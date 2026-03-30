import { useState, useEffect, useCallback, useRef, createContext, useContext } from 'react';
import {
    ShoppingBag, Store, BarChart3, ChevronLeft, Clock, Star, Flame,
    Leaf, TrendingUp, Award, CheckCircle2, AlertTriangle, Package,
    Minus, Plus, ToggleLeft, ToggleRight, Heart, Bell,
    Sparkles, Timer, Shield, MapPin, ChevronRight, Search,
    Sun, Moon, RefreshCw, Map, List, History, X, Cake, Utensils, Coffee, Pizza, Salad,
    User, LogOut, LogIn, UserPlus, Lock, Eye, EyeOff, ChevronDown
} from 'lucide-react';

// ─── Contexts ───────────────────────────────────────────────────────────────────
const ToastContext = createContext();
const DarkModeContext = createContext();
const AuthContext = createContext();
const NotificationContext = createContext();
const FavoritesContext = createContext();

export const useToast = () => useContext(ToastContext);
export const useDarkMode = () => useContext(DarkModeContext);
export const useAuth = () => useContext(AuthContext);
export const useNotifications = () => useContext(NotificationContext);
export const useFavorites = () => useContext(FavoritesContext);
export const useBusinessMode = () => {
    const { businessMode, toggleBusinessMode } = useAuth();
    return { businessMode, toggleBusinessMode };
};

// ─── Toast Provider ─────────────────────────────────────────────────────────────
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const addToast = useCallback((message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type, exiting: false }]);
        setTimeout(() => {
            setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
            setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 300);
        }, 2500);
    }, []);
    return (
        <ToastContext.Provider value={addToast}>
            {children}
            <div className="fixed top-0 left-0 right-0 z-[9999] flex flex-col items-center pointer-events-none">
                {toasts.map(t => (
                    <div key={t.id} className={`mx-4 mt-3 px-4 py-3 rounded-2xl shadow-lg flex items-center gap-2.5 pointer-events-auto max-w-sm w-full
            ${t.type === 'success' ? 'bg-brand-600 text-white' : t.type === 'error' ? 'bg-red-500 text-white' : 'bg-gray-800 text-white'}
            ${t.exiting ? 'toast-out' : 'toast-in'}`}>
                        {t.type === 'success' && <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
                        {t.type === 'error' && <AlertTriangle className="w-5 h-5 flex-shrink-0" />}
                        {t.type === 'info' && <Sparkles className="w-5 h-5 flex-shrink-0" />}
                        <span className="text-sm font-medium">{t.message}</span>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

// ─── Dark Mode Provider ─────────────────────────────────────────────────────────
export function DarkModeProvider({ children }) {
    const [dark, setDark] = useState(false);

    useEffect(() => {
        if (dark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [dark]);

    const toggle = useCallback(() => {
        setDark(d => !d);
    }, []);
    return <DarkModeContext.Provider value={{ dark, toggle }}>{children}</DarkModeContext.Provider>;
}

// ─── Auth Provider ──────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            const stored = localStorage.getItem('saveplate_user');
            return stored ? JSON.parse(stored) : null;
        } catch { return null; }
    });

    const signUp = useCallback((name, email, password) => {
        const newUser = {
            id: Date.now(),
            name,
            email,
            password, // mock — never do this in production
            joinedAt: new Date().toISOString(),
        };
        // Store all users for login lookup
        const users = JSON.parse(localStorage.getItem('saveplate_users') || '[]');
        const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (exists) return { success: false, error: 'An account with this email already exists.' };
        users.push(newUser);
        localStorage.setItem('saveplate_users', JSON.stringify(users));
        localStorage.setItem('saveplate_user', JSON.stringify(newUser));
        setUser(newUser);
        return { success: true };
    }, []);

    const signIn = useCallback((email, password) => {
        // Pre-seed test account for the user's testing
        const users = JSON.parse(localStorage.getItem('saveplate_users') || '[]');
        const testUser = {
            id: 'test-account',
            name: 'Test Hero',
            email: 'test@gmail.com',
            password: '123456',
            joinedAt: new Date().toISOString(),
        };
        const exists = users.find(u => u.email.toLowerCase() === testUser.email.toLowerCase());
        if (!exists) {
            users.push(testUser);
            localStorage.setItem('saveplate_users', JSON.stringify(users));
        }

        const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
        if (!found) return { success: false, error: 'Invalid email or password.' };
        localStorage.setItem('saveplate_user', JSON.stringify(found));
        setUser(found);
        return { success: true };
    }, []);

    const signOut = useCallback(() => {
        localStorage.removeItem('saveplate_user');
        setUser(null);
    }, []);

    const updateUser = useCallback((newData) => {
        const users = JSON.parse(localStorage.getItem('saveplate_users') || '[]');
        const updatedUser = { ...user, ...newData };
        
        // Update user in the global users list
        const updatedUsersList = users.map(u => u.email.toLowerCase() === user.email.toLowerCase() ? updatedUser : u);
        
        localStorage.setItem('saveplate_users', JSON.stringify(updatedUsersList));
        localStorage.setItem('saveplate_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        return { success: true };
    }, [user]);

    const updateAvatar = useCallback((avatar) => {
        return updateUser({ avatar });
    }, [updateUser]);

    const [businessMode, setBusinessMode] = useState(() => localStorage.getItem('saveplate_business_mode') === 'true');

    const toggleBusinessMode = useCallback(() => {
        setBusinessMode(prev => {
            const newVal = !prev;
            localStorage.setItem('saveplate_business_mode', newVal);
            return newVal;
        });
    }, []);

    return (
        <AuthContext.Provider value={{ user, signIn, signUp, signOut, updateUser, updateAvatar, businessMode, toggleBusinessMode }}>
            {children}
        </AuthContext.Provider>
    );
}

// ─── Notification Provider ──────────────────────────────────────────────────────
const MOCK_NOTIFICATIONS = [
    { id: 1, title: '🔥 Flash Deal!', message: "Grandma's Bakery just added 5 more Surprise Bags! Rescue them now.", time: '2m ago', type: 'deal', read: false },
    { id: 2, title: '✅ Rescue Confirmed', message: 'Your order from Green Garden is ready for pickup during the window.', time: '1h ago', type: 'order', read: false },
    { id: 3, title: '🏆 Achievement Unlocked', message: 'Hero Status! You just saved 10kg of CO2 this month. View your impact.', time: '3h ago', type: 'reward', read: true },
    { id: 4, title: '📉 Price Drop', message: 'Your favorite Sushi Place bag is now ฿49 (was ฿99). Limited stock!', time: '5h ago', type: 'deal', read: true },
];

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
    const [isOpen, setIsOpen] = useState(false);

    const markAllRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }, []);

    const markRead = useCallback((id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    const addNotification = useCallback((title, message, type = 'deal') => {
        const newNotif = {
            id: Date.now(),
            title,
            message,
            time: 'Just now',
            type,
            read: false
        };
        setNotifications(prev => [newNotif, ...prev]);
    }, []);

    return (
        <NotificationContext.Provider value={{ notifications, isOpen, setIsOpen, markAllRead, markRead, unreadCount, addNotification }}>
            {children}
        </NotificationContext.Provider>
    );
}

// ─── Favorites Provider ─────────────────────────────────────────────────────────
export function FavoritesProvider({ children }) {
    const [favorites, setFavorites] = useState(() => {
        try {
            const stored = localStorage.getItem('saveplate_favorites');
            return stored ? JSON.parse(stored) : [];
        } catch { return []; }
    });
    const toast = useToast();

    const toggleFavorite = useCallback((id, storeName) => {
        setFavorites(prev => {
            const isFav = prev.includes(id);
            const next = isFav ? prev.filter(x => x !== id) : [...prev, id];
            localStorage.setItem('saveplate_favorites', JSON.stringify(next));
            
            if (!isFav) {
                toast(`💖 Saved ${storeName}! You'll be notified of new deals.`, 'success');
            } else {
                toast(`💔 Removed ${storeName} from favorites.`, 'info');
            }
            
            return next;
        });
    }, [toast]);

    const isFavorite = useCallback((id) => favorites.includes(id), [favorites]);

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
}

// ─── Notification Drawer ────────────────────────────────────────────────────────
export function NotificationDrawer() {
    const { notifications, isOpen, setIsOpen, markAllRead, markRead } = useNotifications();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-9000 flex items-end justify-center" onClick={() => setIsOpen(false)}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md overlay-fade" />

            {/* Sheet */}
            <div
                className="relative w-full max-w-md bg-white dm-card rounded-t-[3rem] shadow-2xl modal-slide-up overflow-hidden flex flex-col max-h-[85vh]"
                onClick={e => e.stopPropagation()}
            >
                {/* Handle bar */}
                <div className="flex justify-center pt-4 pb-2">
                    <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full" />
                </div>

                {/* Header */}
                <div className="px-8 pt-4 pb-6 flex items-center justify-between border-b border-gray-50 dark:border-white/5">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 dm-text tracking-tight uppercase italic">Hero Alerts</h2>
                        <p className="text-[10px] font-black text-brand-600 uppercase tracking-widest mt-0.5">Your Impact Updates</p>
                    </div>
                    <button 
                        onClick={markAllRead}
                        className="px-4 py-2 rounded-xl bg-brand-50 dark:bg-brand-900/20 text-brand-600 text-[10px] font-black uppercase tracking-widest hover:bg-brand-100 transition-colors"
                    >
                        Mark All Read
                    </button>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scrollbar-hide">
                    {notifications.length > 0 ? (
                        notifications.map((n) => (
                            <div 
                                key={n.id} 
                                onClick={() => markRead(n.id)}
                                className={`relative group p-5 rounded-4xl transition-all duration-300 border cursor-pointer
                                ${n.read 
                                    ? 'bg-gray-50/50 dark:bg-white/5 border-transparent opacity-60' 
                                    : 'bg-white dark:bg-slate-800 border-brand-100 dark:border-brand-900/30 shadow-lg shadow-brand-500/5'}`}
                            >
                                {!n.read && (
                                    <div className="absolute top-5 right-5 w-2 h-2 bg-brand-500 rounded-full shadow-[0_0_10px_rgba(255,52,0,0.5)]" />
                                )}
                                
                                <div className="flex gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm
                                        ${n.type === 'deal' ? 'bg-orange-100 text-orange-600' : 
                                          n.type === 'order' ? 'bg-brand-100 text-brand-600' : 
                                          'bg-amber-100 text-amber-600'}`}>
                                        {n.type === 'deal' ? <Flame className="w-6 h-6" /> : 
                                         n.type === 'order' ? <Package className="w-6 h-6" /> : 
                                         <Award className="w-6 h-6" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className="font-black text-gray-900 dm-text text-sm leading-tight">{n.title}</h4>
                                            <span className="text-[9px] font-black text-gray-400 uppercase">{n.time}</span>
                                        </div>
                                        <p className="text-xs font-bold text-gray-500 dm-text-secondary leading-relaxed mr-2">
                                            {n.message}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-20 h-20 rounded-3xl bg-gray-50 dark:bg-white/5 flex items-center justify-center mb-6">
                                <Bell className="w-10 h-10 text-gray-200" />
                            </div>
                            <h3 className="text-lg font-black text-gray-400 dm-text tracking-tight uppercase italic">No Alerts Yet</h3>
                            <p className="text-gray-300 text-[10px] font-bold uppercase tracking-widest mt-2">Check back for fresh rescues!</p>
                        </div>
                    )}
                </div>

                {/* Footer Action */}
                <div className="p-8 pt-4">
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="w-full py-4 rounded-2xl bg-gray-900 text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all"
                    >
                        Dismiss
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Auth Modal ─────────────────────────────────────────────────────────────────
export function AuthModal({ isOpen, onClose }) {
    const [tab, setTab] = useState('signin'); // 'signin' | 'signup'
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn, signUp } = useAuth();
    const toast = useToast();

    // Reset on open/tab change
    useEffect(() => {
        setName(''); setEmail(''); setPassword(''); setError(''); setShowPass(false); setLoading(false);
    }, [isOpen, tab]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Basic validation
        if (!email.trim() || !password.trim()) { setError('Please fill in all fields.'); setLoading(false); return; }
        if (tab === 'signup' && !name.trim()) { setError('Please enter your name.'); setLoading(false); return; }
        if (password.length < 6) { setError('Password must be at least 6 characters.'); setLoading(false); return; }

        // Simulate async delay
        await new Promise(r => setTimeout(r, 600));

        let result;
        if (tab === 'signin') {
            result = signIn(email.trim(), password);
        } else {
            result = signUp(name.trim(), email.trim(), password);
        }

        setLoading(false);
        if (result.success) {
            toast(tab === 'signin' ? '👋 Welcome back!' : '🎉 Account created! Welcome to SavePlate!');
            onClose();
        } else {
            setError(result.error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9000] flex items-end justify-center" onClick={onClose}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm overlay-fade" />

            {/* Sheet */}
            <div
                className="relative w-full max-w-md bg-white dm-card rounded-t-3xl shadow-2xl modal-slide-up overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* Handle bar */}
                <div className="flex justify-center pt-3 pb-1">
                    <div className="w-10 h-1 bg-gray-200 rounded-full" />
                </div>

                {/* Header */}
                <div className="px-6 pt-3 pb-5">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center">
                                <Leaf className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 leading-none">SavePlate</p>
                                <p className="text-base font-bold text-gray-800 dm-text leading-tight">
                                    {tab === 'signin' ? 'Sign In' : 'Create Account'}
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors btn-press">
                            <X className="w-4 h-4 text-gray-500" />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex bg-gray-100 p-1 rounded-xl mb-5">
                        <button
                            onClick={() => setTab('signin')}
                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-200 flex items-center justify-center gap-1.5
                                ${tab === 'signin' ? 'bg-white shadow-sm text-brand-600' : 'text-gray-500'}`}
                        >
                            <LogIn className="w-3.5 h-3.5" /> Sign In
                        </button>
                        <button
                            onClick={() => setTab('signup')}
                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-200 flex items-center justify-center gap-1.5
                                ${tab === 'signup' ? 'bg-white shadow-sm text-brand-600' : 'text-gray-500'}`}
                        >
                            <UserPlus className="w-3.5 h-3.5" /> Sign Up
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-3">
                        {tab === 'signup' && (
                            <div className="page-fade-in">
                                <label className="text-xs font-semibold text-gray-500 dm-text-secondary mb-1 block">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Your name"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dm-card border border-gray-200 rounded-xl text-sm text-gray-700 dm-text placeholder-gray-400
                                            focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400 transition-all"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="text-xs font-semibold text-gray-500 dm-text-secondary mb-1 block">Email</label>
                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dm-card border border-gray-200 rounded-xl text-sm text-gray-700 dm-text placeholder-gray-400
                                        focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-gray-500 dm-text-secondary mb-1 block">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    placeholder="Min. 6 characters"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-10 py-3 bg-gray-50 dm-card border border-gray-200 rounded-xl text-sm text-gray-700 dm-text placeholder-gray-400
                                        focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400 transition-all"
                                />
                                <button type="button" onClick={() => setShowPass(s => !s)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Error message */}
                        {error && (
                            <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5 page-fade-in">
                                <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                                <p className="text-red-600 text-xs font-medium">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-bold text-sm
                                shadow-lg shadow-brand-200 hover:from-brand-600 hover:to-brand-700 active:scale-[0.98] transition-all
                                disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 btn-press mt-1"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full refresh-spin" />
                            ) : (
                                tab === 'signin' ? <><LogIn className="w-4 h-4" /> Sign In</> : <><UserPlus className="w-4 h-4" /> Create Account</>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-xs text-gray-400 mt-4 pb-2">
                        By continuing, you agree to SavePlate's Terms of Service
                    </p>
                </div>
            </div>
        </div>
    );
}

// ─── Profile Sheet ──────────────────────────────────────────────────────────────
export function ProfileSheet({ isOpen, onClose }) {
    const { user, signOut } = useAuth();
    const { dark, toggle } = useDarkMode();
    const [showAuth, setShowAuth] = useState(false);
    const toast = useToast();

    const handleSignOut = () => {
        signOut();
        toast('👋 Signed out. See you soon!', 'info');
        onClose();
    };

    const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';

    if (!isOpen && !showAuth) return null;

    return (
        <>
            <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />

            {isOpen && (
                <div className="fixed inset-0 z-[8000] flex items-end justify-center" onClick={onClose}>
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm overlay-fade" />

                    <div
                        className="relative w-full max-w-md bg-white dm-card rounded-t-3xl shadow-2xl modal-slide-up overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Handle bar */}
                        <div className="flex justify-center pt-3 pb-1">
                            <div className="w-10 h-1 bg-gray-200 rounded-full" />
                        </div>

                        <div className="px-6 pt-2 pb-8">
                            {user ? (
                                /* ── Signed In View ── */
                                <>
                                    {/* Avatar + Info */}
                                    <div className="flex items-center gap-4 py-4 mb-2">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-200 flex-shrink-0">
                                            <span className="text-white text-xl font-extrabold">{initials}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-extrabold text-gray-800 dm-text text-lg truncate">{user.name}</p>
                                            <p className="text-gray-400 dm-text-secondary text-sm truncate">{user.email}</p>
                                            <div className="flex items-center gap-1 mt-1">
                                                <div className="w-2 h-2 rounded-full bg-brand-400" />
                                                <span className="text-xs text-brand-600 font-semibold">Food Hero 🦸</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="h-px bg-gray-100 my-2" />

                                    {/* Settings row — Dark mode */}
                                    <button
                                        onClick={toggle}
                                        className="w-full flex items-center justify-between py-3.5 px-1 hover:bg-gray-50 rounded-xl transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                                                {dark ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-500" />}
                                            </div>
                                            <span className="text-sm font-semibold text-gray-700 dm-text">{dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
                                        </div>
                                        <div className={`w-11 h-6 rounded-full relative transition-colors duration-200 ${dark ? 'bg-brand-500' : 'bg-gray-200'}`}>
                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${dark ? 'left-6' : 'left-1'}`} />
                                        </div>
                                    </button>

                                    <div className="h-px bg-gray-100 my-1" />

                                    {/* Sign Out */}
                                    <button
                                        onClick={handleSignOut}
                                        className="w-full flex items-center gap-3 py-3.5 px-1 hover:bg-red-50 rounded-xl transition-colors group mt-1"
                                    >
                                        <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                                            <LogOut className="w-4 h-4 text-red-500" />
                                        </div>
                                        <span className="text-sm font-semibold text-red-500">Sign Out</span>
                                    </button>
                                </>
                            ) : (
                                /* ── Guest View ── */
                                <>
                                    <div className="text-center py-5">
                                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-4">
                                            <User className="w-10 h-10 text-gray-400" />
                                        </div>
                                        <h3 className="text-xl font-extrabold text-gray-800 dm-text mb-1">Guest Mode</h3>
                                        <p className="text-gray-400 dm-text-secondary text-sm">Sign in to rescue food & track orders</p>
                                    </div>

                                    <div className="space-y-3 mb-4">
                                        <button
                                            onClick={() => { onClose(); setTimeout(() => setShowAuth(true), 150); }}
                                            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-bold text-sm
                                                shadow-lg shadow-brand-200 hover:from-brand-600 hover:to-brand-700 active:scale-[0.98] transition-all
                                                flex items-center justify-center gap-2 btn-press"
                                        >
                                            <LogIn className="w-4 h-4" /> Sign In
                                        </button>
                                        <button
                                            onClick={() => { onClose(); setTimeout(() => setShowAuth(true), 150); }}
                                            className="w-full py-3.5 rounded-xl border-2 border-brand-200 text-brand-600 font-bold text-sm
                                                hover:bg-brand-50 active:scale-[0.98] transition-all
                                                flex items-center justify-center gap-2 btn-press"
                                        >
                                            <UserPlus className="w-4 h-4" /> Create Account
                                        </button>
                                    </div>

                                    <div className="h-px bg-gray-100 my-2" />

                                    {/* Dark mode even for guests */}
                                    <button
                                        onClick={toggle}
                                        className="w-full flex items-center justify-between py-3 px-1 hover:bg-gray-50 rounded-xl transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                                                {dark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-500" />}
                                            </div>
                                            <span className="text-sm font-semibold text-gray-700 dm-text">{dark ? 'Light Mode' : 'Dark Mode'}</span>
                                        </div>
                                        <div className={`w-11 h-6 rounded-full relative transition-colors duration-200 ${dark ? 'bg-brand-500' : 'bg-gray-200'}`}>
                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${dark ? 'left-6' : 'left-1'}`} />
                                        </div>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

// ─── Confetti ───────────────────────────────────────────────────────────────────
export function Confetti() {
    const colors = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6'];
    const pieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 6 + Math.random() * 8,
        rotation: Math.random() * 360,
    }));
    return (
        <div className="fixed inset-0 pointer-events-none z-[9999]">
            {pieces.map(p => (
                <div key={p.id} className="confetti-piece" style={{
                    left: `${p.left}%`, animationDelay: `${p.delay}s`,
                    animationDuration: `${p.duration}s`, width: p.size, height: p.size * 0.6,
                    backgroundColor: p.color, transform: `rotate(${p.rotation}deg)`,
                    borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                }} />
            ))}
        </div>
    );
}

// ─── Skeleton Card ──────────────────────────────────────────────────────────────
export function SkeletonCard() {
    return (
        <div className="bg-white dm-card rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="skeleton h-12 w-full rounded-none" />
            <div className="p-4 space-y-3">
                <div className="skeleton h-5 w-3/4" />
                <div className="skeleton h-3 w-1/2" />
                <div className="flex gap-2"><div className="skeleton h-6 w-20 rounded-full" /><div className="skeleton h-6 w-16 rounded-full" /></div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                    <div className="skeleton h-8 w-24" />
                    <div className="skeleton h-10 w-28 rounded-xl" />
                </div>
            </div>
        </div>
    );
}

// ─── Store Avatar ───────────────────────────────────────────────────────────────
export function StoreAvatar({ name, color1, color2, size = 'md' }) {
    const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-lg' };
    return (
        <div className={`${sizes[size]} rounded-xl flex items-center justify-center font-bold text-white shadow-md flex-shrink-0`}
            style={{ background: `linear-gradient(135deg, ${color1}, ${color2})` }}>
            {initials}
        </div>
    );
}

// ─── Animated Counter ───────────────────────────────────────────────────────────
export function AnimatedCounter({ target, duration = 1500, decimals = 0 }) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) { setCount(target); clearInterval(timer); }
            else { setCount(decimals > 0 ? parseFloat(start.toFixed(decimals)) : Math.floor(start)); }
        }, 16);
        return () => clearInterval(timer);
    }, [target, duration, decimals]);
    return <span className="count-tick">{count.toLocaleString()}</span>;
}

// ─── BottomNav ──────────────────────────────────────────────────────────────────
export function BottomNav({ active, onNavigate, notifCount = 2 }) {
    const { user } = useAuth();

    const items = [
        { id: 'feed', icon: ShoppingBag, label: 'Rescue' },
        { id: 'merchant', icon: Store, label: 'Merchant' },
        { id: 'impact', icon: BarChart3, label: 'Impact' },
        { id: 'history', icon: History, label: 'Orders' },
        { id: 'profile', icon: User, label: 'Profile' },
    ];

    const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

    return (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/90 dm-card backdrop-blur-xl border-t border-gray-100 px-2 pb-6 pt-2 z-[100]">
            <div className="flex justify-around items-center">
                {items.map(item => {
                    const Icon = item.icon;
                    const isActive = active === item.id;
                    
                    // Special rendering for active profile if logged in
                    const isProfile = item.id === 'profile';
                    
                    return (
                        <button key={item.id} onClick={() => onNavigate(item.id)}
                            className={`relative flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all duration-200 btn-press
                            ${isActive ? 'text-brand-600' : 'text-gray-400 hover:text-gray-600 dm-text-secondary'}`}>
                            
                            <div className={`p-2 rounded-xl transition-all duration-200 ${isActive ? 'bg-brand-100 scale-110' : ''}`}>
                                {(isProfile && user) ? (
                                    <div className={`w-5 h-5 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-sm border-2 ${isActive ? 'border-white' : 'border-transparent'}`}>
                                        <span className="text-white text-[7px] font-black">{initials}</span>
                                    </div>
                                ) : (
                                    <Icon className="w-5 h-5" />
                                )}
                            </div>
                            <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

// ─── Pull-to-Refresh Hook ───────────────────────────────────────────────────────
export function usePullToRefresh(onRefresh) {
    const [pulling, setPulling] = useState(false);
    const [pullDistance, setPullDistance] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const startY = useRef(0);
    const containerRef = useRef(null);

    const handleTouchStart = useCallback(e => { startY.current = e.touches[0].clientY; }, []);
    const handleTouchMove = useCallback(e => {
        if (containerRef.current && containerRef.current.scrollTop === 0) {
            const d = Math.max(0, Math.min(80, (e.touches[0].clientY - startY.current) * 0.5));
            if (d > 0) { setPulling(true); setPullDistance(d); }
        }
    }, []);
    const handleTouchEnd = useCallback(() => {
        if (pullDistance > 50) {
            setRefreshing(true);
            onRefresh && onRefresh();
            setTimeout(() => { setRefreshing(false); setPulling(false); setPullDistance(0); }, 1500);
        } else { setPulling(false); setPullDistance(0); }
    }, [pullDistance, onRefresh]);

    return { containerRef, pulling, pullDistance, refreshing, handleTouchStart, handleTouchMove, handleTouchEnd };
}

// ─── Category Icon Map ──────────────────────────────────────────────────────────
export const CategoryIcon = ({ name, className }) => {
    const icons = { Cake, Utensils, Salad, Coffee, Pizza };
    const Icon = icons[name] || ShoppingBag;
    return <Icon className={className} />;
};

// Usage: call inside onClick handlers.
export function useAuthGuard() {
    const { user } = useAuth();
    const toast = useToast();

    const guard = useCallback((action, onNavigate) => {
        if (user) {
            action && action();
        } else {
            toast('🔒 Please sign in to continue', 'error');
            if (onNavigate) {
                onNavigate('auth');
            }
        }
    }, [user, toast]);

    const AuthGate = () => null; // Modal no longer needed

    return { guard, AuthGate, isSignedIn: !!user };
}
