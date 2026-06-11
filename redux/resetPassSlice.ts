import { createSlice } from '@reduxjs/toolkit';
const initialState = {
	email: '',
	code: '',
};

const resetPassSlice = createSlice({
	name: 'resetPass',
	initialState,
	reducers: {
		addEmail: (state, action) => {
			state.email = action.payload;
		},
		removeEmail: (state) => {
			state.email = '';
		},
	},
});

export const { addEmail, removeEmail } = resetPassSlice.actions;
export default resetPassSlice.reducer;
