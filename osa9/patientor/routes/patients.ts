import express from 'express';
import { v1 as uuid } from 'uuid';
import patientService, { Patient } from '../services/patients';

const router = express.Router();

router.get('/', (_req, res) => {
	res.send(patientService.getNonSensitiveData());
});

router.post('/', (req, res) => {
	const { name, dateOfBirth, ssn, gender, occupation } = req.body as Patient;

	if (!name || !dateOfBirth || !ssn || !gender || !occupation) {
		res.status(400).send('Missing data');
	}

	const validGenders = ['female', 'male', 'other'];
	if (!validGenders.includes(gender)) {
		res.status(400).send('Invalid gender');
	}

	const id = uuid();
	const newPatientEntry = {
		id: id,
		name,
		dateOfBirth,
		ssn,
		gender,
		occupation,
	};
	patientService.addPatient(newPatientEntry);
	res.json(newPatientEntry);
});

export default router;
