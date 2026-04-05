
import sys
import os
# Add backend to path
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), 'backend')))

from schemas import TokenResponse, UserResponse
from datetime import datetime

def debug_pydantic():
    print("Testing Pydantic validation for TokenResponse...")
    
    # Mock data that mimics a newly created User SQLAlchemy object
    class MockUser:
        def __init__(self):
            self.id = 1
            self.name = "Test"
            self.email = "test@example.com"
            self.role = "user"
            self.subscription_type = "free"
            self.subscription_status = "inactive"
            self.charity_id = None
            self.charity_percentage = 0.0
            self.created_at = datetime.now()

    user_obj = MockUser()
    
    try:
        print("\nAttempt 1: TokenResponse(access_token='...', user=user_obj)")
        token_res = TokenResponse(access_token="test_token", user=user_obj)
        print("SUCCESS 1")
    except Exception as e:
        print(f"FAILED 1: {e}")

    try:
        print("\nAttempt 2: TokenResponse.model_validate({'access_token': '...', 'user': user_obj})")
        token_res = TokenResponse.model_validate({"access_token": "test_token", "user": user_obj})
        print("SUCCESS 2")
    except Exception as e:
        print(f"FAILED 2: {e}")

if __name__ == "__main__":
    #start debug
    debug_pydantic()
