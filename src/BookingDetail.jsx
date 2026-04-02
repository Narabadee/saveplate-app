import { useState, useEffect, useRef } from 'react';
import {
    ChevronLeft, Clock, Star, Package, Heart,
    Sparkles, Shield, MapPin, CheckCircle2, Minus, Plus, Utensils, Lock,
    TrendingUp, ArrowRight, Flame, Timer
} from 'lucide-react';
import { Confetti, StoreAvatar, useToast, useAuthGuard, useNotifications, useFavorites } from './Shared';
import { MOCK_REVIEWS } from './data';
import { ReviewList } from './Reviews';

// ─── Success Screen ─────────────────────────────────────────────────────────────
function SuccessScreen({ bag, onBack, cart, total, isLastCall }) {
    const [showContent, setShowContent] = useState(false);
    const [showConfetti, setShowConfetti] = useState(true);

    useEffect(() => {
        setTimeout(() => setShowContent(true), 300);
        setTimeout(() => setShowConfetti(false), 4500);
    }, []);

    const selectedItems = cart ? Object.entries(cart).map(([id, qty]) => {
        const item = bag.items.find(i => i.id === parseInt(id));
        return { ...item, qty };
    }).filter(i => i.qty > 0) : [];

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center page-zoom-in relative overflow-hidden">
            {showConfetti && <Confetti />}
            
            {/* Background Effects */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-brand-500 rounded-full blur-[120px]" />
                <div className="absolute bottom-[20%] left-[-10%] w-[50%] h-[50%] bg-amber-500 rounded-full blur-[100px]" />
            </div>

            <div className={`relative z-10 transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-95'}`}>
                <div className="w-28 h-28 rounded-[2.5rem] bg-brand-500 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-brand-500/40 animate-bounce-slow">
                    <CheckCircle2 className="w-14 h-14 text-white" />
                </div>
                
                <h1 className="text-4xl font-black text-white mb-2 tracking-tight drop-shadow-lg">
                    {isLastCall ? 'Spot Secured! 🔒' : 'Food Hero Status! ✨'}
                </h1>
                <p className="text-brand-400 font-black uppercase tracking-[0.2em] text-[10px] mb-10 drop-shadow-sm">
                    {isLastCall ? 'Your food is waiting at the pickup point' : "You've successfully rescued a meal"}
                </p>

                <div className="w-full max-w-sm rounded-[2.5rem] p-8 bg-white shadow-2xl shadow-slate-950/20 mb-12 text-left relative overflow-hidden group border border-white">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
                    
                    <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100 relative z-10">
                        <StoreAvatar name={bag.storeName} color1={bag.color1} color2={bag.color2} />
                        <div>
                            <p className="text-slate-900 font-extrabold text-lg leading-tight">{bag.storeName}</p>
                            <p className="text-brand-600 font-black text-[10px] uppercase tracking-[0.2em]">{bag.category}</p>
                        </div>
                    </div>

                    {/* Order Summary */}
                    {selectedItems.length > 0 && (
                        <div className="mb-6 pb-6 border-b border-slate-50 space-y-3">
                            {selectedItems.map(item => (
                                <div key={item.id} className="flex justify-between text-sm font-bold">
                                    <span className="text-slate-500">{item.qty}x {item.name}</span>
                                    <span className="text-slate-900 font-black">฿{item.price * item.qty}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="space-y-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                <Clock className="w-4 h-4 text-brand-600" /> Pickup Window
                            </div>
                            <span className="text-slate-900 text-sm font-black italic">{bag.pickupStart} – {bag.pickupEnd}</span>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                <Sparkles className="w-4 h-4 text-brand-500" /> Total Paid
                            </div>
                            <span className="text-brand-600 text-3xl font-black leading-none italic drop-shadow-sm">฿{total || bag.sellingPrice}</span>
                        </div>
                    </div>
                </div>

                {isLastCall && (
                    <div className="w-full max-w-sm rounded-3xl bg-white/10 border border-white/20 p-4 mb-2 text-center">
                        <p className="text-brand-300 font-black text-[10px] uppercase tracking-widest mb-1">📍 Pickup Point</p>
                        <p className="text-white text-sm font-bold">Your food is reserved & waiting.</p>
                        <p className="text-white/60 text-[10px] font-bold mt-1 uppercase tracking-widest">Collect anytime during the pickup window</p>
                    </div>
                )}

                <div className="flex flex-col gap-3 w-full max-w-sm">
                    <button
                        onClick={onBack}
                        className="w-full py-4 rounded-2xl bg-white text-slate-900 font-black text-xs uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all"
                    >
                        {isLastCall ? 'Back to Feed' : 'Rescue More Food'}
                    </button>
                    <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">
                        {isLastCall ? 'Your spot is confirmed — food awaits at pickup' : 'Show this screen at the counter during pickup'}
                    </p>
                </div>
            </div>
        </div>
    );
}

// ─── Booking Detail ─────────────────────────────────────────────────────────────
export default function BookingDetail({ bag, onBack, onAddOrder, onNavigate }) {
    const [confirmed, setConfirmed] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [cart, setCart] = useState({});
    const [showAllReviews, setShowAllReviews] = useState(false);
    const [isLastCall, setIsLastCall] = useState(false);
    const toast = useToast();
    const { guard, AuthGate, isSignedIn } = useAuthGuard();
    const { addNotification } = useNotifications();
    const { toggleFavorite, isFavorite } = useFavorites();
    const fav = isFavorite(bag.id);
    const scrollContainerRef = useRef(null);

    const isSelectable = bag.type === 'selectable';

    useEffect(() => {
        try {
            const data = JSON.parse(localStorage.getItem('unieat_last_call') || 'null');
            setIsLastCall(!!(data && data.active && data.closingAt > Date.now()));
        } catch { setIsLastCall(false); }
    }, []);

    const calculateTotal = () => {
        if (!isSelectable) return bag.sellingPrice;
        return Object.entries(cart).reduce((sum, [id, qty]) => {
            const item = bag.items.find(i => i.id === parseInt(id));
            return sum + (item ? item.price * qty : 0);
        }, 0);
    };

    const currentTotal = calculateTotal();
    const canCheckout = isSelectable ? currentTotal > 0 : true;

    const savings = isSelectable
        ? Object.entries(cart).reduce((sum, [id, qty]) => {
            const item = bag.items.find(i => i.id === parseInt(id));
            return sum + (item ? (item.originalPrice - item.price) * qty : 0);
        }, 0)
        : bag.originalPrice - bag.sellingPrice;

    const updateCart = (itemId, change) => {
        setCart(prev => {
            const currentQty = prev[itemId] || 0;
            const newQty = Math.max(0, currentQty + change);
            return { ...prev, [itemId]: newQty };
        });
    };

    const handleConfirm = () => {
        setConfirmed(true);
        toast(isLastCall ? '🔒 Spot Secured! Your food is reserved.' : '🚀 Confirmed! Preparing your rescue...');
        addNotification(
            isLastCall ? '🔒 Spot Secured!' : '✅ Rescue Confirmed!',
            isLastCall
                ? `Your spot at ${bag.storeName} is locked in. Head to the pickup point when ready — your food will be waiting!`
                : `Your rescue from ${bag.storeName} has been recorded. Check the pickup window!`,
            'order'
        );
        onAddOrder && onAddOrder({
            id: Date.now(), bag, status: 'confirmed',
            details: isSelectable ? cart : 'Surprise Bag',
            total: currentTotal,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
        setTimeout(() => setShowSuccess(true), 1200);
    };

    if (showSuccess) return <SuccessScreen bag={bag} onBack={onBack} cart={isSelectable ? cart : null} total={currentTotal} isLastCall={isLastCall} />;

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dm-bg pb-44">
            <div className="flex-1 flex flex-col page-enter">
                <AuthGate />
            
            {/* Immersive Hero Header */}
            <header className="relative h-80 shrink-0 overflow-hidden rounded-b-4xl shadow-2xl z-10">
                <img src={bag.image} alt={bag.storeName} className="w-full h-full object-cover scale-105" />
                <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/10 to-transparent" />
                
                {/* Header Actions */}
                <div className="absolute top-12 left-6 right-6 flex items-center justify-between">
                    <button onClick={onBack} className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/20 text-white active:scale-90 transition-transform shadow-lg">
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <div className="flex items-center gap-3">
                         <div className="px-4 py-2 rounded-2xl bg-red-600/90 backdrop-blur-xl border border-red-400/30 flex items-center gap-2 shadow-xl animate-pulse">
                              <Flame className="w-4 h-4 text-white" />
                              <span className="text-white text-[10px] font-black uppercase tracking-widest">{bag.remaining} LEFT</span>
                         </div>
                         <button 
                             onClick={() => toggleFavorite(bag.id, bag.storeName)}
                             className={`w-11 h-11 rounded-2xl backdrop-blur-xl flex items-center justify-center border border-white/20 transition-all duration-300 active:scale-90 shadow-lg
                             ${fav ? 'bg-white text-red-500' : 'bg-white/20 text-white hover:bg-white/30'}`}
                         >
                             <Heart className={`w-5 h-5 ${fav ? 'fill-red-500' : ''}`} />
                         </button>
                    </div>
                </div>

                {/* Bottom Overlay Content */}
                <div className="absolute bottom-10 left-6 right-6 flex items-end justify-between">
                    <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center gap-2 mb-1">
                             <span className="px-2 py-0.5 rounded-md bg-brand-500/20 text-brand-400 text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-brand-400/30">
                                {bag.category}
                             </span>
                        </div>
                        <h1 className="text-3xl font-black text-white leading-tight drop-shadow-2xl truncate">{bag.storeName}</h1>
                    </div>
                    <div className="w-12 h-12 rounded-2xl glass-pane flex items-center justify-center animate-bounce-slow">
                         <StoreAvatar name={bag.storeName} color1={bag.color1} color2={bag.color2} size="w-8 h-8" />
                    </div>
                </div>
            </header>

            <main className="px-6 -mt-6 relative z-20 space-y-6 flex-1" ref={scrollContainerRef}>
                
                {/* 1. Value/Menu Section */}
                {isSelectable ? (
                    <section className="glass-pane rounded-4xl p-6 border-white shadow-xl space-y-5 card-stagger">
                        <div className="flex items-center gap-2 mb-2">
                             <Utensils className="w-5 h-5 text-brand-600" />
                             <h2 className="font-black dm-text tracking-widest uppercase text-xs">Select Your Menu</h2>
                        </div>
                        <div className="space-y-6">
                            {bag.items.map((item, idx) => (
                                <div key={item.id} className="flex items-center gap-4 group">
                                    <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg shrink-0 border-2 border-white group-hover:scale-110 transition-transform duration-500">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-black text-gray-800 dm-text text-sm leading-tight mb-1">{item.name}</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-brand-600 font-extrabold text-base leading-none italic">฿{item.price}</span>
                                            <span className="text-gray-300 text-[10px] line-through font-bold">฿{item.originalPrice}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center bg-gray-50 dm-bg-secondary p-1 rounded-xl gap-3 shadow-inner border border-gray-100">
                                        <button onClick={() => updateCart(item.id, -1)}
                                            className={`w-7 h-7 flex items-center justify-center rounded-lg bg-white shadow-sm transition-all active:scale-75 disabled:opacity-30`}
                                            disabled={!cart[item.id]}>
                                            <Minus className="w-4 h-4 text-gray-600" />
                                        </button>
                                        <span className="text-sm font-black w-4 text-center text-gray-800 dm-text">{cart[item.id] || 0}</span>
                                        <button onClick={() => updateCart(item.id, 1)}
                                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-brand-500 shadow-lg active:scale-75 transition-all">
                                            <Plus className="w-4 h-4 text-white" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                ) : (
                    <section className="glass-pane rounded-4xl p-6 border-white shadow-xl space-y-4 card-stagger">
                        <div className="flex items-center gap-2">
                             <Package className="w-5 h-5 text-brand-500" />
                             <h2 className="font-black text-gray-800 dm-text tracking-tight uppercase text-xs tracking-widest text-brand-600">Surprise Bag</h2>
                        </div>
                        <p className="text-gray-400 text-xs font-bold leading-relaxed">{bag.description}</p>
                        
                        <div className="bg-linear-to-br from-amber-400/10 to-orange-500/10 rounded-3xl p-5 border border-amber-200/50 relative overflow-hidden group hover:shadow-xl transition-all">
                             <div className="absolute top-[-20%] right-[-10%] w-20 h-20 bg-amber-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
                             <div className="flex items-center gap-2 mb-2">
                                 <TrendingUp className="w-4 h-4 text-amber-600" />
                                 <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Value Guarantee</span>
                             </div>
                             <p className="text-brand-900 dark:text-brand-100 text-xl font-black italic">
                                Worth ฿{bag.originalPrice}+
                             </p>
                             <p className="text-amber-700/60 text-[9px] font-black uppercase tracking-tighter mt-1">
                                ฿{bag.originalPrice - bag.sellingPrice} SAVINGS TARGET REACHED ✓
                             </p>
                        </div>
                    </section>
                )}

                {/* 2. Pickup & Info Sections */}
                <div className="grid grid-cols-2 gap-4 card-stagger" style={{ animationDelay: '0.1s' }}>
                    <div className="glass-pane p-5 rounded-3xl border-white shadow-sm flex flex-col items-center text-center gap-2">
                         <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                             <Clock className="w-5 h-5 text-orange-500" />
                         </div>
                         <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Window</p>
                         <p className="text-xs font-black text-gray-800">{bag.pickupStart} – {bag.pickupEnd}</p>
                    </div>
                    <div className="glass-pane p-5 rounded-3xl border-white shadow-sm flex flex-col items-center text-center gap-2">
                         <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                             <MapPin className="w-5 h-5 text-amber-500" />
                         </div>
                         <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Location</p>
                         <p className="text-xs font-black text-gray-800">{bag.distance}</p>
                    </div>
                </div>

                {/* 3. Review Section */}
                <section className="glass-pane rounded-4xl p-6 border-white shadow-xl card-stagger" style={{ animationDelay: '0.2s' }}>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                            <h2 className="font-black text-gray-800 dm-text tracking-widest uppercase text-xs">Top Reviews</h2>
                        </div>
                        <span className="text-[10px] text-brand-600 font-black bg-brand-50 px-2 py-1 rounded-lg">
                             Verified Deals Only
                        </span>
                    </div>

                    <ReviewList reviews={
                        showAllReviews
                            ? MOCK_REVIEWS.filter(r => r.storeId === bag.id)
                            : MOCK_REVIEWS.filter(r => r.storeId === bag.id).slice(0, 2)
                    } />

                    {MOCK_REVIEWS.filter(r => r.storeId === bag.id).length > 2 && (
                        <button
                            onClick={() => setShowAllReviews(!showAllReviews)}
                            className="w-full mt-6 py-3 text-[10px] text-gray-400 font-black uppercase tracking-widest border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors"
                        >
                            {showAllReviews ? 'Collapse Reviews' : `Show all ${MOCK_REVIEWS.filter(r => r.storeId === bag.id).length} Community Reviews`}
                        </button>
                    )}
                </section>
            </main>
        </div>

        {/* Truly Fixed Order Action Bar - Outside transform context */}
            <div className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md backdrop-blur-2xl p-6 pb-10 border-t shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-100 rounded-t-[2.5rem]
                ${isLastCall ? 'bg-red-50/95 dark:bg-red-950/95 border-red-100 dark:border-red-900/30' : 'bg-white/95 dm-card border-gray-100 dark:border-white/5'}`}>
                {/* Last Call urgency strip */}
                {isLastCall && (
                    <div className="flex items-center gap-2 mb-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl px-4 py-2.5">
                        <Timer className="w-4 h-4 text-white shrink-0 animate-pulse" />
                        <p className="text-white text-[10px] font-black uppercase tracking-widest">⏰ Last Call — Secure your spot before closing!</p>
                    </div>
                )}
                 <div className="flex items-center justify-between mb-5 px-3">
                     <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Savings</p>
                        <p className="text-brand-500 font-black text-sm italic">You save ฿{savings}</p>
                     </div>
                     <div className="text-right">
                         <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Checkout Amount</p>
                         <p className="text-2xl font-black text-gray-900 dm-text leading-none">฿{currentTotal}</p>
                     </div>
                 </div>

                 <button onClick={() => guard(handleConfirm, onNavigate)}
                    disabled={(!canCheckout && isSignedIn) || confirmed}
                    className={`w-full py-5 rounded-4xl text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all duration-500 active:scale-95 flex items-center justify-center gap-3
                    ${((!canCheckout && isSignedIn) || confirmed) ? 'bg-gray-200 text-gray-400 cursor-not-allowed hidden-shadow' :
                      !isSignedIn ? 'bg-brand-600 shadow-brand-200 glow-brand' :
                      isLastCall ? 'bg-gradient-to-r from-red-500 to-orange-500 shadow-red-200' :
                      'bg-linear-to-r from-brand-500 to-amber-600 shadow-brand-200 glow-brand'}`}>
                    {confirmed ? (
                        <div className="flex items-center gap-2">
                            <RefreshCw className="w-4 h-4 refresh-spin" />
                            <span>Securing Your Spot...</span>
                        </div>
                    ) : !isSignedIn ? (
                        <><Lock className="w-5 h-5" /> Sign In to Secure Bag</>
                    ) : isLastCall ? (
                        <div className="flex items-center gap-2">
                            <Timer className="w-5 h-5" />
                            <span>Secure My Spot Now</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <span>Confirm & Reserve Bag</span>
                            <ArrowRight className="w-4 h-4 animate-bounce-horizontal" />
                        </div>
                    )}
                </button>
            </div>
        </div>
    );
}

// ─── Help Components ───────────────────────────────────────────────────────────
const RefreshCw = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
);
