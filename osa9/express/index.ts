import express, { Request, Response } from 'express';
import bmiCalculator from '../first_exercises/src/bmiCalculator';
import calculateExercises from '../first_exercises/src/exerciseCalculator';

const app = express();
app.use(express.json());

app.get('/hello', (_: Request, res: Response) => {
	res.send('Hello Full Stack!');
});

app.get('/bmi', (req: Request, res: Response) => {
	const height = Number(req.query.height);
	const weight = Number(req.query.weight);

	if (isNaN(height) || isNaN(weight)) {
		res.status(400).json({ error: 'malformatted parameters' });
	}

	const bmi = bmiCalculator(height, weight);

	res.send({
		weight,
		height,
		bmi,
	});
});

app.post('/exercises', (req: Request, res: Response) => {
	const { daily_exercises, target } = req.body;

	if (!daily_exercises || !target) {
		res.status(400).json({ error: 'parameters missing' });
	}

	console.log(daily_exercises);

	if (
		isNaN(target) ||
		!Array.isArray(daily_exercises) ||
		daily_exercises.some(isNaN)
	) {
		res.status(400).json({ error: 'malformatted parameters' });
	}

	const result = calculateExercises(daily_exercises, target);

	res.json(result);
});

const PORT = 3002;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
