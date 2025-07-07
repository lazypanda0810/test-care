import React from 'react';
import './Header.css';
import logo from './logo.svg';
import { useNavigate } from 'react-router-dom';

export default function Header({ onMindBotClick, darkMode, setDarkMode }) {
  const navigate = useNavigate();

  return (
    <header className="mindcare-header">
      <div className="header-left">
        <a href="/" style={{display:'flex', alignItems:'center', textDecoration:'none'}}>
          <img src={logo} alt="MindCare Logo" className="header-logo" />
          <span className="header-title">MindCare</span>
        </a>
      </div>
      <nav className="header-nav" style={{flex: 1, justifyContent: 'center', display: 'flex', gap: 16}}>
        <div className="header-dropdown">
          <button className="header-link">Mental Stuff ▾</button>
          <div className="dropdown-content">
            <a href="/sad-o-meter">Sad-o-Meter</a>
            <a href="/anxiety-analyzer">Anxiety Analyzer</a>
            <a href="/stress-o-meter">Stress-O-Meter</a>
            <a href="/burnout-o-scope">Burnout-o-Scope</a>
            <a href="/sleep-struggle-scanner">Sleep Struggle Scanner</a>
          </div>
        </div>
        <div className="header-dropdown">
          <button className="header-link">Cool Tools ▾</button>
          <div className="dropdown-content">
            <a href="/zen-recommender">Zen Recommender</a>
            <a href="/snack-therapy">Snack Therapy</a>
            <a href="/support-o-finder">Support-o-Finder</a>
            <a href="/mood-memes">Mood Memes</a>
            <a href="#mindbot-chat" onClick={e => {e.preventDefault(); onMindBotClick();}}>MindBot Chat</a>
          </div>
        </div>
        <div className="header-dropdown">
          <button className="header-link">Why We Care ▾</button>
          <div className="dropdown-content">
            <a href="/mission">Our Mission</a>
            <a href="/team">Meet the Team</a>
            <a href="/resources">Mental Health Resources</a>
            <a href="/help">How You Can Help</a>
            <a href="/faq">FAQ</a>
          </div>
        </div>
        <button onClick={() => navigate('/ofa')} className="header-link">Log In</button>
        <button
          style={{
            marginLeft: 16,
            padding: '6px 16px',
            borderRadius: 20,
            border: 'none',
            background: darkMode ? '#232526' : '#eaf3fb',
            color: darkMode ? '#fff' : '#2d3a4a',
            boxShadow: '0 2px 8px #b3d8f7',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '1rem',
            alignSelf: 'center'
          }}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          onClick={() => setDarkMode(m => !m)}
        >
          {darkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>
      </nav>
    </header>
  );
}
