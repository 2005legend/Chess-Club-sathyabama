#!/usr/bin/env python3
"""
Test script for Chess Club Task Management Backend
"""

import requests
import json
from datetime import datetime, timedelta

# API base URL
BASE_URL = "http://localhost:8000"

def test_health_check():
    """Test the health check endpoint"""
    print("🔍 Testing health check...")
    try:
        response = requests.get(f"{BASE_URL}/ping")
        if response.status_code == 200:
            print("✅ Health check passed")
            print(f"   Response: {response.json()}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to server. Make sure it's running on port 8000")
    except Exception as e:
        print(f"❌ Error: {str(e)}")
    print()

def test_user_signup():
    """Test user signup endpoint"""
    print("🔍 Testing user signup...")
    
    user_data = {
        "email": "test@example.com",
        "username": "testuser",
        "password": "testpassword123",
        "full_name": "Test User",
        "department": "Computer Science",
        "year": 2
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/auth/signup",
            json=user_data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            print("✅ User signup successful")
            user = response.json()
            print(f"   User ID: {user['id']}")
            print(f"   Email: {user['email']}")
            return user
        else:
            print(f"❌ User signup failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return None
    print()

def test_user_login():
    """Test user login endpoint"""
    print("🔍 Testing user login...")
    
    login_data = {
        "email": "test@example.com",
        "password": "testpassword123"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json=login_data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            print("✅ User login successful")
            token_data = response.json()
            print(f"   Token type: {token_data['token_type']}")
            print(f"   Access token: {token_data['access_token'][:20]}...")
            return token_data['access_token']
        else:
            print(f"❌ User login failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return None
    print()

def test_create_task(token):
    """Test task creation endpoint"""
    if not token:
        print("❌ No token available for task creation test")
        return None
    
    print("🔍 Testing task creation...")
    
    # Create a task for tomorrow
    tomorrow = datetime.now() + timedelta(days=1)
    
    task_data = {
        "task_description": "Practice chess openings",
        "deadline": tomorrow.isoformat(),
        "priority": "medium",
        "notes": "Focus on Sicilian Defense and Ruy Lopez"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/tasks",
            json=task_data,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {token}"
            }
        )
        
        if response.status_code == 200:
            print("✅ Task creation successful")
            task = response.json()
            print(f"   Task ID: {task['id']}")
            print(f"   Description: {task['task_description']}")
            print(f"   Deadline: {task['deadline']}")
            return task
        else:
            print(f"❌ Task creation failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return None
    print()

def test_get_tasks(token):
    """Test getting user tasks endpoint"""
    if not token:
        print("❌ No token available for get tasks test")
        return
    
    print("🔍 Testing get tasks...")
    
    try:
        response = requests.get(
            f"{BASE_URL}/tasks",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        if response.status_code == 200:
            print("✅ Get tasks successful")
            tasks = response.json()
            print(f"   Number of tasks: {len(tasks)}")
            for task in tasks:
                print(f"   - {task['task_description']} (Due: {task['deadline']})")
        else:
            print(f"❌ Get tasks failed: {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ Error: {str(e)}")
    print()

def test_task_extraction(token):
    """Test task extraction from text endpoint"""
    if not token:
        print("❌ No token available for task extraction test")
        return
    
    print("🔍 Testing task extraction from text...")
    
    text_data = {
        "text": "I need to prepare for the chess tournament next week and practice endgame strategies tomorrow"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/extract-tasks/text",
            json=text_data,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {token}"
            }
        )
        
        if response.status_code == 200:
            print("✅ Task extraction successful")
            result = response.json()
            print(f"   Message: {result['message']}")
            print(f"   Extracted tasks: {len(result['extracted_tasks'])}")
            for task in result['extracted_tasks']:
                print(f"   - {task['description']} (Due: {task['deadline']})")
        else:
            print(f"❌ Task extraction failed: {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ Error: {str(e)}")
    print()

def main():
    """Main test function"""
    print("🧪 Chess Club Backend API Test Suite")
    print("=" * 50)
    
    # Test health check first
    test_health_check()
    
    # Test user signup
    user = test_user_signup()
    
    # Test user login
    token = test_user_login()
    
    # Test task creation
    task = test_create_task(token)
    
    # Test getting tasks
    test_get_tasks(token)
    
    # Test task extraction
    test_task_extraction(token)
    
    print("🏁 Test suite completed!")
    print("\n📝 Note: Some tests may fail if the backend is not running or if there are database issues.")
    print("   Make sure to start the backend with: python run.py")

if __name__ == "__main__":
    main()
