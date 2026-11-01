
import type { Metadata } from "next";

import "./globals.css";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export const metadata: Metadata = {
  title: "Credit Intelligence",
  description: "Housing Loan Credit Risk Analytics Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#F5F7FA] text-slate-900">

        <div className="flex min-h-screen">

          <Sidebar />

          <div className="flex min-w-0 flex-1 flex-col">

            <Header />

            <main className="flex-1 p-8">
              {children}
            </main>

          </div>

        </div>

      </body>
    </html>
  );
}
