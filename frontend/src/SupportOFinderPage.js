import React, { useState } from 'react';
import './SadOMeterPage.css'; // Reuse styles for consistency
import Header from './Header';

export default function SupportOFinderPage() {
  const [showMindBot, setShowMindBot] = useState(false);
  return (
    <div className="sadometer-root">
      <Header onMindBotClick={() => setShowMindBot(true)} />
      <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
        <h2 style={{marginBottom: 0}}>Support-o-Finder <span style={{fontSize: 28}}>🫂</span></h2>
        <div className="sadometer-question-card" style={{marginTop: 32, fontSize: 20, fontWeight: 600, color: '#4caf50', textAlign:'center'}}>
          🛠️ This feature is under development and will be available soon.<br /><br />
          Until then, remember you’re not alone. If you need support, consider reaching out to a friend, family member, or a professional. 💙
        </div>
      </div>
      {showMindBot && <div style={{zIndex: 4000, position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh'}}><Header onMindBotClick={() => setShowMindBot(false)} /></div>}
    </div>
  );
}
