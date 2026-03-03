
import requests
import sys

BASE_URL = "http://localhost:8000"
ADMIN_EMAIL = "chessclub.sathyabama@gmail.com"
PASSWORD = "admin123"

def test_e2e():
    print("🚀 Starting End-to-End Test...")

    # 1. Login
    print(f"🔑 Logging in as {ADMIN_EMAIL}...")
    try:
        r = requests.post(f"{BASE_URL}/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": PASSWORD
        })
        if r.status_code != 200:
            print(f"❌ Login failed: {r.status_code} {r.text}")
            return False
        
        data = r.json()
        token = data["access_token"]
        print("✅ Login successful. Token received.")
    except Exception as e:
        print(f"❌ Login error: {e}")
        return False

    # 2. Extract Tasks (Test NLP endpoint)
    print("🗣️ Testing Task Extraction...")
    try:
        r = requests.post(
            f"{BASE_URL}/extract-tasks/text",
            params={"text": "Review the database migration plan by tomorrow 5pm"},
            headers={"Authorization": f"Bearer {token}"}
        )
        if r.status_code == 200:
            res = r.json()
            tasks = res.get("saved_tasks", [])
            print(f"✅ Extraction successful. Created {len(tasks)} tasks.")
            if len(tasks) > 0:
                print(f"   Task: {tasks[0]['description']}")
        else:
            print(f"❌ Extraction failed: {r.status_code} {r.text}")
            return False
    except Exception as e:
        print(f"❌ Extraction error: {e}")
        return False

    # 3. Get Tasks
    print("📋 Fetching Tasks...")
    try:
        r = requests.get(
            f"{BASE_URL}/tasks",
            headers={"Authorization": f"Bearer {token}"}
        )
        if r.status_code == 200:
            tasks = r.json()
            print(f"✅ Fetched {len(tasks)} tasks.")
        else:
            print(f"❌ Fetch tasks failed: {r.status_code}")
            return False
    except Exception as e:
        print(f"❌ Fetch tasks error: {e}")
        return False

    return True

if __name__ == "__main__":
    if test_e2e():
        print("\n✨ E2E VERIFICATION PASSED ✨")
        sys.exit(0)
    else:
        print("\n💥 E2E VERIFICATION FAILED 💥")
        sys.exit(1)
