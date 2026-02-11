import { useState, useEffect, useCallback, useRef, createContext, useContext } from 'react';
import {
    ShoppingBag, Store, BarChart3, ChevronLeft, Clock, Star, Flame,
    Leaf, TrendingUp, Award, CheckCircle2, AlertTriangle, Package,
    Minus, Plus, ToggleLeft, ToggleRight, Heart, Bell,
    Sparkles, Timer, Shield, MapPin, ChevronRight, Search,
    Sun, Moon, RefreshCw, Map, List, History, X, Cake, Utensils, Coffee, Pizza, Salad
} from 'lucide-react';

// ─── Contexts ───────────────────────────────────────────────────────────────────
const ToastContext = createContext();
const DarkModeContext = createContext();
export const useToast = () => useContext(ToastContext);
export const useDarkMode = () => useContext(DarkModeContext);

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
            ${t.type === 'success' ? 'bg-emerald-600 text-white' : t.type === 'error' ? 'bg-red-500 text-white' : 'bg-gray-800 text-white'}
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
    const { dark, toggle } = useDarkMode();
    const items = [
        { id: 'feed', icon: ShoppingBag, label: 'Rescue' },
        { id: 'merchant', icon: Store, label: 'Merchant' },
        { id: 'impact', icon: BarChart3, label: 'Impact' },
        { id: 'history', icon: History, label: 'Orders' },
    ];
    return (
        <div className="sticky bottom-0 bg-white/90 dm-card backdrop-blur-xl border-t border-gray-100 px-2 pb-6 pt-2 z-50">
            <div className="flex justify-around items-center">
                {items.map(item => {
                    const Icon = item.icon;
                    const isActive = active === item.id;
                    return (
                        <button key={item.id} onClick={() => onNavigate(item.id)}
                            className={`relative flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all duration-200 btn-press
                ${isActive ? 'text-emerald-600' : 'text-gray-400 hover:text-gray-600 dm-text-secondary'}`}>
                            <div className={`p-2 rounded-xl transition-all duration-200 ${isActive ? 'bg-emerald-100 scale-110' : ''}`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
                        </button>
                    );
                })}
                <button onClick={toggle} className="flex flex-col items-center gap-1 py-1.5 px-3 text-gray-400 hover:text-gray-600 btn-press">
                    <div className="p-2 rounded-xl">{dark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}</div>
                    <span className="text-[10px] font-medium">{dark ? 'Light' : 'Dark'}</span>
                </button>
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
