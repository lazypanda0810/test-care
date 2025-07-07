import React from 'react';
import './AnxietyAnalyzerPage.css';

import GaugeScoreMeter from './GaugeScoreMeter';
import './GaugeScoreMeter.css';
import Header from './Header';

const questions = [
  {
    text: 'Do you find it hard to relax, even in calm environments?',
    type: 'scale',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often']
  },
  {
    text: 'How frequently do you feel your heart racing or chest tightening?',
    type: 'scale',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often']
  },
  {
    text: 'Do you overthink social interactions or upcoming events?',
    type: 'scale',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often']
  },
  {
    text: 'Do you often compare yourself to others on social media?',
    type: 'scale',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often']
  },
  {
    text: 'How do you feel after scrolling through your feed?',
    type: 'mcq',
    options: ['Better', 'No Change', 'Worse', 'Not Sure']
  },
  {
    text: 'Do you experience sudden feelings of panic or dread?',
    type: 'scale',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often']
  },
  {
    text: 'Do you avoid certain situations because they make you anxious?',
    type: 'mcq',
    options: ['Yes', 'No', 'Not Sure']
  }
];

const emojiReactions = ['😐', '😬', '😳', '😰', '😱'];

export default function AnxietyAnalyzerPage() {
  const [showMindBot, setShowMindBot] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnswer = (val) => {
    setAnswers(a => [...a, val]);
    setStep(s => s + 1);
  };

  const handleContinue = () => {
    setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    if (answers.length < questions.length || answers.some(a => !a)) {
      setResult('Please answer all questions before submitting.');
      return;
    }
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
      if (!res.ok) {
        setResult('Error: Invalid or incomplete answers. Please answer all questions.');
        setLoading(false);
        return;
      }
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
  const emoji = emojiReactions[Math.min(Math.floor((step / questions.length) * emojiReactions.length), emojiReactions.length - 1)];

  return (
    <div className="anxiety-analyzer-root">
      <Header onMindBotClick={() => setShowMindBot(true)} />
      <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
        <h2 style={{marginBottom: 0}}>Anxiety Analyzer <span style={{fontSize: 28}}>{emoji}</span></h2>
        <div className="anxiety-analyzer-progress-bar">
          <div className="anxiety-analyzer-progress" style={{width: `${(step / questions.length) * 100}%`}} />
        </div>
        <div style={{display:'flex', flexDirection:'column', alignItems:'center', width:'100%'}}>
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
                label="Your Anxiety Score"
                subLabel="Anxiety Level"
                tooltip="Lower is better! This is your anxiety score."
                goodIsHigh={false}
              />
              {result && <div style={{marginTop: 18, fontWeight: 600, color: '#4caf50'}}>{result}</div>}
            </div>
          )}
        </div>
      </div>
      {showMindBot && <div style={{zIndex: 4000, position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh'}}><Header onMindBotClick={() => setShowMindBot(false)} /></div>}
    </div>
  );
}
