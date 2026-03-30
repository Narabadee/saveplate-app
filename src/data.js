// ─── Mock Data ──────────────────────────────────────────────────────────────────
export const MOCK_BAGS = [
    {
        id: 1, storeName: "Grandma's Bakery", category: 'Bakery', categoryIcon: 'Cake',
        rating: 4.8, reviews: 234, originalPrice: 200, sellingPrice: 79,
        totalBags: 5, remaining: 3, pickupStart: '18:00', pickupEnd: '19:30',
        distance: '0.3 km', description: 'Freshly baked bread, pastries, and cakes from today\'s selection.',
        guarantee: 'Items worth at least ฿200', emoji: '🥐',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
        color1: '#f59e0b', color2: '#d97706',
        type: 'selectable',
        items: [
            { id: 101, name: 'Almond Croissant', price: 35, originalPrice: 70, remaining: 5, image: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&w=150&q=80' },
            { id: 102, name: 'French Baguette', price: 20, originalPrice: 40, remaining: 8, image: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=150&q=80' },
            { id: 103, name: 'Choco Muffin', price: 25, originalPrice: 50, remaining: 4, image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=150&q=80' }
        ]
    },
    {
        id: 2, storeName: 'Thai Spice Kitchen', category: 'Thai Food', categoryIcon: 'Utensils',
        rating: 4.6, reviews: 189, originalPrice: 250, sellingPrice: 99,
        totalBags: 4, remaining: 2, pickupStart: '20:00', pickupEnd: '21:00',
        distance: '0.8 km', description: 'A mix of authentic Thai dishes — curries, stir-fries, and rice.',
        guarantee: 'Items worth at least ฿250', emoji: '🍜',
        image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=600&q=80',
        color1: '#ef4444', color2: '#dc2626',
    },
    {
        id: 3, storeName: 'Green Bowl Café', category: 'Healthy', categoryIcon: 'Salad',
        rating: 4.9, reviews: 312, originalPrice: 300, sellingPrice: 119,
        totalBags: 3, remaining: 1, pickupStart: '17:00', pickupEnd: '18:30',
        distance: '1.2 km', description: 'Organic salads, grain bowls, and fresh juices.',
        guarantee: 'Items worth at least ฿300', emoji: '🥗',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
        color1: '#10b981', color2: '#059669',
    },
    {
        id: 4, storeName: 'Sunrise Coffee', category: 'Café & Bakery', categoryIcon: 'Coffee',
        rating: 4.7, reviews: 156, originalPrice: 180, sellingPrice: 69,
        totalBags: 6, remaining: 4, pickupStart: '16:00', pickupEnd: '17:30',
        distance: '0.5 km', description: 'Premium coffee drinks and artisan pastries.',
        guarantee: 'Items worth at least ฿180', emoji: '☕',
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80',
        color1: '#8b5cf6', color2: '#7c3aed',
    },
    {
        id: 5, storeName: 'Pizza Planet', category: 'Italian', categoryIcon: 'Pizza',
        rating: 4.5, reviews: 98, originalPrice: 350, sellingPrice: 139,
        totalBags: 3, remaining: 3, pickupStart: '21:00', pickupEnd: '22:00',
        distance: '1.5 km', description: 'Wood-fired pizzas, pasta, and garlic bread.',
        guarantee: 'Items worth at least ฿350', emoji: '🍕',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
        color1: '#f97316', color2: '#ea580c',
        type: 'selectable',
        items: [
            { id: 501, name: 'Margherita Pizza', price: 80, originalPrice: 160, remaining: 3, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=150&q=80' },
            { id: 502, name: 'Pepperoni Slice', price: 40, originalPrice: 80, remaining: 5, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=150&q=80' },
            { id: 503, name: 'Garlic Bread', price: 30, originalPrice: 60, remaining: 4, image: 'https://images.unsplash.com/photo-1619535860434-7f08630f5d05?auto=format&fit=crop&w=150&q=80' }
        ]
    },
];

export const MOCK_REVIEWS = [
    { id: 1, storeId: 2, user: "Sarah M.", rating: 5, text: "Got a huge portion of Green Curry and rice. Absolutely delicious!", date: "2 days ago", tags: ["Generous Portion", "Tasty"] },
    { id: 2, storeId: 2, user: "Tom K.", rating: 4, text: "Good value, but a bit spicy for me. Still worth it!", date: "1 week ago", tags: ["Spicy"] },
    { id: 3, storeId: 1, user: "Jenny L.", rating: 5, text: "Best croissants in town. They were still warm!", date: "Yesterday", tags: ["Fresh"] },
    { id: 4, storeId: 5, user: "Mike P.", rating: 3, text: "Pizza was okay, but cold. Needed reheating.", date: "3 days ago", items: ["Pizza"], tags: ["Cold"] },
    { id: 5, storeId: 2, user: "Alice W.", rating: 5, text: "Love this place! Always great surprises.", date: "Just now", tags: ["Great Value"] },
];

export const IMPACT_STATS = {
    foodSaved: 127.5, moneySaved: 8420, co2Reduced: 318.8,
    mealsRescued: 342, heroLevel: 3, heroProgress: 68, nextLevelAt: 500,
};

export const ONBOARDING_SLIDES = [
    { emoji: '🛍️', title: 'Surprise Bags', subtitle: 'Grab amazing food at 50%+ off. You never know exactly what you\'ll get — that\'s the fun!', color: 'from-emerald-400 to-teal-500' },
    { emoji: '🦸', title: 'Be a Food Hero', subtitle: 'Every bag you rescue prevents food waste and reduces CO₂ emissions. Level up your impact!', color: 'from-amber-400 to-orange-500' },
    { emoji: '⚡', title: 'Quick & Easy', subtitle: 'Browse nearby deals, tap "Rescue Now", pick up your bag. Done in 30 seconds.', color: 'from-blue-400 to-indigo-500' },
];

export const CATEGORIES = ['All', '🥐 Bakery', '🍜 Thai', '🥗 Healthy', '☕ Café', '🍕 Italian'];

export const MOCK_REWARDS = [
    { id: 1, title: '฿20 Discount', code: 'HERO20', level: 3, description: 'Get ฿20 off any surprise bag', status: 'ready', type: 'coupon' },
    { id: 2, title: 'Free Delivery', code: 'ECOFRIEND', level: 6, description: 'Zero delivery fee on your next rescue', status: 'locked', type: 'service' },
    { id: 3, title: '฿50 Gift Card', code: 'PLATINUM50', level: 9, description: '฿50 credit for any store', status: 'locked', type: 'cash' },
];
