import { useState, useEffect } from 'react';
import {
    ChevronLeft, Clock, Star, Package, Heart,
    Sparkles, Shield, MapPin, CheckCircle2, Minus, Plus, Utensils
} from 'lucide-react';
import { Confetti, StoreAvatar, useToast } from './Shared';

// ─── Success Screen ─────────────────────────────────────────────────────────────
function SuccessScreen({ bag, onBack, cart, total }) {
    const [showContent, setShowContent] = useState(false);
    const [showConfetti, setShowConfetti] = useState(true);

    useEffect(() => {
        setTimeout(() => setShowContent(true), 300);
        setTimeout(() => setShowConfetti(false), 4000);
    }, []);

    const selectedItems = cart ? Object.entries(cart).map(([id, qty]) => {
        const item = bag.items.find(i => i.id === parseInt(id));
        return { ...item, qty };
    }).filter(i => i.qty > 0) : [];

    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-500 to-emerald-700 flex flex-col items-center justify-center p-6 text-center page-zoom-in">
            {showConfetti && <Confetti />}
            <div className={`transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 glow-pulse">
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    </div>
                </div>
                <div className="text-4xl mb-4">🎉</div>
                <h1 className="text-white text-2xl font-extrabold mb-2">You're a Food Hero!</h1>
                <p className="text-emerald-100 text-sm mb-8">Your order has been reserved.</p>

                <div className="bg-white/15 backdrop-blur-md rounded-2xl p-5 mb-8 text-left border border-white/20">
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
                        <StoreAvatar name={bag.storeName} color1={bag.color1} color2={bag.color2} />
                        <div>
                            <p className="text-white font-bold">{bag.storeName}</p>
                            <p className="text-emerald-100 text-xs">{bag.category}</p>
                        </div>
                    </div>

                    {/* Order Summary */}
                    {selectedItems.length > 0 && (
                        <div className="mb-4 pb-3 border-b border-white/10 space-y-2">
                            {selectedItems.map(item => (
                                <div key={item.id} className="flex justify-between text-white text-sm">
                                    <span>{item.qty}x {item.name}</span>
                                    <span>฿{item.price * item.qty}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-emerald-100 text-sm">
                            <Clock className="w-4 h-4" /><span>Pickup: {bag.pickupStart} – {bag.pickupEnd}</span>
                        </div>
                        <div className="flex items-center gap-2 text-white text-sm font-semibold">
                            <Sparkles className="w-4 h-4 text-yellow-300" />
                            <span>Paid: ฿{total || bag.sellingPrice}</span>
                        </div>
                    </div>
                </div>

                <button onClick={onBack}
                    className="w-full py-3.5 rounded-xl bg-white text-emerald-600 font-bold text-base
                     hover:bg-emerald-50 active:scale-95 transition-all shadow-lg btn-press">
                    Continue Rescuing Food
                </button>
            </div>
        </div>
    );
}

// ─── Booking Detail ─────────────────────────────────────────────────────────────
export default function BookingDetail({ bag, onBack, onAddOrder }) {
    const [confirmed, setConfirmed] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [cart, setCart] = useState({}); // { itemId: quantity }
    const toast = useToast();

    // Derived state for selectable bags
    const isSelectable = bag.type === 'selectable';

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
        toast('🎉 Order reserved successfully!');
        onAddOrder && onAddOrder({
            id: Date.now(), bag, status: 'confirmed',
            details: isSelectable ? cart : 'Surprise Bag',
            total: currentTotal,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
        setTimeout(() => setShowSuccess(true), 600);
    };

    if (showSuccess) return <SuccessScreen bag={bag} onBack={onBack} cart={isSelectable ? cart : null} total={currentTotal} />;

    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dm-bg page-enter">
            {/* Header */}
            <div className="relative h-64 rounded-b-3xl overflow-hidden shadow-xl">
                <img src={bag.image} alt={bag.storeName} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

                <div className="absolute top-0 left-0 w-full p-5 pt-12 flex justify-between items-start">
                    <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-all btn-press text-white">
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                        <p className="text-white text-xs font-medium">Remaining: {bag.remaining}</p>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-6 text-center">
                    <h1 className="text-white text-3xl font-bold shadow-sm">{bag.storeName}</h1>
                    <div className="flex items-center justify-center gap-2 mt-2 text-white/90 text-sm">
                        <StoreAvatar name={bag.storeName} color1={bag.color1} color2={bag.color2} size="w-5 h-5" />
                        <span>{bag.category} • {isSelectable ? 'Select Items' : 'Surprise Bag'}</span>
                    </div>
                </div>
            </div>

            <div className="px-5 -mt-4 space-y-4 pb-6">
                {/* Content Section */}
                {isSelectable ? (
                    /* Selectable Menu */
                    <div className="bg-white dm-card rounded-2xl shadow-md border border-emerald-100 p-5 page-fade-in">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                <Utensils className="w-4 h-4 text-emerald-600" />
                            </div>
                            <h2 className="font-bold text-gray-800 dm-text">Menu Selection</h2>
                        </div>
                        <div className="space-y-4">
                            {bag.items.map(item => (
                                <div key={item.id} className="flex items-center gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-800 dm-text text-sm truncate">{item.name}</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-emerald-600 font-bold text-sm">฿{item.price}</span>
                                            <span className="text-gray-400 text-xs line-through">฿{item.originalPrice}</span>
                                        </div>
                                    </div>
                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-3 bg-gray-50 dm-bg border border-gray-100 rounded-lg p-1">
                                        <button onClick={() => updateCart(item.id, -1)}
                                            className="w-6 h-6 flex items-center justify-center rounded-md bg-white dm-card shadow-sm text-gray-600 dm-text-secondary hover:text-emerald-600 active:scale-90 transition-transform disabled:opacity-50"
                                            disabled={!cart[item.id]}>
                                            <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="text-sm font-bold w-4 text-center text-gray-800 dm-text">{cart[item.id] || 0}</span>
                                        <button onClick={() => updateCart(item.id, 1)}
                                            className="w-6 h-6 flex items-center justify-center rounded-md bg-emerald-500 shadow-sm text-white active:scale-90 transition-transform">
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* Surprise Bag Guarantee */
                    <div className="bg-white dm-card rounded-2xl shadow-md border border-emerald-100 p-5 page-fade-in">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                <Package className="w-4 h-4 text-emerald-600" />
                            </div>
                            <h2 className="font-bold text-gray-800 dm-text">What's in the bag?</h2>
                        </div>
                        <p className="text-gray-500 dm-text-secondary text-sm mb-4">{bag.description}</p>
                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-4 border border-emerald-100 dark:border-emerald-800 glow-pulse">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="w-4 h-4 text-amber-500" />
                                <span className="text-sm font-bold text-emerald-800">Value Guarantee</span>
                            </div>
                            <p className="text-emerald-700 text-sm font-semibold">
                                You will get items worth at least <span className="text-lg font-extrabold">฿{bag.originalPrice}</span>
                            </p>
                            <p className="text-emerald-600/70 text-xs mt-1">That's a minimum {Math.round(((bag.originalPrice - bag.sellingPrice) / bag.originalPrice) * 100)}% savings!</p>
                        </div>
                    </div>
                )}

                {/* Price summary (Conditional) */}
                <div className="bg-white dm-card rounded-2xl shadow-sm border border-gray-100 p-5 page-fade-in" style={{ animationDelay: '0.1s' }}>
                    <h3 className="font-bold text-gray-800 dm-text mb-3">Summary</h3>
                    <div className="space-y-2">
                        {!isSelectable && (
                            <div className="flex justify-between"><span className="text-gray-500 dm-text-secondary text-sm">Original Value</span><span className="text-gray-400 text-sm line-through">฿{bag.originalPrice}</span></div>
                        )}
                        <div className="flex justify-between items-center"><span className="text-gray-500 dm-text-secondary text-sm">Total to Pay</span><span className="text-emerald-600 text-xl font-extrabold">฿{currentTotal}</span></div>
                        {savings > 0 && (
                            <div className="border-t border-dashed border-gray-200 pt-2 flex justify-between items-center">
                                <span className="text-emerald-600 text-sm font-semibold">You Save</span>
                                <span className="text-emerald-500 text-sm font-bold bg-emerald-50 px-3 py-1 rounded-full">฿{savings}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Pickup info */}
                <div className="bg-white dm-card rounded-2xl shadow-sm border border-gray-100 p-5 page-fade-in" style={{ animationDelay: '0.2s' }}>
                    <h3 className="font-bold text-gray-800 dm-text mb-3">Pickup Details</h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center"><Clock className="w-5 h-5 text-emerald-600" /></div>
                            <div><p className="text-sm font-semibold text-gray-700 dm-text">Pickup Window</p><p className="text-xs text-gray-400 dm-text-secondary">{bag.pickupStart} – {bag.pickupEnd}</p></div>
                        </div>
                        <div className="flex items-center gap-3">
                            <StoreAvatar name={bag.storeName} color1={bag.color1} color2={bag.color2} />
                            <div><p className="text-sm font-semibold text-gray-700 dm-text">{bag.storeName}</p><p className="text-xs text-gray-400 dm-text-secondary">{bag.distance} from you</p></div>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <button onClick={handleConfirm} disabled={!canCheckout || confirmed}
                    className={`w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg transition-all duration-300 btn-press
            ${(!canCheckout || confirmed) ? 'bg-gray-400 cursor-not-allowed hidden-shadow' : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-emerald-200 active:scale-95'}`}>
                    {confirmed ? '⏳ Processing...' : (isSelectable && currentTotal === 0 ? 'Select Items to Rescue' : `Confirm & Pay ฿${currentTotal}`)}
                </button>
            </div>
        </div>
    );
}
