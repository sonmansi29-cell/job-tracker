import urllib.request
import json

ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzcwNzQwNzg2LCJpYXQiOjE3NzA3NDA0ODYsImp0aSI6ImUwZTg2OTcxYTBhNTRlOWRiODdmZDE2NzMzOTExOWZmIiwidXNlcl9pZCI6IjEifQ.xd7zp1GFxtbSWGtteDEX4-hul2JhRxMHoE6xJMaCd2EQ"

# Test creating a job application
data = json.dumps({
    "company": "Google",
    "role": "Frontend Developer", 
    "status": "Applied",
    "applied_date": "2026-02-10"
}).encode('utf-8')

req = urllib.request.Request(
    'http://127.0.0.1:8000/api/job-apps/',
    data=data,
    headers={
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {ACCESS_TOKEN}'
    },
    method='POST'
)

try:
    response = urllib.request.urlopen(req)
    print(f"Status: {response.status}")
    print(f"Response: {response.read().decode()}")
except urllib.error.HTTPError as e:
    print(f"Status: {e.code}")
    print(f"Error: {e.read().decode()}")

