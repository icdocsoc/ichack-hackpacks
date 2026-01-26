# FastAPI

FastAPI is a popular Python library that can make an API too. The main differences are that FastAPI does not have Firebase's whole framework and easily interoperability with Firebase. It is also not serverless, so must be hosted.

For the purposes of a hackathon, this will likely mean self-hosting to `localhost`.

We will be using MongoDB as our database. [Click here for the document databases HackPack](../databases/document.md)

## Setup

 1. Create a new directory for your backend.
 2. In this directory, run the following to set up a virtual environment

 ```bash
 python -m venv venv
 source venv/bin/activate
 ```

 >[!IMPORTANT]
 > Add `venv` to your `.gitignore`. Your team members will thank you!

 3. Run the following to install the necessary dependencies, and any other dependencies you want. For the example, since we are using a MongoDB database, we are adding `pymongo[srv]` and `python-dotenv` to our dependencies.

 ```bash
 pip install fastapi uvicorn
 ```

 >[!TIP]
 > Run the following in the root of your FastAPI
 >
 > ```bash
 > pip freeze > requirements.txt
 > ```
 >
 > This will mean that the `venv` can be quickly restored by running
 >
 > ```bash
 > pip install -r requirements.txt
 > ```
 >

 4. Create the following directory structure

 ```txt
 backend/
├─ app/
│  ├─ __init__.py
│  ├─ main.py
│  ├─ db.py
│  └─ all files with functions .py
└─ requirements.txt
 ```

 5. Paste the following into `main.py`

 ```py
 from fastapi import FastAPI
from .[file with functions] import router as [file]_router
# all other files with functions

app = FastAPI()

app.include_router([file]_router)
# repeat for all other routers
 ```

## Writing Functions

Now that you have finished the (very fast) setup, you are ready to create your first backend functions.

The following shows the basic setup of your API.

```py
from fastapi import APIRouter, Request, HTTPException

router = APIRouter()

@router.[HTTP_METHOD]("/RESOURCE")
async def fun(req: Request):
    body = await req.json()
    if "val1" not in body:
        raise HTTPException(400, "Missing text")
    val1 = body["val1"]
    
    # do something

    return {"val1": val1}
```

This represents one of the `files with functions.py`.

As you can see, requests are handled very nicely and without too much boilerplate compared to a standard Python function.

Unlike with Firebase Cloud Functions, the HTTP method is specified in the decorator, along with the resource for which this function is for.

Below is a more concrete example, as part of the FastAPI backend for our example program. [Click here for the full code](./example-project/fastapi/app/posts.py)

```py
@router.delete("/posts/{id}", status_code=204)
async def delete_post(id: str):
    result = posts_collection.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(404, "not_found")
```

As you can see from the above function, FastAPI also makes the handling of the RESTful resource locators much cleaner. Instead of manually splitting the path, we can extract the bit after the `/posts/` into a named parameter `id` through the use of the curly braces. This can now be used like a standard parameter of a function.

The decorator also can be used to define a default response status code (here, it is set to `204`).

### Typing

We can further utilise FastAPIs powerful decorators to automatically parse the request body into a defined class.

```py
from pydantic import BaseModel

class Text(BaseModel):
    text: str
```

The above code defines a new class `Text` that has a `text` string field.

```py
@router.patch("/posts/{id}")
async def update_post(id: str, text: Text):
    result = posts_collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": {"text": text.text}}
    )

    if result.matched_count == 0:
        raise HTTPException(404, "not_found")

    return {"ok": True}
```

The FastAPI decorator now knows to parse the request body into this `text` parameter, instead of having to manually work with the raw JSON.

### CORS

Like with Firebase, we need a way to suppress CORS errors.

Add the following import to the top of `main.py`

```py
from fastapi.middleware.cors import CORSMiddleware
```

And add the following after `app = FastAPI()` in `main.py`

```py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

>[!WARNING]
> This allows all origins and methods and users. Perfectly fine for a hackathon but do not use in production code!

Since we separated `main.py` with all the logic, and applied it to the whole app, we do not need any further modifications.

## Deploying

Since we are self-hosting this, deploying is as simple as running the following at the root of your FastAPI backend.

```bash
uvicorn app.main:app --reload
```

>[!TIP]
> Since we used `--reload`, the backend will redeploy every time you edit any of your backend code, so no need to manually rerun this command!

Upon startup, you will get a message along the lines of

```bash
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

This is the base URL at which you can access your backend. The defined routes can then be appended to this base URL to access the API functions.

If you want to specify your own host address and port, you can using the arguments

```bash
uvicorn app.main:app --reload --host 1.2.3.4 --port 1234
```

>[!TIP]
> Just use the defaults unless you have a good reason to not do so
