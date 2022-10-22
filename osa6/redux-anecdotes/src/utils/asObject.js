const getId = () => (100000 * Math.random()).toFixed(0);

export const asObject = (anecdote) => {
	return {
		content: anecdote,
		id: getId(),
		votes: 0,
	};
};
