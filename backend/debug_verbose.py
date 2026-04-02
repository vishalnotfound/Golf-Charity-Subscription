
import requests
import json

def debug_signup_verbose():
    url = "http://localhost:8000/auth/signup"
    origin = "http://localhost:5173"
    
    # 1. Test OPTIONS (Preflight)
    print("\n--- 1. Testing OPTIONS (Preflight) ---")
    headers_opt = {
        'Origin': origin,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
    }
    try:
        r = requests.options(url, headers=headers_opt, timeout=5)
        print(f"Status: {r.status_code}")
        print("Headers:")
        for k, v in r.headers.items():
            print(f"  {k}: {v}")
    except Exception as e:
        print(f"Error: {e}")

    # 2. Test POST (Signup)
    print("\n--- 2. Testing POST (Signup) ---")
    headers_post = {
        'Origin': origin,
        'Content-Type': 'application/json'
    }
    payload = {
        'email': 'debug_verbose_final@example.com',
        'name': 'Debug Verbose',
        'password': 'password123'
    }
    try:
        r = requests.post(url, json=payload, headers=headers_post, timeout=5)
        print(f"Status: {r.status_code}")
        print("Headers:")
        for k, v in r.headers.items():
            print(f"  {k}: {v}")
        print(f"Body: {r.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    debug_signup_verbose()
