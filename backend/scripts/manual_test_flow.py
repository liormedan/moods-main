
import requests
import json
import uuid
import sys

# Configuration
BASE_URL = "http://localhost:8000/api/v1"
EMAIL = f"test_user_{uuid.uuid4()}@example.com"
PASSWORD = "test_password_123"

def print_step(step):
    print(f"\n=== {step} ===")

def check_response(response, expected_status=200):
    if response.status_code != expected_status:
        try:
            error_detail = response.json()
        except:
            error_detail = response.text
        print(f"❌ Failed with {response.status_code}")
        print(f"Detail: {error_detail}")
        sys.exit(1)
    print("✅ Success")
    return response.json()

def run_flow():
    print(f"Testing against {BASE_URL}")
    print(f"User: {EMAIL}")

    # 1. Signup
    print_step("1. Signup")
    signup_url = f"{BASE_URL}/auth/signup"
    signup_data = {
        "email": EMAIL,
        "password": PASSWORD,
        "is_active": True
    }
    print(f"Signing up with {EMAIL}...")
    try:
        resp = requests.post(signup_url, json=signup_data)
        check_response(resp, 200)
    except Exception as e:
        print(f"Error during signup request: {e}")
        sys.exit(1)

    # 2. Login (Get Token)
    print_step("2. Login")
    login_url = f"{BASE_URL}/auth/login/access-token"
    login_data = {
        "username": EMAIL,
        "password": PASSWORD
    }
    resp = requests.post(login_url, data=login_data)
    token_data = check_response(resp, 200)
    access_token = token_data.get("access_token")
    if not access_token:
        print("❌ No access token in response")
        sys.exit(1)
    print(f"Got access token: {access_token[:20]}...")

    headers = {
        "Authorization": f"Bearer {access_token}"
    }

    # 3. Get User Settings (Verify Auth)
    print_step("3. Verify Auth (Get Settings)")
    settings_url = f"{BASE_URL}/users/me/settings"
    resp = requests.get(settings_url, headers=headers)
    check_response(resp, 200)

    # 4. Create Mood
    print_step("4. Create Mood Entry")
    mood_url = f"{BASE_URL}/moods/"
    mood_data = {
        "mood_level": 8,
        "energy_level": 7,
        "stress_level": 2,
        "note": "Automated test entry",
        "custom_metrics": {"focus": 9}
    }
    resp = requests.post(mood_url, json=mood_data, headers=headers)
    created_mood = check_response(resp, 200)
    print(f"Created mood with ID: {created_mood.get('id')}")

    # 5. Get Moods
    print_step("5. Retrieve Moods")
    resp = requests.get(mood_url, headers=headers)
    moods = check_response(resp, 200)
    print(f"Retrieved {len(moods)} moods")
    
    # Verify the created mood is in the list
    found = any(m.get('id') == created_mood.get('id') for m in moods)
    if found:
        print("✅ Created mood found in list!")
    else:
        print("❌ Created mood NOT found in list!")
        sys.exit(1)

if __name__ == "__main__":
    try:
        run_flow()
        print("\n🎉 All tests passed successfully!")
    except requests.exceptions.ConnectionError:
        print("\n❌ Error: Could not connect to the backend.")
        print("Make sure the backend is running on http://localhost:8000")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        sys.exit(1)
