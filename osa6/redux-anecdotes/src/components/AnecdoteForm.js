import { connect } from 'react-redux';
import {
	createNewAnecdote,
	setNotification,
} from '../redux/reducers/anecdoteReducer';

const AnecdoteForm = (props) => {
	const { createNewAnecdote, setNotification } = props;

	const handleCreate = async (e) => {
		e.preventDefault();
		const content = e.target.anecdote.value;
		e.target.anecdote.value = '';
		createNewAnecdote(content);
		setNotification(`you created '${content}'`, 5);
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

const mapDispatchToProps = {
	createNewAnecdote,
	setNotification,
};

const ConnectedAnecdoteForm = connect(null, mapDispatchToProps)(AnecdoteForm);

export default ConnectedAnecdoteForm;
