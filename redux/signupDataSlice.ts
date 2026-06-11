import { createSlice } from '@reduxjs/toolkit';
import path from 'path';

const initialState = {
	email: '',
	destination: '',
};

export const signupDataSlice = createSlice({
	name: 'signupData',
	initialState,
	reducers: {
		addEmail: (state, action) => {
			state.email = action.payload;
		},
		addDestination: (state, action) => {
			state.destination = action.payload;
		},
	},
});

export const { addEmail, addDestination } = signupDataSlice.actions;
export default signupDataSlice.reducer;
