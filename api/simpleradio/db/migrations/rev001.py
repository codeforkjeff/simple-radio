
import json

import simpleradio.db.crud as crud

async def execute(conn):
    """
    this was created after initial db schema was already deployed, so check if it needs to be applied
    """
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
