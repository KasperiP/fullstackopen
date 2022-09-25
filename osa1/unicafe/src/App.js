import { useState } from 'react';

const StatisticLine = ({ text, value }) => {
	return (
		<tr>
			<td>{text}</td>
			<td>{value}</td>
		</tr>
	);
};

const Statistics = ({ good, neutral, bad }) => {
	return (
		<>
			<h1>Statistics</h1>
			{good === 0 && neutral === 0 && bad === 0 ? (
				<>
					<p>No feedback given</p>
				</>
			) : (
				<table>
					<tbody>
						<StatisticLine text="good" value={good} />
						<StatisticLine text="neutral" value={neutral} />
						<StatisticLine text="bad" value={bad} />
						<StatisticLine
							text="all"
							value={good + neutral + bad}
						/>
						<StatisticLine
							text="average"
							value={(good - bad) / (good + neutral + bad)}
						/>
						<StatisticLine
							text="positive"
							value={(good / (good + neutral + bad)) * 100 + '%'}
						/>
					</tbody>
				</table>
			)}
		</>
	);
};

const Button = ({ text, handleClick }) => {
	return <button onClick={handleClick}>{text}</button>;
};

const App = () => {
	// tallenna napit omaan tilaansa
	const [good, setGood] = useState(0);
	const [neutral, setNeutral] = useState(0);
	const [bad, setBad] = useState(0);

	return (
		<div>
			<h1>Give feedback</h1>
			<Button text="good" handleClick={() => setGood(good + 1)} />
			<Button
				text="neutral"
				handleClick={() => setNeutral(neutral + 1)}
			/>
			<Button text="bad" handleClick={() => setBad(bad + 1)} />
			<Statistics good={good} neutral={neutral} bad={bad} />
		</div>
	);
};

export default App;
