# API Design

Modern applications are built around **APIs**. A well-designed API is easy to understand, hard to misuse, evolvable and performant under load. 

*Since we are in a hackathon, the goal is speed, correctness and maximum simplicity, not long-term perfection!*

In this HackPack, we will focus on creating an API that is
 - Easy to wire up
 - Hard to accidentally break
 - "Good enough" to demonstrate your ideas

This HackPack will cover
 1. General API Design
 2. FastAPI (Python) for fast iteration and typed safety
 3. Firebase Cloud Functions for serverless APIs

Example code will be provided, with full projects found at [`example-project/fastapi`](example-project/fastapi) and [`example-project/cloud-functions`](example-project/cloud-functions).

## Table Of Contents
- [API Design](#api-design)
  - [Table Of Contents](#table-of-contents)
  - [General API Design](#general-api-design)
    - [What Is an API?](#what-is-an-api)
    - [REST and HTTP](#rest-and-http)
    - [Resources and URLs](#resources-and-urls)
    - [HTTP Methods](#http-methods)
      - [GET](#get)
      - [HEAD](#head)
      - [OPTIONS](#options)
      - [POST](#post)
      - [PUT](#put)
      - [PATCH](#patch)
      - [DELETE](#delete)
    - [Status Codes](#status-codes)
    - [Request and Response Bodies](#request-and-response-bodies)
    - [Versioning](#versioning)
    - [Authentication and Authorisation](#authentication-and-authorisation)
    - [Error Handling](#error-handling)
    - [Extras](#extras)
      - [Rate Limiting](#rate-limiting)
      - [Pagination](#pagination)
      - [Caching](#caching)
    - [General Rules](#general-rules)
    - [Common Failures](#common-failures)
    - [Cheatsheet](#cheatsheet)


## General API Design

### What Is an API?
An **Application Programming Interface** is the definition of a contract between a client and a server. 

It defines the **inputs**, consisting of the request method, URL, headers and body. The **outputs** are also defined, with a status code, headers and body. 

An API should be treated as a black box, with the client not caring *how* the backend server is implemented, only that it obeys this contract.

### REST and HTTP
Most modern APIs are **RESTful** and built on HTTP. 

 - Everything is a **resource**
 - Resources are identified by **URLs**
 - Operations are expressed via **HTTP methods**
 - State is transferred using **representations** (JSON)

REST is a *design style*, not a protocol. You should follow REST conventions where they help clarity and speed, and ignore the when they slow you down.

### Resources and URLs
We design URLs around **nouns** not verbs.

***The GOOD:***
```
GET /users
GET /users/{userId}
POST /posts
GET /posts/{postId}/comments
```

***The BAD:***
```
GET /getUsers
POST /createPost
POST /deleteComment
```

***The UGLY:***
```
DELETE /getUsers
GET /incrementCounter
PATCH /deletePost
```

>[!WARNING]
> The BAD section would at least work and make sense, ***NEVER*** do anything from the UGLY!

URLs should show a hierarchy, reflecting ownership or containment. 

 - `/users/{id}/posts` are the posts owned by a user
 - `/posts/{id}/comments` are the comments belonging to a post

### HTTP Methods

Here are the HTTP methods that you can use for your API

We will be using several terms that need defining

**Safe:** Does not change server state

**Server state:** Anything persistent or observable:
 - database rows
 - counters
 - logs
 - "last viewed" timestamps
 - cache entries

**Idempotent:** Repeated calls do not change the result

**Cacheable:** Intermediaries can cache the result

#### GET

**Semantics**
 - Safe
 - Idempotent
 - Cacheable

**What GET must not do**
 - Modify database state
 - Increment counters
 - Trigger any side effects
 - Create audit events that affect behaviour

>[!NOTE]
> Logging for debugging is allowed, but anything user-visible or persistent is not

**What GET can do**
 - Read data
 - Filter via query parameters
 - Pagination
 - Sorting

**Example**
```
GET /posts?authorId=123
```
---

#### HEAD

**Semantics**
 - Safe
 - Idempotent
 - Cacheable

**Purpose**

Same as GET, but with **no response body**.

This is used for:
 - Existence checks
 - Metadata
 - Caching validation

>[!IMPORTANT]
You will likely not need to use this

---

#### OPTIONS

**Semantics**
 - Safe
 - Idempotent
 - Can be Cacheable

**Purpose**
Returns the allowed methods and CORS info. This will likely be automatically handled for you by FastAPI and Firebase Cloud Functions.

>[!WARNING]
> Since these are automatically handled, don't use this

>[!TIP]
> If you are having problems with this, ask a mentor on the day for help!

---

#### POST

**Semantics**
 - Not safe
 - Not idempotent
 - Not cacheable

**Purpose**
POST can do pretty much any action or side-effect, such as:

 - Create resources
 - Trigger actions
 - Perform non-idempotent operations
 - Accept complex input

**Typical uses**

```bash
POST /posts    # create
POST /login    # auth
POST /posts/123/like
POST /search   # complex queries
```

**What POST does *not* guarantee**

Since POST is not idempotent, if POST is retried, side effects may repeat. 

>[!WARNING]
> You may be tempted to use this for most API operations. Try to limit its use and use the other HTTP methods where possible.

>[!TIP]
> Treat this as a *'do anything'* method

---

#### PUT

**Semantics**
 - Not Safe
 - Idempotent
 - Not Cacheable

**Purpose**
This is used for replacing the entire resource with the provided representation.

**Example**
```
PUT /users/123
```

This will replace the resource with the data provided by the headers and body by the client.

**Rules**
 - The client supplies the full resource state
 - Server completely overwrites existing state
 - Repeating PUT results in the same final state

>[!WARNING]
> A common point of failure is using PUT for partial updates

---

#### PATCH

**Semantics**
 - Not Safe
 - Can be Idempotent
 - Not Cacheable

**Purpose**
Whereas PUT replaces the whole resource, PATCH partially modifies the resource with the provided data.


**Idempotence**
Depending on the implementation, PATCH may or may not be idempotent

 - `set name = "Alice` is idempotent
 - `increment likes by 1` is not idempotent

---

#### DELETE

**Semantics**
 - Not Safe
 - Idempotent
 - Not Cacheable

**Rules**
 - Repeating DELETE should not change the state (after the first call anyway)
 - Subsequent calls should return errors

---

### Status Codes
Status codes are a key part of an API contract.

Common ones:
 - `200 OK` - successful request
 - `201 Created` - resource created
 - `204 No Content` - success, no body
 - `400 Bad Request` - client error
 - `401 Unauthorised` - missing/invalid auth
 - `403 Forbidden` - authenticated but not allowed
 - `404 Not Found` - resource does not exist
 - `409 Conflict` - constraint violation
 - `500 Internal Server Error` - server bug

---

### Request and Response Bodies
We use JSON as the format for passing data between the client and the backend. 

>[!TIP]
> Choose a schema and stick with it. Document it too!

Example response:
```JS
{
    "id": "123",
    "authorId": "abc",
    "text": "Hello",
    "createdAt": "2025-12-18T14:27:01Z",
}
```

**Rules of thumb:**
 - Always return the created resource on `POST`
 - Use ISO-8601 for timestamps
 - Prefer explicit fields over positional arrays

---

### Versioning
Since APIs evolve, we need versioning so clients don't break when we change contracts.

Common strategies:
 - URL versioning: `/v1/posts`
 - Header versioning: `Accept: application/vnd.myapi.v1+json`

>[!TIP]
> You can skip this entirely for a hackathon. 

---

### Authentication and Authorisation
Authentication verifies the user, and authorisation verifies what a user can do.

The common mechanisms include:
 - API keys (simple)
 - OAuth2 / JWT (industry standard)
 - Session cookies (web apps)

This is pretty straightforward for Cloud Functions since Firebase already includes Auth. 

>[!TIP]
> Anonymous auth or hardcoded users are acceptable for a hackathon.

---

### Error Handling

Errors should be:
 - Machine-readable
 - Consistent

Example: 
```JS
{
    "error": "permission_denied",
    "message": "You cannot delete this post"
}
```

The key is simplicity and consistency.

---

### Extras
The following are good practice in production but not necessary for hackathons!

#### Rate Limiting
This should be done to prevent abuse. This adds unnecesarry complexity in a hackathon setting where you do not have real clients.

#### Pagination
Returning all the results can unnecesarily use up both server and client resources. You will be unlikely to have enough data to require this in a hackathon setting.

#### Caching
Improves request latency, but not worth it in a hackathon setting. This is already provided for you by Firebase. 

---

### General Rules
 - **GET**, **HEAD** and **OPTIONS** should **NEVER** have any side effects or unsafe actions. 
 - Use of verbs
 - Inconsistent request and response shapes
 - Returning HTML
 - Silent failures

---

### Common Failures
| Rule                         | What can go wrong if broken                           |
| ---------------------------- | ----------------------------------------------------- |
| GET modifies state           | Duplicate writes from prefetch, crawlers, retries     |
| POST is used for reads       | Hard to cache, confusing for clients                  |
| Inconsistent response shapes | Frontend bugs and unnecessary type-checking headaches |
| DELETE non-idempotent        | Double deletions break demo logic                     |
| Ignoring timestamps/IDs      | Hard to display ordered lists, detect duplicates      |

---

### Cheatsheet

| Method  | Safe | Idempotent | Typical Use       | Notes                                      |
| ------- | ---- | ---------- | ----------------- | ------------------------------------------ |
| GET     | ✅    | ✅          | Read resources    | Never mutate state                         |
| POST    | ❌    | ❌          | Create / actions  | Non-repeatable by default                  |
| PUT     | ❌    | ✅          | Replace resource  | Full replacement, not partial              |
| PATCH   | ❌    | ⚠️         | Partial update    | Can break idempotence if not careful       |
| DELETE  | ❌    | ✅          | Delete resource   | Repeating should not fail catastrophically |
| HEAD    | ✅    | ✅          | Metadata / checks | Usually ignored                            |
| OPTIONS | ✅    | ✅          | CORS info         | Framework handles                          |

