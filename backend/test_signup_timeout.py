
import requests
import time

def test_signup_long_timeout():
    url = "http://localhost:8000/auth/signup"
    origin = "http://localhost:5173"
    
    headers = {
        'Origin': origin,
        'Content-Type': 'application/json'
    }
    
    # Use a unique email each time
    unique_email = f"test_{int(time.time())}@example.com"
    payload = {
        'email': unique_email,
        'name': 'Test User',
        'password': 'password123'
    }
    
    print(f"Testing signup for {unique_email} with 15s timeout...")
    try:
        r = requests.post(url, json=payload, headers=headers, timeout=15)
        print(f"Status: {r.status_code}")
        print(f"Body: {r.text}")
        if r.status_code == 200:
            print("SUCCESS: Signup completed!")
        else:
            print(f"FAILED: Server returned status {r.status_code}")
    except requests.exceptions.Timeout:
        print("FAILED: Request timed out after 15 seconds.")
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    test_signup_long_timeout()
