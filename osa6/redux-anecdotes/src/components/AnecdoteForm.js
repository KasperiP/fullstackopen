import { useDispatch } from 'react-redux';
import { createAnectode } from '../reducers/anecdoteReducer';

const AnecdoteForm = () => {
	const dispatch = useDispatch();

	const handleCreate = (e) => {
		e.preventDefault();
		const content = e.target.anecdote.value;
		dispatch(createAnectode(content));
		e.target.anecdote.value = '';
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
