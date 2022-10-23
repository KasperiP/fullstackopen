import { connect } from 'react-redux';
import { setFilter } from '../redux/reducers/filterReducer';

const Filter = (props) => {
	const setFilter = props.setFilter;

	const handleChange = (event) => {
		const value = event.target.value;
		setFilter(value);
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

const mapDispatchToProps = {
	setFilter,
};

const ConnectedFilter = connect(null, mapDispatchToProps)(Filter);
export default ConnectedFilter;
