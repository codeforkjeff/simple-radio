#
# simple utility to migrate db changes
#
# this is a separate module from 'migrate' so we can get use sys.modules[__name__]

from importlib import import_module
import logging
import pkgutil
import sys

from . import crud
from . import migrations

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def init(conn):
    cursor = await conn.execute("""
    SELECT 1 FROM sqlite_master WHERE type='table' AND name='db_revisions'
    """)

    exists = await cursor.fetchone()

    if not exists:
        await conn.execute("""
        CREATE TABLE db_revisions (
            revision_name VARCHAR PRIMARY KEY,
            executed_at INTEGER
        )
        """)

    await conn.commit()


async def log_revision(conn, revision_name):
    await conn.execute("""
    INSERT INTO db_revisions (revision_name, executed_at) VALUES (?, strftime('%s', 'now'))
    """, (revision_name,))


async def get_revisions(conn):
    cursor = await conn.execute("""
    SELECT * FROM db_revisions""")
    return await cursor.fetchall()


async def migrate():
    logger.info(f"Starting migrations")
    async with crud.db_conn_cm() as conn:
        await init(conn)

        _past_revisions = await get_revisions(conn)
        past_revisions = [ r['revision_name'] for r in _past_revisions ]

        for rev in sorted(pkgutil.iter_modules(migrations.__path__), key=lambda r: r.name):
            rev_module_name = rev.name
            rev_module_fullname = f"{migrations.__name__}.{rev_module_name}"
            rev_module = import_module(rev_module_fullname)
            
            if rev.name not in past_revisions:
                
                logger.info(f"Running {rev_module_fullname}")

                try:
                    await rev_module.execute(conn)
                    await conn.commit()
                except Exception as e:
                    logger.error("Error, rolling back")
                    await conn.rollback()
                    raise e
                
                await log_revision(conn, rev.name)
                await conn.commit()
            else:
                logger.info(f"Already run, skipping: {rev_module_fullname}")
