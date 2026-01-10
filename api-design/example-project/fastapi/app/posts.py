from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from bson import ObjectId
from .db import posts_collection

router = APIRouter()

class Text(BaseModel):
    text: str

def serialize(doc):
    return {
        "id": str(doc["_id"]),
        "text": doc["text"],
    }

@router.post("/posts", status_code=201)
async def create_post(text: Text):
    doc = {
        "text": text.text,
        "createdAt": datetime.now(timezone.utc),
    }

    result = posts_collection.insert_one(doc)
    return {"id": str(result.inserted_id)}

@router.get("/posts")
async def get_posts():
    docs = posts_collection.find()
    return [serialize(d) for d in docs]

@router.get("/posts/{id}")
async def get_post(id: str):
    doc = posts_collection.find_one({"_id": ObjectId(id)})
    if not doc:
        raise HTTPException(404, "not_found")
    return serialize(doc)

@router.patch("/posts/{id}")
async def update_post(id: str, text: Text):
    result = posts_collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": {"text": text.text}}
    )

    if result.matched_count == 0:
        raise HTTPException(404, "not_found")

    return {"ok": True}

@router.delete("/posts/{id}", status_code=204)
async def delete_post(id: str):
    result = posts_collection.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(404, "not_found")
