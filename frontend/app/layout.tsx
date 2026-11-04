
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

        <div className="flex min-h-screen min-w-0 flex-col md:flex-row">

          <Sidebar />

          <div className="flex min-w-0 w-full flex-1 flex-col">

            <Header />

            <main className="min-w-0 w-full flex-1 px-4 py-5 sm:px-6 sm:py-7 lg:p-8">
              {children}
            </main>

          </div>

        </div>

      </body>
    </html>
  );
}
