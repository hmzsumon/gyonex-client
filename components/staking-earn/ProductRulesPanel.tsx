"use client";

const ProductRulesPanel = () => {
  return (
    <div className="rounded-2xl bg-[#111822] border border-white/10 p-4">
      <h3 className="text-sm font-semibold text-white/85">Product Rules</h3>

      <ul className="mt-3 space-y-2 text-sm text-white/60 list-disc pl-5">
        <li>
          Rewards are calculated based on your subscription amount and selected
          term.
        </li>
        <li>APR may vary by tier and platform rules.</li>
        <li>Early redemption (if applicable) may reduce rewards.</li>
        <li>Auto-Subscribe enabled থাকলে term শেষে আবার renew হতে পারে.</li>
      </ul>
    </div>
  );
};

export default ProductRulesPanel;
