import { useEffect, useState } from 'react';
import personService from './Api';
import './App.css';
const Filter = ({ handleFilterChange, filter }) => {
	return (
		<div>
			filter shown with{' '}
			<input onChange={handleFilterChange} value={filter} />
		</div>
	);
};

const PersonForm = ({
	handleSubmit,
	newName,
	handleNameChange,
	newNumber,
	handleNumberChange,
}) => {
	return (
		<form onSubmit={handleSubmit}>
			<div>
				name: <input onChange={handleNameChange} value={newName} />
			</div>
			<div>
				number:{' '}
				<input
					type="tel"
					onChange={handleNumberChange}
					value={newNumber}
				/>
			</div>
			<div>
				<button type="submit" onClick={handleSubmit}>
					add
				</button>
			</div>
		</form>
	);
};

const Persons = ({ persons, filter, handleDelete }) => {
	const filtteredPersons = persons.map((person) => {
		const { name, number } = person;

		// Filter out persons that don't match the filter
		if (filter !== '' && !name.toLowerCase().includes(filter.toLowerCase()))
			return null;

		return (
			<div key={name}>
				<p>
					{name} {number}
					<button onClick={() => handleDelete(person.id)}>
						Delete
					</button>
				</p>
			</div>
		);
	});

	return filtteredPersons;
};

const Notification = ({ message, status }) => {
	if (message === null) {
		return null;
	}

	return (
		<div className={status && status === 'error' ? 'error' : 'success'}>
			{message}
		</div>
	);
};

const App = () => {
	const [persons, setPersons] = useState([]);
	const [newName, setNewName] = useState('');
	const [newNumber, setNewNumber] = useState('');
	const [filter, setFilter] = useState('');

	const [message, setMessage] = useState(null);
	const [status, setStatus] = useState(null);

	useEffect(() => {
		(async () => {
			const res = await personService.getAllNumbers();
			setPersons(res);
		})();
	}, []);

	const handleNameChange = (event) => {
		setNewName(event.target.value);
	};

	const handleNumberChange = (event) => {
		setNewNumber(event.target.value);
	};

	const handleFilterChange = (event) => {
		setFilter(event.target.value);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		// Handle empty input
		if (newName === '') return;

		// Handle already added
		const exists = persons.find((person) => person.name === newName);
		if (exists) {
			const { id, name } = exists;
			if (
				window.confirm(
					`${name} is already added to phonebook, replace the old number with a new one?`
				)
			) {
				try {
					const newPerson = {
						name: newName,
						number: newNumber,
					};
					await personService.updateNumber(id, newPerson);

					const newPersons = persons.map((person) =>
						person.id !== id ? person : newPerson
					);

					setPersons(newPersons);

					setMessage(`Updated ${name}`);
					setTimeout(() => {
						setMessage(null);
					}, 5000);
					return;
				} catch (error) {
					let message;
					if (error?.response?.data?.error) {
						message = error.response.data.error;
					}
					setMessage(message || 'Error while updating person');
					setStatus('error');
					setTimeout(() => {
						setStatus(null);
						setMessage(null);
					}, 5000);
				}
			} else {
				return;
			}
		}

		const newPerson = {
			name: newName,
			number: newNumber,
		};

		// Add new person to db
		try {
			await personService.createNumber(newPerson);

			setNewName('');
			setNewNumber('');
			setPersons(persons.concat(newPerson));

			setMessage(`Added ${newPerson.name}`);
			setTimeout(() => {
				setMessage(null);
			}, 5000);
		} catch (error) {
			let message;
			if (error?.response?.data?.error) {
				message = error.response.data.error;
			}
			setMessage(message || 'Could not add person');
			setStatus('error');
			setTimeout(() => {
				setStatus(null);
				setMessage(null);
			}, 5000);
		}
	};

	const handleDelete = async (id) => {
		const person = persons.find((person) => person.id === id);
		const { name } = person;

		try {
			await personService.deleteNumber(id);
			const newPersons = persons.filter((person) => person.id !== id);
			setPersons(newPersons);
			setMessage(`Deleted ${name}`);
			setTimeout(() => {
				setMessage(null);
			}, 5000);
		} catch (error) {
			setMessage(
				`Information of ${name} has already been removed from server`
			);
			setStatus('error');
			setTimeout(() => {
				setStatus(null);
				setMessage(null);
			}, 5000);
		}
	};

	return (
		<div>
			<h2>Phonebook</h2>
			<Notification message={message} status={status} />
			<Filter handleFilterChange={handleFilterChange} filter={filter} />
			<h3>Add a new</h3>
			<PersonForm
				handleSubmit={handleSubmit}
				newName={newName}
				handleNameChange={handleNameChange}
				newNumber={newNumber}
				handleNumberChange={handleNumberChange}
			/>
			<h3>Numbers</h3>
			<Persons
				persons={persons}
				filter={filter}
				handleDelete={handleDelete}
			/>
		</div>
	);
};

export default App;
