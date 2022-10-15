#
# api routes for content hashing and retrieval

import json

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from .db import crud
from .util import get_short_hash

router = APIRouter(
    prefix="/hashed_content",
    responses={404: {"description": "Not found"}},
)


@router.get("/{hash}")
async def get_content(hash: str, conn=Depends(crud.db_conn)):

    content = await crud.get_hashed_content(conn, hash)
    if not content:
        raise HTTPException(status_code=404, detail=f"Couldn't find content for hash {hash}")

    await crud.touch_hashed_content(conn, hash)
    await conn.commit()

    return {
        "hash": hash,
        "content": content
        }


@router.post("/")
async def store_content(content: crud.Content, conn=Depends(crud.db_conn)):

    # validate
    try:
        content_data = json.loads(content.content)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Bad JSON: content key isn't itself serialized JSON")

    if not isinstance(content_data, list):
        raise HTTPException(status_code=400, detail="Bad JSON: expected content to be an array")

    for record in content_data:
        invalid_values = any([v for v in record.values() if isinstance(v, (list, dict))])
        if invalid_values:
            raise HTTPException(status_code=400, detail="Bad JSON: invalid values")

    content.hash = get_short_hash(content.content)

    existing_content = await crud.get_hashed_content(conn, content.hash)

    if not existing_content:
        await crud.store_hashed_content(conn, content)
        await conn.commit()

    return content
