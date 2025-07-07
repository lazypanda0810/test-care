import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

# Gemini API configuration
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

# Placeholder for ML models (to be implemented)
mental_health_model = None
burnout_risk_model = None

# In-memory history storage (for demo; use a database for production)
history = []

def ask_gemini(questions, answers):
    prompt = """
You are a mental health assistant. Analyze the following questions and user responses, and provide a short, friendly prediction or advice. Be concise and supportive.

Questions and Answers:
"""
    for q, a in zip(questions, answers):
        prompt += f"\nQ: {q}\nA: {a}"
    prompt += """
\n\nPrediction:
- Give a brief, supportive summary or advice based on the answers.
- Always include a line: 'Your score is XX' (where XX is a number from 0 to 100, with 100 being the best possible mental health and 0 the worst. For burnout, 0 is no burnout risk, 100 is maximum risk.)
"""
    data = {
        "contents": [{"parts": [{"text": prompt}]}]
    }
    headers = {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY
    }
    try:
        response = requests.post(GEMINI_API_URL, json=data, headers=headers)
        response.raise_for_status()
        result = response.json()
        return result["candidates"][0]["content"]["parts"][0]["text"]
    except Exception as e:
        return f"Sorry, AI prediction failed: {e}"

@app.route('/api/mental-health-predict', methods=['POST'])
def mental_health_predict():
    data = request.json.get('answers', [])
    questions = request.json.get('questions', [])
    result = ask_gemini(questions, data)
    # Save to history
    history.append({'type': 'mental_health', 'answers': data, 'questions': questions, 'result': result})
    return jsonify({'result': result})

@app.route('/api/burnout-risk-predict', methods=['POST'])
def burnout_risk_predict():
    data = request.json.get('answers', [])
    questions = request.json.get('questions', [])
    result = ask_gemini(questions, data)
    # Save to history
    history.append({'type': 'burnout_risk', 'answers': data, 'questions': questions, 'result': result})
    return jsonify({'result': result})

@app.route('/api/history', methods=['GET'])
def get_history():
    return jsonify({'history': history})

@app.route('/api/feedback', methods=['POST'])
def feedback():
    feedback_text = request.json.get('feedback', '')
    # TODO: Store feedback somewhere
    return jsonify({'result': 'Thank you for your feedback!'})

def ask_gemini_chat(message):
    prompt = f"""
You are MindBot, a friendly, supportive, and non-judgmental mental health chatbot. Respond conversationally and helpfully to the user's message below. If the user asks for advice, support, or just wants to talk, respond with empathy and encouragement. Avoid giving medical diagnoses.

User: {message}
MindBot:"""
    data = {
        "contents": [{"parts": [{"text": prompt}]}]
    }
    headers = {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY
    }
    try:
        response = requests.post(GEMINI_API_URL, json=data, headers=headers)
        response.raise_for_status()
        result = response.json()
        return result["candidates"][0]["content"]["parts"][0]["text"]
    except Exception as e:
        return f"Sorry, MindBot could not reply: {e}"

@app.route('/api/mindbot-chat', methods=['POST'])
def mindbot_chat():
    data = request.json
    message = data.get('message', '')
    if not message.strip():
        return jsonify({'reply': 'Please type a message.'}), 400
    reply = ask_gemini_chat(message)
    return jsonify({'reply': reply})

if __name__ == '__main__':
    if not GEMINI_API_KEY:
        print("Error: GEMINI_API_KEY environment variable not set.")
    else:
        app.run(debug=True)
