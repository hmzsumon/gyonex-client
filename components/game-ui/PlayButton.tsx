import React from "react";

type PlayButtonProps = {
  label?: string;
  onClick?: () => void;
  className?: string;
};

const PlayButton: React.FC<PlayButtonProps> = ({
  label = "Top-up",
  onClick,
  className = "",
}) => {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`relative w-[170px] h-[67px] rounded-full inline-flex items-center justify-center text-white text-[26px] font-extrabold italic tracking-wide bg-[linear-gradient(180deg,#ffb1ff_0%,#ee72ff_52%,#b24aff_100%)] ring-1 ring-white/30 [box-shadow:0_10px_18px_rgba(0,0,0,.35)] hover:brightness-110 active:translate-y-[1px] focus:outline-none focus:ring-2 focus:ring-white/60 ${className}`}
    >
      {/* glossy highlight */}
      <span className="pointer-events-none absolute inset-x-2 top-1 h-[52%] rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,.78),rgba(255,255,255,0))] opacity-90" />
      {/* subtle inner bevel */}
      <span className="pointer-events-none absolute inset-[3px] rounded-full [box-shadow:inset_0_0_0_1px_rgba(255,255,255,.45),inset_0_-10px_16px_rgba(0,0,0,.25)]" />
      <span className="relative drop-shadow-[0_2px_2px_rgba(0,0,0,.35)]">
        {label}
      </span>
    </button>
  );
};

export default PlayButton;
