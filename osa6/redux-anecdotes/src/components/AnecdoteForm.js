import { useDispatch } from 'react-redux';
import {
	createNewAnecdote,
	setNotification,
} from '../redux/reducers/anecdoteReducer';

const AnecdoteForm = () => {
	const dispatch = useDispatch();

	const handleCreate = async (e) => {
		e.preventDefault();
		const content = e.target.anecdote.value;
		e.target.anecdote.value = '';
		dispatch(createNewAnecdote(content));

		dispatch(setNotification(`you created '${content}'`, 5));
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
