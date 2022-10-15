#
# dao layer
#

from contextlib import asynccontextmanager, contextmanager
import json
import os
from typing import Optional

import aiosqlite
from pydantic import BaseModel

from ..util import get_short_hash

db_path = os.environ['SIMPLE_RADIO_DB']

class Content(BaseModel):
    content: str
    hash: Optional[str]


async def db_conn():
    """
    to be used as FastAPI dependency
    """
    async with aiosqlite.connect(db_path) as conn:
        conn.row_factory = aiosqlite.Row
        try:
            yield conn
        finally:
            pass


@asynccontextmanager
async def db_conn_cm():
    # TODO: can't figure out how to wrap db_conn instead of copying its body
    async with aiosqlite.connect(db_path) as conn:
        conn.row_factory = aiosqlite.Row
        try:
            yield conn
        finally:
            pass


async def store_hashed_content(conn, content: Content):
    await conn.execute("""
    INSERT INTO hashed_content (hash, content, created_at)
    VALUES (?, ?, strftime('%s', 'now'))
    """, (content.hash, content.content))


async def touch_hashed_content(conn, hash: str):
    await conn.execute("""
    UPDATE hashed_content SET last_accessed_at = strftime('%s', 'now') WHERE hash = ?
    """, (hash,))


async def get_hashed_content(conn, hash: str):
    """
    returns None if there's no content for the hash
    """
    cursor = await conn.execute("""
    SELECT * FROM hashed_content WHERE hash = ?
    """, (hash,))

    row = await cursor.fetchone()

    content = None
    if row:
        content = row['content']

    return content
