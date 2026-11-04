
import { Shield } from "lucide-react";

export default function Header() {
    return (
        <header className="hidden h-20 items-center justify-between md:flex border-b border-slate-200 bg-white px-8">

            <div>
                <p className="text-xs font-medium uppercase tracking-widest text-slate-400">
                    Credit Risk Intelligence
                </p>

                <h2 className="mt-1 text-lg font-semibold text-slate-800">
                    Portfolio Overview
                </h2>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
                <Shield size={15} />
                <span>Experimental Model</span>
            </div>

        </header>
    );
}
