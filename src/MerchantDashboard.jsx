import { useState, useEffect, useCallback } from 'react';
import {
    Store, Minus, Plus, ToggleLeft, ToggleRight, CheckCircle2,
    AlertTriangle, TrendingUp, Sparkles, Lock, Clock, Heart, Star, MapPin,
    Zap, Info, RefreshCw, ChevronDown, ChevronRight, LogOut, HandHeart, Leaf
} from 'lucide-react';
import { useToast, useAuthGuard, useAuth } from './Shared';
import { Confetti } from './Shared';
import { suggestPrice, fetchAITip } from './PricingEngine';
import { CATEGORIES } from './data';

// ─── Smart Price Panel ─────────────────────────────────────────────────────────
function SmartPricePanel({ suggestion, loading, onSelect, currentPrice }) {
    if (!suggestion && !loading) return null;

    return (
        <div className="mt-4 glass-pane rounded-3xl p-5 border-brand-100 dark:border-brand-900 shadow-xl shadow-brand-500/5 animate-slide-in">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-brand-500 fill-brand-500" />
                    <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest">AI Pricing Suggestion</span>
                </div>
                {loading && <RefreshCw className="w-3.5 h-3.5 text-brand-400 refresh-spin" />}
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                    { label: 'Fast Sell', price: suggestion?.low },
                    { label: 'Recommended', price: suggestion?.suggested, highlight: true },
                    { label: 'Max Value', price: suggestion?.high }
                ].map((opt) => (
                    <button
                        key={opt.label}
                        onClick={() => onSelect(opt.price)}
                        className={`p-3 rounded-2xl flex flex-col items-center gap-1 transition-all active:scale-95 border
                        ${opt.price === currentPrice 
                            ? 'bg-brand-600 border-transparent text-white shadow-lg' 
                            : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 text-gray-800 hover:border-brand-200'}`}
                    >
                        <span className={`text-[8px] font-black uppercase tracking-tighter ${opt.price === currentPrice ? 'text-brand-200' : 'text-gray-400'}`}>
                            {opt.label}
                        </span>
                        <span className="text-sm font-black italic">฿{opt.price || '...'}</span>
                    </button>
                ))}
            </div>

            <div className="bg-brand-50 dark:bg-brand-900/10 rounded-2xl p-3 flex items-start gap-3 border border-brand-100/50">
                <div className="w-6 h-6 rounded-lg bg-brand-500/10 flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                </div>
                <div>
                     <p className="text-[10px] text-brand-700 dark:text-brand-400 font-bold leading-relaxed italic">
                        {suggestion?.aiTip || suggestion?.tip || "Calculating best sell-out strategy..."}
                     </p>
                </div>
            </div>

            <div className="mt-3 flex items-center justify-between px-1">
                 <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Sell-out Chance: {suggestion?.probability}%</span>
                 </div>
                 <div className="h-1 w-20 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-500 rounded-full" style={{ width: `${suggestion?.probability}%` }} />
                 </div>
            </div>
        </div>
    );
}

// ─── Merchant Dashboard Redesign ────────────────────────────────────────────────
export default function MerchantDashboard({ onNavigate }) {
    const [quantity, setQuantity] = useState(5);
    const [price, setPrice] = useState(79);
    const [originalPrice, setOriginalPrice] = useState(200);
    const [category, setCategory] = useState(CATEGORIES[1]); // Default to 'Bakery'
    const [pickupStart, setPickupStart] = useState('18:00');
    const [pickupEnd, setPickupEnd] = useState('19:30');
    const [safetyCheck, setSafetyCheck] = useState(false);
    const [showPosted, setShowPosted] = useState(false);
    
    // AI Pricing State
    const [pricingSuggestion, setPricingSuggestion] = useState(null);
    const [loadingAI, setLoadingAI] = useState(false);
    
    const toast = useToast();
    const { guard, AuthGate, isSignedIn } = useAuthGuard();
    const { toggleBusinessMode } = useAuth();

    // Generate price suggestion when inputs change
    useEffect(() => {
        const suggestion = suggestPrice(category, originalPrice, quantity, pickupStart);
        setPricingSuggestion(prev => ({ ...suggestion, aiTip: prev?.aiTip }));
        
        // Optionally fetch AI tip (throttled/debounced)
        const fetchTip = async () => {
            setLoadingAI(true);
            const aiTip = await fetchAITip(category, suggestion.suggested, pickupStart);
            setPricingSuggestion(prev => ({ ...prev, aiTip }));
            setLoadingAI(false);
        };
        
        const timer = setTimeout(fetchTip, 1000);
        return () => clearTimeout(timer);
    }, [category, originalPrice, quantity, pickupStart]);

    const handlePost = () => {
        if (!safetyCheck) return;
        toast('🚀 Deal posted successfully!');
        setShowPosted(true);
    };

    const handleReset = () => {
        setShowPosted(false);
        setQuantity(5); setPrice(79); setSafetyCheck(false);
    };

    // Live Preview Savings calculation
    const savings = Math.round(((originalPrice - price) / (originalPrice || 1)) * 100);

    if (showPosted) {
        return (
            <div className="min-h-screen bg-slate-50 dm-bg page-zoom-in flex flex-col items-center justify-center px-6 text-center">
                <Confetti />
                <div className="w-24 h-24 rounded-[2.5rem] bg-brand-500 flex items-center justify-center mb-8 shadow-2xl shadow-brand-200 animate-bounce-slow">
                    <CheckCircle2 className="w-12 h-12 text-white" />
                </div>
                <h1 className="text-3xl font-black text-gray-900 dm-text mb-2 tracking-tight">Your Deal is Live! 🎉</h1>
                <p className="text-gray-400 dm-text-secondary font-bold uppercase tracking-widest text-[10px] mb-8">Customers can now rescue your surplus food</p>
                <div className="glass-pane w-full max-w-sm rounded-4xl p-6 border-white shadow-xl mb-10 text-left bg-white/5 backdrop-blur-3xl">
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100 dark:border-gray-800">
                        <div><p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Stock</p><p className="text-xl font-black text-gray-800">{quantity} Bags</p></div>
                        <div><p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Total Value</p><p className="text-xl font-black text-brand-600">฿{quantity * price}</p></div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center"><Clock className="w-5 h-5 text-gray-400" /></div>
                        <div><p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Pickup Time</p><p className="text-sm font-bold text-gray-700">{pickupStart} – {pickupEnd}</p></div>
                    </div>
                </div>
                <div className="flex flex-col gap-3 w-full max-w-sm">
                    {/* ── Donation CTA — Primary Action ── */}
                    <button
                        id="donate-unsold-bags-btn"
                        onClick={() => onNavigate('donation', { quantity, originalPrice })}
                        className="w-full py-5 rounded-4xl font-black text-sm text-white flex items-center justify-center gap-3 transition-all active:scale-95 relative overflow-hidden"
                        style={{ background: 'linear-gradient(135deg, #059669, #0d9488)', boxShadow: '0 0 30px rgba(5,150,105,0.30)' }}
                    >
                        <div className="absolute inset-0 bg-white/5 opacity-0 hover:opacity-100 transition-opacity" />
                        <HandHeart className="w-5 h-5 relative z-10" />
                        <span className="relative z-10 uppercase tracking-widest">🌿 Donate Unsold Bags & Claim Tax Deduction</span>
                    </button>

                    <div className="flex items-center gap-3 px-4 -mb-1">
                        <div className="flex-1 h-px bg-gray-100" />
                        <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">or</span>
                        <div className="flex-1 h-px bg-gray-100" />
                    </div>

                    <button onClick={() => onNavigate('feed')} className="w-full py-4 rounded-2xl bg-gray-900 text-white font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all">View in Discovery Feed</button>
                    <button onClick={handleReset} className="w-full py-4 rounded-2xl bg-white border border-gray-100 text-gray-500 font-black text-sm uppercase tracking-widest active:scale-95 transition-all">Post Another Deal</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dm-bg page-enter flex flex-col pb-28">
            <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-10 dark:opacity-5">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-200 rounded-full blur-[120px]" />
                <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-amber-100 rounded-full blur-[100px]" />
            </div>

            <header className="sticky top-0 z-50 glass-header px-6 pt-12 pb-6">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center">
                        <Store className="w-4 h-4 text-brand-600" />
                    </div>
                    <span className="text-brand-600 dark:text-brand-400 text-[10px] font-black uppercase tracking-widest">Merchant Dashboard</span>
                </div>
                <h1 className="text-2xl font-black text-gray-900 dm-text leading-tight">Create Surge Deal ✨</h1>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Ready in 30 seconds</p>
            </header>

            <div className="px-6 py-6 space-y-8 flex-1 relative">

                {/* ── Donate Surplus Quick Access ── */}
                <button
                    id="donate-surplus-quick-btn"
                    onClick={() => onNavigate('donation', { quantity, originalPrice })}
                    className="w-full rounded-4xl overflow-hidden relative group active:scale-[0.98] transition-all card-stagger"
                    style={{ background: 'linear-gradient(135deg, #064e3b, #065f46, #0d9488)', boxShadow: '0 8px 32px rgba(5,150,105,0.25)' }}
                >
                    {/* Subtle animated shimmer */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                    <div className="relative z-10 flex items-center gap-4 px-5 py-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
                            <HandHeart className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 text-left">
                            <p className="text-white font-black text-sm uppercase tracking-widest leading-tight">
                                🌿 Donate Surplus Food
                            </p>
                            <p className="text-emerald-300/80 text-[9px] font-bold uppercase tracking-widest mt-0.5">
                                Claim tax deduction · ESG report included
                            </p>
                        </div>
                        <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                            <ChevronRight className="w-4 h-4 text-white" />
                        </div>
                    </div>
                </button>

                {/* 0. Category Selection */}
                <div className="space-y-4 card-stagger">
                    <h3 className="font-black text-gray-800 dm-text flex items-center gap-2 text-sm uppercase tracking-widest">
                         What's the spread?
                    </h3>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6">
                         {CATEGORIES.slice(1).map(cat => (
                             <button key={cat} onClick={() => setCategory(cat)}
                                className={`shrink-0 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border
                                ${category === cat 
                                    ? 'bg-brand-600 border-transparent text-white shadow-lg scale-105' 
                                    : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 text-gray-400 hover:border-brand-200'}`}>
                                {cat}
                             </button>
                         ))}
                    </div>
                </div>

                {/* Step 1: Stock & Original Price */}
                <div className="space-y-4 card-stagger" style={{ animationDelay: '0.1s' }}>
                    <div className="flex items-center justify-between">
                         <h3 className="font-black text-gray-800 dm-text tracking-tight flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-brand-500 text-white text-[10px] flex items-center justify-center font-black">1</span>
                            Stock Details
                        </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="glass-pane rounded-3xl p-5 border-white shadow-sm flex flex-col items-center gap-3">
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quantity</p>
                             <div className="flex items-center justify-center gap-4">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center active:scale-90 transition-all">
                                    <Minus className="w-4 h-4 text-gray-600" />
                                </button>
                                <span className="text-3xl font-black text-gray-800">{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)}
                                    className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center active:scale-90 transition-all">
                                    <Plus className="w-4 h-4 text-brand-600" />
                                </button>
                             </div>
                        </div>
                        <div className="glass-pane rounded-3xl p-5 border-white shadow-sm flex flex-col items-center gap-3">
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Orig. Value (฿)</p>
                             <input type="number" value={originalPrice} onChange={e => setOriginalPrice(Number(e.target.value))}
                                className="w-full bg-transparent text-3xl font-black text-center text-gray-800 focus:outline-none" />
                        </div>
                    </div>
                </div>

                {/* Step 2: Smart Pricing */}
                <div className="space-y-4 card-stagger" style={{ animationDelay: '0.2s' }}>
                    <h3 className="font-black text-gray-800 dm-text tracking-tight flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-brand-500 text-white text-[10px] flex items-center justify-center font-black">2</span>
                        Your Rescue Price
                    </h3>
                    
                    <div className="glass-pane rounded-3xl p-6 border-white shadow-xl relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-2">
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Set Price (฿)</p>
                             <div className="flex items-center gap-1.5 bg-brand-50 dark:bg-brand-900/30 px-2 py-1 rounded-lg">
                                 <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest">฿{originalPrice} Original</span>
                             </div>
                        </div>
                        <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))}
                            className="w-full bg-transparent text-4xl font-black text-center text-gray-900 dm-text focus:outline-none mb-2" />
                        
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-brand-500 font-bold text-xs uppercase tracking-widest">{savings}% SAVINGS TO CUSTOMER</span>
                        </div>

                        {/* Smart Price Panel */}
                        <SmartPricePanel 
                            suggestion={pricingSuggestion} 
                            loading={loadingAI} 
                            onSelect={setPrice} 
                            currentPrice={price} 
                        />
                    </div>
                </div>

                {/* Step 3: Live Preview Plate */}
                <div className="space-y-4 card-stagger" style={{ animationDelay: '0.3s' }}>
                    <h3 className="font-black text-gray-800 dm-text tracking-tight flex items-center gap-2 text-sm uppercase tracking-widest opacity-60">
                        <Sparkles className="w-4 h-4 text-amber-500" /> Card Preview
                    </h3>
                    <div className="relative group perspective-1000">
                        <div className="scale-90 origin-top pointer-events-none">
                            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                                <div className="h-40 bg-gray-200 relative">
                                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                                    <div className="absolute top-3 right-3 bg-linear-to-br from-amber-400 to-orange-500 text-white px-2 py-1 rounded-lg text-[10px] font-black">
                                        {savings}% OFF
                                    </div>
                                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md" />
                                        <h4 className="text-white font-black text-sm">Your Shop Name</h4>
                                    </div>
                                </div>
                                <div className="p-4 flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold mb-1"><Clock className="w-3 h-3" /> {pickupStart} – {pickupEnd}</div>
                                        <p className="text-xs font-black text-red-500 uppercase">Only {quantity} left!</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-gray-300 line-through font-bold leading-none">฿{originalPrice}</p>
                                        <p className="text-xl font-black text-brand-600 leading-none">฿{price}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Steps 4 & 5: Time & Verification */}
                <div className="space-y-6 card-stagger" style={{ animationDelay: '0.4s' }}>
                    <h3 className="font-black text-gray-800 dm-text tracking-tight flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-brand-500 text-white text-[10px] flex items-center justify-center font-black">4</span>
                        Final Details
                    </h3>
                    
                    <div className="glass-pane rounded-4xl p-5 shadow-sm border-white grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Starts At</p>
                            <input type="time" value={pickupStart} onChange={e => setPickupStart(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-slate-800 p-3 rounded-2xl font-black text-gray-700 dark:text-white" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Ends At</p>
                            <input type="time" value={pickupEnd} onChange={e => setPickupEnd(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-slate-800 p-3 rounded-2xl font-black text-gray-700 dark:text-white" />
                        </div>
                    </div>

                    <div className={`glass-pane rounded-4xl p-6 transition-all duration-500 border-2 
                        ${safetyCheck ? 'border-brand-500 shadow-xl shadow-brand-500/5' : 'border-white shadow-sm opacity-80'}`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors 
                                    ${safetyCheck ? 'bg-brand-500 text-white' : 'bg-orange-50 text-orange-500'}`}
                                >
                                    <AlertTriangle className="w-6 h-6" />
                                </div>
                                <div><h4 className="font-black text-gray-800 text-sm">Quality Standards</h4><p className="text-gray-400 text-[10px] font-bold uppercase">Ready for Rescue ✓</p></div>
                            </div>
                            <button onClick={() => { setSafetyCheck(!safetyCheck); if (!safetyCheck) toast('✅ Verified!'); }} className="btn-press">
                                {safetyCheck ? <ToggleRight className="w-14 h-8 text-brand-500" /> : <ToggleLeft className="w-14 h-8 text-gray-300" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Final Action */}
                <button
                    onClick={() => guard(handlePost, onNavigate)}
                    disabled={(!safetyCheck && isSignedIn)}
                    className={`w-full py-5 rounded-4xl font-black text-lg shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 text-white card-stagger
                    ${!isSignedIn ? 'bg-gray-400 cursor-not-allowed' : safetyCheck ? 'bg-linear-to-r from-brand-500 via-brand-600 to-amber-600 shadow-brand-200 glow-brand' : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'}`}
                    style={{ animationDelay: '0.4s' }}
                >
                    {!isSignedIn ? (<><Lock className="w-6 h-6" /> SIGN IN TO POST</>) : safetyCheck ? (<><Sparkles className="w-6 h-6" /> LAUNCH SURGE DEAL</>) : '⚠️ VERIFICATION REQUIRED'}
                </button>

                {/* Exit Portal Access */}
                <div className="pt-4 flex justify-center">
                    <button 
                        onClick={() => {
                            toggleBusinessMode();
                            toast('🏠 Back to Hero Discovery!');
                        }}
                        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-brand-600 transition-all text-[10px] font-black uppercase tracking-widest"
                    >
                        <LogOut className="w-4 h-4 rotate-180" />
                        Exit Business Portal
                    </button>
                </div>
            </div>
            <AuthGate />
        </div>
    );
}
