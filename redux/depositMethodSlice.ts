import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	isSelect: false,
	methodId: '',
	activeWallet: {},
};

export const depositMethodSlice = createSlice({
	name: 'depositMethod',
	initialState,
	reducers: {
		selectMethod: (state, action) => {
			state.isSelect = true;
			// state.methodId = action.payload;
			state.activeWallet = action.payload;
		},
		removeMethod: (state) => {
			state.isSelect = false;
			state.methodId = '';
			state.activeWallet = {};
		},
	},
});

export const { selectMethod, removeMethod } = depositMethodSlice.actions;
export default depositMethodSlice.reducer;
