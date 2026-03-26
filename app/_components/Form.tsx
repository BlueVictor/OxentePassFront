'use client'

import { ReactNode } from "react";

type FormProps = {
    title: string;
    action?: string | ((formData: FormData) => void | Promise<void>);
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    children: ReactNode;
    buttons?: ReactNode;
    footer?: ReactNode;
};

export default function Form({
    title,
    action,
    children,
    buttons,
    footer,
}: FormProps) {
    return (
        <section className="relative isolate overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">

            <div className="relative z-10 border-b border-slate-100 bg-gray-100 px-6 py-6 text-gray-600 sm:px-8">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    {title}
                </h1>
            </div>

            <div className="relative z-10 p-6 sm:p-8">
                <form
                    action={action}
                    className="space-y-5"
                >
                    {children}

                    {buttons ? (
                        <div className="pt-2 text-center">
                            {buttons}
                        </div>
                    ) : null}
                </form>

                {footer ? (
                    <div className="mt-6 border-t border-slate-200 pt-5 text-center">
                        {footer}
                    </div>
                ) : null}
            </div>
        </section>
    );
}
