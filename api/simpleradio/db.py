#
# dao layer
#

from contextlib import asynccontextmanager
import json
import os
from typing import Optional

import aiosqlite
from pydantic import BaseModel

from .util import get_short_hash

db_path = os.environ['SIMPLE_RADIO_DB']

default_stream_list = [
    {
      "description": 'KEXP Seattle',
      "name": 'KEXP (Seattle)',
      "url": 'https://kexp-mp3-128.streamguys1.com/kexp128.mp3',
      "homepage": 'https://kexp.org'
    },
    {
      "description": "Member-supported radio at U Penn",
      "name": 'WXPN (Philadelphia)',
      "url": 'https://wxpn.xpn.org/xpnmp3hi',
      "homepage": 'https://wxpn.org'
    },
    {
      "description": "Portland State college radio",
      "name": 'KPSU (Portland)',
      "url": 'https://streamer.radio.co/scad0cc067/listen',
      "homepage": 'https://kpsu.org'
    },
    {
      "description": "Evergreen State College radio",
      "name": 'KAOS (Olympia))',
      "url": 'http://205.134.192.90:8930/;.mp3',
      "homepage": 'https://www.kaosradio.org/'
    }
    ]


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


async def create_hashed_content_table(conn):
    cursor = await conn.execute("""
    SELECT 1 FROM sqlite_master WHERE type='table' AND name='hashed_content'
    """)

    exists = await cursor.fetchone()

    if not exists:
        await conn.execute("""
        CREATE TABLE hashed_content (
            hash VARCHAR PRIMARY KEY,
            content TEXT,
            created_at INTEGER,
            last_accessed_at INTEGER
        )
        """)

        content = json.dumps(default_stream_list)
        hash = get_short_hash(content)

        await store_hashed_content(conn, Content(hash=hash, content=content))

        # this fn commits because not every request will
        await conn.commit()


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
