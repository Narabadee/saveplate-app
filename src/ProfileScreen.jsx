import { useState, useEffect } from 'react';
import {
    User, Mail, Lock, Shield, Bell, Moon, Sun,
    ChevronRight, LogOut, Camera, Check, AlertTriangle,
    TrendingUp, Award, Leaf, Save, Settings, Sparkles, Heart, Store, BookOpen
} from 'lucide-react';
import { useAuth, useDarkMode, useToast, useFavorites } from './Shared';

const AVATARS = ['🦸', '🥗', '🥑', '🥦', '🍎', '🥕', '🍕', '🍰', '☕', '🍱'];

export default function ProfileScreen({ onNavigate }) {
    const { user, signOut, updateUser } = useAuth();
    const { dark, toggle } = useDarkMode();
    const { favorites } = useFavorites();
    const toast = useToast();
    
    const [view, setView] = useState('overview'); // 'overview' | 'account' | 'security'
    const [editing, setEditing] = useState(false);
    
    // Form States
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [password, setPassword] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [loading, setLoading] = useState(false);

    // Reset forms when view changes
    useEffect(() => {
        setName(user?.name || '');
        setEmail(user?.email || '');
        setPassword('');
        setNewPass('');
        setConfirmPass('');
        setEditing(false);
    }, [view, user]);

    if (!user) {
        return (
            <div className="min-h-screen bg-slate-50 dm-bg flex flex-col items-center justify-center p-8 text-center pt-24 pb-32">
                <div className="w-24 h-24 rounded-3xl bg-gray-100 flex items-center justify-center mb-6">
                    <User className="w-12 h-12 text-gray-300" />
                </div>
                <h2 className="text-2xl font-black text-gray-800 dm-text mb-2 tracking-tight">Access Denied</h2>
                <p className="text-gray-400 text-sm mb-10 max-w-xs">Sign in to view your hero profile and track your impact on the planet.</p>
                <button 
                    onClick={() => onNavigate('auth')}
                    className="px-10 py-4 rounded-2xl bg-brand-500 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-brand-200 active:scale-95 transition-all"
                >
                    Sign In Now
                </button>
            </div>
        );
    }

    const handleSignOut = () => {
        signOut();
        toast('👋 Signed out safely. See you soon!', 'info');
        onNavigate('auth');
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        await new Promise(r => setTimeout(r, 800));
        
        const result = updateUser({ name, email });
        if (result.success) {
            toast('✨ Profile updated successfully!');
            setEditing(false);
            setView('overview');
        } else {
            toast('❌ Update failed. Please try again.', 'error');
        }
        setLoading(false);
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (!password) return toast('Please enter current password', 'error');
        if (newPass !== confirmPass) return toast('New passwords do not match', 'error');
        if (newPass.length < 6) return toast('Password must be at least 6 characters', 'error');
        
        setLoading(true);
        await new Promise(r => setTimeout(r, 1000));
        
        if (password !== user.password) {
            setLoading(false);
            return toast('Current password incorrect', 'error');
        }

        updateUser({ password: newPass });
        toast('🔐 Password secured successfully!');
        setView('overview');
        setLoading(false);
    };

    const handleAvatarChange = (avatar) => {
        updateUser({ avatar });
        toast(`Cool choice! ${avatar}`);
    };

    const initials = user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

    return (
        <div className="min-h-screen bg-slate-50 dm-bg pb-32 page-fade-in relative overflow-hidden">
            
            {/* Background Texture */}
            <div className="absolute top-0 inset-x-0 h-64 bg-linear-to-b from-brand-500/10 dark:from-brand-900/20 to-transparent pointer-events-none" />

            {/* Header */}
            <header className="sticky top-0 z-50 glass-header px-6 pt-12 pb-6 flex items-center justify-between">
                <div>
                   <div className="flex items-center gap-2 mb-0.5">
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                        <span className="text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase tracking-widest">
                            {view === 'overview' ? 'Hero Profile' : view === 'account' ? 'Edit Profile' : 'Security'}
                        </span>
                    </div>
                    <h1 className="text-2xl font-black text-gray-900 dm-text italic">
                        {view === 'overview' ? 'Food Savior' : 'Settings'}
                    </h1>
                </div>
                {view !== 'overview' && (
                    <button onClick={() => setView('overview')} className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all border border-white/20">
                        <ChevronRight className="w-5 h-5 text-gray-400 rotate-180" />
                    </button>
                )}
            </header>

            <div className="px-6 py-6 space-y-8 relative z-10">
                
                {view === 'overview' && (
                    <>
                        {/* 1. Identity Card */}
                        <div className="glass-pane active-glass rounded-4xl p-6 border-white shadow-xl relative overflow-hidden card-stagger">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl -mr-12 -mt-12" />
                            
                            <div className="flex items-center gap-5 relative z-10">
                                <div className="relative group">
                                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-2xl">
                                        {user.avatar ? (
                                            <span className="text-4xl leading-none">{user.avatar}</span>
                                        ) : (
                                            <span className="text-2xl font-extrabold text-white">{initials}</span>
                                        )}
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 flex items-center justify-center">
                                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] font-black text-brand-600 dark:text-brand-400 uppercase tracking-widest mb-1">Authenticated Hero</p>
                                    <h2 className="text-xl font-black text-gray-900 dm-text truncate">{user.name}</h2>
                                    <div className="flex items-center gap-1.5 mt-1.5 opacity-60">
                                        <Mail className="w-3 h-3" />
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight truncate">{user.email}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Avatar Picker Overlay */}
                            <div className="mt-8 pt-6 border-t border-gray-100/5 dark:border-white/5">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">Hero Persona</p>
                                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                    {AVATARS.map(a => (
                                        <button 
                                            key={a}
                                            onClick={() => handleAvatarChange(a)}
                                            className={`shrink-0 w-11 h-11 rounded-2xl transition-all duration-300 flex items-center justify-center text-xl
                                            ${user.avatar === a ? 'bg-brand-500 scale-110 shadow-lg shadow-brand-200' : 'bg-white/40 dark:bg-white/5 border border-white/20 hover:scale-105'}`}
                                        >
                                            {a}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 2. Impact Dashboard Recap */}
                        <div className="grid grid-cols-2 gap-4 card-stagger" style={{ animationDelay: '0.1s' }}>
                            <div className="glass-pane rounded-3xl p-5 border-white shadow-sm flex flex-col gap-2">
                                <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                                    <TrendingUp className="w-4 h-4 text-orange-500" />
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tighter">8.2 <span className="text-lg">kg</span></p>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1">CO₂ Saved</p>
                                </div>
                            </div>
                            <div className="glass-pane rounded-3xl p-5 border-white shadow-sm flex flex-col gap-2">
                                <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center text-brand-500">
                                    <Heart className="w-4 h-4 fill-brand-500" />
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-brand-600 dark:text-brand-400 tracking-tighter">{favorites.length} <span className="text-lg">store{favorites.length !== 1 ? 's' : ''}</span></p>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1">Saved</p>
                                </div>
                            </div>
                        </div>

                        {/* 3. Navigation Groups */}
                        <div className="space-y-4 card-stagger" style={{ animationDelay: '0.2s' }}>
                            <div className="glass-pane rounded-3xl border-white shadow-sm overflow-hidden divide-y divide-gray-100 dark:divide-slate-800/50">
                                <ProfileItem 
                                    icon={<User className="w-4 h-4" />} 
                                    label="Account Settings" 
                                    sub="Name, Email, Personal Details"
                                    onClick={() => setView('account')}
                                />
                                <ProfileItem 
                                    icon={<Lock className="w-4 h-4" />} 
                                    label="Security" 
                                    sub="Password, Two-Factor, Privacy"
                                    onClick={() => setView('security')}
                                />
                            </div>

                            <div className="glass-pane rounded-3xl border-white shadow-sm overflow-hidden divide-y divide-gray-100 dark:divide-slate-800/50">
                                <div className="flex items-center justify-between p-4 px-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                            {dark ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-500" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-gray-800 dm-text">Dark Identity</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">System Appearance</p>
                                        </div>
                                    </div>
                                    <button onClick={toggle} className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${dark ? 'bg-brand-500 shadow-inner' : 'bg-gray-200'}`}>
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 ${dark ? 'left-6' : 'left-1'}`} />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between p-4 px-5">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${user.role === 'vendor' ? 'bg-brand-50 dark:bg-brand-900/20' : 'bg-blue-50 dark:bg-blue-900/20'}`}>
                                            {user.role === 'vendor'
                                                ? <Store className="w-4 h-4 text-brand-500" />
                                                : <BookOpen className="w-4 h-4 text-blue-500" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-gray-800 dm-text">
                                                {user.role === 'vendor' ? 'Vendor Account' : 'Student Account'}
                                            </p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                                                {user.role === 'vendor' ? 'Canteen Management Access' : 'Food Rescue Access'}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest ${user.role === 'vendor' ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                                        {user.role === 'vendor' ? 'Vendor' : 'Student'}
                                    </span>
                                </div>
                                <ProfileItem 
                                    icon={<Bell className="w-4 h-4" />} 
                                    label="Hero Alerts" 
                                    sub="Push Notifications, Deal Updates"
                                    toggle={true}
                                />
                            </div>

                            {/* Logout Group */}
                            <div className="glass-pane rounded-3xl border-white shadow-sm overflow-hidden card-stagger" style={{ animationDelay: '0.3s' }}>
                                <ProfileItem 
                                    icon={<LogOut className="w-4 h-4 text-red-500" />} 
                                    label="Access Session" 
                                    sub="Safely Sign Out of UniEat"
                                    onClick={handleSignOut}
                                    danger={true}
                                />
                            </div>

                        </div>
                    </>
                )}

                {view === 'account' && (
                    <form onSubmit={handleUpdateProfile} className="space-y-6 page-fade-in">
                        <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Hero Name</label>
                             <div className="relative group">
                                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full pl-12 pr-6 py-4 bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl text-sm font-bold text-gray-800 dm-text transition-all focus:ring-4 focus:ring-brand-500/5 outline-none focus:border-brand-300"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Communication Core (Email)</label>
                             <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-6 py-4 bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl text-sm font-bold text-gray-800 dm-text transition-all focus:ring-4 focus:ring-brand-500/5 outline-none focus:border-brand-300"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 rounded-4xl bg-linear-to-r from-brand-500 to-amber-600 text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-brand-200/50 active:scale-95 transition-all flex items-center justify-center gap-3 mt-4"
                        >
                            {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <><Check className="w-5 h-5" /> <span>Sync Profile</span></>}
                        </button>
                    </form>
                )}

                {view === 'security' && (
                    <form onSubmit={handleChangePassword} className="space-y-6 page-fade-in">
                        <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Current Protocol (Password)</label>
                             <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full px-6 py-4 bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl text-sm font-bold text-gray-800 dm-text transition-all focus:ring-4 focus:ring-brand-500/5 outline-none focus:border-brand-300"
                            />
                        </div>

                        <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Update Passphrase</label>
                             <input
                                type="password"
                                placeholder="Min. 6 characters"
                                value={newPass}
                                onChange={e => setNewPass(e.target.value)}
                                className="w-full px-6 py-4 bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl text-sm font-bold text-gray-800 dm-text transition-all focus:ring-4 focus:ring-brand-500/5 outline-none focus:border-brand-300"
                            />
                        </div>

                        <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Verify Identity</label>
                             <input
                                type="password"
                                placeholder="Ensure parity"
                                value={confirmPass}
                                onChange={e => setConfirmPass(e.target.value)}
                                className="w-full px-6 py-4 bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl text-sm font-bold text-gray-800 dm-text transition-all focus:ring-4 focus:ring-brand-500/5 outline-none focus:border-brand-300"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 rounded-4xl bg-linear-to-r from-brand-500 to-amber-600 text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-brand-200/50 active:scale-95 transition-all flex items-center justify-center gap-3 mt-4"
                        >
                            {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <><Shield className="w-5 h-5" /> <span>Secure Account</span></>}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

function ProfileItem({ icon, label, sub, onClick, toggle, danger }) {
    const [toggled, setToggled] = useState(true);
    
    return (
        <button 
            onClick={onClick || (toggle ? () => setToggled(t => !t) : null)}
            className={`w-full flex items-center justify-between p-4 px-5 transition-all group
                ${danger ? 'hover:bg-red-50/50 dark:hover:bg-red-900/10' : 'hover:bg-gray-50/50 dark:hover:bg-white/5'}`}
        >
            <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors 
                    ${danger ? 'bg-red-50 dark:bg-red-900/20 group-hover:bg-red-100' : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-brand-50 dark:group-hover:bg-brand-900/20'}`}>
                    <div className={`${danger ? 'text-red-500' : 'text-gray-500 group-hover:text-brand-600'} transition-colors`}>
                        {icon}
                    </div>
                </div>
                <div className="text-left">
                    <p className={`text-sm font-black dm-text ${danger ? 'text-red-600' : 'text-gray-800'}`}>{label}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{sub}</p>
                </div>
            </div>
            {toggle ? (
                <div className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${toggled ? 'bg-brand-500 shadow-inner' : 'bg-gray-200'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 ${toggled ? 'left-6' : 'left-1'}`} />
                </div>
            ) : (
                <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${danger ? 'text-red-300' : 'text-gray-300'}`} />
            )}
        </button>
    );
}

const RefreshCw = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
);
