
import json

import simpleradio.db.crud as crud
import simpleradio.util as util

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


async def execute(conn):
    """
    this was created after initial db schema was already deployed, so check if it needs to be applied
    """

    content = json.dumps(default_stream_list)
    hash = util.get_short_hash(content)

    if not await crud.get_hashed_content(conn, hash):
        await crud.store_hashed_content(conn, crud.Content(hash=hash, content=content))
