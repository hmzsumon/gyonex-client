"use client";

/* ────────── enable DataGrid keys in theme.components ────────── */
import type {} from "@mui/x-data-grid/themeAugmentation";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";

/* ────────── App-wide MUI theme (dark) ────────── */
const theme = createTheme({
  palette: {
    mode: "dark",
    background: { default: "#0B0D12", paper: "#0E1014" },
    text: { primary: "#E6E6E6", secondary: "rgba(255,255,255,0.60)" },
    divider: "rgba(255,255,255,0.08)",
  },
  components: {
    /* ────────── DataGrid dark skin ────────── */
    MuiDataGrid: {
      styleOverrides: {
        root: {
          backgroundColor: "#0E1014",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16,
        },
        columnHeaders: {
          backgroundColor: "rgba(255,255,255,0.05)",
          color: "rgba(255,255,255,0.85)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        },
        cell: {
          borderColor: "rgba(255,255,255,0.06)",
          color: "#E6E6E6",
          fontSize: "13px",
        },
        footerContainer: {
          borderTop: "1px solid rgba(255,255,255,0.08)",
          color: "rgba(255,255,255,0.75)",
          backgroundColor: "rgba(255,255,255,0.03)",
        },
        row: {
          "&:hover": { backgroundColor: "rgba(255,255,255,0.03)" },
        },
        virtualScrollerContent: { backgroundColor: "#0E1014" },
      },
    },
  },
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
