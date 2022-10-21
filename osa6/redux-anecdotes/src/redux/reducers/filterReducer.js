import { createSlice } from '@reduxjs/toolkit';

const filterSlice = createSlice({
	name: 'filter',
	initialState: '',
	reducers: {
		setFilter(_, action) {
			return action.payload;
		},
	},
});

export default filterSlice.reducer;
