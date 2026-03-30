import { useState } from 'react';
import { Star, X, User, ThumbsUp } from 'lucide-react';

export function ReviewList({ reviews }) {
    if (!reviews || reviews.length === 0) {
        return (
            <div className="text-center py-10 bg-gray-50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-gray-200 dark:border-white/10">
                <p className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-widest">No reviews yet. Be the first!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {reviews.map(review => (
                <div key={review.id} className="border-b border-gray-100 dark:border-white/5 pb-6 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center border-2 border-white dark:border-slate-700 shadow-sm">
                                <User className="w-4 h-4 text-gray-400" />
                            </div>
                            <div>
                                <p className="text-sm font-black text-gray-800 dm-text tracking-tight">{review.user}</p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <div className="flex text-amber-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-2.5 h-2.5 ${i < review.rating ? 'fill-current' : 'text-gray-200 dark:text-gray-700'}`} />
                                        ))}
                                    </div>
                                    <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{review.date}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed font-medium pl-1">{review.text}</p>
                    {review.tags && (
                        <div className="flex flex-wrap gap-2 mt-4 pl-1">
                            {review.tags.map(tag => (
                                <span key={tag} className="text-[9px] font-black uppercase tracking-widest bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 px-3 py-1 rounded-lg border border-gray-100 dark:border-white/5">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export function ReviewModal({ isOpen, onClose, storeName, onSubmit }) {
    const [rating, setRating] = useState(0);
    const [text, setText] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (rating === 0) return;
        onSubmit({ rating, text });
        setRating(0);
        setText('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-1000 flex items-center justify-center p-5">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="bg-white rounded-2xl w-full max-w-sm relative z-10 p-6 shadow-2xl page-zoom-in">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold text-gray-800 mb-1">Rate your experience</h2>
                <p className="text-sm text-gray-500 mb-6">How was your bag from {storeName}?</p>

                <div className="flex justify-center gap-2 mb-6">
                    {[1, 2, 3, 4, 5].map(star => (
                        <button key={star} onClick={() => setRating(star)} className="transition-transform active:scale-90">
                            <Star className={`w-8 h-8 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                        </button>
                    ))}
                </div>

                <textarea
                    placeholder="Tell us more... (optional)"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    className="w-full bg-gray-50 rounded-xl p-3 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-brand-500/50 resize-none h-24"
                />

                <button
                    onClick={handleSubmit}
                    disabled={rating === 0}
                    className={`w-full py-3 rounded-xl font-bold text-white transition-all
                        ${rating > 0 ? 'bg-brand-500 hover:bg-brand-600 shadow-lg shadow-brand-200' : 'bg-gray-300 cursor-not-allowed'}`}
                >
                    Submit Review
                </button>
            </div>
        </div>
    );
}
