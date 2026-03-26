interface InputCheckoutProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
  }
  
  export function InputCheckout({ label, ...props }: InputCheckoutProps) {
    return (
      <div className="space-y-2">
        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
          {label}
        </label>
        <input
          className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-emerald-500 focus:bg-white transition-all font-semibold text-slate-700"
          {...props}
        />
      </div>
    );
  }