"use client";

import Row from "@/components/settings/Row";
import Section from "@/components/settings/Section";
import { Bell, Keyboard, ShieldCheck } from "lucide-react";

/* ── Security main screen ─────────────────────────────────── */
export default function SecurityPage() {
  return (
    <div className="mx-auto max-w-2xl pb-8 pt-4">
      {/* header */}
      <h1 className="px-4 pb-2 text-2xl font-bold text-neutral-100">
        Settings
      </h1>

      {/* ── Preferences ─────────────────────────────────────── */}
      <Section title="Preferences">
        <Row
          href="/settings/security/notifications"
          icon={<Bell className="h-5 w-5 text-neutral-300" />}
          title="Notifications"
        />
      </Section>

      {/* ── Security ────────────────────────────────────────── */}
      <Section title="Security">
        <Row
          href="/settings/security/2-step"
          icon={<ShieldCheck className="h-5 w-5 text-neutral-300" />}
          title="Security type"
          end={<span className="text-neutral-300">Email</span>}
        />
        <Row
          href="/settings/security/set-pin"
          icon={<Keyboard className="h-5 w-5 text-neutral-300" />}
          title="Set new PIN"
        />
      </Section>
    </div>
  );
}
