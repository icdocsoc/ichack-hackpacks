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
>The Blaze plan will cost you if your quota runs out, so be careful with your usage! You are very unlikely to run out of your quota within the timeframe of a hackathon!

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
  
```bash
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
>
> ```bash
> Error: Request to https://serviceusage.googleapis.com/v1/projects/X/services/run.googleapis.com:enable had HTTP Error: 429, Quota exceeded for quota metric 'Mutate requests' and limit 'Mutate requests per minute' of service 'serviceusage.googleapis.com' for consumer 'project_number:X'.
> ```
>
> This is Google rate-limiting you when you are enabling the various APIs. Wait for a minute or two and retry.

>[!NOTE]
>The deployment may take a short while, be patient!

Once the process is complete, you will be provided with the URL where your function can be accessed.
For me, this was

```bash
Function URL (helloWorld(us-central1)): https://us-central1-sample-project-44e1c.cloudfunctions.net/helloWorld
```

>[!IMPORTANT]
> Once the setup is complete, you may be asked
>
> ```txt
> How many days do you want to keep container images before they're deleted?
> ```
>
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

[Click here for an example canonical Firebase backend](https://github.com/icdocsoc/ichack-hackpacks/blob/main/api-design/example-project/cloud-functions/functions/src/canonical-restful.ts)

#### Hackathon Simple

For our hacky, simpler method, we just pack the request body with all the data we need. Requests will all go to the `/posts` endpoint but with different arguments.

```ts
const { id, text } = req.body;
```

The above unpacks the request body into the `id` and `text` fields.  

>[!WARNING]
> This typically breaks caching, so the canonical method is preferred...

[Click here for an example hacky Firebase backend](https://github.com/icdocsoc/ichack-hackpacks/blob/main/api-design/example-project/cloud-functions/functions/src/request-packing.ts)

In general, you send a simple string response with the

```ts
res.send("Message");
```

and you send a `JSON` response with

```ts
res.json(data)
```

### Writing Callable Functions

Firebase comes with a special type of API - a ***callable function***.

There are many benefits:

- Auth tokens are automatically included and handled
- No need for custom parsing
- No need to explicitly handle HTTP error codes
- No need for CORS handling
- On the frontend, it is a simple function call

To create a callable function, you just need to use the following structure

```ts
import { onCall, CallableRequest } from "firebase-functions/v2/https";

export const fun = onCall(
    async (request: CallableRequest<{ arg1?: number, arg2?: string,}>) => {
        const { arg1, arg2 } = request.data;
        // your function
        const response = {
            res1: val1,
            res2: val2,
            ok: true,
        };
        return response;
    }
);
```

[An example of this can be found by clicking here](https://github.com/icdocsoc/ichack-hackpacks/blob/main/api-design/example-project/cloud-functions/functions/src/callable.ts)

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

## Making Requests

Now that we know how to create the backend, we now need to know how to use it!

As alluded to already, Firebase has 2 main ways to do this:

 1. The canonical HTTP request
 2. A callable function

### Canonical HTTP Request

This has been covered by [Making Requests](#making-requests). But I want to point out how the frontend requests differ based on the approach used.

With the **RESTful** approach, we need to add the post ID to the API URL.

```ts
export async function updatePost(id: string, text: string) {
  const url = `${API}/${id}`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  return res.json();
}
```

[Click here for a full example frontend for a RESTful Firebase backend](https://github.com/icdocsoc/ichack-hackpacks/blob/main/api-design/example-project/frontend/src/classic_api.ts)

Whereas with the ***hacky*** approach, we pack the ID into the request body.

```ts
export async function updatePost(id: string, text: string) {
  const res = await fetch(API, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, text }),
  });
  return res.json();
}
```

### Callable Functions

#### JS/TS

If you have not done so yet, run the following in the root of the frontent

```bash
npm install firebase
```

Now add your web app.

1. On [Firebase Console](https://console.firebase.google.com/u/0/), open your project
2. Press the `+ Add app` button
3. Select Web
4. Copy the code shown, it should look something like

  ```ts
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "firebase/app";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
  apiKey: "__",
  authDomain: "__",
  projectId: "__",
  storageBucket: "__",
  messagingSenderId: "__",
  appId: "__"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  ```

5. Copy this into a new file called `firebase.ts` (or `.js`) in `frontend/src`
6. Add the necessary code to import cloud functions, as shown below

  ```ts
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "firebase/app";
  import { getFunctions } from "firebase/functions";

  // Your web app's Firebase configuration
  const firebaseConfig = {
  ...
  };

  // Initialize Firebase
  export const app = initializeApp(firebaseConfig);
  export const functions = getFunctions(app);
  // anything else you will need
  ```

7. Now add the following to the top of your API file

  ```ts
  import { httpsCallable } from "firebase/functions";
  import { functions } from "./firebase";

  const yourFuncName = httpsCallable(functions, "yourFuncName");
  ```

8. Call them like you would any other function!

---
Below is an example of a function from the [sample project](https://github.com/icdocsoc/ichack-hackpacks/blob/main/api-design/example-project/frontend/src/callable_api.ts)

```ts
import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";

// Not necessary but good for consistency
type PostsRequest = {
  action: "create" | "get" | "update" | "delete"
  id?: string
  text?: string
}

type PostsResponse =
  | { id: string }                 // create
  | { ok: true }                   // update/delete
  | { id: string; text: string }   // get single
  | { id: string; text: string }[] // get all

const postsCallable = httpsCallable<PostsRequest, PostsResponse>(functions, "postCallable");

export async function getPosts(id?: string) {
  try {
    const res = await postsCallable({ action: "get", id });
    return res.data;
  } catch (err: any) {
    throw new Error(err.message || "Network Error");
  }
}
```
