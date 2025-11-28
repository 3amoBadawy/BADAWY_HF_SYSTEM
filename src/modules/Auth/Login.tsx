
import React, { useState } from 'react';
import { Armchair, Lock, Mail, ArrowLeft, AlertCircle } from 'lucide-react';
import { User } from '../../types';
import { db } from '../../services/database';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('admin@furniflow.com');
  const [password, setPassword] = useState('admin');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const users = db.users.getAll();
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        onLogin(user);
      } else {
        setError('بيانات الدخول غير صحيحة. حاول مرة أخرى.');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="p-8 pb-6 flex flex-col items-center border-b border-slate-100">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-200">
            <Armchair className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">أهلاً بك</h1>
          <p className="text-slate-500 mt-1">سجل دخولك لنظام FurniFlow</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 flex items-center justify-center">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700 ml-1">البريد الإلكتروني</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pr-10 pl-4 py-3 bg-white text-slate-900 placeholder-slate-400 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="name@company.com"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
             <label className="text-sm font-semibold text-slate-700 ml-1">كلمة المرور</label>
             <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pr-10 pl-4 py-3 bg-white text-slate-900 placeholder-slate-400 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 border-slate-300" />
                <span className="text-slate-600">تذكرني</span>
              </label>
              <button type="button" onClick={() => setShowHint(!showHint)} className="text-indigo-600 font-medium hover:text-indigo-700">نسيت كلمة المرور؟</button>
            </div>
            
            {showHint && (
                <div className="text-xs bg-amber-50 text-amber-700 p-3 rounded border border-amber-100 flex gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>الافتراضي: <strong>admin@furniflow.com</strong> / <strong>admin</strong>.</span>
                </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>دخول <ArrowLeft className="w-5 h-5" /></>
            )}
          </button>
        </form>

        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-400">
          نظام مؤسسي آمن • v2.42.0
        </div>
      </div>
    </div>
  );
};

export default Login;
