/* ── How To Refer (3-step list) ───────────────────────────────────────────── */

"use client";

import { BadgeDollarSign, Link2, UserPlus2 } from "lucide-react";

const Step: React.FC<{
  icon: React.ReactNode;
  title: string;
  desc: string;
}> = ({ icon, title, desc }) => {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 rounded-full bg-neutral-900 p-1.5">{icon}</div>
      <div>
        <p className="text-sm font-medium text-neutral-100">{title}</p>
        <p className="text-xs text-neutral-400">{desc}</p>
      </div>
    </div>
  );
};

const HowToRefer: React.FC = () => {
  return (
    <section className="rounded-xl border border-neutral-900 bg-neutral-950 p-4">
      <h3 className="mb-3 text-sm font-semibold text-neutral-200">
        How to Refer
      </h3>

      <div className="space-y-4">
        <Step
          icon={<Link2 size={14} className="text-neutral-200" />}
          title="Share"
          desc="Send your referral link or code to friends"
        />
        <Step
          icon={<UserPlus2 size={14} className="text-neutral-200" />}
          title="Register"
          desc="Friends sign up using your link or code"
        />
        <Step
          icon={<BadgeDollarSign size={14} className="text-neutral-200" />}
          title="Earn"
          desc="Get commission when they activate their card or spend"
        />
      </div>
    </section>
  );
};

export default HowToRefer;
