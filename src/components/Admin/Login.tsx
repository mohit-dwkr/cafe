import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Lock, Mail, Loader2, Coffee } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      alert("Login Failed: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 p-10 border border-slate-100">
        <div className="text-center mb-10">
          <div className="bg-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-200">
            <Coffee className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Admin Panel</h2>
          <p className="text-slate-400 mt-2 font-medium text-sm">Please sign in to manage your cafe</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              required type="email" placeholder="Admin Email" 
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 font-medium transition-all"
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              required type="password" placeholder="Password" 
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 font-medium transition-all"
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            disabled={loading}
            className="w-full py-4 bg-orange-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-orange-100 hover:bg-orange-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Secure Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;