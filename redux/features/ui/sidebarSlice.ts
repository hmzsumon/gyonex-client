// src/redux/features/ui/sidebarSlice.ts
import { createSlice } from "@reduxjs/toolkit";

interface SidebarState {
  isOpen: boolean;
  isUserSidebarOpen?: boolean; // Optional property for user sidebar state
  isMobileSidebarOpen?: boolean; // Optional property for mobile sidebar state
}

const initialState: SidebarState = {
  isOpen: false,
  isUserSidebarOpen: false, // Initialize as false
  isMobileSidebarOpen: false, // Initialize as false
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    openSidebar: (state) => {
      state.isOpen = true;
    },
    closeSidebar: (state) => {
      state.isOpen = false;
    },
    toggleSidebar: (state) => {
      state.isOpen = !state.isOpen;
    },

    openUserSidebar: (state) => {
      state.isUserSidebarOpen = true;
    },
    closeUserSidebar: (state) => {
      state.isUserSidebarOpen = false;
    },
    toggleUserSidebar: (state) => {
      state.isUserSidebarOpen = !state.isUserSidebarOpen;
    },
    openMobileSidebar: (state) => {
      state.isMobileSidebarOpen = true;
    },
    closeMobileSidebar: (state) => {
      state.isMobileSidebarOpen = false;
    },
    toggleMobileSidebar: (state) => {
      state.isMobileSidebarOpen = !state.isMobileSidebarOpen;
    },
  },
});

export const {
  openSidebar,
  closeSidebar,
  toggleSidebar,
  openUserSidebar,
  closeUserSidebar,
  toggleUserSidebar,
  openMobileSidebar,
  closeMobileSidebar,
  toggleMobileSidebar,
} = sidebarSlice.actions;
export default sidebarSlice.reducer;
