import React, { useState } from 'react';
import './SadOMeterPage.css'; // Reuse styles for consistency
import Header from './Header';

const snacks = [
  {
    tip: 'Take 3 deep breaths before your next task.',
    snack: 'Banana',
    emoji: '🍌',
    recipe: 'Peel and eat. For extra fun, slice and top with peanut butter!'
  },
  {
    tip: 'Stand up and stretch for 1 minute.',
    snack: 'Dark Chocolate',
    emoji: '🍫',
    recipe: 'Break off a piece and savor slowly. Pairs well with tea.'
  },
  {
    tip: 'Write down one thing you’re grateful for.',
    snack: 'Trail Mix',
    emoji: '🥜',
    recipe: 'Mix nuts, dried fruit, and a few chocolate chips. Enjoy by the handful.'
  },
  {
    tip: 'Drink a glass of water and notice how it feels.',
    snack: 'Green Tea',
    emoji: '🍵',
    recipe: 'Steep green tea bag in hot water for 2-3 min. Sip mindfully.'
  },
  {
    tip: 'Text a friend a silly meme.',
    snack: 'Popcorn',
    emoji: '🍿',
    recipe: 'Microwave popcorn as per instructions. Sprinkle with a pinch of salt.'
  },
  {
    tip: 'Go outside and look at the sky for 30 seconds.',
    snack: 'Apple Slices',
    emoji: '🍏',
    recipe: 'Slice apple, dip in nut butter or eat as is.'
  }
];

function SnackCard({ snack, onShowRecipe, showRecipe }) {
  return (
    <div className="sadometer-question-card" style={{marginBottom: 18}}>
      <div style={{fontSize: 32, marginBottom: 8}}>{snack.emoji}</div>
      <div className="sadometer-question" style={{fontWeight: 700}}>{snack.snack}</div>
      <div style={{margin: '10px 0 8px 0'}}>{snack.tip}</div>
      {!showRecipe && (
        <button className="feature-btn" onClick={onShowRecipe} style={{marginTop: 8}}>
          Show me the recipe 🍳
        </button>
      )}
      {showRecipe && (
        <div style={{marginTop: 10, fontWeight: 600, color: '#4caf50'}}>{snack.recipe}</div>
      )}
    </div>
  );
}

export default function SnackTherapyPage() {
  const [snackType, setSnackType] = useState(null);
  const [step, setStep] = useState(0);
  const [showRecipe, setShowRecipe] = useState(false);
  const [showMindBot, setShowMindBot] = useState(false);

  // Snack type sets
  const snackSets = {
    'No-cook, I’m lazy 🍪': snacks.filter(s => s.snack === 'Banana' || s.snack === 'Dark Chocolate' || s.snack === 'Trail Mix'),
    'I can do 5-minute magic 🥙': snacks.filter(s => s.snack === 'Green Tea' || s.snack === 'Apple Slices' || s.snack === 'Trail Mix'),
    'Warm, cozy comfort food 🍜': snacks.filter(s => s.snack === 'Popcorn' || s.snack === 'Green Tea'),
  };

  const snackList = snackType ? snackSets[snackType] : [];

  const handleSnackType = (type) => {
    setSnackType(type);
    setStep(0);
    setShowRecipe(false);
  };
  const handleNext = () => {
    setShowRecipe(false);
    setStep(s => (s + 1) % snackList.length);
  };
  const handleChooseAnother = () => {
    setSnackType(null);
    setStep(0);
    setShowRecipe(false);
  };

  return (
    <div className="snack-fullscreen-root" style={{minHeight: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', background: '#eaf3fb'}}>
      <Header onMindBotClick={() => setShowMindBot(true)} />
      <div style={{flex: 1, display:'flex', flexDirection:'column', alignItems:'center', width:'100%', justifyContent:'center'}}>
        {!snackType && (
          <div className="snack-fullscreen-card">
            <div className="snack-fullscreen-question" style={{fontWeight: 700, fontSize: 22, marginBottom: 24}}>
              What kind of snack therapy are you craving?
            </div>
            <div className="snack-fullscreen-options">
              {Object.keys(snackSets).map((type, i) => (
                <button
                  key={i}
                  className="snack-fullscreen-btn"
                  onClick={() => handleSnackType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        )}
        {snackType && snackList.length > 0 && (
          <div className="snack-fullscreen-card">
            <SnackCard snack={snackList[step]} onShowRecipe={() => setShowRecipe(true)} showRecipe={showRecipe} />
            <div className="snack-fullscreen-options" style={{marginTop: 24}}>
              <button className="snack-fullscreen-btn secondary" onClick={handleNext}>
                Next Snack
              </button>
              <button className="snack-fullscreen-btn secondary" onClick={handleChooseAnother} style={{marginLeft: 12}}>
                Choose Another Snack Type
              </button>
            </div>
          </div>
        )}
      </div>
      {showMindBot && <div style={{zIndex: 4000, position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh'}}><Header onMindBotClick={() => setShowMindBot(false)} /></div>}
    </div>
  );
}
