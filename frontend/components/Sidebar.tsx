"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    LayoutDashboard,
    ClipboardCheck,
    ChartNoAxesColumn,
    FileText,
    ShieldCheck,
    Menu,
    X,
} from "lucide-react";

const navigation = [
    { name: "Overview", href: "/", icon: LayoutDashboard },
    { name: "Risk Assessment", href: "/assessment", icon: ClipboardCheck },
    { name: "Analytics", href: "/analytics", icon: ChartNoAxesColumn },
    { name: "Reports", href: "/reports", icon: FileText },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    const renderNavigation = (mobile: boolean) => (
        <nav
            aria-label={mobile ? "Mobile navigation" : "Workspace navigation"}
            className="space-y-1"
        >
            {navigation.map((item) => {
                const Icon = item.icon;

                const active =
                    item.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(item.href);

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={
                            "flex items-center gap-3 rounded-md px-3 py-3 text-sm transition-colors " +
                            (active
                                ? "bg-[#314A60] text-white"
                                : "text-slate-300 hover:bg-white/10 hover:text-white")
                        }
                    >
                        <Icon size={18} />
                        <span>{item.name}</span>
                    </Link>
                );
            })}
        </nav>
    );

    return (
        <>
            {/* Mobile navigation */}
            <div className="bg-[#172536] text-white md:hidden print:hidden">
                <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
                    <Link
                        href="/"
                        onClick={() => setMobileOpen(false)}
                        className="flex min-w-0 items-center gap-3"
                    >
                        <div className="shrink-0 rounded-md bg-[#314A60] p-2">
                            <ShieldCheck size={20} />
                        </div>

                        <div className="min-w-0">
                            <p className="text-xs font-semibold tracking-wide">
                                CREDIT INTELLIGENCE
                            </p>
                            <p className="mt-1 text-[11px] text-slate-400">
                                Risk Analytics Platform
                            </p>
                        </div>
                    </Link>

                    <button
                        type="button"
                        aria-label={
                            mobileOpen
                                ? "Close navigation"
                                : "Open navigation"
                        }
                        aria-expanded={mobileOpen}
                        aria-controls="mobile-navigation"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="shrink-0 rounded-md border border-white/20 p-2"
                    >
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {mobileOpen && (
                    <div id="mobile-navigation" className="px-3 py-3">
                        {renderNavigation(true)}
                    </div>
                )}
            </div>

            {/* Desktop sidebar */}
            <aside className="hidden h-screen w-64 shrink-0 flex-col overflow-y-auto bg-[#172536] text-white md:sticky md:top-0 md:flex print:hidden">
                <div className="border-b border-white/10 px-6 py-7">
                    <div className="flex items-center gap-3">
                        <div className="rounded-md bg-[#314A60] p-2">
                            <ShieldCheck size={21} />
                        </div>

                        <div>
                            <h1 className="text-sm font-semibold tracking-wide">
                                CREDIT INTELLIGENCE
                            </h1>
                            <p className="mt-1 text-xs text-slate-400">
                                Risk Analytics Platform
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 px-3 py-6">
                    <p className="mb-4 px-3 text-[10px] font-semibold tracking-[0.2em] text-slate-500">
                        WORKSPACE
                    </p>
                    {renderNavigation(false)}
                </div>

                <div className="border-t border-white/10 px-6 py-5">
                    <p className="text-xs text-slate-400">
                        Research Prototype
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                        Model Version 2.0
                    </p>
                </div>
            </aside>
        </>
    );
}
