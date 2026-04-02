
import requests
import time
import subprocess
import os

def test_cors():
    print("Starting backend for testing...")
    # Using local port 8000
    p = subprocess.Popen(['uvicorn', 'main:app', '--host', '0.0.0.0', '--port', '8000'], 
                        stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True,
                        cwd=os.path.join(os.getcwd(), 'backend'))
    
    time.sleep(5)  # Wait for startup
    
    origin = 'http://127.0.0.1:5173'
    print(f"Testing CORS OPTIONS request from origin: {origin}")
    
    try:
        # Preflight request
        headers = {
            'Origin': origin,
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type'
        }
        r = requests.options('http://127.0.0.1:8000/auth/signup', headers=headers)
        
        print(f"Status Code: {r.status_code}")
        print(f"Allow-Origin: {r.headers.get('Access-Control-Allow-Origin')}")
        print(f"Allow-Methods: {r.headers.get('Access-Control-Allow-Methods')}")
        
        if r.headers.get('Access-Control-Allow-Origin') == origin:
            print("CORS Verification SUCCESS!")
        else:
            print("CORS Verification FAILED!")
            
    except Exception as e:
        print(f"Test failed: {e}")
    finally:
        p.terminate()
        p.wait()

if __name__ == "__main__":
    test_cors()
