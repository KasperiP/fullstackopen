import { useDispatch } from 'react-redux';

const Filter = () => {
	const dispatch = useDispatch();

	const handleChange = (event) => {
		const value = event.target.value;
		dispatch({ type: 'filter/setFilter', payload: value });
	};
	const style = {
		marginBottom: 10,
	};

	return (
		<div style={style}>
			filter <input onChange={handleChange} />
		</div>
	);
};

export default Filter;
