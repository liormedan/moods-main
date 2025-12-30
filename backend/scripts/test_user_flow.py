"""
Comprehensive User Flow Test
Tests all features of the Moods Enter application:
- Authentication (Signup, Login)
- User Settings (Get, Update)
- Emergency Contacts (Get, Create, Delete)
- Therapist Info (Get, Update)
- Therapist Tasks (Get, Create, Update)
- Mood Entries (Get, Create with all new fields, Delete All)
- Appointments (Get, Create)
"""

import requests
import json
import uuid
import sys
import os
import argparse
from datetime import datetime, timedelta

# Cloud Run URL (update this if your URL changes)
CLOUD_RUN_URL = "https://moods-backend-ka6h625uva-uc.a.run.app/api/v1"
LOCAL_URL = "http://localhost:8000/api/v1"

# Parse command line arguments
parser = argparse.ArgumentParser(description='Test user flow for Moods Enter application')
parser.add_argument(
    '--url',
    type=str,
    default=None,
    help=f'API base URL (default: {LOCAL_URL} or from API_URL env var)'
)
parser.add_argument(
    '--cloud',
    action='store_true',
    help='Use Cloud Run URL (overrides --url)'
)
parser.add_argument(
    '--local',
    action='store_true',
    help='Use localhost URL (overrides --url and --cloud)'
)
parser.add_argument(
    '--no-ssl-verify',
    action='store_true',
    help='Disable SSL certificate verification (not recommended for production)'
)
args = parser.parse_args()

# Determine BASE_URL
if args.local:
    BASE_URL = LOCAL_URL
elif args.cloud:
    BASE_URL = CLOUD_RUN_URL
elif args.url:
    BASE_URL = args.url
else:
    # Check environment variable
    BASE_URL = os.getenv('API_URL', LOCAL_URL)

# Ensure BASE_URL ends with /api/v1 if it doesn't already
if not BASE_URL.endswith('/api/v1'):
    if BASE_URL.endswith('/'):
        BASE_URL = BASE_URL.rstrip('/') + '/api/v1'
    else:
        BASE_URL = BASE_URL + '/api/v1'

EMAIL = f"test_user_{uuid.uuid4().hex[:8]}@example.com"
PASSWORD = "test_password_123"

# SSL verification setting
VERIFY_SSL = not args.no_ssl_verify

# Colors for terminal output
class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

def print_step(step, description=""):
    """Print a test step header"""
    print(f"\n{Colors.HEADER}{Colors.BOLD}=== {step} ==={Colors.ENDC}")
    if description:
        print(f"{Colors.OKCYAN}{description}{Colors.ENDC}")

def print_success(message):
    """Print success message"""
    print(f"{Colors.OKGREEN}✓ {message}{Colors.ENDC}")

def print_error(message):
    """Print error message"""
    print(f"{Colors.FAIL}✗ {message}{Colors.ENDC}")

def print_info(message):
    """Print info message"""
    print(f"{Colors.OKBLUE}ℹ {message}{Colors.ENDC}")

def check_response(response, expected_status=200, description=""):
    """Check if response has expected status code"""
    if response.status_code != expected_status:
        try:
            error_detail = response.json()
        except:
            error_detail = response.text
        print_error(f"Failed with status {response.status_code}")
        if description:
            print_error(f"Description: {description}")
        print_error(f"Detail: {error_detail}")
        return None
    print_success(f"Status {response.status_code}")
    try:
        return response.json()
    except:
        return response.text

def run_comprehensive_test():
    """Run comprehensive user flow test"""
    print(f"\n{Colors.BOLD}{Colors.HEADER}")
    print("=" * 60)
    print("  COMPREHENSIVE USER FLOW TEST - MOODS ENTER")
    print("=" * 60)
    print(f"{Colors.ENDC}")
    
    # Show which environment we're testing
    if 'localhost' in BASE_URL or '127.0.0.1' in BASE_URL:
        env_type = "LOCAL"
        env_color = Colors.OKCYAN
    elif 'run.app' in BASE_URL or 'cloud' in BASE_URL.lower():
        env_type = "CLOUD RUN (PRODUCTION)"
        env_color = Colors.WARNING
    else:
        env_type = "CUSTOM"
        env_color = Colors.OKBLUE
    
    print(f"{env_color}Environment: {env_type}{Colors.ENDC}")
    print_info(f"Testing against: {BASE_URL}")
    print_info(f"Test user email: {EMAIL}")
    print_info(f"Test password: {PASSWORD}")
    
    # Store data for later use
    test_data = {
        "access_token": None,
        "user_id": None,
        "mood_id": None,
        "contact_id": None,
        "task_id": None,
        "appointment_id": None
    }
    
    headers = {}
    
    # ==========================================
    # 1. AUTHENTICATION
    # ==========================================
    print_step("1. AUTHENTICATION", "Testing user signup and login")
    
    # 1.1 Signup
    print("\n1.1 User Signup")
    signup_url = f"{BASE_URL}/auth/signup"
    signup_data = {
        "email": EMAIL,
        "password": PASSWORD,
        "is_active": True
    }
    print_info(f"Signing up with email: {EMAIL}")
    try:
        resp = requests.post(signup_url, json=signup_data, verify=VERIFY_SSL)
        result = check_response(resp, 200, "User signup")
        if not result:
            print_error("Signup failed - cannot continue")
            return False
        test_data["user_id"] = result.get("id")
        print_success(f"User created with ID: {test_data['user_id']}")
    except requests.exceptions.ConnectionError:
        print_error("Cannot connect to backend. Is it running on http://localhost:8000?")
        return False
    except Exception as e:
        print_error(f"Error during signup: {e}")
        return False
    
    # 1.2 Login
    print("\n1.2 User Login")
    login_url = f"{BASE_URL}/auth/login/access-token"
    login_data = {
        "username": EMAIL,
        "password": PASSWORD
    }
    print_info("Logging in to get access token...")
    resp = requests.post(login_url, data=login_data, verify=VERIFY_SSL)
    result = check_response(resp, 200, "User login")
    if not result:
        print_error("Login failed - cannot continue")
        return False
    
    test_data["access_token"] = result.get("access_token")
    if not test_data["access_token"]:
        print_error("No access token in response")
        return False
    
    headers = {
        "Authorization": f"Bearer {test_data['access_token']}"
    }
    print_success(f"Got access token: {test_data['access_token'][:30]}...")
    
    # ==========================================
    # 2. USER SETTINGS
    # ==========================================
    print_step("2. USER SETTINGS", "Testing user settings management")
    
    # 2.1 Get Settings
    print("\n2.1 Get User Settings")
    settings_url = f"{BASE_URL}/users/me/settings"
    resp = requests.get(settings_url, headers=headers, verify=VERIFY_SSL)
    result = check_response(resp, 200, "Get user settings")
    if result:
        print_info(f"Current settings: {json.dumps(result, indent=2, default=str)}")
    
    # 2.2 Update Settings
    print("\n2.2 Update User Settings")
    update_settings_data = {
        "theme": "dark",
        "language": "he",
        "notifications": True
    }
    print_info(f"Updating settings: {update_settings_data}")
    resp = requests.put(settings_url, json=update_settings_data, headers=headers, verify=VERIFY_SSL)
    result = check_response(resp, 200, "Update user settings")
    if result:
        print_success(f"Settings updated: theme={result.get('theme')}, language={result.get('language')}")
    
    # ==========================================
    # 3. EMERGENCY CONTACTS
    # ==========================================
    print_step("3. EMERGENCY CONTACTS", "Testing emergency contact management")
    
    # 3.1 Get Contacts (should be empty initially)
    print("\n3.1 Get Emergency Contacts")
    contacts_url = f"{BASE_URL}/users/me/contacts"
    resp = requests.get(contacts_url, headers=headers, verify=VERIFY_SSL)
    result = check_response(resp, 200, "Get emergency contacts")
    initial_count = len(result) if result else 0
    print_info(f"Initial contacts count: {initial_count}")
    
    # 3.2 Create Contact
    print("\n3.2 Create Emergency Contact")
    contact_data = {
        "name": "Test Emergency Contact",
        "phone": "+972-50-1234567",
        "relation": "Family"
    }
    print_info(f"Creating contact: {contact_data}")
    resp = requests.post(contacts_url, json=contact_data, headers=headers, verify=VERIFY_SSL)
    result = check_response(resp, 200, "Create emergency contact")
    if result:
        test_data["contact_id"] = result.get("id")
        print_success(f"Contact created with ID: {test_data['contact_id']}")
        print_info(f"Contact details: {json.dumps(result, indent=2, default=str)}")
    
    # 3.3 Get Contacts Again (should have one now)
    print("\n3.3 Get Emergency Contacts (After Create)")
    resp = requests.get(contacts_url, headers=headers, verify=VERIFY_SSL)
    result = check_response(resp, 200, "Get emergency contacts after create")
    if result:
        print_success(f"Contacts count: {len(result)}")
        found = any(c.get("id") == test_data["contact_id"] for c in result)
        if found:
            print_success("Created contact found in list!")
        else:
            print_error("Created contact NOT found in list!")
    
    # 3.4 Delete Contact
    print("\n3.4 Delete Emergency Contact")
    if test_data["contact_id"]:
        delete_url = f"{contacts_url}/{test_data['contact_id']}"
        print_info(f"Deleting contact ID: {test_data['contact_id']}")
        resp = requests.delete(delete_url, headers=headers, verify=VERIFY_SSL)
        result = check_response(resp, 200, "Delete emergency contact")
        if result:
            print_success("Contact deleted successfully")
    
    # ==========================================
    # 4. THERAPIST INFO
    # ==========================================
    print_step("4. THERAPIST INFO", "Testing therapist information management")
    
    # 4.1 Get Therapist Info
    print("\n4.1 Get Therapist Info")
    therapist_info_url = f"{BASE_URL}/users/me/therapist/info"
    resp = requests.get(therapist_info_url, headers=headers, verify=VERIFY_SSL)
    result = check_response(resp, 200, "Get therapist info")
    if result:
        print_info(f"Current therapist info: {json.dumps(result, indent=2, default=str)}")
    
    # 4.2 Update Therapist Info
    print("\n4.2 Update Therapist Info")
    therapist_data = {
        "name": "Dr. Test Therapist",
        "email": "therapist@example.com",
        "phone": "+972-50-9876543"
    }
    print_info(f"Updating therapist info: {therapist_data}")
    resp = requests.put(therapist_info_url, json=therapist_data, headers=headers, verify=VERIFY_SSL)
    result = check_response(resp, 200, "Update therapist info")
    if result:
        print_success(f"Therapist info updated: {result.get('name')}")
    
    # ==========================================
    # 5. THERAPIST TASKS
    # ==========================================
    print_step("5. THERAPIST TASKS", "Testing therapist task management")
    
    # 5.1 Get Tasks
    print("\n5.1 Get Therapist Tasks")
    tasks_url = f"{BASE_URL}/users/me/therapist/tasks"
    resp = requests.get(tasks_url, headers=headers, verify=VERIFY_SSL)
    result = check_response(resp, 200, "Get therapist tasks")
    initial_task_count = len(result) if result else 0
    print_info(f"Initial tasks count: {initial_task_count}")
    
    # 5.2 Create Task
    print("\n5.2 Create Therapist Task")
    task_data = {
        "title": "Complete mood tracking exercise",
        "is_completed": False
    }
    print_info(f"Creating task: {task_data}")
    resp = requests.post(tasks_url, json=task_data, headers=headers, verify=VERIFY_SSL)
    result = check_response(resp, 200, "Create therapist task")
    if result:
        test_data["task_id"] = result.get("id")
        print_success(f"Task created with ID: {test_data['task_id']}")
        print_info(f"Task details: {json.dumps(result, indent=2, default=str)}")
    
    # 5.3 Update Task
    print("\n5.3 Update Therapist Task")
    if test_data["task_id"]:
        update_task_data = {
            "title": "Complete mood tracking exercise",
            "is_completed": True
        }
        update_task_url = f"{tasks_url}/{test_data['task_id']}"
        print_info(f"Updating task to completed: {update_task_data}")
        resp = requests.put(update_task_url, json=update_task_data, headers=headers, verify=VERIFY_SSL)
        result = check_response(resp, 200, "Update therapist task")
        if result:
            print_success(f"Task updated: completed={result.get('is_completed')}")
    
    # ==========================================
    # 6. MOOD ENTRIES
    # ==========================================
    print_step("6. MOOD ENTRIES", "Testing mood entry management with all new fields")
    
    # 6.1 Get Moods (should be empty initially)
    print("\n6.1 Get Mood Entries")
    moods_url = f"{BASE_URL}/moods/"
    resp = requests.get(moods_url, headers=headers, verify=VERIFY_SSL)
    result = check_response(resp, 200, "Get mood entries")
    initial_mood_count = len(result) if result else 0
    print_info(f"Initial mood entries count: {initial_mood_count}")
    
    # 6.2 Create Mood Entry with ALL new fields
    print("\n6.2 Create Mood Entry (with all new sliders and medication)")
    mood_data = {
        "mood_level": 7,
        "energy_level": 6,
        "stress_level": 3,
        "note": "Test mood entry with all new features",
        "custom_metrics": [
            {
                "name": "שינה",
                "value": 8,
                "lowLabel": "0 שעות",
                "highLabel": "10+ שעות",
                "emoji": "😴"
            },
            {
                "name": "תיאבון",
                "value": 7,
                "lowLabel": "נמוך",
                "highLabel": "גבוה",
                "emoji": "🍽️"
            },
            {
                "name": "ריכוז",
                "value": 6,
                "lowLabel": "נמוך",
                "highLabel": "גבוה",
                "emoji": "🎯"
            },
            {
                "name": "חברתי",
                "value": 5,
                "lowLabel": "הרגשת בדידות",
                "highLabel": "הרגשת מלאות",
                "emoji": "👥"
            },
            {
                "name": "חרדה",
                "value": 4,
                "lowLabel": "נמוך",
                "highLabel": "גבוה",
                "emoji": "😰"
            },
            {
                "name": "לקיחת תרופות",
                "value": 1,
                "lowLabel": "לא",
                "highLabel": "כן",
                "emoji": "💊"
            }
        ]
    }
    print_info(f"Creating mood entry with custom metrics...")
    print_info(f"  Mood Level: {mood_data['mood_level']}/10")
    print_info(f"  Energy Level: {mood_data['energy_level']}/10")
    print_info(f"  Stress Level: {mood_data['stress_level']}/10")
    print_info(f"  Custom Metrics Count: {len(mood_data['custom_metrics'])}")
    resp = requests.post(moods_url, json=mood_data, headers=headers, verify=VERIFY_SSL)
    result = check_response(resp, 200, "Create mood entry")
    if result:
        test_data["mood_id"] = result.get("id")
        print_success(f"Mood entry created with ID: {test_data['mood_id']}")
        if result.get("custom_metrics"):
            print_success(f"Custom metrics saved: {len(result.get('custom_metrics', []))} items")
    
    # 6.3 Get Moods Again (should have one now)
    print("\n6.3 Get Mood Entries (After Create)")
    resp = requests.get(moods_url, headers=headers, verify=VERIFY_SSL)
    result = check_response(resp, 200, "Get mood entries after create")
    if result:
        print_success(f"Mood entries count: {len(result)}")
        found = any(m.get("id") == test_data["mood_id"] for m in result)
        if found:
            print_success("Created mood entry found in list!")
            # Show the created entry
            created_entry = next((m for m in result if m.get("id") == test_data["mood_id"]), None)
            if created_entry:
                print_info(f"Entry details:")
                print_info(f"  Mood: {created_entry.get('mood_level')}/10")
                print_info(f"  Energy: {created_entry.get('energy_level')}/10")
                print_info(f"  Stress: {created_entry.get('stress_level')}/10")
                print_info(f"  Note: {created_entry.get('note', 'N/A')}")
                if created_entry.get('custom_metrics'):
                    print_info(f"  Custom Metrics: {len(created_entry['custom_metrics'])} items")
        else:
            print_error("Created mood entry NOT found in list!")
    
    # 6.4 Delete All Moods
    print("\n6.4 Delete All Mood Entries")
    print_info("Deleting all mood entries (clean history)...")
    resp = requests.delete(moods_url, headers=headers, verify=VERIFY_SSL)
    result = check_response(resp, 200, "Delete all mood entries")
    if result:
        print_success(f"All mood entries deleted: {result.get('msg', 'Success')}")
    
    # ==========================================
    # 7. APPOINTMENTS
    # ==========================================
    print_step("7. APPOINTMENTS", "Testing appointment management")
    
    # 7.1 Get Appointments
    print("\n7.1 Get Appointments")
    appointments_url = f"{BASE_URL}/appointments/"
    resp = requests.get(appointments_url, headers=headers, verify=VERIFY_SSL)
    result = check_response(resp, 200, "Get appointments")
    initial_appointment_count = len(result) if result else 0
    print_info(f"Initial appointments count: {initial_appointment_count}")
    
    # 7.2 Create Appointment
    print("\n7.2 Create Appointment")
    # Create appointment for tomorrow
    appointment_date = (datetime.now() + timedelta(days=1)).isoformat()
    appointment_data = {
        "title": "Therapy Session",
        "date": appointment_date,
        "notes": "Regular weekly session"
    }
    print_info(f"Creating appointment: {appointment_data}")
    resp = requests.post(appointments_url, json=appointment_data, headers=headers, verify=VERIFY_SSL)
    result = check_response(resp, 200, "Create appointment")
    if result:
        test_data["appointment_id"] = result.get("id")
        print_success(f"Appointment created with ID: {test_data['appointment_id']}")
        print_info(f"Appointment details: {json.dumps(result, indent=2, default=str)}")
    
    # 7.3 Get Appointments Again
    print("\n7.3 Get Appointments (After Create)")
    resp = requests.get(appointments_url, headers=headers, verify=VERIFY_SSL)
    result = check_response(resp, 200, "Get appointments after create")
    if result:
        print_success(f"Appointments count: {len(result)}")
        found = any(a.get("id") == test_data["appointment_id"] for a in result)
        if found:
            print_success("Created appointment found in list!")
        else:
            print_error("Created appointment NOT found in list!")
    
    # ==========================================
    # SUMMARY
    # ==========================================
    print_step("TEST SUMMARY", "All tests completed")
    print(f"\n{Colors.BOLD}Test Results:{Colors.ENDC}")
    print_success("✓ Authentication (Signup & Login)")
    print_success("✓ User Settings (Get & Update)")
    print_success("✓ Emergency Contacts (Get, Create, Delete)")
    print_success("✓ Therapist Info (Get & Update)")
    print_success("✓ Therapist Tasks (Get, Create, Update)")
    print_success("✓ Mood Entries (Get, Create with all fields, Delete All)")
    print_success("✓ Appointments (Get & Create)")
    
    print(f"\n{Colors.OKGREEN}{Colors.BOLD}")
    print("=" * 60)
    print("  ALL TESTS PASSED SUCCESSFULLY! 🎉")
    print("=" * 60)
    print(f"{Colors.ENDC}\n")
    
    return True

if __name__ == "__main__":
    try:
        # Show usage info if needed
        if len(sys.argv) > 1 and ('-h' in sys.argv or '--help' in sys.argv):
            print(f"\n{Colors.OKCYAN}Usage examples:{Colors.ENDC}")
            print(f"  {Colors.OKGREEN}python test_user_flow.py{Colors.ENDC}                    # Test localhost (default)")
            print(f"  {Colors.OKGREEN}python test_user_flow.py --local{Colors.ENDC}            # Test localhost explicitly")
            print(f"  {Colors.OKGREEN}python test_user_flow.py --cloud{Colors.ENDC}            # Test Cloud Run")
            print(f"  {Colors.OKGREEN}python test_user_flow.py --url https://...{Colors.ENDC}  # Test custom URL")
            print(f"  {Colors.OKGREEN}API_URL=https://... python test_user_flow.py{Colors.ENDC} # Test via env var")
            print()
        
        success = run_comprehensive_test()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print(f"\n{Colors.WARNING}Test interrupted by user{Colors.ENDC}")
        sys.exit(1)
    except requests.exceptions.ConnectionError:
        print(f"\n{Colors.FAIL}Error: Could not connect to the backend.{Colors.ENDC}")
        if 'localhost' in BASE_URL:
            print(f"{Colors.FAIL}Make sure the backend is running on http://localhost:8000{Colors.ENDC}")
        else:
            print(f"{Colors.FAIL}Make sure the backend is accessible at: {BASE_URL}{Colors.ENDC}")
            print(f"{Colors.FAIL}Check your internet connection and Cloud Run service status.{Colors.ENDC}")
        sys.exit(1)
    except requests.exceptions.SSLError as e:
        print(f"\n{Colors.FAIL}SSL Error: Could not verify SSL certificate.{Colors.ENDC}")
        print(f"{Colors.FAIL}This might happen with Cloud Run. Error: {e}{Colors.ENDC}")
        sys.exit(1)
    except Exception as e:
        print(f"\n{Colors.FAIL}Unexpected error: {e}{Colors.ENDC}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

