import { Leaf, TrendingUp, Award, Heart, Sparkles, BarChart3 } from 'lucide-react';
import { IMPACT_STATS } from './data';
import { BottomNav, AnimatedCounter } from './Shared';

function ImpactStatCard({ icon, label, value, unit, bgColor, borderColor }) {
    return (
        <div className={`${bgColor} border ${borderColor} rounded-2xl p-4 card-stagger`}>
            <div className="mb-2">{icon}</div>
            <p className="text-xs text-gray-500 dm-text-secondary mb-1">{label}</p>
            <div className="flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-gray-800 dm-text">
                    <AnimatedCounter target={parseFloat(value)} decimals={value.includes('.') ? 1 : 0} />
                </span>
                <span className="text-xs text-gray-500 dm-text-secondary">{unit}</span>
            </div>
        </div>
    );
}

export default function ImpactDashboard({ onNavigate }) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dm-bg page-enter flex flex-col">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 pt-12 pb-8 rounded-b-3xl flex-shrink-0">
                <div className="flex items-center gap-2 mb-1"><BarChart3 className="w-5 h-5 text-emerald-200" /><span className="text-emerald-100 text-sm font-medium">Your Impact</span></div>
                <h1 className="text-white text-xl font-bold">Food Hero Dashboard 🌍</h1>
                <p className="text-emerald-100 text-sm mt-1">Every rescue makes a difference.</p>
            </div>

            <div className="px-5 py-5 space-y-4 flex-1">
                {/* Hero Level */}
                <div className="bg-white dm-card rounded-2xl shadow-md border border-emerald-100 p-5 page-fade-in">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-200/50 float-anim">
                            <Award className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h2 className="font-extrabold text-gray-800 dm-text text-lg">Food Hero Level {IMPACT_STATS.heroLevel}</h2>
                            <p className="text-gray-400 dm-text-secondary text-xs">{IMPACT_STATS.mealsRescued} / {IMPACT_STATS.nextLevelAt} meals to next level</p>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                            <div className="bg-gradient-to-r from-amber-400 to-emerald-500 h-full rounded-full transition-all duration-1000 ease-out relative"
                                style={{ width: `${IMPACT_STATS.heroProgress}%` }}>
                                <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
                            </div>
                        </div>
                        <div className="flex justify-between mt-1.5">
                            <span className="text-xs text-gray-400 dm-text-secondary">Level {IMPACT_STATS.heroLevel}</span>
                            <span className="text-xs font-semibold text-emerald-600">{IMPACT_STATS.heroProgress}%</span>
                            <span className="text-xs text-gray-400 dm-text-secondary">Level {IMPACT_STATS.heroLevel + 1}</span>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                    <ImpactStatCard icon={<Leaf className="w-5 h-5 text-emerald-500" />} label="Food Saved" value={`${IMPACT_STATS.foodSaved}`} unit="kg" bgColor="bg-emerald-50 dark:bg-emerald-900/20" borderColor="border-emerald-100 dark:border-emerald-800" />
                    <ImpactStatCard icon={<TrendingUp className="w-5 h-5 text-blue-500" />} label="Money Saved" value={`${IMPACT_STATS.moneySaved}`} unit="THB" bgColor="bg-blue-50 dark:bg-blue-900/20" borderColor="border-blue-100 dark:border-blue-800" />
                    <ImpactStatCard icon={<Sparkles className="w-5 h-5 text-purple-500" />} label="CO₂e Reduced" value={`${IMPACT_STATS.co2Reduced}`} unit="kg" bgColor="bg-purple-50 dark:bg-purple-900/20" borderColor="border-purple-100 dark:border-purple-800" />
                    <ImpactStatCard icon={<Heart className="w-5 h-5 text-rose-500" />} label="Meals Rescued" value={`${IMPACT_STATS.mealsRescued}`} unit="" bgColor="bg-rose-50 dark:bg-rose-900/20" borderColor="border-rose-100 dark:border-rose-800" />
                </div>

                {/* Weekly bars */}
                <div className="bg-white dm-card rounded-2xl shadow-sm border border-gray-100 p-5 card-stagger" style={{ animationDelay: '0.3s' }}>
                    <h3 className="font-bold text-gray-800 dm-text mb-4">This Month's Impact</h3>
                    <div className="space-y-3">
                        {[{ label: 'Week 1', value: 30 }, { label: 'Week 2', value: 55 }, { label: 'Week 3', value: 80 }, { label: 'Week 4', value: 45 }].map(w => (
                            <div key={w.label} className="flex items-center gap-3">
                                <span className="text-xs text-gray-500 dm-text-secondary w-14">{w.label}</span>
                                <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                                    <div className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-full rounded-full transition-all duration-1000" style={{ width: `${w.value}%` }} />
                                </div>
                                <span className="text-xs text-gray-500 dm-text-secondary w-8">{w.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Eco tip */}
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-5 text-white card-stagger" style={{ animationDelay: '0.4s' }}>
                    <div className="flex items-center gap-2 mb-2"><span className="text-lg">💡</span><span className="font-bold text-sm">Did you know?</span></div>
                    <p className="text-sm text-emerald-50">
                        Your {IMPACT_STATS.co2Reduced} kg CO₂ saved = planting <span className="font-bold">{Math.round(IMPACT_STATS.co2Reduced / 21)} trees</span>! 🌳
                    </p>
                </div>
            </div>
            <BottomNav active="impact" onNavigate={onNavigate} />
        </div>
    );
}
