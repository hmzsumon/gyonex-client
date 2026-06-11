/* components/ui/ToasterBridge.tsx — গ্লোবাল একবার বসাও (app layout এ) */
"use client";
import { useEffect, useState } from "react";

export default function ToasterBridge() {
  const [msg, setMsg] = useState<{
    kind: "success" | "error" | "info";
    text: string;
  } | null>(null);

  useEffect(() => {
    const h = (e: any) => {
      setMsg(e.detail);
      setTimeout(() => setMsg(null), 2500);
    };
    addEventListener("toast", h as any);
    return () => removeEventListener("toast", h as any);
  }, []);

  if (!msg) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[80]">
      <div
        className={`px-4 py-2 rounded-lg shadow-lg ${
          msg.kind === "success"
            ? "bg-green-600/90"
            : msg.kind === "error"
            ? "bg-red-600/90"
            : "bg-neutral-700/90"
        } text-white`}
      >
        {msg.text}
      </div>
    </div>
  );
}
