import os
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv

load_dotenv()

uri = os.getenv("MONGODB_URI")
assert uri is not None, "MONGODB_URI not set"

print(uri)

client = MongoClient(uri, server_api=ServerApi('1'))
db = client.sample_project
posts_collection = db.posts

try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)
