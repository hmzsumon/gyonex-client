/* ──────────────────────────────────────────────────────────────────────────
   SetupAccount — Real/Demo toggle + selectors (Type/Currency/Execution/Leverage/Platform/Nickname)
   NOTE: প্রতিটি সেকশনে sheet/modal ওপেন হয়।
────────────────────────────────────────────────────────────────────────── */
"use client";

import { useState } from "react";
import { WizardState } from "../OpenAccountWizard";
import CurrencySheet from "../sheets/CurrencySheet";
import NicknameSheet from "../sheets/NicknameSheet";

export default function SetupAccount({
  value,
  onChange,
  onContinue,
  onBack,
}: {
  value: WizardState;
  onChange: (v: WizardState) => void;
  onContinue: () => void;
  onBack: () => void;
}) {
  const [showCurrency, setShowCurrency] = useState(false);
  const [showExec, setShowExec] = useState(false);
  const [showLev, setShowLev] = useState(false);
  const [showNick, setShowNick] = useState(false);

  return (
    <div className="p-4">
      {/* Mode toggle */}

      {/* Selectors */}
      <div className="mt-4 rounded-2xl bg-neutral-900 border border-neutral-800 divide-y divide-neutral-800">
        <Row
          label="Currency"
          value={value.currency}
          onClick={() => setShowCurrency(true)}
        />

        <Row
          label="Nickname"
          value={value.nickname ?? "Optional"}
          onClick={() => setShowNick(true)}
        />
      </div>

      {/* Footer */}
      <div className="flex gap-2 mt-4">
        <button
          className="flex-1 py-3 rounded-xl border border-neutral-800"
          onClick={onBack}
        >
          Back
        </button>
        <button
          className="flex-1 py-3 rounded-xl bg-yellow-400 text-black font-semibold"
          onClick={onContinue}
        >
          Continue
        </button>
      </div>

      {/* Sheets */}
      {showCurrency && (
        <CurrencySheet
          current={value.currency}
          onClose={() => setShowCurrency(false)}
          onPick={(cur) => {
            onChange({ ...value, currency: cur });
            setShowCurrency(false);
          }}
        />
      )}

      {showNick && (
        <NicknameSheet
          current={value.nickname ?? ""}
          onClose={() => setShowNick(false)}
          onSave={(nick) => {
            onChange({ ...value, nickname: nick });
            setShowNick(false);
          }}
        />
      )}
    </div>
  );
}

function Row({
  label,
  value,
  onClick,
  rightBadge,
}: {
  label: string;
  value: string;
  onClick?: () => void;
  rightBadge?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-4 flex items-center justify-between"
    >
      <div className="text-neutral-400">{label}</div>
      <div className="flex items-center gap-2">
        {rightBadge && (
          <span className="text-xs px-2 py-1 rounded-full bg-neutral-800">
            {rightBadge}
          </span>
        )}
        <div>{value}</div>
        {onClick && <span className="opacity-60">›</span>}
      </div>
    </button>
  );
}
