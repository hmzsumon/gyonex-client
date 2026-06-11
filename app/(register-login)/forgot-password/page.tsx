import ForgotPasswordForm from "@/components/register-login/ForgetPassForm";

const ForgotPasswordPage = () => {
  return (
    <section className="mx-auto max-w-xl px-2 py-8">
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset,0_10px_50px_-20px_rgba(0,0,0,0.6)]">
        <ForgotPasswordForm />
      </div>
    </section>
  );
};

export default ForgotPasswordPage;
