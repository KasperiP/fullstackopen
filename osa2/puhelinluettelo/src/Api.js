import axios from 'axios';

// Uses express backend
const baseUrl = '/api/persons';
// const baseUrl = 'http://localhost:3001/persons';

const getAllNumbers = () => {
	const request = axios.get(baseUrl);
	return request.then((response) => response.data);
};

const createNumber = (personObj) => {
	const request = axios.post(baseUrl, personObj);
	return request.then((response) => response.data);
};

const deleteNumber = (id) => {
	const request = axios.delete(`${baseUrl}/${id}`);
	return request.then((response) => response.data);
};

const updateNumber = (id, personObj) => {
	const request = axios.put(`${baseUrl}/${id}`, personObj);
	return request.then((response) => response.data);
};

const methods = { getAllNumbers, createNumber, deleteNumber, updateNumber };

export default methods;
