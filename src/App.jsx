import { useState, useEffect, useCallback } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { Leaf, ChevronRight } from 'lucide-react';
import { ToastProvider, DarkModeProvider } from './Shared';
import { ONBOARDING_SLIDES } from './data';
import ConsumerFeed from './ConsumerFeed';
import BookingDetail from './BookingDetail';
import MerchantDashboard from './MerchantDashboard';
import ImpactDashboard from './ImpactDashboard';
import OrderHistory from './OrderHistory';

// ─── Splash Screen ──────────────────────────────────────────────────────────────
function SplashScreen({ onDone }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(onDone, 400);
    }, 2200);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className={`fixed inset-0 z-[10000] bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700
                     flex flex-col items-center justify-center ${exiting ? 'splash-exit' : ''}`}>
      {/* Background decorations */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full" />
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-white/5 rounded-full" />
      <div className="absolute top-1/3 right-20 w-16 h-16 bg-white/10 rounded-full" />

      {/* Logo */}
      <div className="splash-logo">
        <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center
                        shadow-2xl shadow-emerald-800/30 border border-white/20">
          <Leaf className="w-12 h-12 text-white" />
        </div>
      </div>

      {/* Text */}
      <div className="splash-text mt-6 text-center">
        <h1 className="text-white text-3xl font-extrabold tracking-tight">SavePlate</h1>
        <p className="text-emerald-100 text-sm mt-2 font-medium">Rescue Food. Save Money.</p>
      </div>

      {/* Loading dots */}
      <div className="flex gap-1.5 mt-10">
        {[0, 1, 2].map(i => (
          <div key={i} className="w-2 h-2 bg-white/60 rounded-full splash-dot" />
        ))}
      </div>
    </div>
  );
}

// ─── Onboarding Carousel ────────────────────────────────────────────────────────
function OnboardingScreen({ onDone }) {
  const [current, setCurrent] = useState(0);
  const isLast = current === ONBOARDING_SLIDES.length - 1;

  return (
    <div className="fixed inset-0 z-[9998] bg-white flex flex-col">
      {/* Skip */}
      <div className="flex justify-end p-5 pt-12">
        <button onClick={onDone} className="text-gray-400 text-sm font-medium hover:text-gray-600 transition-colors">
          Skip
        </button>
      </div>

      {/* Slide */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center page-fade-in" key={current}>
        <div className={`w-32 h-32 rounded-3xl bg-gradient-to-br ${ONBOARDING_SLIDES[current].color}
                         flex items-center justify-center mb-8 shadow-xl float-anim`}>
          <span className="text-6xl">{ONBOARDING_SLIDES[current].emoji}</span>
        </div>
        <h2 className="text-2xl font-extrabold text-gray-800 mb-3">{ONBOARDING_SLIDES[current].title}</h2>
        <p className="text-gray-500 text-sm leading-relaxed max-w-xs">{ONBOARDING_SLIDES[current].subtitle}</p>
      </div>

      {/* Dots + Button */}
      <div className="px-8 pb-12">
        {/* Dots */}
        <div className="flex justify-center gap-2 mb-8">
          {ONBOARDING_SLIDES.map((_, i) => (
            <div key={i} className={`h-2 rounded-full transition-all duration-300
              ${i === current ? 'w-6 bg-emerald-500' : 'w-2 bg-gray-200'}`} />
          ))}
        </div>

        <button
          onClick={() => isLast ? onDone() : setCurrent(c => c + 1)}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-base
                     shadow-lg shadow-emerald-200 hover:from-emerald-600 hover:to-emerald-700 active:scale-[0.98] transition-all
                     flex items-center justify-center gap-2 btn-press"
        >
          {isLast ? "Let's Start Rescuing! 🦸" : 'Next'}
          {!isLast && <ChevronRight className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}

// ─── Main App ───────────────────────────────────────────────────────────────────
function AppContent() {
  const [phase, setPhase] = useState('splash'); // splash -> onboarding -> app
  const [screen, setScreen] = useState('feed');
  const [selectedBag, setSelectedBag] = useState(null);
  const [orders, setOrders] = useState([]);

  const handleSplashDone = useCallback(() => setPhase('onboarding'), []);
  const handleOnboardingDone = useCallback(() => setPhase('app'), []);

  const handleSelectBag = useCallback((bag) => {
    setSelectedBag(bag);
    setScreen('detail');
  }, []);

  const handleNavigate = useCallback((target) => {
    setScreen(target);
    setSelectedBag(null);
  }, []);

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
      {screen === 'feed' && <ConsumerFeed onSelectBag={handleSelectBag} onNavigate={handleNavigate} />}
      {screen === 'detail' && selectedBag && <BookingDetail bag={selectedBag} onBack={handleBackToFeed} onAddOrder={handleAddOrder} />}
      {screen === 'merchant' && <MerchantDashboard onNavigate={handleNavigate} />}
      {screen === 'impact' && <ImpactDashboard onNavigate={handleNavigate} />}
      {screen === 'history' && <OrderHistory orders={orders} onNavigate={handleNavigate} />}
    </>
  );
}

export default function App() {
  return (
    <DarkModeProvider>
      <ToastProvider>
        <ErrorBoundary>
          <div className="max-w-md mx-auto min-h-screen bg-white dm-bg relative shadow-2xl shadow-gray-300/50">
            <AppContent />
          </div>
        </ErrorBoundary>
      </ToastProvider>
    </DarkModeProvider>
  );
}
