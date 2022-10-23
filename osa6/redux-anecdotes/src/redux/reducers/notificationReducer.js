import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
	name: 'notification',
	initialState: '',
	reducers: {
		setNotification(_, action) {
			return action.payload;
		},
		resetNotification() {
			return '';
		},
	},
});

export const { resetNotification, setNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
