
from pydantic import BaseModel, ConfigDict
from datetime import datetime

def debug_v2():
    print("Testing Pydantic v2 model_config...")
    
    class UserResponseV2(BaseModel):
        model_config = ConfigDict(from_attributes=True)
        id: int
        name: str

    class MockUser:
        def __init__(self):
            self.id = 1
            self.name = "Test"

    user_obj = MockUser()
    try:
        res = UserResponseV2.model_validate(user_obj)
        print(f"SUCCESS: {res.model_dump()}")
    except Exception as e:
        print(f"FAILED: {e}")

if __name__ == "__main__":
    debug_v2()
