/* ── Navbar ─────────────────────────────────────────────────────────────────── */

import Link from "next/link";
import React from "react";
import Logo from "../branding/Logo";
import Button from "./Button";
import Container from "./Container";

import LogoImg from "@/public/logo/gyonex1.png";

const Navbar: React.FC = () => (
  <header className="sticky top-0 z-50 border-b border-neutral-900/60 bg-neutral-950/80 backdrop-blur">
    <Container className="flex h-16 items-center justify-between">
      <Link href="/" className="flex items-center gap-3">
        <Logo src={LogoImg} size="xl" width={120} />
      </Link>

      <div className="flex items-center gap-3">
        <Link
          href={{ pathname: "/register-login", query: { tab: "signin" } }}
          scroll={false}
        >
          <Button
            as="span"
            className="border border-neutral-800 bg-neutral-900 text-neutral-200"
          >
            Log in
          </Button>
        </Link>

        <Link
          href={{ pathname: "/register-login", query: { tab: "create" } }}
          scroll={false}
        >
          <Button
            as="span"
            className="bg-gradient-to-r from-emerald-400 to-cyan-500 text-neutral-950"
          >
            Register
          </Button>
        </Link>
      </div>
    </Container>
  </header>
);

export default Navbar;
