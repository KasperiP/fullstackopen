interface Result {
	periodLength: number;
	trainingDays: number;
	success: boolean;
	rating: number;
	ratingDescription: string;
	target: number;
	average: number;
}

const calculateExercises = (exercises: number[], target: number): Result => {
	const periodLength = exercises.length;
	const trainingDays = exercises.filter((exercise) => exercise > 0).length;
	const average = exercises.reduce((a, b) => a + b, 0) / periodLength;
	const success = average >= target;

	let rating = 0;
	let ratingDescription = '';
	if (average < target) {
		rating = 1;
		ratingDescription = 'work harder';
	}
	if (average >= target) {
		rating = 2;
		ratingDescription = 'not too bad but could be better';
	}
	if (average >= target * 1.5) {
		rating = 3;
		ratingDescription = 'you are doing great';
	}

	return {
		periodLength,
		trainingDays,
		success,
		rating,
		ratingDescription,
		target,
		average,
	};
};

const exercises = process.argv.slice(3).map((exercise) => Number(exercise));
const target = Number(process.argv[2]);

console.log(calculateExercises(exercises, target));

export default calculateExercises;
