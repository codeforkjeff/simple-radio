#

from functools import reduce
import json

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from .db import crud
from .util import get_short_hash

router = APIRouter(
    prefix="/config",
    responses={404: {"description": "Not found"}},
)


@router.get("/")
async def get_config(conn=Depends(crud.db_conn)):

    cursor = await conn.execute("""
    SELECT * FROM config
    """)

    rows = await cursor.fetchall()

    config = reduce(lambda acc, row: {**acc, **{ row['name']: row['value'] }}, rows, {})

    return {
        "config": config
        }

