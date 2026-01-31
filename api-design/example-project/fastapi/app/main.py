from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .posts import router as posts_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # hackathon-safe
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(posts_router)
