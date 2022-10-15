
import asyncio

from . import _migrate

if __name__ == '__main__':
    asyncio.run(_migrate.migrate())
    
