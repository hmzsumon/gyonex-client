import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import depositMethodReducer from "./depositMethodSlice";
import accountUIReducer from "./features/account/accountUISlice";
import aiAccountUIReducer from "./features/ai-account/ai-accountUISlice";
import { apiSlice } from "./features/api/apiSlice";
import authReducer from "./features/auth/authSlice";
import kycReducer from "./features/kyc/kycSlice";
import tradeReducer from "./features/trade/tradeSlice";
import sidebarReducer from "./features/ui/sidebarSlice";
import uiReducer from "./features/ui/uiSlice";
import walletReducer from "./features/wallet/walletSlice";
import resetPassSlice from "./resetPassSlice";
import signUpData from "./signupDataSlice";
import stepperSlice from "./stepperSlice";
import verificationSlice from "./verificationSlice";

const persistConfig = {
  key: "root",
  storage: storage,
  whitelist: ["auth", "trade", "resetPass", "accountUI"],
};

export const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
  depositMethod: depositMethodReducer,
  signUpData,
  stepper: stepperSlice,
  resetPass: resetPassSlice,
  verification: verificationSlice,
  sidebar: sidebarReducer,
  wallet: walletReducer,
  ui: uiReducer,
  accountUI: accountUIReducer,
  kyc: kycReducer,
  trade: tradeReducer,
  aiAccountUI: aiAccountUIReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlice.middleware);
  },
});
export let persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
