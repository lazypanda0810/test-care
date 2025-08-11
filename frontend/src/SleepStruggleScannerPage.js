import React, { useState } from 'react';
import './SleepStruggleScannerPage.css';

import ScoreMeter from './ScoreMeter';
import GaugeScoreMeter from './GaugeScoreMeter';
import './GaugeScoreMeter.css';
import Header from './Header';

const questions = [
	{
		text: 'How often do you have trouble falling or staying asleep?',
		type: 'scale',
		options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often'],
	},
	{
		text: 'Do you wake up feeling rested?',
		type: 'mcq',
		options: ['Always', 'Sometimes', 'Rarely', 'Never'],
	},
	{
		text: 'Do you use your phone or scroll social media in bed?',
		type: 'mcq',
		options: ['Yes', 'No', 'Sometimes'],
	},
	{
		text: 'How many hours do you usually sleep per night?',
		type: 'mcq',
		options: ['Less than 4', '4–6', '6–8', 'More than 8'],
	},
	{
		text: 'Do you have disturbing dreams or nightmares?',
		type: 'scale',
		options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often'],
	},
	{
		text: 'Do you feel tired during the day despite sleeping?',
		type: 'scale',
		options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often'],
	},
];

const emojiReactions = ['😴', '🥱', '😕', '😫', '😵'];

export default function SleepStruggleScannerPage() {
	const [showMindBot, setShowMindBot] = useState(false);
	const [answers, setAnswers] = useState([]);
	const [score, setScore] = useState(null);
	const [result, setResult] = useState('');
	const [loading, setLoading] = useState(false);

	const handleAnswer = (val) => {
		setAnswers((a) => [...a, val]);
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
					questions: questions.map((q) => q.text),
					answers,
				}),
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

	return (
		<div className="sleepstrugglescanner-root">
			<Header onMindBotClick={() => setShowMindBot(true)} />
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					width: '100%',
				}}
			>
				<h2 style={{ marginBottom: 0 }}>Sleep Struggle Scanner</h2>
				<div className="sleepstrugglescanner-progress-bar">
					<div className="sleepstrugglescanner-progress" style={{width: `${(answers.length / questions.length) * 100}%`}} />
				</div>
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'center',
						alignItems: 'stretch',
						width: '100%',
					}}
				>
					<div
						style={{
							flex: '0 0 420px',
							maxWidth: 420,
							minWidth: 320,
							background: '#fff',
							zIndex: 2,
							boxShadow: '0 2px 16px #e3eaf3',
							borderRadius: 18,
							margin: '0 8px',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
						}}
					>
						{/* Render all questions at once like Google Forms */}
						{score === null && (
							<form
								style={{ width: '100%', maxWidth: 420 }}
								onSubmit={(e) => {
									e.preventDefault();
									handleSubmit();
								}}
							>
								{questions.map((q, idx) => (
									<div key={idx} style={{ marginBottom: 18 }}>
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
								<button
									className="feature-btn"
									type="submit"
									style={{ marginTop: 24 }}
									disabled={loading}
								>
									{loading ? 'Analyzing...' : 'Get Me My Score'}
								</button>
								{/* Ad section */}
								<div
									style={{
										margin: '32px 0',
										width: '100%',
										display: 'flex',
										justifyContent: 'center',
									}}
								>
									<div
										style={{
											background: '#f3e5f5',
											borderRadius: 12,
											padding: '18px 24px',
											boxShadow: '0 2px 12px #e1bee7',
											minWidth: 220,
											textAlign: 'center',
										}}
									>
										<div
											style={{
												fontWeight: 700,
												color: '#7c4dff',
												marginBottom: 6,
											}}
										>
											Sponsored
										</div>
										<div
											style={{
												fontSize: 15,
												color: '#333',
											}}
										>
											Try our new Zen Snack Box! Mindful treats for your
											mood.{' '}
											<a
												href="#"
												style={{
													color: '#7c4dff',
													textDecoration: 'underline',
												}}
											>
												Learn more
											</a>
										</div>
									</div>
								</div>
							</form>
						)}
						{score !== null && (
							<div style={{ marginTop: 32 }}>
								<GaugeScoreMeter
									score={score}
									label="Your Sleep Score"
									subLabel="Sleep Quality"
									tooltip="Higher is better! This is your sleep score."
									goodIsHigh={true}
								/>
								{result && (
									<div
										style={{
											marginTop: 18,
											fontWeight: 600,
											color: '#4caf50',
										}}
									>
										{result}
									</div>
								)}
							</div>
						)}
						{result && !loading && score === null && (
							<div
								style={{
									marginTop: 18,
									fontWeight: 600,
									color: 'red',
								}}
							>
								{result}
							</div>
						)}
					</div>
				</div>
			</div>
			{showMindBot && (
				<div
					style={{
						zIndex: 4000,
						position: 'fixed',
						top: 0,
						left: 0,
						width: '100vw',
						height: '100vh',
					}}
				>
					<Header onMindBotClick={() => setShowMindBot(false)} />
				</div>
			)}
		</div>
	);
}
