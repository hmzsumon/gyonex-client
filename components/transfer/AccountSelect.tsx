"use client";
import { LiteAccount } from "@/redux/features/transfer/transferApi";
import { useSelector } from "react-redux";

export default function AccountSelect({
  label,
  accounts,
  value,
  onChange,
  excludeId,
}: {
  label: string;
  accounts: LiteAccount[];
  value?: string;
  onChange: (id: string) => void;
  excludeId?: string;
}) {
  const { user } = useSelector((state: any) => state.auth);
  const mainBalance = Number(user?.m_balance || 0);
  const mainCurrency = user?.currency || "USD";

  // exclude করা হলে ‘main’ ও বাদ দাও (যদি চাই)
  const opts = accounts.filter((a) => a.id !== excludeId);

  // label renderer
  const labelFor = (a: LiteAccount) => {
    const tag = a.accountNumber ? `#${a.accountNumber}` : a.title;
    return `${tag} • ${a.currency} ${a.balance.toFixed(2)}`;
  };

  return (
    <div>
      <div className="mb-1 text-xs text-neutral-300">{label}</div>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg bg-neutral-900 border border-neutral-800 px-3 py-2 text-neutral-200 outline-none"
      >
        <option value="" disabled>
          Please choose…
        </option>

        {/* 👇 Special option: Main balance */}
        {excludeId !== "main" && (
          <option value="main">
            Main balance • {mainCurrency} {mainBalance.toFixed(2)}
          </option>
        )}

        {opts.map((a) => (
          <option key={a.id} value={a.id}>
            {labelFor(a)}
          </option>
        ))}
      </select>

      {value && value !== "" && (
        <div className="mt-1 text-xs text-neutral-400">
          {value === "main" ? (
            <>
              <span>Main balance</span>
              <span className="mx-2">•</span>
              <span>
                Balance: {mainCurrency} {mainBalance.toFixed(2)}
              </span>
            </>
          ) : (
            (() => {
              const a = accounts.find((x) => x.id === value);
              if (!a) return null;
              const tag = a.accountNumber ? `#${a.accountNumber}` : a.title;
              return (
                <>
                  <span>{tag}</span>
                  <span className="mx-2">•</span>
                  <span>
                    Balance: {a.currency} {a.balance.toFixed(2)}
                  </span>
                  <span className="mx-2">•</span>
                  <span>Margin ratio: {a.marginRatio.toFixed(2)}%</span>
                </>
              );
            })()
          )}
        </div>
      )}
    </div>
  );
}
