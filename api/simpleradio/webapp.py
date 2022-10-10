
from fastapi import APIRouter, FastAPI
from . import hashed_content

v1 = FastAPI()

v1.include_router(hashed_content.router)

app = FastAPI()

app.mount("/api/v1", v1)
