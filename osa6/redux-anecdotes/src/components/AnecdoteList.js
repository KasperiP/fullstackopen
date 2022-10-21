import { useDispatch, useSelector } from 'react-redux';

const AnecdoteList = () => {
	const dispatch = useDispatch();
	const anecdotes = useSelector((state) => {
		const anecdotes = state.anecdotes;
		const filter = state.filter;
		return [...anecdotes]
			.sort((a, b) => b.votes - a.votes)
			.filter((anecdote) => anecdote.content.includes(filter));
	});

	const handleVote = (id) => {
		dispatch({ type: 'anecdotes/voteAnecdote', payload: { id } });

		dispatch({
			type: 'notification/setNotification',
			payload: `you voted '${
				anecdotes.find((a) => a.id === id).content
			}'`,
		});

		// Clear notification after 5 seconds
		setTimeout(() => {
			dispatch({
				type: 'notification/resetNotification',
			});
		}, 5000);
	};

	return (
		<>
			{anecdotes.map((anecdote) => (
				<div key={anecdote.id}>
					<div>{anecdote.content}</div>
					<div>
						has {anecdote.votes}
						<button onClick={() => handleVote(anecdote.id)}>
							vote
						</button>
					</div>
				</div>
			))}
		</>
	);
};

export default AnecdoteList;
