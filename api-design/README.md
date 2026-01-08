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

# Table Of Contents
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
- [Firebase Cloud Functions](#firebase-cloud-functions)
  - [Setup](#setup)
  - [Writing Cloud Functions](#writing-cloud-functions)
    - [Setup `index.ts`](#setup-indexts)
    - [Create Your Functions](#create-your-functions)
    - [Deploy Your Functions](#deploy-your-functions)
    - [Writing RESTful Functions](#writing-restful-functions)
      - [Canonical RESTful](#canonical-restful)
      - [Hackathon Simple](#hackathon-simple)
    - [Handling CORS](#handling-cors)


# General API Design

## What Is an API?
An **Application Programming Interface** is the definition of a contract between a client and a server. 

It defines the **inputs**, consisting of the request method, URL, headers and body. The **outputs** are also defined, with a status code, headers and body. 

An API should be treated as a black box, with the client not caring *how* the backend server is implemented, only that it obeys this contract.

## REST and HTTP
Most modern APIs are **RESTful** and built on HTTP. 

 - Everything is a **resource**
 - Resources are identified by **URLs**
 - Operations are expressed via **HTTP methods**
 - State is transferred using **representations** (JSON)

REST is a *design style*, not a protocol. You should follow REST conventions where they help clarity and speed, and ignore the when they slow you down.

## Resources and URLs
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

## HTTP Methods

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

### GET

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

### HEAD

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

### OPTIONS

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

### POST

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

### PUT

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

### PATCH

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

### DELETE

**Semantics**
 - Not Safe
 - Idempotent
 - Not Cacheable

**Rules**
 - Repeating DELETE should not change the state (after the first call anyway)
 - Subsequent calls should return errors

---

## Status Codes
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

## Request and Response Bodies
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

## Versioning
Since APIs evolve, we need versioning so clients don't break when we change contracts.

Common strategies:
 - URL versioning: `/v1/posts`
 - Header versioning: `Accept: application/vnd.myapi.v1+json`

>[!TIP]
> You can skip this entirely for a hackathon. 

---

## Authentication and Authorisation
Authentication verifies the user, and authorisation verifies what a user can do.

The common mechanisms include:
 - API keys (simple)
 - OAuth2 / JWT (industry standard)
 - Session cookies (web apps)

This is pretty straightforward for Cloud Functions since Firebase already includes Auth. 

>[!TIP]
> Anonymous auth or hardcoded users are acceptable for a hackathon.

---

## Error Handling

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

## Extras
The following are good practice in production but not necessary for hackathons!

### Rate Limiting
This should be done to prevent abuse. This adds unnecesarry complexity in a hackathon setting where you do not have real clients.

### Pagination
Returning all the results can unnecesarily use up both server and client resources. You will be unlikely to have enough data to require this in a hackathon setting.

### Caching
Improves request latency, but not worth it in a hackathon setting. This is already provided for you by Firebase. 

---

## General Rules
 - **GET**, **HEAD** and **OPTIONS** should **NEVER** have any side effects or unsafe actions. 
 - Use of verbs
 - Inconsistent request and response shapes
 - Returning HTML
 - Silent failures

---

## Common Failures
| Rule                         | What can go wrong if broken                           |
| ---------------------------- | ----------------------------------------------------- |
| GET modifies state           | Duplicate writes from prefetch, crawlers, retries     |
| POST is used for reads       | Hard to cache, confusing for clients                  |
| Inconsistent response shapes | Frontend bugs and unnecessary type-checking headaches |
| DELETE non-idempotent        | Double deletions break demo logic                     |
| Ignoring timestamps/IDs      | Hard to display ordered lists, detect duplicates      |

---

## Cheatsheet

| Method  | Safe | Idempotent | Typical Use       | Notes                                      |
| ------- | ---- | ---------- | ----------------- | ------------------------------------------ |
| GET     | ✅    | ✅          | Read resources    | Never mutate state                         |
| POST    | ❌    | ❌          | Create / actions  | Non-repeatable by default                  |
| PUT     | ❌    | ✅          | Replace resource  | Full replacement, not partial              |
| PATCH   | ❌    | ⚠️         | Partial update    | Can break idempotence if not careful       |
| DELETE  | ❌    | ✅          | Delete resource   | Repeating should not fail catastrophically |
| HEAD    | ✅    | ✅          | Metadata / checks | Usually ignored                            |
| OPTIONS | ✅    | ✅          | CORS info         | Framework handles                          |

# Firebase Cloud Functions
Firebase Cloud Functions uses the Firebase framework so you can have one backend for your whole project. 
This has the benefit of being **serverless**, so you do not have to manage the running of your API yourself.

## Setup
 1. Go to [https://console.firebase.google.com/](https://console.firebase.google.com/)
 2. Create a new project (or if you have already done this, open it by clicking on it)
 3. Wait for project to be created
 4. On the left hand pane, click on `Build` -> `Functions`
 5. As `Functions` is not included in the `Spark` (default) plan, you will have to upgrade to the `Blaze` plan

>[!WARNING]
> The Blaze plan will cost you if your quota runs out, so be careful with your usage! You are very unlikely to run out of your quota within the timeframe of a hackathon!
 6. Create a Cloud Billing Account
 7. Follow the instructions in the new window
 8. Click `Get Started` once you have changed to the `Blaze` plan
 9. As prompted, run `npm install -g firebase-tools`
 10. Run `firebase login`
 11. In your project root, run `firebase init`
 12. At the very least, select `Functions`. 
 13. Select `Use an existing project` and select your project.
 14. Choose your language for Cloud Functions. For this guide, we will be using **TypeScript**, but links will be provided for Python alternatives.
 15. I recommend enabling ESLint.
 16. Install dependencies as prompted.
 17. Firebase will have created a whole directory structure like the one below
 ```
 example-project/
 ├─ functions/
 │   ├─ src/
 │   │   └─ index.ts
 │   ├─ package.json
 │   └─ tsconfig.json
 ├─ firebase.json
 └─ .firebaserc
 ```

## Writing Cloud Functions
Now that you have set up your Cloud Functions directory, we will get to writing some example functions themselves.

### Setup `index.ts`
Add the following to the end of `src/index.ts`
```ts
// The Firebase Admin SDK to access Firestore.
import {initializeApp} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";

initializeApp();
```
This will setup your cloud functions in ***Admin*** mode, allowing your backend full access to Firebase's framework (Firestore, etc).

### Create Your Functions
All the functions you create need to be exposed as 
```ts
export const [fun_name] = [fun_def]
```
in `index.ts`. 

You can go about this in one of two ways:

 - If you don't have many functions, you can write all your functions directly inside `index.ts`.
 - If you have many, you will want to split them into several files. I would recommend this approach.

To demonstrate a simple `GET` request, we will create a new file `basic.ts` in the `src` folder. 

```ts
import * as functions from "firebase-functions";

export const helloWorld = functions.https.onRequest((req, res) => {
  res.send("Hello ICHack!");
});
```

This is a simple HTTP `GET` function that returns `"Hello ICHack!"` to the caller.

Since this is not in `index.ts`, we now need to expose it there. 

We add the following to `index.ts`
```ts
import * as basic from "./basic";

export const helloWorld = basic.helloWorld;
```
We use a qualified import so we can reuse the same name for the function. 

Now that we have written our first function, we can deploy it!

### Deploy Your Functions
Deploying your functions is just publishing your code to Firebase's servers so your clients can call them.

To deploy, in your project directory, call 
```bash
firebase deploy
```

There is a high chance that there will be deployment failures due to ESLint errors. Fix those errors and re-run the command.

>[!IMPORTANT]
> While setting this up myself, I got the following error
> ```
> Error: Request to https://serviceusage.googleapis.com/v1/projects/X/services/run.googleapis.com:enable had HTTP Error: 429, Quota exceeded for quota metric 'Mutate requests' and limit 'Mutate requests per minute' of service 'serviceusage.googleapis.com' for consumer 'project_number:X'.
> ```
> This is Google rate-limiting you when you are enabling the various APIs. Wait for a minute or two and retry.

>[!NOTE]
> The deployment may take a short while, be patient!

Once the process is complete, you will be provided with the URL where your function can be accessed.
For me, this was
```bash
Function URL (helloWorld(us-central1)): https://us-central1-sample-project-44e1c.cloudfunctions.net/helloWorld
```

>[!IMPORTANT]
> Once the setup is complete, you may be asked
> ```bash
> How many days do you want to keep container images before they're deleted?
> ````
> To avoid surprise bills, press 1 and `Enter`. This cleans up the containers for tasks older than a day.

### Writing RESTful Functions
As you may have noticed, where do the HTTP methods and status codes come into this?

Each function you create represents a resource, an endpoint. The function itself will handle what HTTP method is used. 

Below is how you would go about it
```ts
import * as functions from "firebase-functions";

export const helloWorld = functions.https.onRequest(async (req, res) => {
  switch (req.method) {
  case "GET":
    res.status(200).send("Hello ICHack!");
    break;

  case "POST": {
    // Increment counter
    res.status(200).json({ newCount: ... });
    break;
  }

  case "DELETE":
    // Reset counter
    res.status(204);
    break;

  default:
    res.status(404).send("Method Not Allowed");
  }
});
```

Now on to a specific resource, the canonical **RESTful** way of doing this is with `/posts/{postId}`. We will show why this may not be the best with Firestore, and that packing the `postId` into the request body may be better.

#### Canonical RESTful
In order to properly parse the resource, we must inspect the path.

```ts
const id = req.path.split("/")[1]; // /posts/{id}
```
The above code gets the request path, and splits on the `/`. This will extract the `id` value so it can be used by our backend.

#### Hackathon Simple

For our hacky, simpler method, we just pack the request body with all the data we need. Requests will all go to the `/posts` endpoint but with different arguments.

```ts
const { id, text } = req.body;
```

The above unpacks the request body into the `id` and `text` fields.  

>[!WARNING]
> This typically breaks caching, so the canonical method is preferred...

In general, you send a simple string response with the
```ts
res.send("Message");
```
and you send a `JSON` response with 
```ts
res.json(data)
```

### Handling CORS
If you were to deploy and run your API and call these functions from a browser front-end, you will end up with CORS errors. 

This step can be avoided if you choose the Firebase callable functions method of calling your API (more on this later...)

To suppress CORS errors, simply add `{cors: true}` as shown below, to all your functions.

```ts
export const helloWorld = functions.https.onRequest(
  {cors: true},
  async (req, res) => {
    // your function logic
  }
);
```

>[!WARNING]
> Do not use this in production. This allows requests from any source. Instead you should use `{cors: [your_domain_one.com, ...]}`
> 
> However this is perfectly fine for hackathons!

>[!TIP]
> Don't forget to redeploy your functions using `firebase deploy` after you edit them!


