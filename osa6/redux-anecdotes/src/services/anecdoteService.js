import axios from 'axios';
import { asObject } from '../utils/asObject';

const baseUrl = 'http://localhost:3001/anecdotes';

export const getAll = async () => {
	const response = await axios.get(baseUrl);
	return response.data;
};

export const create = async (content) => {
	const object = asObject(content);
	const response = await axios.post(baseUrl, object);
	return response.data;
};

export const update = async (id, newObject) => {
	const response = await axios.put(`${baseUrl}/${id}`, newObject);
	return response.data;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
	getAll,
	create,
	update,
};
