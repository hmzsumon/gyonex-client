// ── UI slice: desktop collapse & mobile drawer
import { createSlice } from "@reduxjs/toolkit";

type UIState = {
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;
};

const initialState: UIState = {
  sidebarCollapsed: false,
  mobileSidebarOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    openMobileSidebar(state) {
      state.mobileSidebarOpen = true;
    },
    closeMobileSidebar(state) {
      state.mobileSidebarOpen = false;
    },
  },
});

export const { toggleSidebar, openMobileSidebar, closeMobileSidebar } =
  uiSlice.actions;

export default uiSlice.reducer;
