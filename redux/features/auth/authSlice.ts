import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  btnLogin: false,
  user: null,
  token: null,
  isAuthenticated: false,
  isForgotPassword: false,
  emailForgotPassword: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setBtnLogin: (state) => {
      state.btnLogin = !state.btnLogin;
    },
    setUser: (state, action) => {
      // console.log('action.payload', action.payload);
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    loadUser: (state, action) => {
      state.user = action.payload.user;
    },
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    setForgotPasswordState: (state, action) => {
      state.isForgotPassword = action.payload.isForgotPassword;
      state.emailForgotPassword = action.payload.emailForgotPassword;
    },
  },
});

export const {
  setBtnLogin,
  setUser,
  logoutUser,
  loadUser,
  setForgotPasswordState,
} = authSlice.actions;
export default authSlice.reducer;
