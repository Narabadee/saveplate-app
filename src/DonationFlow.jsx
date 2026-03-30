import { useState } from 'react';
import {
    Leaf, ChevronRight, CheckCircle2, ArrowLeft, Download,
    Sparkles, Heart, TreePine, Utensils, Building2, BadgeCheck,
    Recycle, HandHeart, FileText, TrendingUp, Minus, Plus
} from 'lucide-react';
import { useToast, AnimatedCounter, Confetti } from './Shared';

// ─── Mock Partners ─────────────────────────────────────────────────────────────
const PARTNERS = [
    {
        id: 'sos-thailand',
        name: 'SOS Thailand',
        description: 'Fighting hunger across Bangkok & northern regions with real-time food logistics.',
        tags: ['e-Donation Supported'],
        tagColors: ['bg-emerald-100 text-emerald-700'],
        icon: Heart,
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-600',
    },
    {
        id: 'organic-farms',
        name: 'Organic Fertilizer Farms',
        description: 'Converts surplus food into certified organic compost, closing the circular economy loop.',
        tags: ['Carbon Offset Certified'],
        tagColors: ['bg-amber-100 text-amber-700'],
        icon: TreePine,
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-600',
    },
    {
        id: 'community-kitchen',
        name: 'Community Kitchen Network',
        description: 'A network of 48 kitchens across Thailand serving homeless communities daily.',
        tags: ['Tax-Deductible'],
        tagColors: ['bg-sky-100 text-sky-700'],
        icon: Utensils,
        iconBg: 'bg-sky-100',
        iconColor: 'text-sky-600',
    },
];

// ─── Step 1: Donation Setup (Quantity + Valuation, all-in-one) ─────────────────
function DonationSetup({ initialQty, initialCostPerBag, onNext, onBack }) {
    const [quantity, setQuantity] = useState(initialQty);
    const [costPerBag, setCostPerBag] = useState(initialCostPerBag);

    const totalCost = quantity * costPerBag;
    const taxSaved = Math.round(totalCost * 0.20);
    const mealsEstimate = quantity * 3;
    const co2Estimate = (quantity * 2.5).toFixed(1);

    return (
        <div className="min-h-screen bg-slate-50 dm-bg page-enter flex flex-col">
            {/* Hero Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-slate-900 to-black px-6 pt-14 pb-8">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-500/10 rounded-full blur-[80px]" />
                    <div className="absolute bottom-0 left-[-10%] w-[50%] h-[50%] bg-amber-500/10 rounded-full blur-[100px]" />
                </div>

                <button onClick={onBack} className="relative z-10 flex items-center gap-2 text-white/60 mb-6 hover:text-white transition-colors btn-press">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Back to Dashboard</span>
                </button>

                <div className="relative z-10 flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
                                <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                            </div>
                            <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">Donate Surplus Food</span>
                        </div>
                        <h1 className="text-2xl font-black text-white leading-tight">
                            Set Up Donation 🌿
                        </h1>
                        <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mt-1">
                            Adjust everything right here
                        </p>
                    </div>
                    {/* Live Tax Preview Badge */}
                    <div className="shrink-0 text-right">
                        <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Est. Tax Saved</p>
                        <p className="text-2xl font-black text-emerald-400">฿{taxSaved.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            <div className="px-6 py-6 flex-1 flex flex-col space-y-5 pb-10">

                {/* ── SECTION 1: How many bags? ── */}
                <div className="card-stagger">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                        How many bags to donate?
                    </p>
                    <div className="glass-pane rounded-3xl p-5 border-white shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-black text-gray-900 dm-text text-sm">Unsold Surprise Bags</p>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                                    Adjust to match actual leftovers
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    id="qty-decrease-btn"
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-700 flex items-center justify-center active:scale-90 transition-all btn-press"
                                >
                                    <Minus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                                </button>
                                <span className="text-3xl font-black text-gray-900 dm-text w-10 text-center">{quantity}</span>
                                <button
                                    id="qty-increase-btn"
                                    onClick={() => setQuantity(q => q + 1)}
                                    className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center active:scale-90 transition-all btn-press"
                                >
                                    <Plus className="w-4 h-4 text-emerald-600" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── SECTION 2: Impact Preview (live-updating) ── */}
                <div className="grid grid-cols-2 gap-3 card-stagger" style={{ animationDelay: '0.1s' }}>
                    <div className="glass-pane rounded-3xl p-4 border-white shadow-sm text-center">
                        <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center mx-auto mb-2">
                            <Utensils className="w-4 h-4 text-amber-600" />
                        </div>
                        <p className="text-xl font-black text-gray-900 dm-text">~{mealsEstimate}</p>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Meals</p>
                    </div>
                    <div className="glass-pane rounded-3xl p-4 border-white shadow-sm text-center">
                        <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center mx-auto mb-2">
                            <TreePine className="w-4 h-4 text-emerald-600" />
                        </div>
                        <p className="text-xl font-black text-gray-900 dm-text">{co2Estimate}<span className="text-xs"> kg</span></p>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">CO₂e Saved</p>
                    </div>
                </div>

                {/* ── SECTION 3: Cost per bag (editable) ── */}
                <div className="card-stagger" style={{ animationDelay: '0.15s' }}>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                        Your cost price per bag (฿)
                    </p>
                    <div className="glass-pane rounded-3xl p-5 border-white shadow-sm">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 text-center">
                            Declared unit cost for tax records
                        </p>
                        <input
                            id="cost-per-bag-input"
                            type="number"
                            value={costPerBag}
                            onChange={e => setCostPerBag(Math.max(0, Number(e.target.value)))}
                            className="w-full bg-transparent text-4xl font-black text-center text-gray-900 dm-text focus:outline-none"
                        />
                        <p className="text-center text-[9px] font-bold text-emerald-500 uppercase tracking-widest mt-1">
                            Typically 50–70% of original sale price
                        </p>
                    </div>
                </div>

                {/* ── SECTION 4: Tax Calculation Receipt ── */}
                <div className="card-stagger" style={{ animationDelay: '0.2s' }}>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Tax Deduction Summary</p>
                    <div className="glass-pane rounded-3xl p-5 border-white shadow-sm space-y-3">
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-500 font-bold">{quantity} bags × ฿{costPerBag}</p>
                            <p className="font-black text-gray-900 dm-text">฿{totalCost.toLocaleString()}</p>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-dashed border-gray-100 dark:border-white/10">
                            <div>
                                <p className="font-black text-emerald-700 dark:text-emerald-400 text-sm">≈ Tax Saved</p>
                                <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">At 20% CIT Rate</p>
                            </div>
                            <p className="text-xl font-black text-emerald-600">฿{taxSaved.toLocaleString()}</p>
                        </div>
                        <p className="text-[9px] text-gray-400 text-center">
                            Eligible up to 2% of annual net profit · Subject to Revenue Dept. approval
                        </p>
                    </div>
                </div>

                {/* ── CTA ── */}
                <div className="mt-auto pt-2">
                    <button
                        id="donate-next-btn"
                        onClick={() => onNext({ quantity, costPerBag, totalCost })}
                        disabled={quantity < 1 || costPerBag <= 0}
                        className="w-full py-5 rounded-4xl font-black text-lg text-white shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600"
                        style={{ boxShadow: '0 0 30px rgba(16,185,129,0.25)' }}
                    >
                        <HandHeart className="w-6 h-6" />
                        Choose a Partner
                        <ChevronRight className="w-5 h-5" />
                    </button>
                    <p className="text-center text-gray-400 text-[9px] font-bold uppercase tracking-widest mt-3">
                        Next: Select where your donation goes
                    </p>
                </div>
            </div>
        </div>
    );
}

// ─── Step 2: Partner Selection ─────────────────────────────────────────────────
function PartnerSelection({ totalCost, onNext, onBack }) {
    const [selected, setSelected] = useState(null);

    return (
        <div className="min-h-screen bg-slate-50 dm-bg page-enter flex flex-col">
            <header className="sticky top-0 z-50 glass-header px-6 pt-12 pb-6">
                <button onClick={onBack} className="flex items-center gap-2 text-gray-400 mb-4 hover:text-brand-600 transition-colors btn-press">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Back</span>
                </button>
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center">
                        <HandHeart className="w-4 h-4 text-brand-600" />
                    </div>
                    <span className="text-brand-600 dark:text-brand-400 text-[10px] font-black uppercase tracking-widest">Step 2 of 2</span>
                </div>
                <h1 className="text-2xl font-black text-gray-900 dm-text leading-tight">Choose a Partner</h1>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Certified charity & circular economy partners</p>
            </header>

            <div className="px-6 py-6 flex-1 flex flex-col">
                {/* Donation Amount Badge */}
                <div className="flex items-center justify-between glass-pane rounded-3xl px-5 py-4 border-white shadow-sm mb-6 card-stagger">
                    <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Donation Value</p>
                        <p className="text-xl font-black text-gray-900 dm-text">฿{totalCost.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-xl">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">Ready to Transfer</span>
                    </div>
                </div>

                {/* Partner Cards */}
                <div className="space-y-4 flex-1">
                    {PARTNERS.map((partner, i) => {
                        const Icon = partner.icon;
                        const isSelected = selected === partner.id;
                        return (
                            <button
                                key={partner.id}
                                id={`partner-${partner.id}`}
                                onClick={() => setSelected(partner.id)}
                                className={`w-full text-left rounded-4xl p-5 transition-all duration-300 border-2 card-stagger
                                    ${isSelected
                                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10 shadow-xl shadow-emerald-500/10 scale-[1.01]'
                                        : 'border-white glass-pane shadow-sm hover:border-gray-200'}`}
                                style={{ animationDelay: `${0.1 + i * 0.1}s` }}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`w-12 h-12 rounded-2xl ${partner.iconBg} flex items-center justify-center shrink-0`}>
                                        <Icon className={`w-6 h-6 ${partner.iconColor}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="font-black text-gray-900 dm-text text-sm">{partner.name}</h3>
                                            {isSelected && (
                                                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 badge-pop" />
                                            )}
                                        </div>
                                        <p className="text-[10px] text-gray-500 dm-text-secondary font-bold leading-relaxed mb-3">
                                            {partner.description}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {partner.tags.map((tag, ti) => (
                                                <span key={tag} className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${partner.tagColors[ti]}`}>
                                                    <BadgeCheck className="w-3 h-3 inline mr-1" />{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="pt-6 pb-2">
                    <button
                        id="confirm-donation-btn"
                        onClick={() => selected && onNext(PARTNERS.find(p => p.id === selected))}
                        disabled={!selected}
                        className={`w-full py-5 rounded-4xl font-black text-lg text-white shadow-2xl transition-all flex items-center justify-center gap-3
                            ${selected
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 active:scale-95'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'}`}
                        style={selected ? { boxShadow: '0 0 30px rgba(16,185,129,0.25)' } : {}}
                    >
                        <Recycle className="w-6 h-6" />
                        {selected ? 'Confirm Donation' : 'Select a Partner First'}
                        {selected && <ChevronRight className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Step 3: Impact Dashboard (Success) ───────────────────────────────────────
function ImpactSuccess({ quantity, totalCost, partner, onDone }) {
    const toast = useToast();

    const taxSaved = Math.round(totalCost * 0.20);
    const co2Saved = parseFloat((quantity * 2.5).toFixed(1));
    const mealsProvided = quantity * 3;

    const handleDownload = () => {
        toast('📄 ESG Report & Tax Receipt generated! Downloading...', 'success');
        const link = document.createElement('a');
        link.href = '#';
        link.download = `SavePlate-ESG-Report-${Date.now()}.pdf`;
        link.click();
    };

    return (
        <div className="min-h-screen bg-slate-50 dm-bg page-zoom-in flex flex-col pb-10">
            <Confetti />

            <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-slate-900 to-black px-6 pt-14 pb-12 text-center">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-[-20%] w-[70%] h-[70%] bg-emerald-500/15 rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 right-[-10%] w-[50%] h-[50%] bg-amber-500/10 rounded-full blur-[80px]" />
                </div>
                <div className="relative z-10">
                    <div className="w-24 h-24 rounded-[2.5rem] mx-auto mb-6 bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-2xl shadow-emerald-500/40 animate-bounce-slow border border-white/20">
                        <CheckCircle2 className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Donation Complete! 🌿</h1>
                    <p className="text-white/50 text-[10px] font-black uppercase tracking-widest">Donated to {partner.name}</p>
                    <div className="mt-4 inline-flex items-center gap-2 bg-white/10 border border-white/10 backdrop-blur-xl rounded-2xl px-4 py-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">ESG Report Ready</span>
                    </div>
                </div>
            </div>

            <div className="px-6 py-6 space-y-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Real-Time Impact Metrics</p>

                <div className="glass-pane rounded-3xl p-5 border-white shadow-sm card-stagger" style={{ animationDelay: '0.1s' }}>
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center shrink-0">
                            <TrendingUp className="w-7 h-7 text-brand-600" />
                        </div>
                        <div className="flex-1">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Estimated Tax Saved</p>
                            <p className="text-3xl font-black text-brand-600">฿<AnimatedCounter target={taxSaved} duration={1200} /></p>
                            <p className="text-[9px] text-gray-400 font-bold mt-1">
                                Calculated at 20% corporate tax rate · Eligible up to 2% of net profit
                            </p>
                        </div>
                    </div>
                </div>

                <div className="glass-pane rounded-3xl p-5 border-white shadow-sm card-stagger" style={{ animationDelay: '0.2s' }}>
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center shrink-0">
                            <TreePine className="w-7 h-7 text-emerald-600" />
                        </div>
                        <div className="flex-1">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Carbon Footprint Saved</p>
                            <p className="text-3xl font-black text-emerald-600">
                                <AnimatedCounter target={co2Saved} duration={1400} decimals={1} />
                                <span className="text-lg ml-1">kgCO₂e</span>
                            </p>
                            <p className="text-[9px] text-gray-400 font-bold mt-1">
                                Prevented from landfill · Equiv. to {(co2Saved / 21).toFixed(1)} tree-months of absorption
                            </p>
                        </div>
                    </div>
                </div>

                <div className="glass-pane rounded-3xl p-5 border-white shadow-sm card-stagger" style={{ animationDelay: '0.3s' }}>
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0">
                            <Utensils className="w-7 h-7 text-amber-600" />
                        </div>
                        <div className="flex-1">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Meals Provided</p>
                            <p className="text-3xl font-black text-amber-600">
                                <AnimatedCounter target={mealsProvided} duration={1000} />
                                <span className="text-lg ml-1">portions</span>
                            </p>
                            <p className="text-[9px] text-gray-400 font-bold mt-1">
                                Via {partner.name} network · Delivered within 24h
                            </p>
                        </div>
                    </div>
                </div>

                <div className="glass-pane rounded-3xl px-5 py-4 border-white shadow-sm card-stagger flex items-center gap-4" style={{ animationDelay: '0.4s' }}>
                    <div className="w-10 h-10 rounded-2xl bg-sky-100 flex items-center justify-center shrink-0">
                        <BadgeCheck className="w-5 h-5 text-sky-600" />
                    </div>
                    <div className="flex-1">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Donated To</p>
                        <p className="font-black text-gray-900 dm-text text-sm">{partner.name}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Amount</p>
                        <p className="font-black text-emerald-600">฿{totalCost.toLocaleString()}</p>
                    </div>
                </div>

                <button
                    id="download-esg-btn"
                    onClick={handleDownload}
                    className="w-full py-5 rounded-4xl font-black text-lg text-white shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 bg-gradient-to-r from-slate-800 to-slate-900 card-stagger"
                    style={{ animationDelay: '0.5s' }}
                >
                    <Download className="w-6 h-6" />
                    Download ESG Report / Tax Receipt
                </button>

                <button
                    id="back-to-dashboard-btn"
                    onClick={onDone}
                    className="w-full py-4 rounded-4xl font-black text-sm text-gray-500 border border-gray-200 dark:border-slate-700 transition-all active:scale-95 card-stagger hover:border-brand-300 hover:text-brand-600"
                    style={{ animationDelay: '0.6s' }}
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
}

// ─── Main DonationFlow Controller ──────────────────────────────────────────────
export default function DonationFlow({ quantity = 5, originalPrice = 200, onNavigate }) {
    const [step, setStep] = useState(1);
    const [donationData, setDonationData] = useState({ quantity, costPerBag: Math.round(originalPrice * 0.6), totalCost: 0 });
    const [selectedPartner, setSelectedPartner] = useState(null);

    const handleSetupNext = ({ quantity: qty, costPerBag, totalCost }) => {
        setDonationData({ quantity: qty, costPerBag, totalCost });
        setStep(2);
    };

    const handlePartnerNext = (partner) => {
        setSelectedPartner(partner);
        setStep(3);
    };

    if (step === 1) return (
        <DonationSetup
            initialQty={donationData.quantity}
            initialCostPerBag={donationData.costPerBag}
            onNext={handleSetupNext}
            onBack={() => onNavigate('merchant')}
        />
    );

    if (step === 2) return (
        <PartnerSelection
            totalCost={donationData.totalCost}
            onNext={handlePartnerNext}
            onBack={() => setStep(1)}
        />
    );

    if (step === 3) return (
        <ImpactSuccess
            quantity={donationData.quantity}
            totalCost={donationData.totalCost}
            partner={selectedPartner}
            onDone={() => onNavigate('merchant')}
        />
    );
}
