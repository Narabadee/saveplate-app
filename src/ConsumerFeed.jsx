import { useState, useEffect, useCallback, useRef } from 'react';
import {
    Clock, Flame, Heart, Shield, MapPin, ChevronRight, Search, X,
    Sparkles, Timer, Leaf, Bell, Map, List, RefreshCw, Star, CheckCircle2, AlertCircle
} from 'lucide-react';
import { MOCK_BAGS, CATEGORIES } from './data';
import { SkeletonCard, StoreAvatar, usePullToRefresh, useToast, useDarkMode, useAuthGuard, useNotifications, useFavorites, AccountPill } from './Shared';

// ─── Last Call Countdown ────────────────────────────────────────────────────────
function LastCallCountdown({ closingAt }) {
    const [remaining, setRemaining] = useState('');
    useEffect(() => {
        const update = () => {
            const diff = Math.max(0, closingAt - Date.now());
            const mins = Math.floor(diff / 60000);
            const secs = Math.floor((diff % 60000) / 1000);
            setRemaining(diff === 0 ? 'Closed' : `${mins}:${String(secs).padStart(2, '0')}`);
        };
        update();
        const t = setInterval(update, 1000);
        return () => clearInterval(t);
    }, [closingAt]);
    return (
        <div className="text-center">
            <p className="text-white font-black text-xl leading-none">{remaining}</p>
            <p className="text-red-200 text-[9px] font-black uppercase tracking-widest">remaining</p>
        </div>
    );
}

// ─── Bag Card ───────────────────────────────────────────────────────────────────
function BagCard({ bag, onSelect, index, lastCall }) {
    const savings = Math.round(((bag.originalPrice - bag.sellingPrice) / bag.originalPrice) * 100);
    const isLastFew = bag.remaining <= 3;
    const isSelectable = bag.type === 'selectable';
    const [swiped, setSwiped] = useState(false);
    const startX = useRef(0);
    const { toggleFavorite, isFavorite } = useFavorites();
    const fav = isFavorite(bag.id);

    return (
        <div
            className="card-stagger relative"
            style={{ animationDelay: `${index * 0.08}s` }}
        >
            <div
                onClick={onSelect}
                onTouchStart={e => { startX.current = e.touches[0].clientX; }}
                onTouchEnd={e => {
                    const dx = e.changedTouches[0].clientX - startX.current;
                    if (Math.abs(dx) > 80) setSwiped(dx < 0);
                }}
                className={`bg-white dm-card rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden cursor-pointer
                   hover:shadow-2xl hover:shadow-brand-200/40 hover:-translate-y-1.5 transition-all duration-500 group
                   ${swiped ? 'translate-x-[-70px]' : 'translate-x-0'}`}
            >
                {/* Hero Image Section */}
                <div className="h-56 relative overflow-hidden">
                    <img src={bag.image} alt={bag.storeName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    
                    {/* Overlays */}
                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Top Left: Rating */}
                    <div className="absolute top-4 left-4 glass-pane px-2.5 py-1.5 rounded-xl flex items-center gap-2 shadow-lg border-white/40">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-xs font-black text-gray-800 dark:text-white">{bag.rating}</span>
                        <div className="w-px h-3 bg-gray-200 dark:bg-gray-700 mx-0.5" />
                        <button 
                            onClick={(e) => { e.stopPropagation(); toggleFavorite(bag.id, bag.storeName); }}
                            className="group/fav active:scale-75 transition-transform"
                        >
                            <Heart className={`w-4 h-4 transition-all duration-300 ${fav ? 'fill-red-500 text-red-500' : 'text-gray-400 group-hover/fav:text-red-400'}`} />
                        </button>
                    </div>

                    {/* Top Right: Savings Ticket */}
                    <div className="absolute top-4 right-4 animate-bounce-slow">
                        <div className="bg-linear-to-br from-amber-400 to-orange-500 text-white px-3 py-1.5 rounded-xl shadow-lg border border-white/20 flex flex-col items-center">
                            <span className="text-[10px] font-black uppercase tracking-tighter leading-none">{savings}%</span>
                            <span className="text-[8px] font-bold uppercase tracking-widest leading-none">OFF</span>
                        </div>
                    </div>

                    {/* Last Call Badge */}
                    {lastCall && (
                        <div className="absolute top-14 left-4 right-4 z-10">
                            <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-red-500/30 animate-pulse">
                                <Timer className="w-3.5 h-3.5 shrink-0" />
                                <span>⏰ Last Call — Order Before Closing!</span>
                            </div>
                        </div>
                    )}

                    {/* Bottom Content Over Image */}
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-brand-300 bg-brand-900/40 px-2 py-0.5 rounded-md backdrop-blur-sm">
                                    {bag.category}
                                </span>
                            </div>
                            <h3 className="text-xl font-black text-white drop-shadow-md truncate max-w-[200px]">
                                {bag.storeName}
                            </h3>
                        </div>
                        <div className="text-right">
                            <p className="text-white/60 text-[10px] line-through font-bold leading-none">฿{bag.originalPrice}</p>
                            <p className="text-white text-2xl font-black leading-none mt-1">฿{bag.sellingPrice}</p>
                        </div>
                    </div>

                    {/* Type Indicator */}
                    <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
                         {/* Hidden by default, shown on hover/interaction if needed, but we have clean labels now */}
                    </div>
                </div>

                <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                                <MapPin className="w-4 h-4 text-gray-400" />
                            </div>
                            <span className="text-xs font-bold text-gray-500 dm-text-secondary">{bag.distance}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                                <Clock className="w-4 h-4 text-gray-400" />
                            </div>
                            <span className="text-xs font-bold text-gray-500 dm-text-secondary">{bag.pickupStart}–{bag.pickupEnd}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mb-5">
                         {isLastFew && (
                            <div className="flex-1 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-2xl px-3 py-2 flex items-center gap-2 shake group-hover:animate-none">
                                <Flame className="w-4 h-4 text-red-500" />
                                <span className="text-xs font-black text-red-600 uppercase">Only {bag.remaining} left!</span>
                            </div>
                        )}
                        {!isLastFew && (
                            <div className="flex-1 bg-brand-50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-900/30 rounded-2xl px-3 py-2 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-brand-500" />
                                <span className="text-xs font-black text-brand-600 uppercase">Available Now</span>
                            </div>
                        )}
                    </div>

                    <button 
                        className={`w-full py-4 rounded-2xl text-sm font-black shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 text-white
                        ${isSelectable ? 'bg-action-view shadow-orange-200' : 'bg-linear-to-r from-brand-500 to-amber-600 shadow-brand-200'}`}
                    >
                        {isSelectable ? <List className="w-4 h-4" /> : <Heart className="w-4 h-4" />}
                        {isSelectable ? 'VIEW MENU' : 'RESCUE NOW'}
                    </button>
                    
                    <p className="text-center text-[10px] text-gray-300 font-bold uppercase tracking-widest mt-4">
                         Secure Checkout • {bag.reviews} Community Reviews
                    </p>
                </div>
            </div>
            
            {/* Swipe reveal action */}
            {swiped && (
                <div onClick={(e) => { e.stopPropagation(); toggleFavorite(bag.id, bag.storeName); setSwiped(false); }}
                    className="absolute right-0 top-0 bottom-0 w-20 bg-brand-500 text-white flex flex-col items-center justify-center rounded-r-3xl transition-all animate-slide-in">
                    <Heart className={`w-6 h-6 mb-1 ${fav ? 'fill-white' : ''}`} />
                    <span className="text-[8px] font-black uppercase">{fav ? 'Saved' : 'Save'}</span>
                </div>
            )}
        </div>
    );
}

// ─── Consumer Feed ──────────────────────────────────────────────────────────────
export default function ConsumerFeed({ onSelectBag, onNavigate }) {
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState(0);
    const [activeTab, setActiveTab] = useState('all'); // 'all' | 'surprise' | 'selectable'
    const [viewMode, setViewMode] = useState('list');
    const [lastCall, setLastCall] = useState(null);
    const toast = useToast();
    const { dark } = useDarkMode();
    const { guard, AuthGate } = useAuthGuard();
    const { unreadCount, setIsOpen } = useNotifications();

    const { containerRef, pulling, pullDistance, refreshing, handleTouchStart, handleTouchMove, handleTouchEnd } = usePullToRefresh(() => {
        setLoading(true);
        setTimeout(() => { setLoading(false); toast('Feed updated with fresh deals! 🔄'); }, 1200);
    });

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    // Poll for last-call announcements from vendors
    useEffect(() => {
        const checkLastCall = () => {
            try {
                const data = JSON.parse(localStorage.getItem('unieat_last_call') || 'null');
                if (data && data.active && data.closingAt > Date.now()) {
                    setLastCall(data);
                } else {
                    setLastCall(null);
                    if (data && data.active) localStorage.removeItem('unieat_last_call');
                }
            } catch { setLastCall(null); }
        };
        checkLastCall();
        const interval = setInterval(checkLastCall, 15000);
        return () => clearInterval(interval);
    }, []);

    const filteredBags = MOCK_BAGS.filter(b => {
        const matchesSearch = searchQuery ? b.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.category.toLowerCase().includes(searchQuery.toLowerCase()) : true;

        const matchesTab = activeTab === 'all'
            ? true
            : activeTab === 'surprise'
                ? (!b.type || b.type === 'surprise')
                : (b.type === 'selectable');

        const selectedCategoryStr = CATEGORIES[activeCategory];
        const matchesCategory = activeCategory === 0 || // All
            b.category.includes(selectedCategoryStr.split(' ')[1]) || // Match word after emoji
            selectedCategoryStr.includes(b.category); // Fallback

        return matchesSearch && matchesTab && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-slate-50 dm-bg page-enter flex flex-col pb-24"
            ref={containerRef} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>

            {/* Background Blobs for consistency */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-10 dark:opacity-5">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-brand-200 rounded-full blur-[120px]" />
                <div className="absolute bottom-[20%] left-[-10%] w-[50%] h-[50%] bg-amber-100 rounded-full blur-[100px]" />
            </div>

            {/* Header: Immersive Glass Style */}
            <header className="sticky top-0 z-50 glass-header px-6 pt-12 pb-6 border-b border-white/20">
                <div className="flex items-center justify-between mb-5">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 mb-1">
                            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                            <span className="text-brand-600 dark:text-brand-400 text-[10px] font-black uppercase tracking-[0.2em] leading-none">Live in Bangkok</span>
                        </div>
                        <h1 className="text-2xl font-black text-gray-900 dm-text leading-none tracking-tight">Explore Deals ✨</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsOpen(true)}
                            className="w-10 h-10 rounded-2xl glass-pane flex items-center justify-center hover:bg-white/40 transition-all btn-press border-white/40 shadow-sm relative"
                        >
                            <Bell className="w-5 h-5 text-gray-700 dark:text-white dm-text" />
                            {unreadCount > 0 && (
                                <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center">
                                    <span className="text-[8px] font-black text-white">{unreadCount}</span>
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Search Bar: Always Visible & Large */}
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search bakeries, restaurants..."
                        value={searchQuery} 
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-4 bg-gray-100/80 dark:bg-gray-800/80 border border-transparent focus:bg-white dark:focus:bg-gray-900 focus:border-brand-300 focus:ring-4 focus:ring-brand-500/10 rounded-2xl text-sm font-medium transition-all"
                    />
                </div>
            </header>

            <div className="px-6 py-6 flex-1 relative flex flex-col gap-6">
                
                {/* Pull-to-refresh indicator */}
                {(pulling || refreshing) && (
                    <div className="flex justify-center -mt-4 transition-all" style={{ height: pulling ? pullDistance : 40 }}>
                        <RefreshCw className={`w-6 h-6 text-brand-500 ${refreshing ? 'refresh-spin' : ''}`}
                            style={{ transform: pulling ? `rotate(${pullDistance * 3}deg)` : undefined }} />
                    </div>
                )}

                {/* Main Tabs (Glass Sliding Style) */}
                <div className="glass-pane p-1 rounded-2xl flex gap-1 border-gray-100 shadow-sm">
                    {['all', 'surprise', 'selectable'].map((tab) => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2
                            ${activeTab === tab 
                                ? 'bg-white dark:bg-gray-800 shadow-md text-brand-600 dark:text-white scale-[1.02]' 
                                : 'text-gray-400 hover:text-gray-600 dm-text-secondary'}`}
                        >
                            {tab === 'surprise' && <Sparkles className="w-3.5 h-3.5" />}
                            {tab === 'selectable' && <List className="w-3.5 h-3.5" />}
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Category filters (Premium Chips) */}
                <div className="relative">
                    <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide scroll-fade-right">
                        {CATEGORIES.map((cat, i) => (
                            <button key={cat} onClick={() => setActiveCategory(i)}
                                className={`flex-shrink-0 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 border
                                ${i === activeCategory
                                    ? 'chip-active border-transparent'
                                    : 'bg-white dark:bg-gray-800 text-gray-500 dm-text-secondary border-gray-100 dark:border-gray-700 hover:border-brand-200'}`}>
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Feed Controls */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black text-gray-900 dm-text tracking-tight">Nearby Rescues</h2>
                        <div className="flex items-center gap-1.5 mt-0.5">
                             <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">
                                {filteredBags.length} Deals Live Now
                             </p>
                        </div>
                    </div>
                    <button onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
                        className="glass-pane p-1 rounded-xl flex border-gray-100 shadow-sm hover:scale-105 transition-transform active:scale-95 overflow-hidden">
                        <div className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-brand-500 text-white shadow-sm' : 'text-gray-400'}`}>
                            <List className="w-4 h-4" />
                        </div>
                        <div className={`p-2 rounded-lg transition-colors ${viewMode === 'map' ? 'bg-brand-500 text-white shadow-sm' : 'text-gray-400'}`}>
                            <Map className="w-4 h-4" />
                        </div>
                    </button>
                </div>

                {/* View Content */}
                {viewMode === 'map' ? (
                     <div className="page-zoom-in relative h-[400px] rounded-[2.5rem] overflow-hidden border-4 border-white dark:border-gray-800 shadow-2xl">
                         {/* Styled Map Background */}
                         <div className="absolute inset-0 bg-brand-50 dark:bg-gray-900 opacity-40" />
                         <div className="absolute inset-0 p-8 flex items-center justify-center opacity-10" style={{
                            backgroundImage: 'radial-gradient(circle, #10b981 2px, transparent 2px)',
                            backgroundSize: '40px 40px'
                         }} />
                         
                         {loading ? (
                             <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                                 <RefreshCw className="w-10 h-10 text-brand-500 refresh-spin" />
                                 <p className="text-xs font-black text-brand-600 uppercase tracking-widest">Scanning Area...</p>
                             </div>
                         ) : (
                             MOCK_BAGS.slice(0, 5).map((bag, i) => (
                                <button key={bag.id} onClick={() => onSelectBag(bag)}
                                    className="absolute pin-bounce cursor-pointer group hover:z-50"
                                    style={{ top: `${15 + (i % 3) * 20}%`, left: `${10 + (i * 18)}%`, animationDelay: `${i * 0.2}s` }}>
                                    <div className="relative">
                                        <div className="w-14 h-14 rounded-2xl glass-pane p-1 shadow-2xl transition-transform group-hover:scale-125 border-brand-100">
                                            <img src={bag.image} alt={bag.storeName} className="w-full h-full object-cover rounded-xl" />
                                        </div>
                                        <div className="absolute -bottom-3 -right-3 bg-brand-500 text-white text-[9px] font-black px-2 py-1 rounded-lg border-2 border-white shadow-md">
                                            ฿{bag.sellingPrice}
                                        </div>
                                    </div>
                                </button>
                            ))
                         )}
                         <div className="absolute bottom-6 left-1/2 -translate-x-1/2 glass-pane px-5 py-3 rounded-2xl flex items-center gap-2 shadow-xl border-white/40">
                             <MapPin className="w-4 h-4 text-brand-600" />
                             <span className="text-xs font-black text-gray-800 uppercase tracking-tight">Explore Sukhumvit Area</span>
                         </div>
                     </div>
                ) : (
                    /* Feed List */
                    <div className="space-y-6">
                        {/* Last Call Alert Banner */}
                        {lastCall && !loading && (
                            <div className="rounded-3xl overflow-hidden shadow-xl shadow-red-500/20 animate-slide-in">
                                <div className="bg-gradient-to-r from-red-500 via-red-500 to-orange-500 p-4 flex items-center gap-4">
                                    <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                                        <Timer className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-white font-black text-sm uppercase tracking-widest leading-tight">⏰ Last Call Alert!</p>
                                        <p className="text-red-100 text-[10px] font-bold mt-0.5">A canteen is closing soon — order now before it's gone!</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <LastCallCountdown closingAt={lastCall.closingAt} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {loading ? (
                            <>
                                <SkeletonCard /><SkeletonCard /><SkeletonCard />
                            </>
                        ) : (
                            filteredBags.map((bag, i) => (
                                <BagCard key={bag.id} bag={bag} onSelect={() => guard(() => onSelectBag(bag), onNavigate)} index={i} lastCall={!!lastCall} />
                            ))
                        )}
                        {!loading && filteredBags.length === 0 && (
                            <div className="text-center py-20 page-fade-in group">
                                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                                    <Search className="w-10 h-10 text-gray-300" />
                                </div>
                                <h3 className="text-xl font-black text-gray-900 dm-text tracking-tight mb-2 italic">Nothing here yet! 🍽️</h3>
                                <p className="text-gray-400 dm-text-secondary text-xs font-medium max-w-[200px] mx-auto leading-relaxed">
                                    Check back around 5pm when stores start their daily rescues.
                                </p>
                                <button onClick={() => {setSearchQuery(''); setActiveCategory(0); setActiveTab('all');} } 
                                    className="mt-6 text-brand-600 text-xs font-black uppercase tracking-widest hover:underline decoration-brand-200 underline-offset-4">
                                    Reset Filters
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            
            <AuthGate />
        </div>
    );
}
