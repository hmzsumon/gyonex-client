"use client";

/* ────────── Section: Imports ────────── */
import RegisterForm from "@/components/register-login/RegisterForm";
import SignInForm from "@/components/register-login/SignInForm";
import { TabButton } from "@/components/register-login/Tabs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Tab = "signin" | "create";

/* ────────── Component: AuthPage ────────── */
export default function AuthPage(): JSX.Element {
  /* ── URL state ── */
  const router = useRouter();
  const searchParams = useSearchParams();

  /* ── Derive tab from URL ── */
  const tabFromUrl = useMemo<Tab>(() => {
    const t = searchParams.get("tab");
    return t === "create" ? "create" : "signin";
  }, [searchParams]);

  /* ── Local state ── */
  const [tab, setTab] = useState<Tab>(tabFromUrl);

  /* ── Keep state in sync with URL ── */
  useEffect(() => {
    setTab(tabFromUrl);
  }, [tabFromUrl]);

  /* ── Helper: update tab + URL without pushing history ── */
  const setTabAndUrl = (next: Tab) => {
    const sp = new URLSearchParams(Array.from(searchParams.entries()));
    sp.set("tab", next);
    router.replace(`?${sp.toString()}`, { scroll: false });
    setTab(next);
  };

  return (
    <section className="mx-auto max-w-xl px-2 py-8">
      {/* ── Title ── */}
      <h1 className="mb-6 text-center text-2xl font-extrabold tracking-tight text-white">
        Welcome to Gyonex
      </h1>

      {/* ── Tab Controls ── */}
      <div className="mb-6 flex justify-center gap-8">
        <TabButton
          active={tab === "signin"}
          onClick={() => setTabAndUrl("signin")}
        >
          Sign in
        </TabButton>
        <TabButton
          active={tab === "create"}
          onClick={() => setTabAndUrl("create")}
        >
          Create an account
        </TabButton>
      </div>

      {/* ── Card ── */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset,0_10px_50px_-20px_rgba(0,0,0,0.6)]">
        {tab === "signin" ? (
          <SignInForm onSuccess={() => setTabAndUrl("signin")} />
        ) : (
          <RegisterForm onSuccess={() => setTabAndUrl("signin")} />
        )}
      </div>
    </section>
  );
}
