
import requests
import json
import sys

BASE_URL = "http://localhost:8000"
ADMIN_EMAIL = "chessclub.sathyabama@gmail.com"
PASSWORD = "admin123" # Assuming this hasn't changed in db, or I need to create a user first?
# Wait, I don't know the admin password in the DB. The code I saw in auth.py was verifying password hash.
# In `main.py` -> `login` endpoint checks `verify_password`.
# I might not be able to login if I don't have a user in the DB.
# The user said they already ran the project, so maybe there's a user?
# Or I should creates a user if not exists?
# Let's try to register a user if there is a registration endpoint? 
# Looking at main.py, there is NO registration endpoint visible in the snippets I saw!
# PROBABLY need to Create a user script directly accessing DB?

# Actually, I can just check if I can hit the public endpoints.
# And maybe try to login with common creds?
# If login fails, I can't test admin features via script easily without DB access.
# I'll try to check public GET endpoints for Events and Puzzles.

def check_endpoints():
    print("Checking GET /events...")
    try:
        r = requests.get(f"{BASE_URL}/events")
        if r.status_code == 200:
            print("✅ GET /events is accessible")
            print(f"   Count: {len(r.json())}")
        else:
            print(f"❌ GET /events failed: {r.status_code}")
    except Exception as e:
         print(f"❌ GET /events error: {e}")

    print("\nChecking GET /puzzles...")
    try:
        r = requests.get(f"{BASE_URL}/puzzles")
        if r.status_code == 200:
            print("✅ GET /puzzles is accessible")
            print(f"   Count: {len(r.json())}")
        else:
            print(f"❌ GET /puzzles failed: {r.status_code}")
    except Exception as e:
        print(f"❌ GET /puzzles error: {e}")

if __name__ == "__main__":
    check_endpoints()
