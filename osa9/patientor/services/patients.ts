import patients from '../data/patients.json';

enum Gender {
	Female = 'female',
	Male = 'male',
	Other = 'other',
}

export interface Patient {
	id: string;
	name: string;
	dateOfBirth: string;
	ssn: string;
	gender: Gender;
	occupation: string;
}

const getAllData = (): Patient[] => {
	return patients as Patient[];
};

const getNonSensitiveData = (): Omit<Patient, 'ssn'>[] => {
	const patientsWithoutSsn = patients.map(
		({ ssn, ...patient }) => patient
	) as Omit<Patient, 'ssn'>[];
	return patientsWithoutSsn;
};

const addPatient = (patient: Patient) => {
	patients.push(patient);
	return patient;
};

export default {
	getAllData,
	getNonSensitiveData,
	addPatient,
};
