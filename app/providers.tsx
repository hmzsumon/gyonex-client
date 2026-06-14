"use client";

/* ────────── enable DataGrid keys in theme.components ────────── */
import type {} from "@mui/x-data-grid/themeAugmentation";

import { useState } from "react";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/* ─────────────────────────────────────────────
   App-wide MUI theme (dark)
   UI আগের মতই থাকবে, এখানে কোনো design change করা হয়নি।
───────────────────────────────────────────── */
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
  /* ─────────────────────────────────────────────
     React Query Client
     useState দিয়ে একবারই QueryClient create করা হচ্ছে।
     না হলে re-render হলে cache reset হতে পারে।
  ───────────────────────────────────────────── */
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            /* ── Window focus করলে বারবার auto API refetch বন্ধ ── */
            refetchOnWindowFocus: false,

            /* ── API failed হলে ১ বার retry করবে ── */
            retry: 1,
          },
        },
      }),
  );

  return (
    /* ─────────────────────────────────────────────
       QueryClientProvider
       Lottery page-এ useQueryClient/useQuery/useMutation ব্যবহার হয়েছে।
       তাই এই provider না থাকলে:
       "No QueryClient set, use QueryClientProvider to set one" 
       error দেখাবে।
    ───────────────────────────────────────────── */
    <QueryClientProvider client={queryClient}>
      {/* ── Existing MUI provider আগের মতই রাখা হয়েছে ── */}
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
