'use client'

import Link from "next/link";

type ActionCardProps = {
    href: string;
    badge: string;
    title: string;
    description: string;
};

export default function ActionCard({ href, badge, title, description }: ActionCardProps) {
    return (
        <Link
            href={href}
            className="group block overflow-hidden rounded-[2rem] border border-emerald-200 bg-gradient-to-r from-emerald-50 to-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
        >
            <div className="flex items-center justify-between gap-4">
                <div>
                    <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                        {badge}
                    </span>

                    <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
                        {title}
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                        {description}
                    </p>
                </div>

                <div className="text-2xl text-emerald-600 transition group-hover:translate-x-1">
                    {">"}
                </div>
            </div>
        </Link>
    );
}
