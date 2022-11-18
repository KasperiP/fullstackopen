import diagnoses from '../data/diagnoses.json';

export interface Diagnose {
	code: string;
	name: string;
	latin?: string;
}

const getAllData = (): Diagnose[] => {
	return diagnoses;
};

export default {
	getAllData,
};
