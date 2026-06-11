// app/(agent)/agent/team/level/[level]/page.tsx
"use client";

/* ────────── imports ────────── */
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridSortModel,
} from "@mui/x-data-grid";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";

/* ────────── API hook ────────── */
import { useGetTeamUsersByLevelQuery } from "@/redux/features/auth/authApi";

/* ────────── types (extendable) ────────── */
type TeamUser = {
  _id: string;
  customerId: string;
  name: string;
  email?: string;
  phone?: string;
  deposit?: number;
  activeDeposit?: number;
  status?: "active" | "inactive";
  joinedAt?: string;

  /* wallet derived fields (optional) */
  totalDeposit?: number;
  totalWithdraw?: number;
  totalEarning?: number;
  totalAiTrade?: number;
  totalAiTradeBalance?: number;
  totalLiveTradeBalance?: number;
};

/* ────────── column schema (single source of truth) ────────── */
type FieldKind = "text" | "currency" | "date" | "status" | "link";
type FieldSchema<T> = {
  field: keyof T | "view";
  headerName: string;
  width?: number;
  kind: FieldKind;
  render?: (row: T) => React.ReactNode;
};

/* ────────── helpers ────────── */
const fmtCurrency = (n?: number) =>
  Number(n ?? 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

/* ────────── master schema (add/remove/reorder freely) ────────── */
const FIELD_SCHEMAS: FieldSchema<TeamUser>[] = [
  { field: "customerId", headerName: "Customer ID", width: 140, kind: "text" },
  { field: "name", headerName: "Name", width: 180, kind: "text" },
  { field: "phone", headerName: "Phone", width: 140, kind: "text" },
  { field: "deposit", headerName: "Deposit", width: 120, kind: "currency" },
  {
    field: "activeDeposit",
    headerName: "Active",
    width: 120,
    kind: "currency",
  },
  {
    field: "totalDeposit",
    headerName: "Total Deposit",
    width: 140,
    kind: "currency",
  },
  {
    field: "totalWithdraw",
    headerName: "Total Withdraw",
    width: 150,
    kind: "currency",
  },
  {
    field: "totalEarning",
    headerName: "Total Earning",
    width: 140,
    kind: "currency",
  },
  {
    field: "totalAiTrade",
    headerName: "Smart Trade (P&L)",
    width: 150,
    kind: "currency",
  },
  {
    field: "totalAiTradeBalance",
    headerName: "Smart  Balance",
    width: 140,
    kind: "currency",
  },
  {
    field: "totalLiveTradeBalance",
    headerName: "Live Balance",
    width: 150,
    kind: "currency",
  },
  { field: "status", headerName: "Status", width: 110, kind: "status" },
  { field: "joinedAt", headerName: "Joined", width: 160, kind: "date" },
];

/* ────────── choose visible fields (easy to tweak) ────────── */
const VISIBLE_FIELDS: Array<FieldSchema<TeamUser>["field"]> = [
  "customerId",
  "name",
  "email",
  "totalDeposit",
  "totalWithdraw",
  "totalEarning",
  "totalAiTrade",
  "totalAiTradeBalance",
  "totalLiveTradeBalance",
  "status",
  "joinedAt",
];

/* ────────── build DataGrid columns from schema (typed & safe) ────────── */
function buildColumns(schema: FieldSchema<TeamUser>[]): GridColDef<TeamUser>[] {
  return schema.map((col): GridColDef<TeamUser> => {
    const fieldKey = col.field as string;

    if (col.field === "view") {
      return {
        field: "view",
        headerName: col.headerName,
        width: col.width ?? 80,
        align: "center",
        headerAlign: "center",
        sortable: false,
        renderCell: (p: GridRenderCellParams<TeamUser>) =>
          col.render
            ? col.render((p?.row as TeamUser) ?? ({} as TeamUser))
            : null,
      };
    }

    if (col.kind === "status") {
      return {
        field: fieldKey,
        headerName: col.headerName,
        width: col.width ?? 110,
        renderCell: (p: GridRenderCellParams<TeamUser>) => {
          const status = (p?.row as TeamUser)?.status;
          return (
            <span
              className={
                status === "active"
                  ? "rounded-full border border-emerald-400/30 bg-emerald-400/15 px-2 py-0.5 text-xs text-emerald-400"
                  : "rounded-full border border-rose-400/30 bg-rose-400/15 px-2 py-0.5 text-xs text-rose-400"
              }
            >
              {status ?? "-"}
            </span>
          );
        },
      };
    }

    if (col.kind === "currency") {
      return {
        field: fieldKey,
        headerName: col.headerName,
        width: col.width ?? 130,
        type: "number",
        valueGetter: (p: any) => {
          const row: any = p?.row ?? {};
          const val = row?.[fieldKey];
          return Number(val ?? 0);
        },
        renderCell: (p: GridRenderCellParams<TeamUser>) => {
          const row: any = p?.row ?? {};
          const val = Number(row?.[fieldKey] ?? 0);
          return fmtCurrency(val);
        },
      };
    }

    if (col.kind === "date") {
      return {
        field: fieldKey,
        headerName: col.headerName,
        width: col.width ?? 160,
        valueGetter: (p: any) => {
          const iso = (p?.row as any)?.[fieldKey] as string | undefined;
          return iso ? new Date(iso).getTime() : null;
        },
        renderCell: (p: GridRenderCellParams<TeamUser>) => {
          const iso = (p?.row as any)?.[fieldKey] as string | undefined;
          return iso
            ? new Date(iso).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "-";
        },
      };
    }

    return {
      field: fieldKey,
      headerName: col.headerName,
      width: col.width ?? 160,
      renderCell: (p: GridRenderCellParams<TeamUser>) => {
        const row = (p?.row as TeamUser) ?? ({} as TeamUser);
        const val = (row as any)?.[fieldKey];
        return (val ?? "-") as any;
      },
    };
  });
}

export default function TeamLevelPage() {
  /* ────────── params & data ────────── */
  const params = useParams<{ level: string }>();
  const level = Number(params.level);
  const { data, isLoading } = useGetTeamUsersByLevelQuery({ level });
  const users: TeamUser[] = data?.users ?? [];

  /* ────────── rows ────────── */
  const rows = useMemo(() => users.map((u) => ({ id: u._id, ...u })), [users]);

  /* ────────── columns (filter + build) ────────── */
  const columns: GridColDef<TeamUser>[] = useMemo(() => {
    const activeSchema = FIELD_SCHEMAS.filter((c) =>
      VISIBLE_FIELDS.includes(c.field),
    );
    return buildColumns(activeSchema);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ────────── default sort (data-aware) ────────── */
  const sortModel: GridSortModel = useMemo(() => {
    const fieldPref = [
      "totalDeposit",
      "deposit",
      "totalEarning",
      "totalAiTrade",
      "joinedAt",
    ];
    const firstExisting = fieldPref.find((f) =>
      VISIBLE_FIELDS.includes(f as any),
    );
    return firstExisting ? [{ field: firstExisting, sort: "desc" }] : [];
  }, []);

  return (
    <main className="min-h-screen bg-[#0B0D12] text-[#E6E6E6]">
      <div className="mx-auto max-w-6xl py-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Level {level} Users
            <span className="ml-2 text-white/60">({users.length})</span>
          </h2>
          <Link
            href="/agent-zone/clients"
            className="text-sm text-teal-300 hover:underline"
          >
            ← Back to dashboard
          </Link>
        </div>

        <div className="h-[calc(100vh-200px)]">
          <DataGrid
            rows={rows}
            columns={columns}
            loading={isLoading}
            disableRowSelectionOnClick
            columnHeaderHeight={44}
            getRowHeight={() => 56}
            initialState={{ sorting: { sortModel } }}
            sx={{
              bgcolor: "#0E1014",
              color: "#E6E6E6",
              border: "1px solid rgba(255,255,255,0.08)",
              "& .MuiDataGrid-columnHeaders": {
                bgcolor: "rgba(255,255,255,0.05)",
                color: "rgba(255,255,255,0.85)",
                fontSize: 12,
              },
              "& .MuiDataGrid-cell": {
                borderColor: "rgba(255,255,255,0.06)",
                fontSize: 12,
              },
              "& .MuiDataGrid-row:hover": { bgcolor: "rgba(255,255,255,0.03)" },
              "& .MuiTablePagination-root": { color: "rgba(255,255,255,0.75)" },
            }}
          />
        </div>
      </div>
    </main>
  );
}
