import VerifyEmailForm from "@/components/register-login/VerifyEmailForm";

const VerifyMailPage = () => {
  return (
    <section className="mx-auto max-w-xl px-2 py-10">
      <h1 className="mb-6 text-center text-3xl font-extrabold tracking-tight text-white">
        Verify your email
      </h1>

      <div className="rounded-lg border border-neutral-800 bg-neutral-900/60 px-2 py-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset,0_10px_50px_-20px_rgba(0,0,0,0.6)]">
        <VerifyEmailForm />
      </div>
    </section>
  );
};

export default VerifyMailPage;
