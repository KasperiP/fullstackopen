import axios from 'axios';
import { useEffect, useState } from 'react';

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

const Persons = ({ persons, filter }) => {
	const filtteredPersons = persons.map((person) => {
		const { name, number } = person;

		// Filter out persons that don't match the filter
		if (filter !== '' && !name.includes(filter)) return null;

		return (
			<p key={name}>
				{name} {number}
			</p>
		);
	});

	return filtteredPersons;
};

const App = () => {
	const [persons, setPersons] = useState([]);
	const [newName, setNewName] = useState('');
	const [newNumber, setNewNumber] = useState('');
	const [filter, setFilter] = useState('');

	useEffect(() => {
		(async () => {
			const res = await axios.get('http://localhost:3001/persons');
			console.log(res);
			setPersons(res.data);
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

	const handleSubmit = (event) => {
		event.preventDefault();

		// Handle empty input
		if (newName === '') return;

		// Handle already added
		const match = persons.find((person) => person.name === newName);
		if (match) {
			return alert(`${newName} is already added to phonebook`);
		}

		setNewName('');
		setNewNumber('');
		setPersons(persons.concat({ name: newName, number: newNumber }));
	};

	return (
		<div>
			<h2>Phonebook</h2>
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
			<Persons persons={persons} filter={filter} />
		</div>
	);
};

export default App;
