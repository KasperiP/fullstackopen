const calculateBmi = (height: number, weight: number): string => {
	const values = {
		severe_thinness: 16,
		moderate_thinness: 16.9,
		mild_thinness: 18.4,
		normal: 24.9,
		overweight: 29.9,
		obese_class_1: 34.9,
		obese_class_2: 39.9,
		obese_class_3: 40,
	};

	const bmi = weight / (height / 100) ** 2;

	if (bmi < values.severe_thinness) {
		return 'Underweight (Severe thinness)';
	}
	if (bmi < values.moderate_thinness) {
		return 'Underweight (Moderate thinness)';
	}
	if (bmi < values.mild_thinness) {
		return 'Underweight (Mild thinness)';
	}
	if (bmi < values.normal) {
		return 'Normal (Healthy weight)';
	}
	if (bmi < values.overweight) {
		return 'Overweight (Pre-obese)';
	}
	if (bmi < values.obese_class_1) {
		return 'Obese (Class I)';
	}
	if (bmi < values.obese_class_2) {
		return 'Obese (Class II)';
	}
	if (bmi < values.obese_class_3) {
		return 'Obese (Class III)';
	}

	return '';
};

const height = Number(process.argv[2]);
const weight = Number(process.argv[3]);

console.log(calculateBmi(height, weight));

export default calculateBmi;
