
import bcrypt
from datetime import datetime, timezone

def test_bcrypt():
    password = "password123".encode('utf-8')
    salt = bcrypt.gensalt()
    hash = bcrypt.hashpw(password, salt)
    print(f"Hashed: {hash}")
    match = bcrypt.checkpw(password, hash)
    print(f"Match: {match}")

if __name__ == "__main__":
    test_bcrypt()
