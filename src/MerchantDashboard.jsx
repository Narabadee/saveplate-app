import { useState } from 'react';
import {
    Store, Minus, Plus, ToggleLeft, ToggleRight, CheckCircle2,
    AlertTriangle, TrendingUp, Sparkles
} from 'lucide-react';
import { BottomNav, useToast } from './Shared';

export default function MerchantDashboard({ onNavigate }) {
    const [quantity, setQuantity] = useState(5);
    const [price, setPrice] = useState(79);
    const [pickupStart, setPickupStart] = useState('18:00');
    const [pickupEnd, setPickupEnd] = useState('19:30');
    const [safetyCheck, setSafetyCheck] = useState(false);
    const [posted, setPosted] = useState(false);
    const [showPosted, setShowPosted] = useState(false);
    const toast = useToast();

    const handlePost = () => {
        if (!safetyCheck) return;
        setPosted(true);
        toast('🚀 Deal posted successfully!');
        setTimeout(() => setShowPosted(true), 200);
    };

    const handleReset = () => {
        setPosted(false); setShowPosted(false);
        setQuantity(5); setPrice(79); setSafetyCheck(false);
    };

    if (showPosted) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dm-bg page-zoom-in">
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 pt-12 pb-6 rounded-b-3xl">
                    <div className="flex items-center gap-2 mb-1"><Store className="w-5 h-5 text-emerald-200" /><span className="text-emerald-100 text-sm font-medium">Merchant Dashboard</span></div>
                    <h1 className="text-white text-xl font-bold">Deal Posted! 🎉</h1>
                </div>
                <div className="px-5 py-8 text-center">
                    <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4 glow-pulse">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 dm-text mb-2">Your Surprise Bags are Live!</h2>
                    <p className="text-gray-500 dm-text-secondary text-sm mb-6">
                        {quantity} bags at ฿{price} each • Pickup {pickupStart}–{pickupEnd}
                    </p>
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
                        <p className="text-emerald-700 text-sm font-medium">
                            💡 Estimated revenue: <span className="font-bold">฿{quantity * price}</span> from food that would've gone to waste.
                        </p>
                    </div>
                    <button onClick={handleReset}
                        className="w-full py-3.5 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 active:scale-95 transition-all shadow-md shadow-emerald-200 btn-press">
                        Post Another Deal
                    </button>
                </div>
                <BottomNav active="merchant" onNavigate={onNavigate} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dm-bg page-enter flex flex-col">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 pt-12 pb-6 rounded-b-3xl flex-shrink-0">
                <div className="flex items-center gap-2 mb-1"><Store className="w-5 h-5 text-emerald-200" /><span className="text-emerald-100 text-sm font-medium">Merchant Dashboard</span></div>
                <h1 className="text-white text-xl font-bold">Post a Surprise Deal ✨</h1>
                <p className="text-emerald-100 text-sm mt-1">30 seconds. That's all it takes.</p>
            </div>

            <div className="px-5 py-5 space-y-4 flex-1">
                {/* No-photo banner */}
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3.5 flex items-start gap-3 page-fade-in">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div><p className="text-amber-800 dark:text-amber-200 text-sm font-semibold">No photo needed!</p><p className="text-amber-700 dark:text-amber-300 text-xs">We use your shop profile image. Just set quantity, price, and time.</p></div>
                </div>

                {/* Quantity */}
                <div className="bg-white dm-card rounded-2xl shadow-sm border border-gray-100 p-5 card-stagger" style={{ animationDelay: '0.1s' }}>
                    <label className="text-sm font-bold text-gray-700 dm-text mb-3 block">How many bags? 🛍️</label>
                    <div className="flex items-center justify-center gap-5">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 flex items-center justify-center transition-all active:scale-90 btn-press">
                            <Minus className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        </button>
                        <span className="text-4xl font-extrabold text-gray-800 dm-text w-16 text-center">{quantity}</span>
                        <button onClick={() => setQuantity(quantity + 1)}
                            className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 hover:bg-emerald-200 dark:hover:bg-emerald-800/50 flex items-center justify-center transition-all active:scale-90 btn-press">
                            <Plus className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </button>
                    </div>
                </div>

                {/* Price */}
                <div className="bg-white dm-card rounded-2xl shadow-sm border border-gray-100 p-5 card-stagger" style={{ animationDelay: '0.2s' }}>
                    <label className="text-sm font-bold text-gray-700 dm-text mb-3 block">Price per bag? 💰</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-lg font-bold">฿</span>
                        <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))}
                            className="w-full pl-10 pr-4 py-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-2xl font-bold text-gray-800 dm-text
                         focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all" />
                    </div>
                    <div className="mt-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 flex items-start gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-emerald-700 dark:text-emerald-300"><span className="font-semibold">Auto hint:</span> Original value shown: <span className="font-bold">฿{price * 2}+</span> (50%+ savings)</p>
                    </div>
                </div>

                {/* Pickup Time */}
                <div className="bg-white dm-card rounded-2xl shadow-sm border border-gray-100 p-5 card-stagger" style={{ animationDelay: '0.3s' }}>
                    <label className="text-sm font-bold text-gray-700 dm-text mb-3 block">Pickup Time ⏰</label>
                    <div className="flex items-center gap-3">
                        <input type="time" value={pickupStart} onChange={e => setPickupStart(e.target.value)}
                            className="flex-1 py-3 px-4 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-800 dm-text font-medium focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all dark:[color-scheme:dark]" />
                        <span className="text-gray-400 font-medium">to</span>
                        <input type="time" value={pickupEnd} onChange={e => setPickupEnd(e.target.value)}
                            className="flex-1 py-3 px-4 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-800 dm-text font-medium focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all dark:[color-scheme:dark]" />
                    </div>
                </div>

                {/* Safety Toggle */}
                <div className="bg-white dm-card rounded-2xl shadow-sm border border-gray-100 p-5 card-stagger" style={{ animationDelay: '0.4s' }}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-start gap-3 flex-1">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0">
                                <AlertTriangle className="w-5 h-5 text-orange-500" />
                            </div>
                            <div><p className="text-sm font-bold text-gray-700 dm-text">Food Safety Check</p><p className="text-xs text-gray-400 dm-text-secondary mt-0.5">Confirm temperature & quality standards</p></div>
                        </div>
                        <button onClick={() => { setSafetyCheck(!safetyCheck); if (!safetyCheck) toast('✅ Safety confirmed!'); }} className="flex-shrink-0 ml-3 btn-press">
                            {safetyCheck ? <ToggleRight className="w-12 h-7 text-emerald-500" /> : <ToggleLeft className="w-12 h-7 text-gray-300 dark:text-gray-600" />}
                        </button>
                    </div>
                    {safetyCheck && (
                        <div className="mt-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-2.5 flex items-center gap-2 page-fade-in">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" /><span className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">Quality confirmed ✓</span>
                        </div>
                    )}
                </div>

                <button onClick={handlePost} disabled={!safetyCheck}
                    className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all duration-300 btn-press
            ${safetyCheck ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-emerald-200 active:scale-95'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'}`}>
                    {safetyCheck ? '🚀 Post Surprise Deal Now' : '⚠️ Enable Safety Check First'}
                </button>
            </div>
            <BottomNav active="merchant" onNavigate={onNavigate} />
        </div>
    );
}
