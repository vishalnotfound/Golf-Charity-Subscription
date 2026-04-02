
from fastapi.testclient import TestClient
import sys
import os
import json

# Add backend to path
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), 'backend')))

from main import app

client = TestClient(app)

def test_signup_internal():
    print("Testing signup internally with TestClient...")
    
    payload = {
        'email': 'internal_test_final@example.com',
        'name': 'Internal Test',
        'password': 'password123'
    }
    
    try:
        r = client.post("/auth/signup", json=payload)
        print(f"Status: {r.status_code}")
        print(f"Body: {r.text}")
        if r.status_code == 200:
            print("SUCCESS: Internal test works!")
        else:
            print(f"FAILED: Internal test returned {r.status_code}")
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    test_signup_internal()
