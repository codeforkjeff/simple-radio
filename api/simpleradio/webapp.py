
from fastapi import APIRouter, FastAPI
from . import hashed_content
from . import config

v1 = FastAPI()

v1.include_router(hashed_content.router)
v1.include_router(config.router)

app = FastAPI()

app.mount("/api/v1", v1)
