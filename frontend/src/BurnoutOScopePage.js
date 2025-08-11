import React, { useState } from 'react';
import './BurnoutOScopePage.css';

import GaugeScoreMeter from './GaugeScoreMeter';
import './GaugeScoreMeter.css';
import Header from './Header';

const questions = [
  {
    text: 'Do you feel emotionally drained after work or study?',
    type: 'scale',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often']
  },
  {
    text: 'Do small tasks feel overwhelming?',
    type: 'scale',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often']
  },
  {
    text: 'Do you feel cynical or detached from your responsibilities?',
    type: 'mcq',
    options: ['Yes', 'No', 'Sometimes']
  },
  {
    text: 'Do you struggle to find motivation for things you used to enjoy?',
    type: 'scale',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often']
  },
  {
    text: 'Do you feel physically exhausted even after resting?',
    type: 'scale',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often']
  },
  {
    text: 'Do you feel you are not accomplishing enough at work or school?',
    type: 'mcq',
    options: ['Yes', 'No', 'Sometimes']
  }
];

const emojiReactions = ['😐', '😬', '😳', '😰', '😱'];

export default function BurnoutOScopePage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMindBot, setShowMindBot] = useState(false);

  const handleAnswer = (val) => {
    setAnswers(a => [...a, val]);
    setStep(s => s + 1);
  };

  const handleContinue = () => {
    setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    if (answers.length < questions.length || answers.some(a => a === undefined)) {
      setResult('Please answer all questions before submitting.');
      return;
    }
    setLoading(true);
    setResult('');
    setScore(null);
    try {
      const res = await fetch('/api/burnout-risk-predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questions: questions.map(q => q.text),
          answers
        })
      });
      if (!res.ok) {
        setResult('Error: Invalid or incomplete answers. Please answer all questions.');
        setLoading(false);
        return;
      }
      const data = await res.json();
      const match = data.result.match(/score is (\d{1,3})/i);
      let scoreVal = match ? parseInt(match[1]) : null;
      if (scoreVal === null || isNaN(scoreVal)) scoreVal = 80;
      setScore(scoreVal);
      setResult(data.result);
    } catch (e) {
      setResult('Error: ' + e.message);
    }
    setLoading(false);
  };

  // Animated emoji based on step
  const emoji = emojiReactions[Math.min(Math.floor((step / questions.length) * emojiReactions.length), emojiReactions.length - 1)];

  return (
    <div className="burnoutoscope-root">
      <Header onMindBotClick={() => setShowMindBot(true)} />
      <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
        <h2 style={{marginBottom: 0}}>Burnout-o-Scope <span style={{fontSize: 28}}>{emoji}</span></h2>
        <div className="burnoutoscope-progress-bar">
          <div className="burnoutoscope-progress" style={{width: `${(step / questions.length) * 100}%`}} />
        </div>
        <div style={{display:'flex', flexDirection:'column', alignItems:'center', width:'100%'}}>
          {/* Main content centered, GIFs removed */}
          <div style={{flex:'0 0 420px', maxWidth:420, minWidth:320, background:'#fff', zIndex:2, boxShadow:'0 2px 16px #e3eaf3', borderRadius:18, margin:'0 8px', display:'flex', flexDirection:'column', alignItems:'center'}}>
            {/* Render all questions at once like Google Forms */}
            {score === null && (
              <form style={{width:'100%', maxWidth:420}} onSubmit={e => {e.preventDefault(); handleSubmit();}}>
                {questions.map((q, idx) => (
                  <div key={idx} style={{marginBottom: 18}}>
                    <div className="question-row">
                      <span className="question-number">Q{idx + 1}.</span>
                      <span className="question-text">{q.text}</span>
                    </div>
                    <div className="options-row">
                      {q.options.map((opt, i) => (
                        <label key={i}>
                          <input
                            type="radio"
                            name={`q${idx}`}
                            value={opt}
                            checked={answers[idx] === opt}
                            onChange={() => {
                              const newA = [...answers];
                              newA[idx] = opt;
                              setAnswers(newA);
                            }}
                            required
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                <button className="feature-btn" type="submit" style={{marginTop:24}} disabled={loading}>
                  {loading ? 'Analyzing...' : 'Get Me My Score'}
                </button>
                {/* Ad section */}
                <div style={{margin:'32px 0', width:'100%', display:'flex', justifyContent:'center'}}>
                  <div style={{background:'#f3e5f5', borderRadius:12, padding:'18px 24px', boxShadow:'0 2px 12px #e1bee7', minWidth:220, textAlign:'center'}}>
                    <div style={{fontWeight:700, color:'#7c4dff', marginBottom:6}}>Sponsored</div>
                    <div style={{fontSize:15, color:'#333'}}>Try our new Zen Snack Box! Mindful treats for your mood. <a href="#" style={{color:'#7c4dff', textDecoration:'underline'}}>Learn more</a></div>
                  </div>
                </div>
              </form>
            )}
            {score !== null && (
              <div style={{marginTop: 32}}>
                <GaugeScoreMeter
                  score={score}
                  label="Your Burnout Risk Score"
                  subLabel="Burnout Risk"
                  tooltip="Lower is better! This is your burnout risk score."
                  goodIsHigh={false}
                />
                {result && <div style={{marginTop: 18, fontWeight: 600, color: '#4caf50'}}>{result}</div>}
              </div>
            )}
            {result && !loading && score === null && (
              <div style={{marginTop: 18, fontWeight: 600, color: 'red'}}>{result}</div>
            )}
          </div>
        </div>
      </div>
      {showMindBot && <div style={{zIndex: 4000, position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh'}}><Header onMindBotClick={() => setShowMindBot(false)} /></div>}
    </div>
  );
}
