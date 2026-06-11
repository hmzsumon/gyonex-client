// components/fruit-loops/ChipPicker.tsx
"use client";

/* ── Imports ───────────────────────────────────────────────────────────── */
import { selectChip } from "@/redux/features/fruit-loops/fruitLoopsSlice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import BWChip from "../game-ui/BWChip";

/* ── Component ─────────────────────────────────────────────────────────── */
export default function ChipPicker() {
  const dispatch = useDispatch();
  const reduxSelected = useSelector((s: any) => s.fruitLoops.selectedChip);
  const soundOn = useSelector((s: any) => s.fruitLoops.soundOn);

  const chips = [
    { amount: 1, baseColor: "#191919", faceColor: "#111827" },
    { amount: 10, baseColor: "#2563EB", faceColor: "#1D4ED8" },
    { amount: 100, baseColor: "#EF4444", faceColor: "#DC2626" },
    { amount: 500, baseColor: "#22C55E", faceColor: "#16A34A" },
  ];

  const [selected, setSelected] = useState<number>(
    reduxSelected ?? chips[0].amount
  );

  const onPick = (amt: number) => {
    setSelected(amt);
    dispatch(selectChip(amt));
    // if (soundOn) Sound.play("chipSelect");
  };

  return (
    <div className="grid grid-cols-4 gap-2 place-items-center">
      {chips.map((c) => (
        <BWChip
          key={c.amount}
          size={50}
          {...c}
          stripeColor="#fff"
          textColor="#fff"
          selected={selected === c.amount}
          selectedScale={1.08}
          animate="pulse"
          glowColor="rgba(59,130,246,.55)"
          onClick={() => onPick(c.amount)}
        />
      ))}
    </div>
  );
}
/* ── End Component ─────────────────────────────────────────────────────── */
