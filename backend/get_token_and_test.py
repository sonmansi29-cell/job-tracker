import urllib.request
import json

# Step 1: Get fresh JWT token
token_url = 'http://127.0.0.1:8000/api/token/'
token_data = json.dumps({
    'username': 'admin',
    'password': 'mansi@29'
}).encode('utf-8')

token_req = urllib.request.Request(
    token_url,
    data=token_data,
    headers={'Content-Type': 'application/json'},
    method='POST'
)

try:
    token_response = urllib.request.urlopen(token_req)
    tokens = json.loads(token_response.read().decode())
    access_token = tokens['access']
    print(f"✅ Got new access token: {access_token[:50]}...")
except Exception as e:
    print(f"❌ Error getting token: {e}")
    exit(1)

# Step 2: Test creating a job application
job_url = 'http://127.0.0.1:8000/api/job-apps/'
job_data = json.dumps({
    "company": "Google",
    "position": "Frontend Developer", 
    "status": "Applied",
    "applied_date": "2026-02-10"
}).encode('utf-8')

job_req = urllib.request.Request(
    job_url,
    data=job_data,
    headers={
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {access_token}'
    },
    method='POST'
)

try:
    job_response = urllib.request.urlopen(job_req)
    print(f"✅ Status: {job_response.status}")
    print(f"✅ Job created successfully!")
    print(f"Response: {job_response.read().decode()}")
except urllib.error.HTTPError as e:
    print(f"❌ Status: {e.code}")
    print(f"Error: {e.read().decode()}")

