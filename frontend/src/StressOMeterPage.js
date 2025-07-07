import React from 'react';
import './StressOMeterPage.css';

import ScoreMeter from './ScoreMeter';
import GaugeScoreMeter from './GaugeScoreMeter';
import './GaugeScoreMeter.css';
import Header from './Header';

export default function StressOMeterPage() {
  const [stressType, setStressType] = useState(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMindBot, setShowMindBot] = useState(false);

  // Dynamic question sets
  const questionSets = {
    'Work Stress': [
      { text: 'Do you feel physically tense or on edge at work?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often'] },
      { text: 'How often do you feel like you’re running out of time at work?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often'] },
      { text: 'Do you avoid tasks just to avoid stress at work?', type: 'mcq', options: ['Yes', 'No', 'Sometimes'] },
      { text: 'Do you feel your work is appreciated?', type: 'mcq', options: ['Always', 'Sometimes', 'Rarely', 'Never'] },
      { text: 'How often do you bring work stress home?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often'] },
    ],
    'Academic Pressure': [
      { text: 'Do you feel overwhelmed by assignments or exams?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often'] },
      { text: 'How often do you procrastinate due to stress?', type: 'mcq', options: ['Never', 'Sometimes', 'Often', 'Always'] },
      { text: 'Do you feel pressure to achieve top grades?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often'] },
      { text: 'Do you compare yourself to classmates?', type: 'mcq', options: ['Yes', 'No', 'Sometimes'] },
      { text: 'How often do you lose sleep over studies?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often'] },
    ],
    'Relationship Stress': [
      { text: 'Do you feel misunderstood by people close to you?', type: 'mcq', options: ['Yes', 'No', 'Sometimes'] },
      { text: 'How often do you argue or feel tension in relationships?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often'] },
      { text: 'Do you avoid conversations to avoid conflict?', type: 'mcq', options: ['Yes', 'No', 'Sometimes'] },
      { text: 'Do you feel emotionally supported?', type: 'mcq', options: ['Always', 'Sometimes', 'Rarely', 'Never'] },
      { text: 'How often do you feel lonely even when not alone?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often'] },
    ],
    'Financial Stress': [
      { text: 'Do you worry about money daily?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often'] },
      { text: 'How often do you avoid checking your bank account?', type: 'mcq', options: ['Never', 'Sometimes', 'Often', 'Always'] },
      { text: 'Do you feel anxious about bills or expenses?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often'] },
      { text: 'Do you talk to anyone about your finances?', type: 'mcq', options: ['Yes', 'No', 'Sometimes'] },
      { text: 'How often do you feel out of control with money?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often'] },
    ],
    'Just Everything 💀': [
      { text: 'Do you feel like you’re juggling too many things at once?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often'] },
      { text: 'How often do you feel like screaming into a pillow?', type: 'mcq', options: ['Never', 'Sometimes', 'Often', 'Always'] },
      { text: 'Do you feel your brain is running a marathon?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often'] },
      { text: 'Do you wish you could pause life for a day?', type: 'mcq', options: ['Yes', 'No', 'Sometimes'] },
      { text: 'How often do you feel like you’re running on empty?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often'] },
    ],
  };

  const questions = stressType ? questionSets[stressType] : [];

  const handleStressType = (type) => {
    setStressType(type);
    setStep(0);
    setAnswers([]);
    setScore(null);
    setResult('');
  };

  const handleAnswer = (val) => {
    setAnswers(a => [...a, val]);
    setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResult('');
    setScore(null);
    try {
      const res = await fetch('/api/mental-health-predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questions: questions.map(q => q.text),
          answers
        })
      });
      const data = await res.json();
      const match = data.result.match(/score is (\d{1,3})/i);
      let scoreVal = match ? parseInt(match[1]) : null;
      if (scoreVal === null || isNaN(scoreVal)) scoreVal = 60;
      setScore(scoreVal);
      setResult(data.result);
    } catch (e) {
      setResult('Error: ' + e.message);
    }
    setLoading(false);
  };

  // Animated emoji based on step
  const emojiReactions = ['😐', '😬', '😣', '😖', '😱'];
  const emoji = emojiReactions[Math.min(Math.floor((step / (questions.length || 1)) * emojiReactions.length), emojiReactions.length - 1)];

  return (
    <div className="stressometer-root">
      <Header onMindBotClick={() => setShowMindBot(true)} />
      <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
        <h2 style={{marginBottom: 0}}>Stress-O-Meter</h2>
        <div className="stressometer-progress-bar">
          <div className="stressometer-progress" style={{width: `${(step / (questions.length || 1)) * 100}%`}} />
        </div>
        {/* Render all questions at once like Google Forms if stressType is selected */}
        {!stressType && (
          <div style={{margin:'32px 0', textAlign:'center'}}>
            <div style={{fontWeight:700, fontSize:20, marginBottom:18}}>What kind of stress are you feeling?</div>
            <div style={{display:'flex', flexDirection:'column', gap:12}}>
              {Object.keys(questionSets).map((type, i) => (
                <button key={i} className="feature-btn" style={{margin:'0 auto', minWidth:180}} onClick={() => handleStressType(type)}>{type}</button>
              ))}
            </div>
          </div>
        )}
        {stressType && score === null && (
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
              label="Your Stress Score"
              subLabel="Stress Level"
              tooltip="Lower is better! This is your stress score."
              goodIsHigh={false}
            />
            {result && <div style={{marginTop: 18, fontWeight: 600, color: '#4caf50'}}>{result}</div>}
          </div>
        )}
        {result && !loading && score === null && (
          <div style={{marginTop: 18, fontWeight: 600, color: 'red'}}>{result}</div>
        )}
      </div>
      {showMindBot && <div style={{zIndex: 4000, position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh'}}><Header onMindBotClick={() => setShowMindBot(false)} /></div>}
      <div style={{display:'flex', flexDirection:'column', alignItems:'center', width:'100%'}}>
        {/* GIFs removed as requested. Main content remains centered. */}
      </div>
    </div>
  );
}
