import { useState, useEffect, useCallback } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { Leaf, ChevronRight, Sparkles, Zap, Heart, Shield, ArrowRight } from 'lucide-react';
import { ToastProvider, DarkModeProvider, AuthProvider, NotificationProvider, FavoritesProvider, NotificationDrawer, BottomNav, useAuth } from './Shared';
import { ONBOARDING_SLIDES } from './data';
import ConsumerFeed from './ConsumerFeed';
import BookingDetail from './BookingDetail';
import MerchantDashboard from './MerchantDashboard';
import ImpactDashboard from './ImpactDashboard';
import DonationFlow from './DonationFlow';
import OrderHistory from './OrderHistory';
import ProfileScreen from './ProfileScreen';
import Auth from './Auth';

// ─── Splash Screen: Immersive Layered Identity ──────────────────────────────────
function SplashScreen({ onDone }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(onDone, 600);
    }, 2400);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className={`fixed inset-0 z-[10000] bg-slate-900 flex flex-col items-center justify-center overflow-hidden
                     ${exiting ? 'splash-exit' : ''}`}>
      
      {/* Background Animated Blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-brand-500/20 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[20%] right-[-10%] w-[60%] h-[60%] bg-amber-500/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      {/* Layered Logo Animation */}
      <div className="relative group perspective-1000">
        <div className="splash-logo relative z-10 w-28 h-28 rounded-[2.5rem] bg-linear-to-br from-brand-400 via-brand-500 to-amber-600 
                        flex items-center justify-center shadow-3xl shadow-brand-500/40 border border-white/20 animate-breathe">
          <Leaf className="w-14 h-14 text-white drop-shadow-lg" />
        </div>
        
        {/* Decorative Glass Rings */}
        <div className="absolute inset-[-20%] border-2 border-white/5 rounded-[3rem] animate-spin-slow opacity-20" />
        <div className="absolute inset-[-40%] border border-white/5 rounded-[4rem] animate-spin-slow-reverse opacity-10" />
      </div>

      {/* Text Branding */}
      <div className="splash-text mt-12 text-center relative z-20">
        <h1 className="text-white text-4xl font-black tracking-tight mb-2 italic">UniEat</h1>
        <div className="flex items-center justify-center gap-2">
           <div className="h-[1px] w-4 bg-brand-500/50" />
           <p className="text-brand-400 text-[10px] font-black uppercase tracking-[0.3em] font-medium">Heroism in Every Meal</p>
           <div className="h-[1px] w-4 bg-brand-500/50" />
        </div>
      </div>

      {/* Loading Progress Bar */}
      <div className="mt-16 w-32 h-1 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full bg-brand-500 splash-progress-bar rounded-full" />
      </div>
    </div>
  );
}

// ─── Onboarding Carousel: Narrative Immersive Layout ─────────────────────────────
function OnboardingScreen({ onDone }) {
  const [current, setCurrent] = useState(0);
  const isLast = current === ONBOARDING_SLIDES.length - 1;

  const bgColors = [
      'from-brand-900 via-slate-900 to-black',
      'from-amber-900 via-slate-900 to-black',
      'from-amber-900 via-slate-900 to-black'
  ];

  return (
    <div className={`fixed inset-0 z-[9998] flex flex-col transition-all duration-1000 bg-linear-to-b ${bgColors[current]}`}>
      
      {/* Background Blobs for depth */}
      <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-white/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-brand-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Skip Button */}
      <div className="flex justify-end p-6 pt-12 relative z-50">
        <button onClick={onDone} className="text-white/30 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors p-2">
          Skip Narrative
        </button>
      </div>

      {/* Immersive Content Slide */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center relative z-20" key={current}>
        
        {/* Animated Hero Element */}
        <div className="relative mb-12">
            <div className={`w-36 h-36 rounded-[3rem] bg-linear-to-br ${ONBOARDING_SLIDES[current].color}
                             flex items-center justify-center shadow-3xl shadow-current opacity-90 float-anim border border-white/10`}>
              <span className="text-7xl drop-shadow-2xl">{ONBOARDING_SLIDES[current].emoji}</span>
            </div>
            {/* Pulsing ring around hero */}
            <div className="absolute inset-[-10%] border-2 border-white/5 rounded-[3.5rem] animate-ping opacity-20" />
        </div>

        <h2 className="text-4xl font-black text-white mb-4 tracking-tight leading-tight italic page-zoom-in">
            {ONBOARDING_SLIDES[current].title}
        </h2>
        <p className="text-brand-100/60 text-sm leading-relaxed max-w-[280px] font-medium mb-12 animate-fade-in">
            {ONBOARDING_SLIDES[current].subtitle}
        </p>

        {/* Feature Icons Section */}
        <div className="flex items-center gap-6 opacity-40">
             <div className="flex flex-col items-center gap-1.5 grayscale">
                <Shield className="w-5 h-5 text-white" />
                <span className="text-[8px] font-black uppercase text-white tracking-widest">Secure</span>
             </div>
             <div className="flex flex-col items-center gap-1.5">
                <Zap className="w-5 h-5 text-brand-400" />
                <span className="text-[8px] font-black uppercase text-brand-400 tracking-widest">Fast</span>
             </div>
             <div className="flex flex-col items-center gap-1.5 grayscale">
                <Heart className="w-5 h-5 text-white" />
                <span className="text-[8px] font-black uppercase text-white tracking-widest">Social</span>
             </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-8 pb-16 relative z-50">
        {/* Progressive Dots */}
        <div className="flex justify-center gap-3 mb-10">
          {ONBOARDING_SLIDES.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-500
              ${i === current ? 'w-10 bg-brand-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'w-1.5 bg-white/20'}`} />
          ))}
        </div>

        <button
          onClick={() => isLast ? onDone() : setCurrent(c => c + 1)}
          className="group w-full py-5 rounded-4xl bg-white text-slate-900 font-black text-xs uppercase tracking-[0.2em]
                     shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 overflow-hidden relative"
        >
          <div className="absolute inset-y-0 left-0 w-0 bg-brand-500 transition-all group-hover:w-full opacity-10" />
          <span className="relative z-10">{isLast ? "Join the Alliance! 🦸" : 'Continue Story'}</span>
          <ArrowRight className={`w-4 h-4 relative z-10 transition-transform ${!isLast ? 'group-hover:translate-x-1 animate-bounce-horizontal' : ''}`} />
        </button>
      </div>
    </div>
  );
}

// ─── Main App ───────────────────────────────────────────────────────────────────
function AppContent() {
  const [phase, setPhase] = useState('app'); // bypass splash/onboarding for prototype
  const [screen, setScreen] = useState('feed');
  const [authReturn, setAuthReturn] = useState({ screen: 'feed', bag: null });
  const [selectedBag, setSelectedBag] = useState(null);
  const [orders, setOrders] = useState([]);
  const [donationContext, setDonationContext] = useState({ quantity: 5, originalPrice: 200 });

  const { businessMode, user } = useAuth();

  // Watch for Business Mode toggle to auto-switch screen
  useEffect(() => {
    if (businessMode) {
      setScreen('merchant');
    } else if (screen === 'merchant') {
      setScreen('feed');
    }
  }, [businessMode]);

  const handleSplashDone = useCallback(() => setPhase('onboarding'), []);
  const handleOnboardingDone = useCallback(() => setPhase('app'), []);

  const handleSelectBag = useCallback((bag) => {
    setSelectedBag(bag);
    setScreen('detail');
  }, []);

  const handleNavigate = useCallback((target, data) => {
    // Role-based access guards
    const isVendor = user?.role === 'vendor';
    if (isVendor && ['feed', 'impact'].includes(target)) return;
    if (!isVendor && target === 'merchant') return;

    if (target === 'auth') {
      setAuthReturn({ screen, bag: selectedBag });
    }
    if (target === 'donation' && data) {
      setDonationContext(data);
    }
    setScreen(target);
    setSelectedBag(null);
  }, [screen, selectedBag, user?.role]);

  const handleAuthSuccess = useCallback(() => {
    // Redirect vendor to dashboard, customer to previous screen
    const stored = JSON.parse(localStorage.getItem('unieat_user') || '{}');
    if (stored?.role === 'vendor') {
      setScreen('merchant');
      setSelectedBag(null);
    } else {
      setScreen(authReturn.screen || 'feed');
      setSelectedBag(authReturn.bag);
    }
  }, [authReturn]);

  const handleAuthBack = useCallback(() => {
    setScreen(authReturn.screen);
    setSelectedBag(authReturn.bag);
  }, [authReturn]);

  const handleBackToFeed = useCallback(() => {
    setScreen('feed');
    setSelectedBag(null);
  }, []);

  const handleAddOrder = useCallback((order) => {
    setOrders(prev => [order, ...prev]);
  }, []);

  if (phase === 'splash') return <SplashScreen onDone={handleSplashDone} />;
  if (phase === 'onboarding') return <OnboardingScreen onDone={handleOnboardingDone} />;

  return (
    <>
      <div className={`${['feed', 'merchant', 'impact', 'history'].includes(screen) ? 'pb-24' : ''}`}>
        {screen === 'feed' && <ConsumerFeed onSelectBag={handleSelectBag} onNavigate={handleNavigate} />}
        {screen === 'detail' && selectedBag && <BookingDetail bag={selectedBag} onBack={handleBackToFeed} onAddOrder={handleAddOrder} onNavigate={handleNavigate} />}
        {screen === 'merchant' && <MerchantDashboard onNavigate={handleNavigate} />}
        {screen === 'impact' && <ImpactDashboard onNavigate={handleNavigate} />}
        {screen === 'donation' && <DonationFlow quantity={donationContext.quantity} originalPrice={donationContext.originalPrice} onNavigate={handleNavigate} />}
        {screen === 'history' && <OrderHistory orders={orders} onNavigate={handleNavigate} />}
        {screen === 'profile' && <ProfileScreen onNavigate={handleNavigate} />}
        {screen === 'auth' && <Auth onBack={handleAuthBack} onSuccess={handleAuthSuccess} />}
      </div>
      {['feed', 'merchant', 'impact', 'history', 'profile'].includes(screen) && (
        <BottomNav active={screen} onNavigate={handleNavigate} />
      )}
      <NotificationDrawer onNavigate={handleNavigate} />
    </>
  );
}

export default function App() {
  return (
    <DarkModeProvider>
      <AuthProvider>
        <ToastProvider>
          <NotificationProvider>
            <FavoritesProvider>
              <ErrorBoundary>
                <div className="max-w-md mx-auto min-h-screen bg-white dm-bg relative shadow-2xl shadow-gray-300/50 overflow-hidden">
                  <AppContent />
                </div>
              </ErrorBoundary>
            </FavoritesProvider>
          </NotificationProvider>
        </ToastProvider>
      </AuthProvider>
    </DarkModeProvider>
  );
}
