
import requests
import sys
import datetime

BASE_URL = "http://localhost:8000"
ADMIN_EMAIL = "chessclub.sathyabama@gmail.com"
PASSWORD = "admin123"

def debug_full_flow():
    # 1. Login
    print(f"🔑 Logging in...")
    try:
        r = requests.post(f"{BASE_URL}/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": PASSWORD
        })
        if r.status_code != 200:
            print(f"❌ LOGIN FAILED: {r.status_code} {r.text}")
            return
        
        token = r.json()["access_token"]
        print("✅ Login successful")
    except Exception as e:
        print(f"❌ Login Connection Error: {e}")
        return

    # 2. Create Event
    print("\n📅 Creating Event...")
    headers = {"Authorization": f"Bearer {token}"}
    payload = {
        "title": "Debug Event 2",
        "description": "Testing full flow",
        "date": "2026-06-01",
        "time": "10:00",
        "venue": "Test Hall",
        "event_type": "meeting",
        "registration_required": False
    }
    
    try:
        r = requests.post(f"{BASE_URL}/events", json=payload, headers=headers)
        if r.status_code == 200:
            print("✅ EVENT CREATION SUCCESS!")
            print(r.json())
        else:
            print(f"❌ EVENT CREATION FAILED: {r.status_code}")
            with open("event_error.json", "w") as f:
                f.write(r.text)
            print(f"Response saved to event_error.json")
    except Exception as e:
        print(f"❌ Event Request Error: {e}")

if __name__ == "__main__":
    debug_full_flow()
