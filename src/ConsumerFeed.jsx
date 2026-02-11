import { useState, useEffect, useCallback, useRef } from 'react';
import {
    Clock, Flame, Heart, Shield, MapPin, ChevronRight, Search, X,
    Sparkles, Timer, Leaf, Bell, Map, List, RefreshCw, Star
} from 'lucide-react';
import { MOCK_BAGS, CATEGORIES } from './data';
import { BottomNav, SkeletonCard, StoreAvatar, usePullToRefresh, useToast, useDarkMode } from './Shared';

// ─── Bag Card ───────────────────────────────────────────────────────────────────
function BagCard({ bag, onSelect, index }) {
    const savings = Math.round(((bag.originalPrice - bag.sellingPrice) / bag.originalPrice) * 100);
    const isLastFew = bag.remaining <= 3;
    const isSelectable = bag.type === 'selectable';
    const [swiped, setSwiped] = useState(false);
    const startX = useRef(0);

    return (
        <div
            className="card-stagger"
            style={{ animationDelay: `${index * 0.08}s` }}
        >
            <div
                onClick={onSelect}
                onTouchStart={e => { startX.current = e.touches[0].clientX; }}
                onTouchEnd={e => {
                    const dx = e.changedTouches[0].clientX - startX.current;
                    if (Math.abs(dx) > 80) setSwiped(dx < 0);
                }}
                className={`bg-white dm-card rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer
                   hover:shadow-xl hover:shadow-emerald-100/50 hover:-translate-y-1 transition-all duration-300 group
                   ${swiped ? 'translate-x-[-60px]' : 'translate-x-0'}`}
                style={{ transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
            >
                {/* Top bar with image */}
                <div className="h-40 relative">
                    <img src={bag.image} alt={bag.storeName} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-sm">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span className="text-xs font-bold text-gray-800">{bag.rating}</span>
                    </div>
                    {/* TYPE BADGE */}
                    <div className={`absolute top-3 right-3 px-2 py-1 rounded-lg backdrop-blur-md border border-white/20 shadow-sm flex items-center gap-1.5
                        ${isSelectable ? 'bg-indigo-500/90' : 'bg-emerald-500/90'}`}>
                        {isSelectable ? (
                            <>
                                <List className="w-3 h-3 text-white" />
                                <span className="text-[10px] font-bold text-white tracking-wide uppercase">Menu</span>
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-3 h-3 text-white" />
                                <span className="text-[10px] font-bold text-white tracking-wide uppercase">Surprise</span>
                            </>
                        )}
                    </div>
                    <div className="absolute bottom-3 left-3 text-white">
                        <span className="text-xs font-bold bg-black/40 px-2 py-1 rounded backdrop-blur-md border border-white/10">{bag.category}</span>
                    </div>
                </div>

                <div className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                        <StoreAvatar name={bag.storeName} color1={bag.color1} color2={bag.color2} />
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-800 dm-text text-base group-hover:text-emerald-700 transition-colors truncate">
                                {bag.storeName}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-gray-400 dm-text-secondary text-xs flex items-center gap-1">
                                    <MapPin className="w-3 h-3" /> {bag.distance}
                                </span>
                                <span className="text-gray-300">•</span>
                                <span className="text-gray-400 dm-text-secondary text-xs flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {bag.pickupStart}–{bag.pickupEnd}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                        {isLastFew && (
                            <span className="inline-flex items-center gap-1 bg-red-50 text-red-500 px-2.5 py-1 rounded-full text-xs font-semibold animate-pulse">
                                <Flame className="w-3 h-3" /> Last {bag.remaining}!
                            </span>
                        )}
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full text-xs font-semibold">
                            <Shield className="w-3 h-3" /> {savings}% off
                        </span>
                        <span className="text-gray-400 dm-text-secondary text-xs">({bag.reviews} reviews)</span>
                    </div>

                    <div className="flex items-end justify-between pt-2 border-t border-gray-50">
                        <div>
                            <span className="text-gray-400 text-sm line-through mr-2">฿{bag.originalPrice}</span>
                            <span className="text-emerald-600 text-2xl font-extrabold">฿{bag.sellingPrice}</span>
                        </div>
                        <button className={`px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg active:scale-90 transition-all duration-200 flex items-center gap-1.5 ripple-container btn-press text-white
                            ${isSelectable ? 'bg-indigo-500 hover:bg-indigo-600 shadow-indigo-200 hover:shadow-indigo-300' : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200 hover:shadow-emerald-300'}`}>
                            {isSelectable ? <List className="w-4 h-4" /> : <Heart className="w-4 h-4" />}
                            {isSelectable ? 'View Menu' : 'Rescue Now'}
                        </button>
                    </div>
                </div>
            </div>
            {/* Swipe reveal action */}
            {swiped && (
                <button onClick={(e) => { e.stopPropagation(); setSwiped(false); }}
                    className="absolute right-0 top-0 bottom-0 w-16 bg-emerald-500 text-white flex items-center justify-center rounded-r-2xl">
                    <Heart className="w-5 h-5" />
                </button>
            )}
        </div>
    );
}

// ─── Consumer Feed ──────────────────────────────────────────────────────────────
export default function ConsumerFeed({ onSelectBag, onNavigate }) {
    const [loading, setLoading] = useState(true);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState(0);
    const [activeTab, setActiveTab] = useState('all'); // 'all' | 'surprise' | 'selectable'
    const [viewMode, setViewMode] = useState('list');
    const toast = useToast();
    const { dark } = useDarkMode();

    const { containerRef, pulling, pullDistance, refreshing, handleTouchStart, handleTouchMove, handleTouchEnd } = usePullToRefresh(() => {
        setLoading(true);
        setTimeout(() => { setLoading(false); toast('Feed refreshed! 🔄'); }, 1200);
    });

    // Simulate initial loading
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    const filteredBags = MOCK_BAGS.filter(b => {
        const matchesSearch = searchQuery ? b.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.category.toLowerCase().includes(searchQuery.toLowerCase()) : true;
        const matchesTab = activeTab === 'all'
            ? true
            : activeTab === 'surprise'
                ? (!b.type || b.type === 'surprise')
                : (b.type === 'selectable');

        return matchesSearch && matchesTab;
    });

    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dm-bg page-enter flex flex-col"
            ref={containerRef} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>

            {/* Pull-to-refresh indicator */}
            {(pulling || refreshing) && (
                <div className="flex justify-center py-3 transition-all" style={{ height: pulling ? pullDistance : 40 }}>
                    <RefreshCw className={`w-6 h-6 text-emerald-500 ${refreshing ? 'refresh-spin' : ''}`}
                        style={{ transform: pulling ? `rotate(${pullDistance * 3}deg)` : undefined }} />
                </div>
            )}

            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 pt-12 pb-6 rounded-b-3xl shadow-lg shadow-emerald-200/50 flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Leaf className="w-5 h-5 text-emerald-200" />
                            <span className="text-emerald-100 text-sm font-medium">SavePlate</span>
                        </div>
                        <h1 className="text-white text-2xl font-bold">Rescue Food Today 🦸</h1>
                        <p className="text-emerald-100 text-sm mt-1">Save money. Reduce waste. Be a hero.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setSearchOpen(!searchOpen)}
                            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all btn-press">
                            <Search className="w-5 h-5 text-white" />
                        </button>
                        <div className="relative">
                            <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all btn-press">
                                <Bell className="w-5 h-5 text-white" />
                            </button>
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-emerald-600 flex items-center justify-center badge-pop">
                                <span className="text-[10px] text-white font-bold">3</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Search bar */}
                {searchOpen && (
                    <div className="page-fade-in mb-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input type="text" placeholder="Search stores or categories..."
                                value={searchQuery} onChange={e => setSearchQuery(e.target.value)} autoFocus
                                className="w-full pl-10 pr-4 py-2.5 bg-white/90 rounded-xl text-sm text-gray-700 placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-white/50" />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-gray-400" /></button>
                            )}
                        </div>
                    </div>
                )}

                {/* Stats banner */}
                <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-yellow-300" />
                    </div>
                    <div className="flex-1">
                        <p className="text-white text-sm font-semibold">342 meals rescued near you!</p>
                        <p className="text-emerald-100 text-xs">Join 1,200+ Food Heroes in Bangkok</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-emerald-200" />
                </div>
            </div>

            <div className="px-5 py-5 flex-1">
                {/* TABS - NEW */}
                <div className="bg-gray-100 dm-card p-1 rounded-xl flex gap-1 mb-6">
                    <button onClick={() => setActiveTab('all')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-200
                        ${activeTab === 'all'
                                ? 'bg-white dm-card shadow-sm text-emerald-600'
                                : 'text-gray-500 hover:text-gray-700 dm-text-secondary'}`}>
                        All
                    </button>
                    <button onClick={() => setActiveTab('surprise')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-200 flex items-center justify-center gap-1.5
                        ${activeTab === 'surprise'
                                ? 'bg-white dm-card shadow-sm text-emerald-600'
                                : 'text-gray-500 hover:text-gray-700 dm-text-secondary'}`}>
                        <Sparkles className="w-3.5 h-3.5" /> Surprise
                    </button>
                    <button onClick={() => setActiveTab('selectable')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-200 flex items-center justify-center gap-1.5
                        ${activeTab === 'selectable'
                                ? 'bg-white dm-card shadow-sm text-indigo-600' // Indigo for menu
                                : 'text-gray-500 hover:text-gray-700 dm-text-secondary'}`}>
                        <List className="w-3.5 h-3.5" /> Menu
                    </button>
                </div>

                {/* Category filters */}
                <div className="flex gap-2 overflow-x-auto pb-3 -mx-5 px-5 scrollbar-hide">
                    {CATEGORIES.map((cat, i) => (
                        <button key={cat} onClick={() => setActiveCategory(i)}
                            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 btn-press
                ${i === activeCategory
                                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200 scale-105'
                                    : 'bg-white dm-card text-gray-600 dm-text-secondary border border-gray-100 hover:border-emerald-200 hover:text-emerald-600'}`}>
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Section header */}
                <div className="flex items-center justify-between mt-4 mb-4">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 dm-text">
                            {activeTab === 'all' ? 'All Bags Near You' :
                                activeTab === 'surprise' ? 'Surprise Bags' : 'Menu Orders'}
                        </h2>
                        <p className="text-xs text-gray-400 dm-text-secondary">{filteredBags.length} available</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
                            className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full btn-press">
                            {viewMode === 'list' ? <Map className="w-3.5 h-3.5" /> : <List className="w-3.5 h-3.5" />}
                            <span className="text-xs font-semibold">{viewMode === 'list' ? 'Map' : 'List'}</span>
                        </button>
                        <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
                            <Timer className="w-3.5 h-3.5" /><span className="text-xs font-semibold">Live</span>
                        </div>
                    </div>
                </div>

                {/* Map View */}
                {viewMode === 'map' ? (
                    <div className="page-zoom-in bg-emerald-100 dm-card rounded-2xl h-72 flex flex-col items-center justify-center relative overflow-hidden border border-emerald-200">
                        <div className="absolute inset-0 opacity-20" style={{
                            backgroundImage: 'radial-gradient(circle, #059669 1px, transparent 1px)',
                            backgroundSize: '20px 20px'
                        }} />
                        {MOCK_BAGS.slice(0, 4).map((bag, i) => (
                            <button key={bag.id} onClick={() => onSelectBag(bag)}
                                className="absolute pin-bounce cursor-pointer group"
                                style={{ top: `${20 + i * 15}%`, left: `${15 + i * 18}%`, animationDelay: `${i * 0.2}s` }}>
                                <div className="flex flex-col items-center">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg overflow-hidden border-2 border-white"
                                        style={{ background: `linear-gradient(135deg, ${bag.color1}, ${bag.color2})` }}>
                                        <img src={bag.image} alt={bag.storeName} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="bg-white dm-card shadow-md rounded-lg px-2 py-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <p className="text-xs font-bold text-gray-700 dm-text whitespace-nowrap">฿{bag.sellingPrice}</p>
                                    </div>
                                </div>
                            </button>
                        ))}
                        <p className="text-emerald-700 text-sm font-medium z-10 mt-auto mb-3">📍 Tap a pin to view details</p>
                    </div>
                ) : (
                    /* List View */
                    <div className="space-y-4">
                        {loading ? (
                            <>
                                <SkeletonCard /><SkeletonCard /><SkeletonCard />
                            </>
                        ) : (
                            filteredBags.map((bag, i) => (
                                <BagCard key={bag.id} bag={bag} onSelect={() => onSelectBag(bag)} index={i} />
                            ))
                        )}
                        {!loading && filteredBags.length === 0 && (
                            <div className="text-center py-12 page-fade-in">
                                <span className="text-4xl mb-3 block">🔍</span>
                                <p className="text-gray-500 dm-text-secondary font-medium">No bags found for "{searchQuery}"</p>
                                <button onClick={() => setSearchQuery('')} className="text-emerald-600 text-sm font-semibold mt-2">Clear search</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <BottomNav active="feed" onNavigate={onNavigate} />
        </div>
    );
}
