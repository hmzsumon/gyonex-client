import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	step: 1,
	verificationData: {
		fullName: '',
		gender: '',
		dateOfBirth: '',
		phone: '',
		country: '',
		city: '',
		zip: '',
		address: '',
		idType: '',
		frontIdUrl: '',
		backIdUrl: '',
		passportUrl: '',
		selfieUrl: '',
	},
};

const verificationSlice = createSlice({
	name: 'verification',
	initialState,
	reducers: {
		setStep: (state, action) => {
			state.step = action.payload;
		},
		setVerificationData: (state, action) => {
			state.verificationData = action.payload;
		},
	},
});

export const { setStep, setVerificationData } = verificationSlice.actions;
export default verificationSlice.reducer;
