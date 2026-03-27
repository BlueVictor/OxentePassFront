'use client'

import { useRouter } from "next/navigation";
import { chamadaAPI } from "../../backend/chamadaPadrao";
import { useState } from "react";
import Link from "next/link";
import { useToast } from "../_components/ToastProvider";
import { Lock, Fingerprint, ArrowRight, UserPlus, Mail, User } from "lucide-react";

export default function CadastroPage() {
  const router = useRouter();
  const { showToast } = useToast();
  
  const [focoAtivo, setFocoAtivo] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    email: "",
    senha: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);

    try {
      const response = await chamadaAPI("/usuario", "POST", formData);

      if (!response) {
        showToast("Não foi possível realizar o cadastro com os dados informados.", "error");
        setCarregando(false);
        return;
      }

      showToast("Cadastro realizado com sucesso!", "success");
      router.push("/login");
      router.refresh();
    } catch (error) {
      showToast("Ocorreu um erro interno. Tente novamente.", "error");
      setCarregando(false);
    }
  };

  return (
    <div className="fixed inset-0 pt-[80px] bg-slate-50 flex items-center justify-center overflow-hidden z-0">
      
      <div 
        className="bg-white rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.05)] border border-slate-100 relative z-10"
        style={{ width: '100%', maxWidth: '600px', padding: '32px', boxSizing: 'border-box', margin: '0 16px' }}
      >
        
        <div className="text-center mb-6">
          <div className="bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-emerald-100" style={{ width: '56px', height: '56px' }}>
            <UserPlus className="w-7 h-7 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-1">Criar Conta</h2>
          <p className="text-xs font-medium text-slate-400">Preencha os dados para se cadastrar.</p>
        </div>

        <form onSubmit={handleSubmit}>
          
          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="nome" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block mb-2">
              Nome Completo
            </label>
            <div style={{ position: 'relative', width: '100%' }}>
              <div 
                style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}
                className={`transition-colors duration-300 ${focoAtivo === 'nome' ? 'text-emerald-500' : 'text-slate-400'}`}
              >
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                name="nome"
                id="nome"
                required
                value={formData.nome}
                onChange={handleChange}
                onFocus={() => setFocoAtivo('nome')}
                onBlur={() => setFocoAtivo(null)}
                placeholder="Como deseja ser chamado?"
                style={{ width: '100%', padding: '14px 16px 14px 48px', boxSizing: 'border-box' }}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold text-slate-700 placeholder:text-slate-300 text-sm"
              />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="cpf" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block mb-2">
              Documento (CPF)
            </label>
            <div style={{ position: 'relative', width: '100%' }}>
              <div 
                style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}
                className={`transition-colors duration-300 ${focoAtivo === 'cpf' ? 'text-emerald-500' : 'text-slate-400'}`}
              >
                <Fingerprint className="w-5 h-5" />
              </div>
              <input
                type="text"
                name="cpf"
                id="cpf"
                required
                value={formData.cpf}
                onChange={handleChange}
                onFocus={() => setFocoAtivo('cpf')}
                onBlur={() => setFocoAtivo(null)}
                maxLength={11}
                placeholder="Apenas números"
                style={{ width: '100%', padding: '14px 16px 14px 48px', boxSizing: 'border-box' }}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold text-slate-700 placeholder:text-slate-300 text-sm"
              />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="email" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block mb-2">
              E-mail
            </label>
            <div style={{ position: 'relative', width: '100%' }}>
              <div 
                style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}
                className={`transition-colors duration-300 ${focoAtivo === 'email' ? 'text-emerald-500' : 'text-slate-400'}`}
              >
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                name="email"
                id="email"
                required
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocoAtivo('email')}
                onBlur={() => setFocoAtivo(null)}
                placeholder="seu@email.com"
                style={{ width: '100%', padding: '14px 16px 14px 48px', boxSizing: 'border-box' }}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold text-slate-700 placeholder:text-slate-300 text-sm"
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="senha" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block mb-2">
              Criar Senha
            </label>
            <div style={{ position: 'relative', width: '100%' }}>
              <div 
                style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}
                className={`transition-colors duration-300 ${focoAtivo === 'senha' ? 'text-emerald-500' : 'text-slate-400'}`}
              >
                <Lock className="w-5 h-5" />
              </div>
              <input
                type="password"
                name="senha"
                id="senha"
                required
                value={formData.senha}
                onChange={handleChange}
                onFocus={() => setFocoAtivo('senha')}
                onBlur={() => setFocoAtivo(null)}
                minLength={8}
                placeholder="Mínimo de 8 caracteres"
                style={{ width: '100%', padding: '14px 16px 14px 48px', boxSizing: 'border-box' }}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold text-slate-700 placeholder:text-slate-300 text-sm"
              />
            </div>
          </div>

          <div style={{ paddingTop: '8px' }}>
            <button
              type="submit"
              disabled={carregando}
              style={{ width: '100%', padding: '16px', boxSizing: 'border-box' }}
              className="group relative flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-lg shadow-emerald-200 transition-all active:scale-[0.98] disabled:bg-slate-300 disabled:shadow-none"
            >
              <span>{carregando ? "Finalizando..." : "Finalizar Cadastro"}</span>
              {!carregando && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </div>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <span className="text-[11px] font-medium text-slate-400">Já tem uma conta? </span>
          <Link
            href="/login"
            className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 uppercase tracking-wider ml-1"
          >
            Faça login aqui
          </Link>
        </div>

      </div>
    </div>
  );
}