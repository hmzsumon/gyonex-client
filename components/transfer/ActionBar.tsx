/* ────────── ActionBar (Cancel + Verify/Proceed/Find) ────────── */
"use client";

export default function ActionBar({
  hasRecipient,
  isVerify,
  disableFind,
  disableProceed,
  onFind,
  onVerify,
  onProceed,
  onCancel,
}: {
  hasRecipient: boolean;
  isVerify: boolean;
  disableFind: boolean;
  disableProceed: boolean;
  onFind: () => void;
  onVerify: () => void;
  onProceed: () => void;
  onCancel: () => void;
}) {
  if (!hasRecipient) {
    return (
      <button
        onClick={onFind}
        className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={disableFind}
      >
        Find Recipient
      </button>
    );
  }

  // when a recipient is selected: show Cancel + (Verify/Proceed)
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-sm hover:bg-neutral-700"
      >
        Cancel
      </button>

      {isVerify ? (
        <button
          onClick={onProceed}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={disableProceed}
        >
          Proceed to Send
        </button>
      ) : (
        <button
          onClick={onVerify}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-500"
        >
          Security Verify
        </button>
      )}
    </div>
  );
}
