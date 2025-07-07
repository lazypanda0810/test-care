import requests

url = "http://127.0.0.1:5000/api/mental-health-predict"
data = {
    "questions": [
        "How often have you felt down, depressed, or hopeless in the last two weeks?",
        "How often have you had little interest or pleasure in doing things?"
    ],
    "answers": ["often", "sometimes"]
}

resp = requests.post(url, json=data)
print("Status:", resp.status_code)
print("Response:", resp.text)
