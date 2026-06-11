/* ──────────────────────────────────────────────────────────────────────────
   accountUISlice — selected account & current tab (persisted)
────────────────────────────────────────────────────────────────────────── */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AccountTab = "active" | "closed";

interface AccountUIState {
  selectedAccountId: string | null;
  currentTab: AccountTab;
}

const initialState: AccountUIState = {
  selectedAccountId: null,
  currentTab: "active",
};

const aiAccountUISlice = createSlice({
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

export const { setSelectedAccountId, setAccountTab } = aiAccountUISlice.actions;
export default aiAccountUISlice.reducer;
