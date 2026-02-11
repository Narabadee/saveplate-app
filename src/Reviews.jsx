import { useState } from 'react';
import { Star, X, User, ThumbsUp } from 'lucide-react';

export function ReviewList({ reviews }) {
    if (!reviews || reviews.length === 0) {
        return (
            <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <p className="text-gray-400 text-sm">No reviews yet. Be the first!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {reviews.map(review => (
                <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                <User className="w-4 h-4 text-gray-500" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-800">{review.user}</p>
                                <div className="flex text-amber-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`} />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <span className="text-xs text-gray-400">{review.date}</span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{review.text}</p>
                    {review.tags && (
                        <div className="flex gap-1 mt-2">
                            {review.tags.map(tag => (
                                <span key={tag} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
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
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-5">
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
                    className="w-full bg-gray-50 rounded-xl p-3 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none h-24"
                />

                <button
                    onClick={handleSubmit}
                    disabled={rating === 0}
                    className={`w-full py-3 rounded-xl font-bold text-white transition-all
                        ${rating > 0 ? 'bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-200' : 'bg-gray-300 cursor-not-allowed'}`}
                >
                    Submit Review
                </button>
            </div>
        </div>
    );
}
