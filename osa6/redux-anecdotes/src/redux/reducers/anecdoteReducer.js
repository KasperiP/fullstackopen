import { createSlice, current } from '@reduxjs/toolkit';
import anecdoteService from '../../services/anecdoteService';

const anecdoteSlice = createSlice({
	name: 'anecdotes',
	initialState: [],
	reducers: {
		voteAnecdote(state, action) {
			const currentState = current(state);
			const votedAnectode = currentState.find(
				(a) => a.id === action.payload.id
			);
			const changedAnecdote = {
				...votedAnectode,
				votes: votedAnectode.votes + 1,
			};
			return state.map((anecdote) =>
				anecdote.id !== votedAnectode.id ? anecdote : changedAnecdote
			);
		},
		createAnecdote(state, action) {
			state.push(action.payload);
		},
		setAnecdotes(_, action) {
			return action.payload;
		},
	},
});

export const { voteAnecdote, createAnecdote, setAnecdotes } =
	anecdoteSlice.actions;

export const initializeAnecdotes = () => {
	return async (dispatch) => {
		const anecdotes = await anecdoteService.getAll();
		dispatch(setAnecdotes(anecdotes));
	};
};

export const createNewAnecdote = (content) => {
	return async (dispatch) => {
		const newAnecdote = await anecdoteService.create(content);
		dispatch(createAnecdote(newAnecdote));
	};
};

export const voteAnecdoteById = (id) => {
	return async (dispatch) => {
		const currentAnecdotes = await anecdoteService.getAll();
		const votedAnecdote = currentAnecdotes.find((a) => a.id === id);
		const changedAnecdote = {
			...votedAnecdote,
			votes: votedAnecdote.votes + 1,
		};
		await anecdoteService.update(id, changedAnecdote);
		dispatch(voteAnecdote({ id: votedAnecdote.id }));
	};
};

export const setNotification = (notification, time) => {
	return async (dispatch) => {
		dispatch({
			type: 'notification/setNotification',
			payload: notification,
		});

		// Clear notification after 5 seconds
		setTimeout(() => {
			dispatch({
				type: 'notification/resetNotification',
			});
		}, time * 1000);
	};
};

export default anecdoteSlice.reducer;
