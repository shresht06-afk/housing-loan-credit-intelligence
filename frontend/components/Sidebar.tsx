"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    LayoutDashboard,
    ClipboardCheck,
    ChartNoAxesColumn,
    FileText,
    ShieldCheck,
} from "lucide-react";

const navigation = [
    { name: "Overview", href: "/", icon: LayoutDashboard },
    { name: "Risk Assessment", href: "/assessment", icon: ClipboardCheck },
    { name: "Analytics", href: "/analytics", icon: ChartNoAxesColumn },
    { name: "Reports", href: "/reports", icon: FileText },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="flex h-screen w-64 shrink-0 flex-col bg-[#172536] text-white">
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

            <nav className="flex-1 px-3 py-6">
                <p className="mb-4 px-3 text-[10px] font-semibold tracking-[0.2em] text-slate-500">
                    WORKSPACE
                </p>

                <div className="space-y-1">
                    {navigation.map((item) => {
                        const Icon = item.icon;

                        const active =
                            item.href === "/"
                                ? pathname === "/"
                                : pathname.startsWith(item.href);

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 rounded-md px-3 py-3 text-sm transition-colors ${active
                                        ? "bg-[#314A60] text-white"
                                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                <Icon size={18} />
                                {item.name}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            <div className="border-t border-white/10 px-6 py-5">
                <p className="text-xs text-slate-400">
                    Research Prototype
                </p>
                <p className="mt-1 text-xs text-slate-500">
                    Model Version 2.0
                </p>
            </div>
        </aside>
    );
}