import subprocess
import time
import requests
import os

def run_debug():
    print("Starting debug backend...")
    # Start uvicorn on port 8005
    log_file = open('trace.log', 'w')
    p = subprocess.Popen(['uvicorn', 'main:app', '--port', '8005'], stdout=log_file, stderr=subprocess.STDOUT)
    time.sleep(5)
    
    print("Triggering signup request...")
    try:
        r = requests.post('http://localhost:8005/auth/signup', 
                         json={'email': 'trace_debug_final@example.com', 'name': 'Trace', 'password': 'password123'}, 
                         timeout=10)
        print(f"Status: {r.status_code}")
        print(f"Body: {r.text}")
    except Exception as e:
        print(f"Error during request: {e}")
    
    print("Stopping backend...")
    p.terminate()
    p.wait()
    log_file.close()
    
    print("\n--- BACKEND LOG ---")
    if os.path.exists('trace.log'):
        with open('trace.log', 'r') as f:
            print(f.read())
    else:
        print("Log file not found.")

if __name__ == "__main__":
    run_debug()
