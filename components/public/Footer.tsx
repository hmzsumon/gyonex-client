/* ── Footer ─────────────────────────────────────────────────────────────────── */

import React from "react";
import Container from "./Container";

import LogoImg from "@/public/logo/gyonex1.png";
import Logo from "../branding/Logo";

const Footer: React.FC = () => (
  <footer className="border-t border-neutral-900 bg-neutral-950 py-12 text-neutral-300">
    <Container>
      <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 md:grid-cols-6">
        {[
          { h: "Accounts", l: ["Standard", "Zero", "Raw", "Demo"] },
          { h: "Markets", l: ["Forex", "Metals", "Energies", "Crypto"] },
          { h: "Platforms", l: ["Web", "iOS", "Android", "Desktop"] },
          { h: "Resources", l: ["Education", "Blog", "Status", "Affiliates"] },
          { h: "About", l: ["Company", "Careers", "Contact", "Legal"] },
          {
            h: "Support",
            l: ["Help center", "Security", "Report issue", "Community"],
          },
        ].map((c) => (
          <div key={c.h}>
            <h5 className="mb-3 text-sm font-semibold text-white">{c.h}</h5>
            <ul className="space-y-2 text-sm">
              {c.l.map((x) => (
                <li key={x}>
                  <a className="hover:text-white" href="#">
                    {x}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-neutral-900 pt-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2 text-sm">
          {/* ── Brand / logo ── */}
          <div>
            <Logo src={LogoImg} size="xl" width={120} />
          </div>
        </div>
        <p className="text-xs text-neutral-400">
          © {new Date().getFullYear()} Gyonex. All rights reserved.
        </p>
      </div>
    </Container>
  </footer>
);

export default Footer;
