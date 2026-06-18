import React from "react";
import Starfield from "@/components/Starfield";

export const metadata = {
  title: "Admin Portal | Cosmic Chronicle",
  description: "Secure administrative dashboard for managing the Cosmic blog and writers.",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#04020a] text-white">
      {/* Background Starfield */}
      <Starfield />
      
      {/* Dynamic admin content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
