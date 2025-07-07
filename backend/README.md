# MindCare Backend (Flask)

This is the backend for the MindCare app, built with Python and Flask.

## How to run
1. Make sure you have Python 3.8+ installed.
2. (Recommended) Create a virtual environment:
   ```bash
   python -m venv venv
   venv\Scripts\activate  # On Windows
   ```
3. Install dependencies:
   ```bash
   pip install flask flask-cors
   ```
4. Run the server:
   ```bash
   python app.py
   ```

## Endpoints
- `/api/stress-check` (POST)
- `/api/burnout-check` (POST)

All endpoints expect JSON input and return a summary result.

### `/api/stress-check` (POST)
**Request Example:**
```json
{
  "answers": [3, 2, 4, 1, 5]
}
```
**Response Example:**
```json
{
  "summary": "Your stress level is moderate."
}
```

### `/api/burnout-check` (POST)
**Request Example:**
```json
{
  "answers": [2, 3, 1, 4, 2]
}
```
**Response Example:**
```json
{
  "summary": "You are not experiencing burnout."
}
```

---

> This backend is for demo/testing only. No data is stored.
