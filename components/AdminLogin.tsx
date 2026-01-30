
import React, { useState } from 'react';

interface Props {
  onLogin: () => void;
}

const AdminLogin: React.FC<Props> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Real tizimda buni server orqali tekshirish lozim.
    // Hozircha oddiy login/parol: admin / ranch2026
    if (username === 'admin' && password === 'ranch2026') {
      onLogin();
    } else {
      setError('Login yoki parol noto\'g\'ri!');
    }
  };

  return (
    <div className="p-8 max-w-sm mx-auto flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 shadow-2xl">
        <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <h2 className="text-3xl font-black text-slate-800 mb-2">Ma'muriyat</h2>
      <p className="text-slate-400 text-sm mb-8 font-medium">Xavfsiz tizimga kirish</p>

      <form onSubmit={handleLogin} className="w-full space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Login</label>
          <input 
            type="text" 
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full p-4 rounded-2xl border-2 border-slate-100 bg-white focus:border-indigo-600 outline-none transition-all font-bold"
            placeholder="admin"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Parol</label>
          <input 
            type="password" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-4 rounded-2xl border-2 border-slate-100 bg-white focus:border-indigo-600 outline-none transition-all font-bold"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p className="text-red-500 text-xs font-bold text-center animate-bounce">{error}</p>
        )}

        <button 
          type="submit"
          className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl hover:bg-black active:scale-95 transition-all mt-4"
        >
          KIRISH
        </button>
      </form>
      <p className="mt-8 text-[10px] text-slate-400 font-bold uppercase tracking-tighter italic">Authorized Personnel Only</p>
    </div>
  );
};

export default AdminLogin;
