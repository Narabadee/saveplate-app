import { useState } from 'react';
import { 
    Leaf, TrendingUp, Award, Heart, Sparkles, BarChart3, 
    ArrowRight, TreeDeciduous, Gift, Ticket, Lock, CheckCircle2, Copy 
} from 'lucide-react';
import { IMPACT_STATS, MOCK_REWARDS } from './data';
import { AnimatedCounter, Confetti, useToast } from './Shared';

function ImpactStatCard({ icon, label, value, unit, colorClass, accentColor, delay }) {
    return (
        <div 
            className={`bg-white dark:bg-slate-800 rounded-3xl p-5 card-stagger flex flex-col justify-between min-h-[140px] relative overflow-hidden shadow-sm border-l-4 ${accentColor || 'border-brand-400'}`}
            style={{ animationDelay: delay }}
        >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colorClass.replace('text-', 'bg-')}/10 ${colorClass}`}>
                {icon}
            </div>
            <div>
                <p className="text-[10px] uppercase tracking-wide font-bold text-gray-400 mb-1">{label}</p>
                <div className="flex items-baseline gap-1">
                    <span className={`text-2xl font-black tracking-tight ${colorClass}`}>
                        <AnimatedCounter target={parseFloat(value)} decimals={value.toString().includes('.') ? 1 : 0} />
                    </span>
                    <span className="text-xs font-bold text-gray-400">{unit}</span>
                </div>
            </div>
        </div>
    );
}

function RewardCard({ reward, onClaim, onCopy }) {
    const isLocked = reward.status === 'locked';
    const isClaimed = reward.status === 'claimed';
    const isReady = reward.status === 'ready';

    return (
        <div className={`relative shrink-0 w-64 h-32 rounded-3xl overflow-hidden transition-all duration-300 ${
            isLocked ? 'opacity-60 grayscale' : 'shadow-xl shadow-amber-900/10'
        } ${isReady ? 'glow-amber scale-100' : 'scale-95'}`}>
            
            {/* Ticket background with perforation effect */}
            <div className={`absolute inset-0 ${
                isLocked ? 'bg-gray-100 dark:bg-gray-800' : 
                isClaimed ? 'bg-linear-to-br from-brand-500 to-brand-600' : 
                'bg-linear-to-br from-amber-400 to-orange-500'
            }`} />
            
            {/* Perforation circles */}
            <div className="absolute top-1/2 -left-3 w-6 h-6 bg-white dark:bg-slate-900 rounded-full -translate-y-1/2 z-10" />
            <div className="absolute top-1/2 -right-3 w-6 h-6 bg-white dark:bg-slate-900 rounded-full -translate-y-1/2 z-10" />

            <div className="relative z-0 h-full flex items-center px-8 border-r-2 border-dashed border-white/20">
                <div className="flex-1 text-white">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Level {reward.level} Prize</p>
                    <h4 className="text-lg font-black leading-tight mb-1">{reward.title}</h4>
                    <p className="text-[10px] font-medium opacity-90 line-clamp-1">{reward.description}</p>
                </div>
                
                <div className="ml-4 flex flex-col items-center justify-center">
                    {isLocked ? (
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <Lock className="w-5 h-5 text-white/60" />
                        </div>
                    ) : isReady ? (
                        <button 
                            onClick={() => onClaim(reward.id)}
                            className="bg-white text-orange-600 px-4 py-2 rounded-xl text-xs font-black shadow-lg active:scale-90 transition-transform pulse-ring"
                        >
                            CLAIM
                        </button>
                    ) : (
                        <button 
                            onClick={() => onCopy(reward.code)}
                            className="bg-brand-400 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-inner active:scale-95 transition-transform"
                        >
                            <Copy className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ImpactDashboard({ onNavigate }) {
    const [rewards, setRewards] = useState(MOCK_REWARDS);
    const [showConfetti, setShowConfetti] = useState(false);
    const toast = useToast();

    const handleClaim = (id) => {
        setRewards(prev => prev.map(r => r.id === id ? { ...r, status: 'claimed' } : r));
        setShowConfetti(true);
        toast('🎊 Prize Claimed! Check your wallet.');
        setTimeout(() => setShowConfetti(false), 3000);
    };

    const handleCopy = (code) => {
        navigator.clipboard.writeText(code);
        toast('📋 Code copied: ' + code);
    };

    // Calculate next prize level
    const nextReward = rewards.find(r => r.status === 'locked') || rewards[rewards.length - 1];
    const levelsToReward = nextReward.level - IMPACT_STATS.heroLevel;

    return (
        <div className="min-h-screen bg-slate-50 dm-bg page-enter flex flex-col pb-28">
            {showConfetti && <Confetti />}

            {/* ── Dark Hero Header ── */}
            <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-black px-6 pt-14 pb-8">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-brand-500/10 rounded-full blur-[80px]" />
                    <div className="absolute bottom-0 left-[-10%] w-[50%] h-[50%] bg-amber-500/10 rounded-full blur-[100px]" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 rounded-lg bg-brand-500/20 border border-brand-400/30 flex items-center justify-center">
                            <BarChart3 className="w-3.5 h-3.5 text-brand-400" />
                        </div>
                        <span className="text-brand-400 text-[10px] font-bold uppercase tracking-widest">Dashboard</span>
                    </div>
                    <h1 className="text-3xl font-black text-white leading-tight">Your Hero<br />Legacy 🏆</h1>
                    <p className="text-white/40 text-xs font-medium mt-1">Keep rescuing to level up and unlock prizes</p>
                </div>

                {/* Hero Level Progress — in header */}
                <div className="relative z-10 mt-6 bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-5">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <span className="inline-block px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-[10px] font-black uppercase tracking-widest">
                                Level {IMPACT_STATS.heroLevel} Guardian
                            </span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                            <Award className="w-5 h-5 text-white" />
                        </div>
                    </div>
                    <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-brand-400 to-amber-500 transition-all duration-1000"
                            style={{ width: `${IMPACT_STATS.heroProgress}%` }}
                        />
                    </div>
                    <div className="flex justify-between mt-2">
                        <span className="text-[10px] font-bold text-white/40">LVL {IMPACT_STATS.heroLevel}</span>
                        <span className="text-[10px] font-black text-brand-400">{IMPACT_STATS.heroProgress}% XP</span>
                        <span className="text-[10px] font-bold text-white/40">LVL {IMPACT_STATS.heroLevel + 1}</span>
                    </div>
                </div>
            </div>

            <div className="px-6 space-y-5 pb-6">

                {/* Milestone Prizes Section */}
                <div className="space-y-4 card-stagger" style={{ animationDelay: '0.1s' }}>
                    <div className="flex items-center justify-between">
                        <h3 className="font-black text-gray-800 dm-text tracking-tight flex items-center gap-2">
                            <Gift className="w-5 h-5 text-orange-500" /> Milestone Prizes
                        </h3>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">3 Items</span>
                    </div>
                    
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6">
                        {rewards.map((reward, i) => (
                            <RewardCard 
                                key={reward.id} 
                                reward={reward} 
                                onClaim={handleClaim} 
                                onCopy={handleCopy}
                            />
                        ))}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 px-6 pb-2">
                    <ImpactStatCard
                        icon={<Leaf className="w-5 h-5" />}
                        label="Food Saved"
                        value={`${IMPACT_STATS.foodSaved}`}
                        unit="kg"
                        colorClass="text-brand-500"
                        accentColor="border-brand-400"
                        delay="0.2s"
                    />
                    <ImpactStatCard
                        icon={<TrendingUp className="w-5 h-5" />}
                        label="Money Saved"
                        value={`${IMPACT_STATS.moneySaved}`}
                        unit="฿"
                        colorClass="text-amber-500"
                        accentColor="border-amber-400"
                        delay="0.25s"
                    />
                    <ImpactStatCard
                        icon={<Sparkles className="w-5 h-5" />}
                        label="CO₂e Saved"
                        value={`${IMPACT_STATS.co2Reduced}`}
                        unit="kg"
                        colorClass="text-emerald-500"
                        accentColor="border-emerald-400"
                        delay="0.3s"
                    />
                    <ImpactStatCard
                        icon={<Heart className="w-5 h-5" />}
                        label="Total Rescues"
                        value={`${IMPACT_STATS.mealsRescued}`}
                        unit="bags"
                        colorClass="text-rose-500"
                        accentColor="border-rose-400"
                        delay="0.35s"
                    />
                </div>

                {/* Graphical Weekly Chart (Line Chart) */}
                <div className="bg-white dark:bg-slate-800 rounded-4xl p-6 card-stagger mx-6" style={{ animationDelay: '0.4s' }}>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-black text-gray-800 dm-text text-sm">Activity Recap</h3>
                            <p className="text-[10px] text-gray-400 font-medium mt-0.5">Weekly Performance</p>
                        </div>
                        <div className="px-3 py-1 rounded-lg bg-brand-50 dark:bg-brand-900/30 text-brand-600 text-[10px] font-bold">
                            Best: Week 3
                        </div>
                    </div>
                    
                    <div className="relative h-40 group">
                        <svg viewBox="0 0 400 100" className="w-full h-full overflow-visible drop-shadow-lg">
                            <defs>
                                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#ff3400" />
                                    <stop offset="100%" stopColor="#f59e0b" />
                                </linearGradient>
                                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#ff3400" stopOpacity="0.15" />
                                    <stop offset="100%" stopColor="#ff3400" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            
                            {/* Area Fill */}
                            <path 
                                d="M 50 100 L 50 65 C 100 65 100 40 150 40 S 200 5 250 5 S 300 50 350 50 L 350 100 Z" 
                                fill="url(#areaGradient)" 
                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                            />
                            
                            {/* Main Line Path */}
                            <path 
                                d="M 50 65 C 100 65 100 40 150 40 S 200 5 250 5 S 300 50 350 50" 
                                fill="none" 
                                stroke="url(#lineGradient)" 
                                strokeWidth="4" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                                className="transition-all duration-1000"
                                style={{
                                    strokeDasharray: 400,
                                    strokeDashoffset: 400,
                                    animation: 'draw 2s ease-out forwards',
                                    animationDelay: '0.6s'
                                }}
                            />

                            {/* Data Points */}
                            {[
                                { x: 50, y: 65, val: 35 }, 
                                { x: 150, y: 40, val: 60 }, 
                                { x: 250, y: 5, val: 95 }, 
                                { x: 350, y: 50, val: 50 }
                            ].map((p, i) => {
                                const isLast = i === 3;
                                return (
                                    <g key={i} className="group/node">
                                        {/* Outer Glow Circle */}
                                        <circle 
                                            cx={p.x} cy={p.y} r={isLast ? "12" : "8"} 
                                            className={`fill-brand-500/10 transition-all duration-700 ${isLast ? 'animate-pulse' : 'opacity-0 group-hover/node:opacity-100'}`} 
                                        />
                                        {/* Core Point */}
                                        <circle 
                                            cx={p.x} cy={p.y} r="6" 
                                            className="fill-white stroke-brand-500 stroke-3 glow-brand cursor-pointer" 
                                        />
                                        {/* Tooltip on Node */}
                                        <foreignObject x={p.x - 20} y={p.y - 35} width="40" height="25" className="opacity-0 group-hover/node:opacity-100 transition-opacity pointer-events-none">
                                            <div className="bg-gray-800 text-white text-[8px] font-black px-1.5 py-1 rounded shadow-lg text-center">
                                                {p.val}%
                                            </div>
                                        </foreignObject>
                                    </g>
                                );
                            })}
                        </svg>

                        {/* Labels row */}
                        <div className="flex justify-between mt-4 px-[10%]">
                            {['W1', 'W2', 'W3', 'W4'].map(label => (
                                <span key={label} className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{label}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Eco Banner */}
                <div className="relative group card-stagger" style={{ animationDelay: '0.5s' }}>
                    <div className="absolute inset-0 bg-linear-to-r from-brand-600 to-amber-600 rounded-4xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
                    <div className="relative bg-linear-to-br from-brand-600 to-amber-700 rounded-4xl p-6 text-white overflow-hidden shadow-xl">
                        <div className="absolute -right-8 -bottom-8 opacity-10">
                            <TreeDeciduous className="w-32 h-32" />
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                                <Leaf className="w-6 h-6 text-brand-100" />
                            </div>
                            <div>
                                <h4 className="font-black text-lg leading-tight mb-2 italic tracking-tight">Eco-Hero Status: Verified</h4>
                                <p className="text-brand-50/80 text-xs font-medium leading-relaxed">
                                    Your efforts saved <span className="font-black text-white">{IMPACT_STATS.co2Reduced} kg</span> of CO₂. That's offset equal to <span className="bg-brand-400/30 px-1 rounded font-black text-white underline decoration-brand-300 underline-offset-2">planting {Math.round(IMPACT_STATS.co2Reduced / 21)} trees</span> in your city! 🌳
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
