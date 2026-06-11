import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	steppers: [
		{
			id: 1,
			label: 'Personal Information',
			number: 1,
			active: false,
			completed: false,
		},
		{
			id: 2,
			label: 'Contact Information',
			number: 2,
			active: false,
			completed: false,
		},
		{
			id: 3,
			label: 'Account Information',
			number: 3,
			active: false,
			completed: false,
		},
		{
			id: 4,
			label: 'Review',
			number: 4,
			active: false,
			completed: false,
		},
	],

	activeStep: 1,

	personalData: {
		country: '',
		name: '',
		else: '',
		mobile: '',
		referralCode: '',
		referralValidation: false,
		email: '',
	},
	moreAboutData: {
		date_of_birth: null,
		address: '',
		city: '',
		state: '',
		zip: '',
	},
	securityData: {
		password: '',
		pass_code: '',
	},
};

export const stepperSlice = createSlice({
	name: 'stepper',
	initialState,
	reducers: {
		setActiveStep: (state, action) => {
			const number = action.payload;
			// console.log(action.payload);
			const updatedSteppers = state.steppers.map((step) => {
				if (step.number === number) {
					return { ...step, active: true };
				}
				return step;
			});
			return { ...state, steppers: updatedSteppers };
		},
		// setCompletedStep
		setCompletedStep: (state, action) => {
			const number = action.payload;
			console.log(action.payload);
			const updatedSteppers = state.steppers.map((step) => {
				if (step.number === number) {
					return { ...step, completed: true };
				}
				return step;
			});
			return { ...state, steppers: updatedSteppers };
		},

		// handleNext
		handleNext: (state) => {
			return { ...state, activeStep: state.activeStep + 1 };
		},

		// handlePrevious
		handlePrevious: (state, action) => {
			const number = action.payload;

			const updatedSteppers = state.steppers.map((step) => {
				if (step.number === number) {
					return { ...step, active: false };
				}
				return step;
			});
			return {
				...state,
				steppers: updatedSteppers,
				activeStep: state.activeStep - 1,
			};
		},

		// setPersonalData
		setPersonalData: (state, action) => {
			return { ...state, personalData: action.payload };
		},

		// setMoreAboutData
		setMoreAboutData: (state, action) => {
			return { ...state, moreAboutData: action.payload };
		},

		// setSecurityData
		setSecurityData: (state, action) => {
			return { ...state, securityData: action.payload };
		},
	},
});

export const {
	setActiveStep,
	setCompletedStep,
	handleNext,
	handlePrevious,
	setSecurityData,
	setMoreAboutData,
	setPersonalData,
} = stepperSlice.actions;
export default stepperSlice.reducer;
