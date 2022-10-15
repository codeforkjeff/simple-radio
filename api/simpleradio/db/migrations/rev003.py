
import json

import simpleradio.db.crud as crud
import simpleradio.util as util

async def execute(conn):

    await conn.execute("""
    CREATE TABLE config (
        name VARCHAR PRIMARY KEY,
        value VARCHAR
    )
    """)

    await conn.execute("""
    INSERT INTO config (name, value) VALUES ('default_stream_list_id', ?)
    """, ('3939c14eb6',))
