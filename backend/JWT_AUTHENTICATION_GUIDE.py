"""
JWT Authentication Guide - Django Job Application API
=====================================================

STEP 1: Get JWT Access Token
-----------------------------
1. Open browser: http://127.0.0.1:8000/api/token/
2. You'll see a browsable form (Django REST Framework)
3. Click on "POST" button
4. Fill in the form:
   - username: admin
   - password: mansi@29
5. Click "Post"
6. You'll get JSON response with access and refresh tokens
7. COPY the access token (everything after "access": ")

STEP 2: Authorize the Job API
-----------------------------
1. Go to: http://127.0.0.1:8000/api/job-apps/
2. Click "Authorize" button at top-right
3. In the popup, paste exactly:
   Bearer YOUR_ACCESS_TOKEN
   (space after Bearer is IMPORTANT!)
4. Click "Authorize" then "Close"

STEP 3: Create Your First Job
-----------------------------
1. In the browsable API at http://127.0.0.1:8000/api/job-apps/
2. Click "POST"
3. Fill in the JSON (use "position" not "role" - this is the field name in the model):
   {
     "company": "Google",
     "position": "Frontend Developer",
     "status": "Applied",
     "applied_date": "2026-02-10"
   }
4. Click "Post"
5. You should see: 201 Created ✅

TEST RESULTS:
"""
import urllib.request
import json

BASE_URL = "http://127.0.0.1:8000"

print("=" * 60)
print("JWT AUTHENTICATION TEST")
print("=" * 60)

# STEP 1: Get JWT Token
print("\n📍 STEP 1: Getting JWT Access Token...")
print(f"URL: {BASE_URL}/api/token/")

token_data = json.dumps({
    "username": "admin",
    "password": "mansi@29"
}).encode('utf-8')

token_req = urllib.request.Request(
    f"{BASE_URL}/api/token/",
    data=token_data,
    headers={'Content-Type': 'application/json'},
    method='POST'
)

try:
    token_response = urllib.request.urlopen(token_req)
    tokens = json.loads(token_response.read().decode())
    access_token = tokens['access']
    refresh_token = tokens['refresh']
    print("✅ SUCCESS! Received tokens:")
    print(f"   Access Token: {access_token[:50]}...")
    print(f"   Refresh Token: {refresh_token[:50]}...")
except urllib.error.HTTPError as e:
    print(f"❌ FAILED: {e.code} - {e.read().decode()}")
    exit(1)

# STEP 2: Test Authorization (simulating what happens when you click Authorize)
print("\n📍 STEP 2: Testing Authorization with Bearer Token...")
print("URL: {BASE_URL}/api/job-apps/")

job_list_req = urllib.request.Request(
    f"{BASE_URL}/api/job-apps/",
    headers={'Authorization': f'Bearer {access_token}'}
)

try:
    job_response = urllib.request.urlopen(job_list_req)
    jobs = json.loads(job_response.read().decode())
    print("✅ SUCCESS! Authorized access to job list")
    print(f"   Status: {job_response.status}")
    print(f"   Jobs found: {len(jobs)}")
except urllib.error.HTTPError as e:
    print(f"❌ FAILED: {e.code} - {e.read().decode()}")
    exit(1)

# STEP 3: Create a Job
print("\n📍 STEP 3: Creating a Job Application...")
print("URL: {BASE_URL}/api/job-apps/")
print("JSON:")
print(json.dumps({
    "company": "Google",
    "position": "Frontend Developer",
    "status": "Applied",
    "applied_date": "2026-02-10"
}, indent=3))

job_data = json.dumps({
    "company": "Google",
    "position": "Frontend Developer",
    "status": "Applied",
    "applied_date": "2026-02-10"
}).encode('utf-8')

job_create_req = urllib.request.Request(
    f"{BASE_URL}/api/job-apps/",
    data=job_data,
    headers={
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {access_token}'
    },
    method='POST'
)

try:
    create_response = urllib.request.urlopen(job_create_req)
    job_result = json.loads(create_response.read().decode())
    print("✅ SUCCESS! Job Created!")
    print(f"   Status: {create_response.status} Created")
    print(f"   Job ID: {job_result['id']}")
    print(f"   Company: {job_result['company']}")
    print(f"   Position: {job_result['position']}")
    print(f"   Status: {job_result['status']}")
    print(f"   Applied Date: {job_result['applied_date']}")
except urllib.error.HTTPError as e:
    print(f"❌ FAILED: {e.code} - {e.read().decode()}")
    exit(1)

print("\n" + "=" * 60)
print("🎉 ALL TESTS PASSED!")
print("=" * 60)
print("\nSummary:")
print("✅ STEP 1: JWT Token obtained successfully")
print("✅ STEP 2: API authorized with Bearer token")
print("✅ STEP 3: Job application created (201 Created)")
print("\nThe Django backend API is fully configured and working!")
print(f"\nOpen in browser: {BASE_URL}/api/job-apps/")
print(f"Click 'Authorize' and paste: Bearer {access_token}")

