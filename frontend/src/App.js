import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import GaugeScoreMeter from './GaugeScoreMeter';
import './GaugeScoreMeter.css';
import AnxietyAnalyzerPage from './AnxietyAnalyzerPage';
import SleepStruggleScannerPage from './SleepStruggleScannerPage';
import BurnoutOScopePage from './BurnoutOScopePage';
import StressOMeterPage from './StressOMeterPage';
import ZenRecommenderPage from './ZenRecommenderPage';
import SupportOFinderPage from './SupportOFinderPage';
import SnackTherapyPage from './SnackTherapyPage';
import MindBotChat from './MindBotChat';
import './MindBotChat.css';
import SadOMeterPage from './SadOMeterPage';
import Header from './Header';
import MissionPage from './MissionPage';
import TeamPage from './TeamPage';
import ResourcesPage from './ResourcesPage';
import HelpPage from './HelpPage';
import FAQPage from './FAQPage';

const features = [
  {
    icon: '😞',
    name: 'Sad-o-Meter (Depression Check)',
    tagline: 'Because crying during shampoo ads might mean something.',
    btn: 'Check Me',
  },
  {
    icon: '😰',
    name: 'Anxiety Analyzer',
    tagline: 'Let’s see if that 3AM overthinking has a name.',
    btn: 'Check Me',
  },
  {
    icon: '💤',
    name: 'Sleep Struggle Scanner',
    tagline: 'Tired? Or just emotionally jet-lagged?',
    btn: 'Check Me',
  },
  {
    icon: '😵',
    name: 'Burnout-o-Scope',
    tagline: 'Exhausted? Or corporate ghost?',
    btn: 'Check Me',
  },
  {
    icon: '🤔',
    name: 'Stress-O-Meter',
    tagline: 'Gauge your internal screaming levels.',
    btn: 'Check Me',
  },
  {
    icon: '🧘',
    name: 'Zen Recommender',
    tagline: 'No, we won’t just say “try yoga”… unless it works.',
    btn: 'Try it',
  },
  {
    icon: '🫂',
    name: 'Support-o-Finder',
    tagline: 'We help you find real help, not just hug emojis.',
    btn: 'Try it',
  },
  {
    icon: '🍕',
    name: 'Snack Therapy (Just for Fun)',
    tagline: 'Mental health tips paired with snack suggestions.',
    btn: 'Try it',
  },
];

const featureQuestions = {
  'Anxiety Analyzer': [
    'How often have you felt nervous, anxious, or on edge?',
    'How often have you not been able to stop or control worrying?',
    'How often have you worried about different things?',
    'How often have you had trouble relaxing?',
    'How often have you felt afraid as if something awful might happen?'
  ],
  'Sleep Struggle Scanner': [
    'How often have you had trouble falling asleep, staying asleep, or waking up too early?',
    'How often have you felt you had enough sleep but still felt tired?',
    'How often have you fallen asleep at work or while watching TV?',
    'How often have you had disturbing dreams or nightmares?',
    'How often have you felt too awake or alert in the evening?'
  ],
  'Burnout-o-Scope': [
    'How often have you felt physically, emotionally, or mentally exhausted?',
    'How often have you felt detached or indifferent towards your job or daily activities?',
    'How often have you felt a lack of accomplishment or productivity?',
    'How often have you become easily frustrated or irritable?',
    'How often have you felt overwhelmed by your responsibilities?'
  ],
  'Stress-O-Meter': [
    'How often have you felt unable to control the important things in your life?',
    'How often have you felt nervous and stressed?',
    'How often have you felt that you were not doing enough?',
    'How often have you felt that you were not being appreciated?',
    'How often have you felt that you were on the verge of a breakdown?'
  ],
  'Zen Recommender': [
    'How often do you take time to relax and unwind?',
    'How often do you engage in activities that bring you joy?',
    'How often do you practice mindfulness or meditation?',
    'How often do you spend time in nature or in a peaceful environment?',
    'How often do you feel a sense of inner peace and calm?'
  ],
  'Support-o-Finder': [
    'How often do you feel the need to talk to someone about your problems?',
    'How often do you seek help from friends or family?',
    'How often do you consider talking to a professional?',
    'How often do you feel that you have a good support system?',
    'How often do you feel comfortable expressing your feelings to others?'
  ],
  'Snack Therapy (Just for Fun)': [
    'What is your favorite comfort food?',
    'What snack do you reach for when you need a pick-me-up?',
    'What is your guilty pleasure food?',
    'What food reminds you of happy times?',
    'What is your go-to snack for a movie night?'
  ],
};

function FeatureTestPage({ featureName }) {
  const [answers, setAnswers] = useState(Array(featureQuestions[featureName]?.length || 0).fill(''));
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const isBurnout = featureName === 'Burnout-o-Scope';

  const handleChange = (idx, val) => {
    setAnswers(a => a.map((v, i) => i === idx ? val : v));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult('');
    setScore(null);
    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feature_name: featureName, questions: featureQuestions[featureName], answers })
      });
      const data = await res.json();
      // Try to extract score from Gemini's response (e.g. "Your mental health score is 87")
      const match = data.result.match(/score is (\d{1,3})/i);
      let scoreVal = match ? parseInt(match[1]) : null;
      if (scoreVal === null || isNaN(scoreVal)) scoreVal = isBurnout ? 80 : 60; // fallback
      setScore(scoreVal);
      setResult(data.result);
    } catch (e) {
      setResult('Error: ' + e.message);
    }
    setLoading(false);
  };

  if (isBurnout) {
    return (
      <div className="feature-test-page">
        <h2>{featureName}</h2>
        <form onSubmit={handleSubmit}>
          <ol>
            {(featureQuestions[featureName] || []).map((q, idx) => (
              <li key={idx} style={{marginBottom: 12}}>
                <div>{q}</div>
                <input
                  type="text"
                  value={answers[idx]}
                  onChange={e => handleChange(idx, e.target.value)}
                  style={{marginTop: 6, padding: '6px 12px', borderRadius: 8, border: '1.5px solid #b3d8f7', width: '90%'}}
                  required
                />
              </li>
            ))}
          </ol>
          <button className="feature-btn" type="submit" disabled={loading} style={{marginTop: 18}}>
            {loading ? 'Analyzing...' : 'Get My Score'}
          </button>
        </form>
        {score !== null && (
          <GaugeScoreMeter
            score={score}
            label={isBurnout ? 'Your Burnout Risk Score' : 'Your Mental Health Score'}
            subLabel={isBurnout ? 'Burnout Risk' : 'Mental Wellness'}
            tooltip={isBurnout ? 'Lower is better! This is your burnout risk score.' : 'Higher is better! This is your overall mental wellness score.'}
            goodIsHigh={!isBurnout}
          />
        )}
        {result && <div style={{marginTop: 18, fontWeight: 600, color: '#4caf50'}}>{result}</div>}
        <a href="/" className="feature-btn" style={{marginTop: 24, display: 'inline-block'}}>Back to Home</a>
      </div>
    );
  }

  return (
    <div className="feature-test-page">
      <h2>{featureName}</h2>
      <ol>
        {(featureQuestions[featureName] || []).map((q, idx) => <li key={idx}>{q}</li>)}
      </ol>
      <a href="/" className="feature-btn" style={{marginTop: 24, display: 'inline-block'}}>Back to Home</a>
    </div>
  );
}

function FunnyOFA() {
  const [step, setStep] = useState(1);
  const [input, setInput] = useState('');
  const [masked, setMasked] = useState('');
  const [otp, setOtp] = useState('');
  const [userOtp, setUserOtp] = useState('');
  const [result, setResult] = useState('');
  const navigate = useNavigate();

  // Helper to mask input
  function maskInput(val) {
    if (val.includes('@')) {
      const [local, domain] = val.split('@');
      if (local.length <= 5) return local[0] + '****' + local.slice(-2) + '@' + domain;
      return local.slice(0, 3) + '****' + local.slice(-2) + '@' + domain;
    } else {
      return '******' + val.slice(-2);
    }
  }

  // Helper to generate a valid OTP
  function generateOtp() {
    let code = '';
    while (true) {
      code = String(Math.floor(100000 + Math.random() * 900000));
      if (!/000/.test(code) && !/^00/.test(code) && !/^01/.test(code)) break;
    }
    return code;
  }

  function handleInput(e) {
    setInput(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!input) return;
    setMasked(maskInput(input));
    const newOtp = generateOtp();
    setOtp(newOtp);
    // Go to /ofa/:otp/:masked
    navigate(`/ofa/${newOtp}/${encodeURIComponent(maskInput(input))}`);
  }

  function handleOtpSubmit(e) {
    e.preventDefault();
    if (userOtp === otp) {
      setResult('Wow! Either you guessed it or you’re psychic. Welcome aboard! 😎');
    } else {
      setResult('Oops! That’s not the magic number. But you can still pretend you passed. 😂');
    }
    setStep(3);
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
      borderRadius: 24,
      boxShadow: '0 4px 32px rgba(0,0,0,0.10)',
      maxWidth: 380,
      margin: '40px auto',
      padding: 32,
      textAlign: 'center',
      fontFamily: 'Nunito, Segoe UI, Arial, sans-serif',
      color: '#2d3a4a',
      position: 'relative',
    }}>
      <h2 style={{color: '#7c4dff', marginBottom: 12}}>🔐 One-Factor Authentication</h2>
      <form onSubmit={handleSubmit}>
        <div style={{fontSize: 18, marginBottom: 16}}>Enter your phone number or email address to continue</div>
        <input
          type="text"
          value={input}
          onChange={handleInput}
          placeholder="Email or phone number"
          style={{padding: '10px 16px', borderRadius: 12, border: '1.5px solid #b39ddb', fontSize: 16, width: '90%', marginBottom: 18}}
          required
        />
        <br />
        <button type="submit" style={{background: '#7c4dff', color: '#fff', border: 'none', borderRadius: 16, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer', marginBottom: 10}}>Continue 🚀</button>
      </form>
    </div>
  );
}

function FunnyOFAOtpPage() {
  const { otp, masked } = useParams();
  const [userOtp, setUserOtp] = useState('');
  const [result, setResult] = useState('');
  const [wrongCount, setWrongCount] = useState(0);
  const [showDidntReceive, setShowDidntReceive] = useState(false);
  const navigate = useNavigate();

  // List of disrespectful mocking messages
  const mockingMessages = [
    "Are you blind? It’s in front of you!",
    "Seriously? Try reading!",
    "Wow, that's embarrassing.",
    "Maybe ask a friend for help?",
    "Are you even trying?",
    "Retype it, genius.",
    "Are you... retarded?",
    "It's literally right there!",
    "You must be new here.",
    "Try using your eyes this time."
  ];

  function handleOtpSubmit(e) {
    e.preventDefault();
    if (userOtp === otp) {
      navigate('/');
    } else {
      setWrongCount(c => c + 1);
      setResult(mockingMessages[wrongCount % mockingMessages.length]);
      setUserOtp(''); // Clear input so user can try again
    }
  }

  function handleDidntReceive() {
    setShowDidntReceive(true);
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
      borderRadius: 24,
      boxShadow: '0 4px 32px rgba(0,0,0,0.10)',
      maxWidth: 420,
      margin: '40px auto',
      padding: 32,
      textAlign: 'center',
      fontFamily: 'Nunito, Segoe UI, Arial, sans-serif',
      color: '#2d3a4a',
      position: 'relative',
    }}>
      <header/>
      <h2 style={{color: '#7c4dff', marginBottom: 12}}>🔐 One-Factor Authentication</h2>
      <div style={{fontSize: 18, marginBottom: 10}}><b>{otp}</b> is your otp and sent in your mobile no, kindly don’t share it with anyone. 📬</div>
      <form onSubmit={handleOtpSubmit}>
        <input
          type="text"
          value={userOtp}
          onChange={e => setUserOtp(e.target.value)}
          placeholder="Enter the OTP you received"
          style={{padding: '10px 16px', borderRadius: 12, border: '1.5px solid #ffd54f', fontSize: 16, width: '90%', marginBottom: 18}}
          required
        />
        <br />
        <button type="submit" style={{background: '#ffd54f', color: '#2d3a4a', border: 'none', borderRadius: 16, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer', marginBottom: 10}}>Verify 🔑</button>
      </form>
      <div style={{marginTop: 10}}>
        <span style={{fontWeight:600}}>Didn’t receive OTP?</span>
        <button onClick={handleDidntReceive} style={{background: '#e1bee7', color: '#7c4dff', border: 'none', borderRadius: 16, padding: '8px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer', marginLeft: 10}}>I didn’t receive OTP</button>
        {showDidntReceive && <div style={{marginTop: 8, color:'#d32f2f', fontWeight:600}}>It’s in front of you moron 😜</div>}
      </div>
      {result && <div style={{fontSize: 18, marginTop: 18, color:'#d32f2f'}}>{result}</div>}
      <div style={{position: 'absolute', bottom: 12, right: 18, fontSize: 22, opacity: 0.18}}>😂</div>
      <button onClick={() => navigate('/')} style={{marginTop: 18, background: '#80cbc4', color: '#fff', border: 'none', borderRadius: 16, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer'}}>Back to Home</button>
    </div>
  );
}

function Home({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const [showMindBot, setShowMindBot] = useState(false);
  return (
    <div className="mindcare-root">
      {/* Header Section */}
      <Header darkMode={darkMode} setDarkMode={setDarkMode} onMindBotClick={() => setShowMindBot(true)} />
      {/* Main Banner */}
      <section className="mindcare-banner">
        <h1>How’s your brain doing today?</h1>
        <p className="banner-subtext">Not sure if you’re burned out, bummed out, or just plain out of snacks? We got you.</p>
        <p className="banner-desc">Our features help you check-in, laugh a little, and maybe understand your mind better — all judgment-free.</p>
      </section>
      {/* Our Features */}
      <section className="mindcare-features">
        <h2>🌟 Our Features</h2>
        <div className="features-grid features-grid-two-rows">
          {features.map((f, i) => (
            <div className="feature-card" key={i}>
              <div className="feature-emoji" aria-label="icon">{f.icon}</div>
              <div className="feature-title">{f.name}</div>
              <div className="feature-tagline">{f.tagline}</div>
              <button
                className="feature-btn"
                onClick={() => {
                  if (f.name === 'Anxiety Analyzer') {
                    navigate('/anxiety-analyzer');
                  } else if (f.name === 'Sleep Struggle Scanner') {
                    navigate('/sleep-struggle-scanner');
                  } else if (f.name === 'Burnout-o-Scope') {
                    navigate('/burnout-o-scope');
                  } else if (f.name === 'Stress-O-Meter') {
                    navigate('/stress-o-meter');
                  } else if (f.name === 'Zen Recommender') {
                    navigate('/zen-recommender');
                  } else if (f.name === 'Support-o-Finder') {
                    navigate('/support-o-finder');
                  } else if (f.name === 'Snack Therapy (Just for Fun)') {
                    navigate('/snack-therapy');
                  } else if (f.name === 'Sad-o-Meter (Depression Check)') {
                    navigate('/sad-o-meter');
                  } else {
                    navigate(`/test/${encodeURIComponent(f.name)}`);
                  }
                }}
              >{f.btn}</button>
            </div>
          ))}
        </div>
      </section>
      {/* Floating Buttons */}
      <div className="floating-btns">
        <button className="floating-btn chat-bot" title="Talk to MindBot" onClick={() => setShowMindBot(true)}>
          <span role="img" aria-label="chat">💬</span> <span className="floating-label">Talk to MindBot 🤖</span>
        </button>
        <button className="floating-btn mood-memes" title="Mood Memes">
          <span role="img" aria-label="meme">😂</span> <span className="floating-label">Mood Memes</span>
        </button>
      </div>
      {showMindBot && <MindBotChat onClose={() => setShowMindBot(false)} />}
    </div>
  );
}
export default function App() {
  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    // Try to use system preference or localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      if (saved !== null) return saved === 'true';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="/sad-o-meter" element={<SadOMeterPage />} />
        <Route path="/anxiety-analyzer" element={<AnxietyAnalyzerPage />} />
        <Route path="/sleep-struggle-scanner" element={<SleepStruggleScannerPage />} />
        <Route path="/burnout-o-scope" element={<BurnoutOScopePage />} />
        <Route path="/stress-o-meter" element={<StressOMeterPage />} />
        <Route path="/zen-recommender" element={<ZenRecommenderPage />} />
        <Route path="/support-o-finder" element={<SupportOFinderPage />} />
        <Route path="/snack-therapy" element={<SnackTherapyPage />} />
        <Route path="/test/:featureName" element={<TestRouteWrapper />} />
        <Route path="/ofa" element={<FunnyOFA />} />
        <Route path="/ofa/:otp/:masked" element={<FunnyOFAOtpPage />} />
        <Route path="/mission" element={<MissionPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/faq" element={<FAQPage />} />
      </Routes>
    </Router>
  );
}

function TestRouteWrapper() {
  const { featureName } = useParams();
  return <FeatureTestPage featureName={decodeURIComponent(featureName)} />;
}
