interface SelectCheckoutProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    children: React.ReactNode;
  }
  
  export function SelectCheckout({ label, children, ...props }: SelectCheckoutProps) {
    return (
      <div className="space-y-2">
        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
          {label}
        </label>
        <select
          className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold text-slate-700 appearance-none"
          {...props}
        >
          {children}
        </select>
      </div>
    );
  }