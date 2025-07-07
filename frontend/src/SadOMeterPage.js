import React, { useState, useMemo } from 'react';
import GaugeScoreMeter from './GaugeScoreMeter';
import './GaugeScoreMeter.css';
import './SadOMeterPage.css';
import Header from './Header';

const SADOMETER_QUESTION_POOL = [
  "Do you often feel hopeless without a specific reason?",
  "Do you struggle to find joy in things you once enjoyed?",
  "Do you feel like a failure or burden to others?",
  "Do you cry unexpectedly or frequently?",
  "Have you experienced a loss of appetite?",
  "Do you feel like life isn’t worth living?",
  "Have you had thoughts of harming yourself?",
  "Do you have difficulty making decisions?",
  "Do you feel disconnected from people you love?",
  "Do you sleep significantly more or less than usual?",
  "Have you lost interest in physical intimacy or relationships?",
  "Do you experience a lack of energy every day?",
  "Do you avoid responsibilities or basic tasks?",
  "Do you experience guilt over small things?",
  "Do you feel physically slowed down or heavy?",
  "Do you isolate yourself even when you need support?",
  "Do you feel numb rather than sad?",
  "Do you find yourself replaying negative thoughts?",
  "Do you feel anxiety mixed with sadness?",
  "Are you overly self-critical?",
  "Do you struggle with remembering or focusing?",
  "Do you feel emotionally flat?",
  "Do you find it hard to imagine feeling better?",
  "Have your hobbies lost meaning?",
  "Do you feel tension when interacting with others?",
  "Are you often irritable without cause?",
  "Do you feel envious of others' happiness?",
  "Do you dread waking up in the morning?",
  "Do you experience chest tightness or shallow breathing?",
  "Do you feel like a ghost in your own life?",
  "Do you prefer being alone most of the time?",
  "Do you feel like you’re watching life from the outside?",
  "Are you frustrated with yourself daily?",
  "Do you think others would be better off without you?",
  "Have you been feeling more emotionally sensitive than usual?",
  "Do you feel invisible?",
  "Do you avoid mirrors or photos of yourself?",
  "Do you feel you're no longer yourself?",
  "Do you obsess over past mistakes?",
  "Do you feel a constant sense of loss?"
];

const SADOMETER_OPTIONS = [
  "Never",
  "Rarely",
  "Sometimes",
  "Often",
  "Almost Always"
];

function shuffle(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const emojiReactions = ['😐', '😢', '😞', '😭', '😔'];

export default function SadOMeterPage() {
  // Randomly select 20–25 questions for this session
  const questions = useMemo(() => shuffle(SADOMETER_QUESTION_POOL).slice(0, Math.floor(20 + Math.random() * 6)), []);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMindBot, setShowMindBot] = useState(false);

  // Randomize options per question
  const optionsForStep = useMemo(() => shuffle(SADOMETER_OPTIONS), [step]);

  const handleAnswer = (val) => {
    setAnswers(a => {
      const newA = [...a];
      newA[step] = val;
      return newA;
    });
    setStep(s => s + 1);
  };

  const handleSubmit = async (e) => {
    e && e.preventDefault && e.preventDefault();
    if (answers.length < SADOMETER_QUESTION_POOL.length || answers.some(a => a === undefined)) {
      setResult('Please answer all questions before submitting.');
      return;
    }
    setLoading(true);
    setResult('');
    // Calculate score: sum of selected option indices
    let scoreVal = answers.reduce((sum, val) => sum + SADOMETER_OPTIONS.indexOf(val), 0);
    setScore(scoreVal);
    setLoading(false);
  };

  // Animated emoji based on step
  const emoji = emojiReactions[Math.min(Math.floor((step / questions.length) * emojiReactions.length), emojiReactions.length - 1)];

  return (
    <div className="sadometer-root">
      <Header onMindBotClick={() => setShowMindBot(true)} />
      <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
        <h2 style={{marginBottom: 0}}>Sad-o-Meter <span style={{fontSize: 28}}>{emoji}</span></h2>
        <div className="sadometer-progress-bar">
          <div className="sadometer-progress" style={{width: `${(step / questions.length) * 100}%`}} />
        </div>
        <div style={{display:'flex', flexDirection:'column', alignItems:'center', width:'100%'}}>
          {/* Render all questions at once like Google Forms */}
          {score === null && (
            <form style={{width:'100%', maxWidth:420}} onSubmit={e => {e.preventDefault(); handleSubmit();}}>
              {SADOMETER_QUESTION_POOL.map((q, idx) => (
                <div key={idx} style={{marginBottom: 18}}>
                  <div className="question-row">
                    <span className="question-number">Q{idx + 1}.</span>
                    <span className="question-text">{q}</span>
                  </div>
                  <div className="options-row">
                    {SADOMETER_OPTIONS.map((opt, i) => (
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
                label="Your Sadness Score"
                subLabel="Sadness Level"
                tooltip="Lower is better! This is your sadness score."
                goodIsHigh={false}
              />
              <div style={{marginTop: 24, background:'#f7fafd', borderRadius:12, padding:18, color:'#333', fontSize:15, maxWidth:420}}>
                <b>Scoring Guide:</b><br/>
                <span>0–20: Minimal or no depressive symptoms<br/>
                21–40: Mild depressive symptoms<br/>
                41–80: Moderate depression<br/>
                81–120: Severe depression<br/>
                121–160: Critical depression (seek immediate help)</span>
              </div>
              {result && <div style={{marginTop: 18, fontWeight: 600, color: '#4caf50'}}>{result}</div>}
            </div>
          )}
          {result && !loading && score === null && (
            <div style={{marginTop: 18, fontWeight: 600, color: 'red'}}>{result}</div>
          )}
        </div>
      </div>
      {showMindBot && <div style={{zIndex: 4000, position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh'}}><Header onMindBotClick={() => setShowMindBot(false)} /></div>}
    </div>
  );
}
