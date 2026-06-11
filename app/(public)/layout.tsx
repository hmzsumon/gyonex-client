import Footer from "@/components/public/Footer";
import Navbar from "@/components/public/Navbar";
import React from "react";

const PublicLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <Navbar />
      <div>{children}</div>
      <Footer />
    </main>
  );
};

export default PublicLayout;
