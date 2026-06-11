/* ──────────────────────────────────────────────────────────────────────────
   accountUISlice — selected account & current tab (persisted)
────────────────────────────────────────────────────────────────────────── */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AccountTab = "real" | "demo" | "archived";

interface AccountUIState {
  selectedAccountId: string | null;
  currentTab: AccountTab;
}

const initialState: AccountUIState = {
  selectedAccountId: null,
  currentTab: "real",
};

const accountUISlice = createSlice({
  name: "accountUI",
  initialState,
  reducers: {
    setSelectedAccountId(state, action: PayloadAction<string | null>) {
      state.selectedAccountId = action.payload;
    },
    setAccountTab(state, action: PayloadAction<AccountTab>) {
      state.currentTab = action.payload;
    },
  },
});

export const { setSelectedAccountId, setAccountTab } = accountUISlice.actions;
export default accountUISlice.reducer;
