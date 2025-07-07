import React, { useState } from 'react';
import './SadOMeterPage.css'; // Reuse styles for consistency
import Header from './Header';

const practices = [
  {
    title: '4-7-8 Guided Breathing',
    desc: 'Breathe in for 4 seconds, hold for 7, exhale for 8. Repeat 4 times.',
    emoji: '🌬️',
    link: 'https://www.youtube.com/watch?v=YRPh_GaiL8s',
    type: 'video'
  },
  {
    title: '5-Minute Meditation',
    desc: 'A short guided meditation to reset your mind.',
    emoji: '🧘',
    link: 'https://www.youtube.com/watch?v=inpok4MKVLM',
    type: 'video'
  },
  {
    title: 'Drop Shoulders Visual',
    desc: 'Relax your shoulders. Imagine them melting down. Try it now!',
    emoji: '🫳',
    type: 'visual'
  },
  {
    title: 'Mind-Dumping Journal Prompt',
    desc: 'Write down everything on your mind for 2 minutes. No filter.',
    emoji: '📝',
    type: 'prompt'
  },
  {
    title: 'Nature Walk',
    desc: 'Step outside for 5 minutes. Notice the sights, sounds, and smells.',
    emoji: '🌳',
    type: 'activity'
  },
  {
    title: 'Herbal Tea Ritual',
    desc: 'Make yourself a cup of herbal tea. Sip slowly and mindfully.',
    emoji: '🍵',
    type: 'activity'
  },
  {
    title: 'Progressive Muscle Relaxation',
    desc: 'Tense and relax each muscle group from head to toe.',
    emoji: '💪',
    type: 'activity'
  },
  {
    title: 'Coloring Exercise',
    desc: 'Download a coloring page and color for 5 minutes.',
    emoji: '🎨',
    link: 'https://www.crayola.com/free-coloring-pages/',
    type: 'download'
  },
  {
    title: 'Digital Detox',
    desc: 'Put your phone away for 30 minutes. The world can wait.',
    emoji: '📵',
    type: 'activity'
  }
];

function ZenCard({ practice }) {
  return (
    <div className="sadometer-question-card" style={{marginBottom: 18}}>
      <div style={{fontSize: 32, marginBottom: 8}}>{practice.emoji}</div>
      <div className="sadometer-question" style={{fontWeight: 700}}>{practice.title}</div>
      <div style={{margin: '10px 0 8px 0'}}>{practice.desc}</div>
      {practice.link && (
        <a href={practice.link} target="_blank" rel="noopener noreferrer" className="feature-btn" style={{marginTop: 8, display: 'inline-block'}}>
          {practice.type === 'video' ? 'Watch Video' : practice.type === 'download' ? 'Download Template' : 'Learn More'}
        </a>
      )}
    </div>
  );
}

export default function ZenRecommenderPage() {
  const [mood, setMood] = useState(null);
  const [practiceIdx, setPracticeIdx] = useState(null);
  const [showMindBot, setShowMindBot] = useState(false);

  // Mood-driven activity sets
  const moodSets = {
    'I want to calm down': [
      practices[0],
      practices[1],
      practices[2],
    ],
    'I want motivation': [
      { ...practices[1], desc: 'Try this 5-minute motivation audio to get pumped!' },
      { ...practices[3], desc: 'Write down one thing you want to achieve today.' },
      { ...practices[5], desc: 'Make a cup of tea and plan your next win.' },
    ],
    'I want to unplug': [
      practices[8],
      practices[6],
      practices[7],
    ],
    'I want peace and quiet': [
      practices[4],
      practices[2],
      practices[3],
    ],
  };

  const activities = mood ? moodSets[mood] : [];

  const handleMood = (m) => {
    setMood(m);
    setPracticeIdx(null);
  };
  const handlePractice = (idx) => {
    setPracticeIdx(idx);
  };
  const handleChooseAnother = () => {
    setMood(null);
    setPracticeIdx(null);
  };
  const handleBackToList = () => {
    setPracticeIdx(null);
  };

  return (
    <div className="sadometer-root">
      <Header onMindBotClick={() => setShowMindBot(true)} />
      <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
        <div className="zen-fullscreen-root" style={{minHeight: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)'}}>
          <h2 style={{marginBottom: 0}}>Zen Recommender <span style={{fontSize: 28}}>🧘</span></h2>
          {!mood && (
            <div className="zen-fullscreen-card">
              <div className="zen-fullscreen-question" style={{fontWeight: 700, fontSize: 22, marginBottom: 24}}>
                How do you want to feel today?
              </div>
              <div className="zen-fullscreen-options">
                {Object.keys(moodSets).map((m, i) => (
                  <button
                    key={i}
                    className="zen-fullscreen-btn"
                    onClick={() => handleMood(m)}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          )}
          {mood && practiceIdx === null && (
            <div className="zen-fullscreen-card">
              <div className="zen-fullscreen-question" style={{fontWeight: 700, fontSize: 22, marginBottom: 24}}>
                Choose a practice:
              </div>
              <div className="zen-fullscreen-options">
                {activities.map((p, i) => (
                  <button
                    key={i}
                    className="zen-fullscreen-btn"
                    onClick={() => handlePractice(i)}
                  >
                    {p.title}
                  </button>
                ))}
              </div>
              <button className="zen-fullscreen-btn secondary" onClick={handleChooseAnother} style={{marginTop: 24}}>
                Choose Another Mood
              </button>
            </div>
          )}
          {mood && practiceIdx !== null && (
            <div className="zen-fullscreen-card">
              <ZenCard practice={activities[practiceIdx]} />
              <div className="zen-fullscreen-options" style={{marginTop: 24}}>
                <button className="zen-fullscreen-btn secondary" onClick={handleBackToList}>
                  Back to Practices
                </button>
                <button className="zen-fullscreen-btn secondary" onClick={handleChooseAnother} style={{marginLeft: 12}}>
                  Choose Another Mood
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {showMindBot && <div style={{zIndex: 4000, position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh'}}><Header onMindBotClick={() => setShowMindBot(false)} /></div>}
    </div>
  );
}
