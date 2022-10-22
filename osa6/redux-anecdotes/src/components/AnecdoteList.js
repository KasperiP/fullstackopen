import { useDispatch, useSelector } from 'react-redux';
import {
	setNotification,
	voteAnecdoteById,
} from '../redux/reducers/anecdoteReducer';

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
		dispatch(voteAnecdoteById(id));

		const anecdote = anecdotes.find((anecdote) => anecdote.id === id);
		dispatch(setNotification(`you voted '${anecdote.content}'`, 5));
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
