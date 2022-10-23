import { useEffect } from 'react';
import { connect } from 'react-redux';
import { resetNotification } from '../redux/reducers/notificationReducer';

const Notification = (props) => {
	const { notification, resetNotification } = props;

	useEffect(() => {
		const timer = setTimeout(() => {
			resetNotification();
		}, 5 * 1000);
		return () => clearTimeout(timer);
	}, [notification, resetNotification]);

	const style = {
		border: 'solid',
		padding: 10,
		borderWidth: 1,
	};
	return <>{notification && <div style={style}>{notification}</div>}</>;
};

const mapStateToProps = (state) => {
	return {
		notification: state.notification,
		setNotification: state.setNotification,
	};
};

const mapDispatchToProps = {
	resetNotification,
};

const ConnectedNotification = connect(
	mapStateToProps,
	mapDispatchToProps
)(Notification);
export default ConnectedNotification;
