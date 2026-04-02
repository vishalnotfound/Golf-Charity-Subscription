
import requests

def debug_signup():
    url = "http://localhost:8000/auth/signup"
    headers = {
        'Origin': 'http://localhost:5173',
        'Content-Type': 'application/json'
    }
    payload = {
        'email': 'debug_cors_final@example.com',
        'name': 'Debug',
        'password': 'password123'
    }
    
    print(f"Testing {url} with origin {headers['Origin']}...")
    try:
        # First test preflight
        preflight_headers = {
            'Origin': 'http://localhost:5173',
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type'
        }
        print("\n--- OPTIONS (Preflight) ---")
        r_opt = requests.options(url, headers=preflight_headers)
        print(f"Status: {r_opt.status_code}")
        for k, v in r_opt.headers.items():
            if 'Access-Control' in k:
                print(f"{k}: {v}")
        
        # Then test POST
        print("\n--- POST (Signup) ---")
        r_post = requests.post(url, json=payload, headers=headers)
        print(f"Status: {r_post.status_code}")
        print(f"Response: {r_post.text}")
        for k, v in r_post.headers.items():
            if 'Access-Control' in k:
                print(f"{k}: {v}")
                
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    debug_signup()
