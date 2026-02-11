import { useState } from 'react';
import { Clock, MapPin, CheckCircle2, Package, ChevronRight, Star } from 'lucide-react';
import { BottomNav, StoreAvatar, useToast } from './Shared';
import { ReviewModal } from './Reviews';

export default function OrderHistory({ orders, onNavigate }) {
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const toast = useToast();

    const handleWriteReview = (order) => {
        setSelectedOrder(order);
        setReviewModalOpen(true);
    };

    const handleSubmitReview = (review) => {
        console.log("Review Submitted:", review, "For Order:", selectedOrder);
        toast('🎉 Review submitted! Thanks for your feedback.');
        setReviewModalOpen(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dm-bg page-enter-left flex flex-col">
            <ReviewModal
                isOpen={reviewModalOpen}
                onClose={() => setReviewModalOpen(false)}
                storeName={selectedOrder?.bag.storeName}
                onSubmit={handleSubmitReview}
            />
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 pt-12 pb-6 rounded-b-3xl flex-shrink-0">
                <div className="flex items-center gap-2 mb-1">
                    <Package className="w-5 h-5 text-emerald-200" />
                    <span className="text-emerald-100 text-sm font-medium">Order History</span>
                </div>
                <h1 className="text-white text-xl font-bold">Your Rescues 📦</h1>
                <p className="text-emerald-100 text-sm mt-1">{orders.length} bags rescued so far</p>
            </div>

            <div className="px-5 py-5 space-y-3 flex-1">
                {orders.length === 0 ? (
                    <div className="text-center py-16 page-fade-in">
                        <span className="text-5xl block mb-4">🛒</span>
                        <h3 className="text-lg font-bold text-gray-700 dm-text mb-2">No rescues yet</h3>
                        <p className="text-gray-400 dm-text-secondary text-sm mb-4">Your rescued bags will show up here.</p>
                        <button onClick={() => onNavigate('feed')}
                            className="bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-emerald-600 active:scale-95 transition-all btn-press">
                            Start Rescuing
                        </button>
                    </div>
                ) : (
                    orders.map((order, i) => (
                        <div key={order.id}
                            className="bg-white dm-card rounded-2xl shadow-sm border border-gray-100 p-4 card-stagger flex items-center gap-3"
                            style={{ animationDelay: `${i * 0.08}s` }}>
                            <StoreAvatar name={order.bag.storeName} color1={order.bag.color1} color2={order.bag.color2} />
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-gray-800 dm-text text-sm truncate">{order.bag.storeName}</h3>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-xs text-gray-400 dm-text-secondary flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {order.bag.pickupStart}–{order.bag.pickupEnd}
                                    </span>
                                    <span className="text-xs text-gray-400 dm-text-secondary flex items-center gap-1">
                                        <MapPin className="w-3 h-3" /> {order.bag.distance}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 mt-1">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                    <span className="text-xs text-emerald-600 font-medium">Confirmed at {order.time}</span>
                                </div>
                            </div>

                            <div className="text-right flex-shrink-0 flex flex-col items-end gap-2">
                                <div>
                                    <p className="text-emerald-600 font-extrabold">฿{order.bag.sellingPrice}</p>
                                    <p className="text-gray-400 text-xs line-through">฿{order.bag.originalPrice}</p>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleWriteReview(order); }}
                                    className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold flex items-center gap-1 active:scale-90 transition-transform"
                                >
                                    <Star className="w-3 h-3" /> Review
                                </button>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                        </div>
                    ))
                )}
            </div>
            <BottomNav active="history" onNavigate={onNavigate} />
        </div >
    );
}
