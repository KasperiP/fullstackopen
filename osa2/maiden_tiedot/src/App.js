import axios from 'axios';
import { useEffect, useState } from 'react';

const Country = ({ country }) => {
	const [weather, setWeather] = useState(null);
	const { name, capital, area, languages, flags } = country;

	useEffect(() => {
		(async () => {
			const res = await axios.get(
				`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/finland?unitGroup=metric&key=${process.env.REACT_APP_API_KEY}&contentType=json`
			);
			setWeather(res.data);
		})();
	}, []);

	// There is no weather image because of different API

	return (
		<div>
			<h1>{name.common}</h1>
			<p>capital {capital}</p>
			<p>area {area}</p>
			<h3>languages:</h3>
			<ul>
				{Object.values(languages).map((lang) => (
					<li key={lang}>{lang}</li>
				))}
			</ul>
			<img src={flags.png} alt="flag" width="200" />
			<h2>Wether in {capital}</h2>
			{weather ? (
				<>
					<p>Temperature {weather.currentConditions.temp} Celcius</p>
					<p>
						Wind{' '}
						{(weather.currentConditions.windspeed / 3.6).toFixed(1)}{' '}
						m/s
					</p>
				</>
			) : (
				<>
					<p>Data not found :(</p>
				</>
			)}
		</div>
	);
};

const Countries = ({ countries, search, setSearch }) => {
	const filteredCountries = countries.filter((country) => {
		const { common: name } = country.name;
		return name.toLowerCase().includes(search.toLowerCase());
	});

	if (filteredCountries.length > 10) {
		return <p>Too many matches, specify another filter</p>;
	}

	if (filteredCountries.length === 1) {
		return <Country country={filteredCountries[0]} />;
	}

	return (
		<div>
			{filteredCountries.map((country) => {
				const { common: name } = country.name;
				return (
					<div key={name}>
						{name}{' '}
						<button onClick={() => setSearch(name)}>show</button>
					</div>
				);
			})}
		</div>
	);
};

const App = () => {
	const [search, setSearch] = useState('');
	const [countries, setCountries] = useState([]);

	useEffect(() => {
		(async () => {
			const res = await axios.get('https://restcountries.com/v3.1/all');
			setCountries(res.data);
		})();
	}, []);

	const handleChange = (event) => {
		setSearch(event.target.value);
	};

	return (
		<div>
			find countries{' '}
			<input type="text" value={search} onChange={handleChange} />
			<Countries
				countries={countries}
				search={search}
				setSearch={setSearch}
			/>
		</div>
	);
};

export default App;
