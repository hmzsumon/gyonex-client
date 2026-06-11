"use client";

type Props = {
  label: string;
  disabled?: boolean;
  onConfirm: () => void;
};

const ConfirmBar = ({ label, disabled, onConfirm }: Props) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#0f141b]/90 backdrop-blur border-t border-white/10 px-4 py-4">
      <button
        onClick={onConfirm}
        disabled={disabled}
        className={[
          "w-full rounded-xl py-3 text-base font-semibold",
          "transition active:scale-[0.99]",
          disabled
            ? "bg-[#f0c34d]/30 text-black/40 cursor-not-allowed"
            : "bg-[#f0c34d] text-black hover:opacity-95",
        ].join(" ")}
      >
        {label}
      </button>
    </div>
  );
};

export default ConfirmBar;
