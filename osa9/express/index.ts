import express, { Request, Response } from 'express';
import bmiCalculator from '../first_exercises/src/bmiCalculator';
const app = express();

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

const PORT = 3002;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
