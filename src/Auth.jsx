import { useState } from 'react';
import {
    LogIn, UserPlus, Mail, Lock, Eye, EyeOff, User, ChevronLeft, Leaf, AlertTriangle, Sparkles, ArrowRight
} from 'lucide-react';
import { useAuth, useToast } from './Shared';

export default function Auth({ onBack, onSuccess }) {
    const [tab, setTab] = useState('signin'); // 'signin' | 'signup'
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn, signUp } = useAuth();
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!email.trim() || !password.trim()) {
            setError('Please fill in all fields.');
            setLoading(false);
            return;
        }
        if (tab === 'signup' && !name.trim()) {
            setError('Please enter your name.');
            setLoading(false);
            return;
        }

        await new Promise(r => setTimeout(r, 600));

        const result = tab === 'signin' 
            ? signIn(email.trim(), password)
            : signUp(name.trim(), email.trim(), password);

        setLoading(false);
        if (result.success) {
            toast(tab === 'signin' ? '👋 Welcome back!' : '🎉 Welcome to SavePlate!');
            onSuccess && onSuccess();
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dm-bg flex flex-col page-fade-in pb-12 overflow-hidden relative">
            
            {/* Background Blobs for consistency */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10 dark:opacity-5">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-brand-200 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-100 rounded-full blur-[100px]" />
                <div className="absolute top-[30%] left-[10%] w-[30%] h-[30%] bg-amber-100 rounded-full blur-[80px]" />
            </div>

            {/* Premium Glass Header */}
            <header className="sticky top-0 z-50 glass-header px-6 pt-12 pb-6">
                <div className="flex items-center gap-3 mb-2">
                    <button onClick={onBack} className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all active:scale-90">
                        <ChevronLeft className="w-5 h-5 text-gray-700 dm-text" />
                    </button>
                    <div className="flex items-center gap-2 mb-0.5">
                        <Leaf className="w-4 h-4 text-brand-600" />
                        <span className="text-brand-600 dark:text-brand-400 text-[10px] font-black uppercase tracking-widest">Authentication</span>
                    </div>
                </div>
                <h1 className="text-2xl font-black text-gray-900 dm-text leading-tight px-1 italic">
                    {tab === 'signin' ? 'Welcome Back!' : 'Join the Movement'}
                </h1>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1 px-1">
                    {tab === 'signin' ? 'Rescue mission awaits' : 'Start your hero journey'}
                </p>
            </header>

            <div className="px-6 py-8 flex-1 relative z-10 flex flex-col">
                
                {/* Tabs (Sliding Glass Style) */}
                <div className="glass-pane p-1 rounded-2xl flex gap-1 border-white shadow-sm mb-10 overflow-hidden">
                    {['signin', 'signup'].map((t) => (
                        <button 
                            key={t}
                            onClick={() => setTab(t)}
                            className={`flex-1 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2
                            ${tab === t 
                                ? 'bg-white dark:bg-gray-800 shadow-lg text-brand-600 dark:text-white scale-[1.02]' 
                                : 'text-gray-400 hover:text-gray-600 dm-text-secondary'}`}
                        >
                            {t === 'signin' ? <LogIn className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                            {t === 'signin' ? 'Sign In' : 'New Account'}
                        </button>
                    ))}
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6 flex-1">
                    {tab === 'signup' && (
                        <div className="space-y-2 card-stagger">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Character Name</label>
                            <div className="relative group">
                                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full pl-12 pr-6 py-4 bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl text-sm font-bold text-gray-800 dm-text transition-all focus:ring-4 focus:ring-brand-500/5 outline-none focus:border-brand-300"
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-2 card-stagger" style={{ animationDelay: '0.1s' }}>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Secure Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                            <input
                                type="email"
                                placeholder="hero@saveplate.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full pl-12 pr-6 py-4 bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl text-sm font-bold text-gray-800 dm-text transition-all focus:ring-4 focus:ring-brand-500/5 outline-none focus:border-brand-300"
                            />
                        </div>
                    </div>

                    <div className="space-y-2 card-stagger" style={{ animationDelay: '0.2s' }}>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Passphrase</label>
                        <div className="relative group">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                            <input
                                type={showPass ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full pl-12 pr-12 py-4 bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl text-sm font-bold text-gray-800 dm-text transition-all focus:ring-4 focus:ring-brand-500/5 outline-none focus:border-brand-300"
                            />
                            <button type="button" onClick={() => setShowPass(s => !s)}
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors">
                                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-2xl px-5 py-4 animate-shake">
                            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                            <p className="text-red-700 dark:text-red-400 text-xs font-bold uppercase tracking-tight">{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 rounded-4xl bg-linear-to-r from-brand-500 to-amber-600 text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-brand-200/50 active:scale-95 transition-all flex items-center justify-center gap-3 mt-4"
                    >
                        {loading ? (
                            <RefreshCw className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <span>{tab === 'signin' ? 'Verify Identity' : 'Commission Account'}</span>
                                <ArrowRight className="w-4 h-4 animate-bounce-horizontal" />
                            </>
                        )}
                    </button>
                </form>

                {/* Trust / Stats Footer */}
                <div className="mt-12 py-8 border-t border-gray-100 dark:border-gray-800 text-center animate-fade-in">
                    <div className="flex items-center justify-center gap-2 text-amber-500 font-black text-[10px] uppercase tracking-widest mb-4">
                        <Sparkles className="w-4 h-4" />
                        <span>Trusted by 12,402 Saviors</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-8 opacity-60">
                        <div className="flex flex-col items-center">
                            <span className="text-lg font-black text-gray-800 dm-text">840 kg</span>
                            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">CO2 Impact Daily</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-lg font-black text-gray-800 dm-text">32 Cities</span>
                            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Network Reach</span>
                        </div>
                    </div>

                    <p className="mt-10 text-[9px] text-gray-400 font-bold leading-relaxed max-w-[220px] mx-auto uppercase tracking-tighter">
                        Protected by SavePlate Security Protocols. All rights reserved 2026.
                    </p>
                </div>
            </div>
        </div>
    );
}

const RefreshCw = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
);
