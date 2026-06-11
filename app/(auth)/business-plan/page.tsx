// app/docs/business-plan/page.tsx
"use client";

import { Download, RotateCcw } from "lucide-react";
import { useState } from "react";

const pdfHref = "/docs/business-plan.pdf";

export default function BusinessPlanPage() {
  const [fallback, setFallback] = useState(false);

  return (
    <main className="min-h-screen bg-[#0b0e11] text-white">
      <div className="mx-auto max-w-6xl px-3 py-6">
        <header className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-extrabold tracking-tight">
            Business Plan
          </h1>

          <div className="flex items-center gap-2">
            <a
              href={pdfHref}
              download
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-400 to-cyan-500 px-3 py-2 text-sm font-semibold text-neutral-950"
            >
              <Download size={16} />
              Download
            </a>

            {fallback && (
              <button
                onClick={() => setFallback(false)}
                className="inline-flex items-center gap-2 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm"
              >
                <RotateCcw size={16} />
                Try embed again
              </button>
            )}
          </div>
        </header>

        {!fallback ? (
          <object
            data={pdfHref}
            type="application/pdf"
            className="h-[80vh] w-full rounded-xl border border-neutral-800"
            aria-label="Business Plan PDF"
            onError={() => setFallback(true)}
          >
            {/* If the browser can’t render, we’ll show the fallback below */}
          </object>
        ) : (
          <div className="grid place-items-center rounded-xl border border-neutral-800 bg-neutral-900/50 p-8">
            <p className="mb-4 text-sm text-neutral-300">
              Your browser couldn’t preview the PDF.
            </p>
            <a
              href={pdfHref}
              className="rounded-lg bg-gradient-to-r from-emerald-400 to-cyan-500 px-4 py-2 text-sm font-semibold text-neutral-950"
              target="_blank"
              rel="noreferrer"
            >
              Open in new tab
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
