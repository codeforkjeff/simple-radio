
import hashlib

def get_short_hash(content: str):
    return hashlib.sha1(content.encode('utf-8')).hexdigest()[0:10]
