# MindCare - Mental Health Assessment Platform

MindCare is a comprehensive mental health assessment platform that provides various tools for analyzing mental wellbeing, including anxiety analysis, burnout assessment, depression screening, stress monitoring, and an AI-powered chatbot for mental health support.

## Features

- 🧠 **Anxiety Analyzer** - Comprehensive anxiety assessment tool
- 🔥 **Burnout-O-Scope** - Workplace burnout risk evaluation
- 😔 **Depression Assessment** - Mental health screening questionnaire
- 😴 **Sleep Struggle Scanner** - Sleep quality analysis
- 📊 **Stress-O-Meter** - Stress level monitoring
- 🤖 **MindBot Chat** - AI-powered mental health support chatbot
- 📈 **Interactive Dashboards** - Visual score meters and gauges
- 📋 **Assessment History** - Track your mental health journey
- 💡 **Resources & Support** - Mental health resources and information

## Tech Stack

### Backend
- **Python 3.11+**
- **Flask** - Web framework
- **Flask-CORS** - Cross-origin resource sharing
- **Google Gemini AI** - AI-powered responses and assessments
- **python-dotenv** - Environment variable management

### Frontend
- **React 19.1+** - Frontend framework
- **React Router** - Navigation
- **Chart.js & React-ChartJS-2** - Data visualization
- **React Icons** - Icon components
- **CSS3** - Custom styling

## Prerequisites

Before running the application, ensure you have the following installed:

- **Python 3.11 or higher**
- **Node.js 18+ and npm**
- **Google Gemini API Key** (for AI features)

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd testcare
```

### 2. Backend Setup

#### Create Virtual Environment
```bash
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

#### Install Python Dependencies
```bash
cd backend
pip install -r requirements.txt
```

#### Environment Variables
Create a `.env` file in the root directory:
```bash
# Copy the example and add your API key
cp .env.example .env
```

Add your Google Gemini API key to the `.env` file:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

> **Getting a Gemini API Key:**
> 1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
> 2. Create a new API key
> 3. Copy the key to your `.env` file

### 3. Frontend Setup

#### Install Node Dependencies
```bash
cd frontend
npm install
```

## Running the Application

### 1. Start the Backend Server

From the `backend` directory:
```bash
cd backend
source ../.venv/bin/activate  # Activate virtual environment
python app.py
```

The backend server will start on `http://localhost:5000`

### 2. Start the Frontend Development Server

Open a new terminal and from the `frontend` directory:
```bash
cd frontend
npm start
```

The frontend will start on `http://localhost:3000` and automatically open in your browser.

## API Endpoints

### Backend API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/mental-health-predict` | POST | Mental health assessment analysis |
| `/api/burnout-risk-predict` | POST | Burnout risk evaluation |
| `/api/mindbot-chat` | POST | AI chatbot conversation |
| `/api/history` | GET | Retrieve assessment history |
| `/api/feedback` | POST | Submit user feedback |

### Example API Usage

#### Mental Health Assessment
```bash
curl -X POST http://localhost:5000/api/mental-health-predict \
  -H "Content-Type: application/json" \
  -d '{
    "questions": ["How are you feeling today?"],
    "answers": ["I am feeling stressed"]
  }'
```

#### MindBot Chat
```bash
curl -X POST http://localhost:5000/api/mindbot-chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I am feeling anxious about work"
  }'
```

## Project Structure

```
testcare/
├── README.md
├── .env                    # Environment variables
├── .gitignore             # Git ignore rules
├── .venv/                 # Python virtual environment
├── backend/               # Flask backend
│   ├── app.py            # Main Flask application
│   ├── requirements.txt  # Python dependencies
│   └── test_api.py       # API tests
└── frontend/             # React frontend
    ├── package.json      # Node dependencies
    ├── public/           # Static assets
    │   ├── index.html
    │   └── logo.png
    └── src/              # React components
        ├── App.js        # Main application component
        ├── Header.js     # Navigation header
        ├── MindBotChat.js # AI chatbot interface
        ├── AnxietyAnalyzerPage.js
        ├── BurnoutOScopePage.js
        ├── DepressionAssessmentPage.js
        ├── StressOMeterPage.js
        ├── SleepStruggleScannerPage.js
        ├── ScoreMeter.js # Score visualization
        ├── GaugeScoreMeter.js
        └── [other components...]
```

## Development

### Backend Development

1. Activate the virtual environment:
   ```bash
   source .venv/bin/activate
   ```

2. Make changes to `backend/app.py` or other Python files

3. The Flask development server will automatically reload on file changes

### Frontend Development

1. The React development server supports hot reloading
2. Make changes to files in `frontend/src/`
3. The browser will automatically refresh with your changes

### Testing

#### Backend Tests
```bash
cd backend
source ../.venv/bin/activate
python test_api.py
```

#### Frontend Tests
```bash
cd frontend
npm test
```

## Building for Production

### Backend Production
For production deployment, consider using:
- **Gunicorn** or **uWSGI** as WSGI server
- **Nginx** as reverse proxy
- **Docker** for containerization

### Frontend Production Build
```bash
cd frontend
npm run build
```

This creates a `build/` directory with optimized production files.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini AI API key | Yes |
| `FLASK_ENV` | Flask environment (development/production) | No |
| `FLASK_DEBUG` | Enable Flask debug mode | No |

## Troubleshooting

### Common Issues

1. **Module not found errors (Python)**
   ```bash
   # Ensure virtual environment is activated
   source .venv/bin/activate
   pip install -r backend/requirements.txt
   ```

2. **Permission denied errors (Node.js)**
   ```bash
   # Fix permissions for node_modules
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **API connection errors**
   - Ensure backend is running on port 5000
   - Check that CORS is properly configured
   - Verify the Gemini API key is set correctly

4. **React Icons not found**
   ```bash
   cd frontend
   npm install react-icons
   ```

### Getting Help

If you encounter issues:

1. Check the console output for error messages
2. Ensure all dependencies are installed correctly
3. Verify environment variables are set properly
4. Check that both servers are running on the correct ports

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Google Gemini AI for providing AI capabilities
- React community for excellent documentation
- Flask community for the robust web framework

## Support

For support and questions:
- Open an issue on GitHub
- Contact the development team
- Check the documentation

---

**Note:** This application is for educational and informational purposes only. It is not a substitute for professional mental health care. If you are experiencing mental health issues, please consult with a qualified healthcare professional.
