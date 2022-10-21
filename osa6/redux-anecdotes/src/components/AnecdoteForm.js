import { useDispatch } from 'react-redux';

const AnecdoteForm = () => {
	const dispatch = useDispatch();

	const handleCreate = (e) => {
		e.preventDefault();
		const content = e.target.anecdote.value;
		dispatch({ type: 'anecdotes/createAnecdote', payload: content });

		e.target.anecdote.value = '';

		dispatch({
			type: 'notification/setNotification',
			payload: `you created '${content}'`,
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
			<h2>create new</h2>{' '}
			<form onSubmit={handleCreate}>
				<div>
					<input name="anecdote" />
				</div>
				<button type="submit">create</button>
			</form>
		</>
	);
};

export default AnecdoteForm;
