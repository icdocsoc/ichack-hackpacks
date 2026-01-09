# Document Databases

Document databases store data as **self-contained JSON-like documents**. Unlike relational databases, they allow each record (document) to have a **flexible structure, where different records can have different fields**. Relationships are often embedded rather than joined.

This deep-dive HackPack covers the theory behind document databases, then two practical implementations: **Firestore** and **MongoDB**.

Sample code will be provided, with example programs found in `databases/example-project`.

## Table of Contents

- [Firestore](#firestore)
  - [Setup](#setup)
    - [Create a Firebase project](#create-a-firebase-project)
    - [Install Firebase SDK](#install-firebase-sdk)
    - [Initialise Firebase](#initialise-firebase)
  - [Firestore Data Model](#firestore-data-model)
    - [Data Types](#data-types)
  - [Core Database Operations](#core-database-operations)
    - [Create Data](#create-data)
      - [Auto-ID Document](#auto-id-document)
      - [Known ID](#known-id)
    - [Read Data](#read-data)
      - [Getting a single document](#getting-a-single-document)
      - [Query a collection](#query-a-collection)
      - [Other operators](#other-operators)
      - [Combining queries](#combining-queries)
      - [Query a subcollection](#query-a-subcollection)
      - [Order and limit data](#order-and-limit-data)
    - [Update Data](#update-data)
      - [Special Atomic Update Methods](#special-atomic-update-methods)
    - [Delete Data](#delete-data)
  - [Batching](#batching)
  - [Transactions](#transactions)
  - [Real-Time Updates](#real-time-updates)
  - [Indexes](#indexes)
  - [Quota](#quota)
  - [Authentication](#authentication)
    - [Setup](#authentication-setup)
    - [Use](#use)
  - [Example](#example)
    - [Auth](#auth)
    - [Create](#create)
    - [Read](#read)
    - [Update](#update)
    - [Delete](#delete)
    - [Batching](#batching-1)

## Firestore

Firestore is a **managed, serverless document database** designed primarily for **web and mobile applications**. It shines when you want to move fast, avoid backend infrastructure, and build real-time features.

This deep dive will focus on integrating Firestore into **web apps** (React / Vue / plain JS), however links to the official Firestore docs will be provided to find alternatives (Python, Kotlin, Java, etc).

## Setup

### Create a Firebase project

 0. Ensure you have already set up a JS project (we will be using [`npm` with `React` and `TypeScript`](/databases/example-project/sample-document-app/))
 1. Go to [console.firebase.google.com](https://console.firebase.google.com/)
 2. Create a new project
 3. Wait for project to be created
 4. On the left hand pane, click on `Build` -> `Firestore Database`
 5. Press `Create database`
 6. Pick `Standard edition`
 7. The default location is fine, but Europe, or even better, London, can be selected for lower latency.
 8. For IC Hack, we recommend you select `test mode`, so you do not have to deal with access issues.

 > [!IMPORTANT]
 > This will revert to `production mode` within 30 days, so fixes may be needed if you continue to work on your project.

 9. Return to the home screen
 10. Add a new web app (press `Add app` and select `web`)

---

### Install Firebase SDK

  In your project root directory, run

  ```bash
  npm install firebase
  ```

---

### Initialise Firebase

 1. Copy the code snippet from the web app setup screen. This should look something like

 ```ts
 // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
```

 1. Paste all this into a new file, [`project-root/src/firebase.ts`](/databases/example-project/sample-document-app/src/firebase.ts). This should now appear next to `main.tsx`.
 2. Add the following 2 lines to that file

 ```ts
 import { getFirestore } from "firebase/firestore";

 [EXISTING STUFF]

 export const db = getFirestore(app);
 ```

 3. Congratulations, you are ready to use Firestore!

## Firestore Data Model

Now you have to design a data model for your app.

In general, your Firestore data model will take the shape of

```txt
users (collection)
 └─ userId123 (document)
     ├─ name: "Alice"
     ├─ email: "alice@example.com"
     └─ posts (subcollection)
         └─ postId456
```

A **collection** is a set of documents, here we have the `users` collection holding many user documents. Each document needs a unique name (this is analogous to a primary key in traditional relational databases). Like JSON objects, these documents have fields. In the above example, we have 3 fields: `name`, `email` and `posts`. The first two are ordinary fields. The latter however is a **subcollection**. This is a nested collection of documents, a collection of "post" documents in this case.

Since Firestore does not support joins, you have to instead store data in a denormalised manner, often leading to duplication of data. Each post may have a subcollection of viewers, to keep track of who has viewed a post. You will either need to store references to all the user documents that have viewed the post, or embed the data.

The latter is preferred for **small**, mostly **read-only** data, since it avoids running extra queries. However, you should use references if the documents are **large**, **frequently updated** or **shared** across entities.

> [!IMPORTANT]
> Firestore is optimised for **reads**, **real-time updates** and **velocity**, not **relational correctness** or **complex querying**

---

### Data Types

Firestore can store

- strings
- booleans
- numbers
- dates
- null
- arrays (including nested)
- objects

```ts
const docData = {
    stringExample: "Hello world!",
    booleanExample: true,
    numberExample: 3.14159265,
    dateExample: Timestamp.fromDate(new Date("December 10, 1815")),
    arrayExample: [5, true, "hello"],
    nullExample: null,
    objectExample: {
        a: 5,
        b: {
            nested: "foo"
        }
    }
};
```

Above is an example of each of the datatypes.
> [!NOTE]
> Firestore stores all numbers as doubles.

---

As you can see from the example, all Firestore objects are stored as `Map` or `Dictionary` objects within TypeScript.
In order to store custom classes, you must create a converter.

```ts
class User {
  constructor (name, email) {
    this.name = name;
    this.email = email;
  }
}

const userConverter = {
  toFirestore: (user) => {
    return {
      name: user.name
      email: user.email
    };
  },

  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new User(data.name, data.email);
  }
}

const docRef = doc(db, "users", userID).withConverter(userConverter);
await setDoc(docRef, new User("Bob", "bob@gmail.com"));
```

The above shows how you would go about creating a converter, and using it with a Firestore operation.

[Click here for other languages](https://firebase.google.com/docs/firestore/manage-data/add-data#custom_objects)

## Core Database Operations

For the following, you may need to use some or all of

```ts
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot
} from "firebase/firestore";
```

We will go through each of the elementary database CRUD operations.

---

### Create Data

There are 2 ways to add a document to a collection.

#### Auto-ID Document

```ts
await addDoc(collection(db, "users"), {
  name: "Alice",
  email: "alice@example.com",
});
```

The above can be used to add a new document, with no specific document ID.

#### Known ID

```ts
await setDoc(doc(db, "users", userId), {
  name: "Alice",
  email: "alice@example.com"
});
```

The above is more for users. It is idiomatic to set the document name of a user, to the AuthID of a user provided by Firebase Auth.

[Click for other languages](https://firebase.google.com/docs/firestore/manage-data/add-data#add_a_document)

---

### Read Data

#### Getting a single document

```ts
const docRef = doc(db, "users", userId)
const docSnap = await getDoc(docRef);
if (docSnap.exists()) {
  console.log(docSnap.data());
}
```

This is only useful if you know the document name for your target document.

[Click for other languages](https://firebase.google.com/docs/firestore/query-data/get-data#get_a_document)

#### Query a collection

```ts
const q = query(
  collection(db, "users"),
  where("name", "==", "Alice")
);

const snaps = await getDocs(q);
snaps.forEach(doc => console.log(doc.id, doc.data()));
```

The `where` can be removed in order to retrieve all documents in a collection.

[Click for other languages](https://firebase.google.com/docs/firestore/query-data/get-data#get_multiple_documents_from_a_collection)

#### Other operators

The other available operators are:

- `<` less than
- `<=` less than or equal to
- `==` equal to
- `>` greater than
- `>=` greater than or equal to
- `!=` not equal to
- `array-contains`
- `array-contains-any`
- `in`
- `not-in`
  
These will only ever return documents where the operand field exists.
Firestore imposes limits of 30 elements for the `in` and `array-contains-any` operators, as in `where('field', 'not-in', [a, b, c, ... , x, y, z])`, the `[a, b, c, ...]` array must have at most 30 elements.
Similarly, the `not-in` operator can support up to 10 elements.

> [!IMPORTANT]
> The above is only true for web apps, Python, Node.js, Go and Ruby. Other languages use named methods. [See here for more info](https://firebase.google.com/docs/firestore/query-data/queries#query_operators)

#### Combining queries

You can perform `OR` and `AND` operations to logically combine constraints.

```ts
const q = query(collection(db, "users"), and(
  where("name", 'in', ['Alice', 'Bob']),
  or (
    where("email", '==', 'alice@gmail.com'),
    where("email", '==', 'bob@gmail.com')
  )
));
```

> [!WARNING]
> The 30 term limit described in the previous section extends to this too. Your total query must have a maximum of 30 disjunctions after Firestore converts your query into [disjunctive normal form](https://en.wikipedia.org/wiki/Disjunctive_normal_form).

> [!IMPORTANT]
> You cannot combine `not-in` with any of `in`, `array-contains-any` or `or` in the same query.

#### Query a subcollection

```ts
const querySnapshot = await getDocs(collection(db, "users", "userId123", "posts"));
querySnapshot.forEach((doc) => {
  console.log(doc.id, " => ", doc.data());
});
```

The `collection` syntax uses a path structure to find subcollections. In the above example, we use `db` to indicate the root directory, and then the rest becomes `/users/userId123/posts`, forming a generic `/[COLLECTION]/[DOCUMENT]/[SUBCOLLECTION]` path.

It can become cumbersome to keep using the full path for all reads. Instead, we could use the reference of a document as a starting point.
The below code gets the same subcollection as the above, but can be easier to deal with when working with more complicated data. Here, we use `docRef` as the base of the path, and get the `posts` subcollection from it.

```ts
const docRef = doc(db, "users", "userId123")
const querySnapshot = await getDocs(collection(docRef, "posts"));
querySnapshot.forEach((doc) => {
  console.log(doc.id, " => ", doc.data());
});
```

[Click for other languages](https://firebase.google.com/docs/firestore/query-data/get-data#get_all_documents_in_a_subcollection)

#### Order and limit data

A Firestore query by default returns all the documents that satisfy your query, in ascending document ID. Often this is far too many documents and you want to limit it to the top *N* results.

```ts
const q = query(collection(db, "users"), orderBy("name"), orderBy("email", "desc"), limit(5));
```

The above query will return the top 5 users, when sorted by name ascending, and ties are resolved by sorting by email decreasing.
Note that you can combine this with `where` clauses to first filter your data.

---

### Update Data

```ts
await updateDoc(doc(db, "users", userId), {
  email: "alice1@gmail.com"
});
```

The code snippet above will update only the email field of that document. Fields you do not mention will be untouched.

For nested objects, you can use *dot notation* to reference those fields, without overwriting other fields of that nested object.
Here is an example of this notation.

```ts
const frankDocRef = doc(db, "users", "frank");
await setDoc(frankDocRef, {
    name: "Frank",
    favorites: { food: "Pizza", color: "Blue", subject: "recess" },
    age: 12
});

// To update age and favorite color:
await updateDoc(frankDocRef, {
    "age": 13,
    "favorites.color": "Red"
});
```

[Click for other languages](https://firebase.google.com/docs/firestore/manage-data/add-data#update_fields_in_nested_objects)

---

#### Special Atomic Update Methods

There are also 2 special methods to update arrays:

- `arrayUnion()` - this adds the element to the target array if not already in it
- `arrayRemove()` - this removes all instances of the element from the target array

Here is an example

```ts
const washingtonRef = doc(db, "cities", "DC");

// Atomically add a new region to the "regions" array field.
await updateDoc(washingtonRef, {
    regions: arrayUnion("greater_virginia")
});

// Atomically remove a region from the "regions" array field.
await updateDoc(washingtonRef, {
    regions: arrayRemove("east_coast")
});
```

[Click for other languages](https://firebase.google.com/docs/firestore/manage-data/add-data#update_elements_in_an_array)

---

Finally, there is a pair of special methods for numeric fields, `increment` and `decrement`.
These increment or decrement the target numeric field by the amount specified.

```ts
await updateDoc(doc(db, "users", userId), {
  followerCount: increment(2)
});
```

This will increase `userId`'s `followerCount` by 2.
> [!IMPORTANT]
> If the field does not exist, or is not numeric, this operation will set the field to the numeric value specified in the argument.

[Click for other languages](https://firebase.google.com/docs/firestore/manage-data/add-data#increment_a_numeric_value)

---

### Delete Data

You can delete a document

```ts
await deleteDoc(doc(db, "users", userId));
```

> [!WARNING]
> This operation does not delete the subcollections of this document

[Click for other languages](https://firebase.google.com/docs/firestore/manage-data/delete-data#delete_documents)

You can also delete a field

```ts
await updateDoc(doc(db, "users", userId), {
  email: deleteField()
});
```

[Click for other languages](https://firebase.google.com/docs/firestore/manage-data/delete-data#fields)

In order to delete a collection or subcollection, you need to delete all the documents inside that collection. Large deletes are not recommended for clients, and should instead be handled by a backend function.
Here is an example of how you would do it for a client. We will limit it to 500 deletions for safety.

```ts
const q = query(collection(db, "users", userId, "posts"), limit(500));
const snap = await getDocs(q);

const batch = writeBatch(db);
snap.docs.forEach(doc => batch.delete(doc.ref));
await batch.commit();
```

> [!NOTE]
> We have used batches here, we will cover this properly in the [batching section](#batching)

> [!CAUTION]
> Only to be used in hackathons! Strongly not recommended for production code!

## Batching

When you want to complete a set of operations, which do not include any reads, this can be combined into one `batch` operation. While this **does not** reduce your usage towards the quota limit, it **does** reduce operation latency by only having one network round-trip.

```ts
const batch = writeBatch(db);

batch.set(doc(db, "users", userId1), {name: "Bob"});

batch.update(doc(db, "users", userId2), {"email": "alice@gmail.com"});

batch.delete(doc(db, "users", userId3));

await batch.commit();
```

Notice how we only have 1 async operation, the final `batch.commit()`.

[Click for other languages](https://firebase.google.com/docs/firestore/manage-data/transactions#batched-writes)

> [!TIP]
> Use this whenever possible if you are writing to more than 1 document!

## Transactions

Transactions have the same benefits as batching (only a single network round-trip), while also allowing reads.
However, there are a few points to note:

- Reads must be executed before writes
- The transaction may run more than once if a concurrent edit affects a read document
- Transaction functions should not directly modify application state
- Transactions may fail, this could be because
  - There were reads after writes
  - Transaction was retried too many times
  - Transaction exceeded the maximum size of 10 MiB
  - Transaction timed out

In the case of errors, transaction operations are rolled back.

```ts
try {
  const newFollowerCount = await runTransaction(db, async (transaction) => {
    const userDoc = await transaction.get(doc(db, "users", userId));
    if (!userDoc.exists()) {
      throw "Document does not exist!";
    }

    const newFollowerCount = userDoc.data().followerCount + 1;
    if (newFollowerCount <= 1000000) {
      transaction.update(userDoc, { followerCount: newFollowerCount });
      return newFollowerCount;
    } else {
      return Promise.reject("Sorry! User has reached the follower limit");
    }
  });
  // Only runs if we didn't reach follower cap
  console.log("Followers increased to ", newFollowerCount);
} catch (e) {
  console.error(e);
}
```

The above code snippet shows how to execute a transaction. Notice how no `console.log()` was called within the transaction. Instead we return a value out of the transaction and use that. This ensures that retries can happen safely without repeatedly executing the `console.log()`.

> [!TIP]
> Transactions ensure atomicity, however for array and counter operations, prefer to use the methods [found here](#special-atomic-update-methods).

> [!TIP]
> Use this whenever possible!

[Click for other languages](https://firebase.google.com/docs/firestore/manage-data/transactions#passing_information_out_of_transactions)

## Real-Time Updates

One key feature of Firestore is the ability to subscribe to updates to a document or collection.

This is especially useful for things like

- Chats
- Collaborative tools
- Live dashboards
  
```ts
const unsub = onSnapshot(doc(db, "users", userId), (doc) => {
  console.log("Updates for user: ", doc.data());
});

// Later
unsub();
```

[Click for other languages](https://firebase.google.com/docs/firestore/query-data/listen)

You can also listen to multiple documents, by listening to a query.

```ts
const q = query(collection(db, "users"));
const unsub = onSnapshot(q, (querySnapshot) => {
  const users = [];
  querySnapshot.forEach((doc) => {
    users.push(doc.data().name);
  });
  console.log("List of current users: ", users.join(", "));
});

// Later
unsub();
```

The above code will cause all the users to be printed each time the query results change (this includes document additions, removals and modification).

[Click for other languages](https://firebase.google.com/docs/firestore/query-data/listen#listen_to_multiple_documents_in_a_collection)

> [!IMPORTANT]
> Both of the above will cause an initial trigger for the initial read.

> [!CAUTION]
> Creating a listener for a query can quickly use up read quotas. Consider adding a limit to how many documents to return from the query!

## Indexes

There are likely to be many occasions when you have errors running a complex query. Firestore requires composite indexes for running complex queries involving several fields.

These errors will be very explicit and accompanied with a link, that should create the necessary index for you.

> [!NOTE]
> The creation of a composite index typically takes a long time (up to tens of minutes), so do not be alarmed!

## Quota

By default, when you create a new project, you will be on the **Spark** plan. This is a completely free tier and you will never be charged.

Your limits are:

- 1 GiB total Firestore data
- 10 GiB data read per month
- 20K writes per day (including updates)
- 50K reads per day
- 20K deletes per day

> [!CAUTION]
> The [real-time updates](#real-time-updates) count as **1 read per updated document**. For a query listener, this counts as **however many documents were returned by that query**. The same goes for ordinary queries. This can quickly chew through your quota if you're not careful!
>
> Batched writes and transactions count **each** constituent read and write towards your quota as well.

> [!WARNING]
> Once your quota runs out, you will be unable to perform that operation.

> [!NOTE]
> This is just for reference. You will be *EXTREMELY* unlikely to hit any of these quota limits.

## Authentication

You will likely want some sort of authentication, even anonymous (using just the browser session). This will give each user a unique authentication ID, which becomes the document name for their user document.

### Authentication Setup

 1. Go to [https://console.firebase.google.com/](https://console.firebase.google.com/)
 2. Open your project
 3. On the left hand pane, click on `Build` -> `Authentication`
 4. Click on `Get started`
 5. From this panel, click on the sign-in providers you want

> [!TIP]
> Anonymous or email/password are by far the recommended methods

 6. Click enable for the selected sign-in provider

### Use

 1. Add the following to your imports for `firebase.ts`

 ```ts
import { getAuth } from "firebase/auth"
```

 2. Add the following just before your `getFirestore(app)` call, also in `firebase.ts`

 ```ts
 export const auth = getAuth(app);
 ```

 3. In `App.tsx`, the main `App()` function should be of the form

 ```ts
 function App() {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, []);

  if (user === undefined) return <Loading />;

  return user ? <Dashboard /> : <SignIn />;
}
```

where `Loading`, `Dashboard` and `SignIn` are React components.

Click on the following for examples of those components

- [`Loading`](./example-project/sample-document-app/src/components/LoadingSpinner.tsx)
- [`Dashboard`](./example-project/sample-document-app/src/pages/Dashboard.tsx)
- [Anonymous `SignIn`](./example-project/sample-document-app/src/components/SignInAnonymous.tsx)
- [Email/Password `SignIn`](./example-project/sample-document-app/src/components/SignInPassword.tsx)
- [`App.tsx`](./example-project/sample-document-app/src/App.tsx)

## Example

For our example project, we will be creating a VERY simple chat app. This is one of the ideal use-cases for Firestore, since we want real-time updates on messages across all the users.

Our data model is as follows

```txt
posts (collection)
 └─ postId (document)
     ├─ authorId: "gSUFRq..."
     ├─ createdAt: 18 December 2025 at 14:27:01 UTC
     ├─ text: "Hello World!"
     └─ updatedAt: 18 December 2025 at 14:45:34 UTC
```

The example demonstrates how to use Firestore for authentication.
The example also covers all of the CRUD operations, along with real-time query updates to retrieve the last 50 messages. There is also an example of a batched operation to delete all the posts of the current user.

### Auth

- [Routing](./example-project/sample-document-app/src/App.tsx#L10)
- [Anonymous Sign-In](./example-project/sample-document-app/src/components/SignInAnonymous.tsx)
- [Email/Password Sign-In](./example-project/sample-document-app/src/components/SignInPassword.tsx)

### Create

- [Create a Post](./example-project/sample-document-app/src/pages/Dashboard.tsx#L103)

### Read

- [Read Newest Posts](./example-project/sample-document-app/src/pages/Dashboard.tsx#L94)
- [Converter](./example-project/sample-document-app/src/pages/Dashboard.tsx#L34)
- [Read All Posts Created By Current User](./example-project/sample-document-app/src/pages/Dashboard.tsx#L66)

### Update

- [Update Post](./example-project/sample-document-app/src/components/Post.tsx#L12)

### Delete

- [Delete Single Post](./example-project/sample-document-app/src/components/Post.tsx#L23)
- [Batch Delete All Posts](./example-project/sample-document-app/src/pages/Dashboard.tsx#L78)

### Batching

- [Batch Delete All Posts](./example-project/sample-document-app/src/pages/Dashboard.tsx#L78)
