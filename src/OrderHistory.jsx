import { useState } from 'react';
import { Clock, MapPin, CheckCircle2, Package, ChevronRight, Star, ArrowLeft } from 'lucide-react';
import { StoreAvatar, useToast, useDarkMode } from './Shared';
import { ReviewModal } from './Reviews';

export default function OrderHistory({ orders, onNavigate }) {
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const toast = useToast();
    const { dark } = useDarkMode();

    const handleWriteReview = (order) => {
        setSelectedOrder(order);
        setReviewModalOpen(true);
    };

    const handleSubmitReview = (review) => {
        toast('🎉 Review submitted! Thanks for your feedback.');
        setReviewModalOpen(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 dm-bg page-enter-left flex flex-col pb-24">
            <ReviewModal
                isOpen={reviewModalOpen}
                onClose={() => setReviewModalOpen(false)}
                storeName={selectedOrder?.bag.storeName}
                onSubmit={handleSubmitReview}
            />

            {/* Background Blobs for consistency */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-10 dark:opacity-5">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-200 rounded-full blur-[120px]" />
                <div className="absolute bottom-[20%] left-[-10%] w-[40%] h-[40%] bg-amber-100 rounded-full blur-[100px]" />
            </div>

            {/* Premium Glass Header */}
            <header className="sticky top-0 z-50 glass-header px-6 pt-12 pb-6">
                <div className="flex items-center gap-3 mb-2">
                    <button onClick={() => onNavigate('feed')} className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all active:scale-90">
                        <ArrowLeft className="w-5 h-5 text-gray-700 dm-text" />
                    </button>
                    <div className="flex items-center gap-2 mb-0.5">
                        <Package className="w-4 h-4 text-brand-600" />
                        <span className="text-brand-600 dark:text-brand-400 text-[10px] font-black uppercase tracking-widest">Order History</span>
                    </div>
                </div>
                <h1 className="text-2xl font-black text-gray-900 dm-text leading-tight px-1">Your Rescues 📦</h1>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1 px-1">
                    {orders.length} meals saved so far
                </p>
            </header>

            <div className="px-6 py-4 space-y-4 flex-1 relative">
                {orders.length === 0 ? (
                    <div className="flex flex-col items-center py-16 page-fade-in">
                        {/* Illustrated empty state */}
                        <div className="relative mb-8">
                            <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center shadow-xl shadow-amber-200/50 border border-amber-100">
                                <span className="text-6xl animate-bounce-slow">🛍️</span>
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-brand-500 flex items-center justify-center shadow-lg">
                                <span className="text-lg">✨</span>
                            </div>
                        </div>

                        <h3 className="text-2xl font-black text-gray-900 dm-text tracking-tight mb-2">Nothing rescued yet</h3>
                        <p className="text-gray-400 text-sm font-medium max-w-[220px] mx-auto text-center leading-relaxed mb-8">
                            Grab surplus food from nearby restaurants at <span className="font-black text-brand-600">50–80% off</span> before it goes to waste.
                        </p>

                        {/* Quick category preview */}
                        <div className="flex gap-2 mb-8 flex-wrap justify-center">
                            {['🥐 Bakery', '🍜 Thai', '🥗 Healthy', '☕ Café'].map(cat => (
                                <span key={cat} className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-xs font-bold text-gray-600 dm-text shadow-sm">{cat}</span>
                            ))}
                        </div>

                        <button onClick={() => onNavigate('feed')}
                            className="bg-gradient-to-r from-brand-500 to-amber-500 text-white px-10 py-4 rounded-2xl font-black text-sm shadow-xl shadow-brand-200 active:scale-95 transition-all">
                            Browse Nearby Deals
                        </button>
                    </div>
                ) : (
                    orders.map((order, i) => (
                        <div key={order.id}
                            className="bg-white dm-card rounded-4xl shadow-sm border border-gray-100 p-5 card-stagger flex items-center gap-4 group hover:shadow-xl hover:shadow-brand-900/10 transition-all duration-300"
                            style={{ animationDelay: `${i * 0.08}s` }}>
                            <StoreAvatar name={order.bag.storeName} color1={order.bag.color1} color2={order.bag.color2} />
                            
                            <div className="flex-1 min-w-0">
                                <h3 className="font-black text-gray-800 dm-text text-base leading-tight truncate mb-1">{order.bag.storeName}</h3>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                                        <Clock className="w-3 h-3" /> {order.bag.pickupStart}–{order.bag.pickupEnd}
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                                        <MapPin className="w-3 h-3" /> {order.bag.distance}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 mt-2 bg-brand-50 dark:bg-brand-900/20 w-fit px-2 py-0.5 rounded-lg border border-brand-100 dark:border-brand-900/30">
                                    <CheckCircle2 className="w-3 h-3 text-brand-500" />
                                    <span className="text-[10px] text-brand-700 dark:text-brand-400 font-black uppercase tracking-tight">Success at {order.time}</span>
                                </div>
                            </div>

                            <div className="text-right shrink-0 flex flex-col items-end gap-2.5">
                                <div>
                                    <p className="text-brand-600 dark:text-brand-400 text-lg font-black leading-none">฿{order.bag.sellingPrice}</p>
                                    <p className="text-gray-300 text-[10px] line-through font-bold">฿{order.bag.originalPrice}</p>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleWriteReview(order); }}
                                    className="px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-700 dm-text text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 active:scale-95 transition-transform hover:bg-white dark:hover:bg-gray-700 group-hover:bg-amber-50 group-hover:text-amber-600 group-hover:border-amber-100"
                                >
                                    <Star className="w-3 h-3" /> Review
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
            
            <div className="mt-12 px-10 text-center opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-3">Community Savings</p>
                 <div className="flex justify-center gap-8">
                     <div className="flex flex-col items-center">
                         <span className="text-lg font-black text-gray-800">฿84.2K</span>
                         <span className="text-[8px] font-bold text-gray-400 uppercase">Rescued Area Value</span>
                     </div>
                     <div className="flex flex-col items-center">
                         <span className="text-lg font-black text-gray-800">1.2K</span>
                         <span className="text-[8px] font-bold text-gray-400 uppercase">CO2 Offset (kg)</span>
                     </div>
                 </div>
            </div>
        </div>
    );
}
