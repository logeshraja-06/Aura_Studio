import React, { useState, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useLenis } from './hooks/useLenis';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import CustomCursor from './components/CustomCursor';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import BookingModal from './components/BookingModal';
import Aperture3DBackground from './components/admin/Aperture3DBackground';

// Landing Sections
import Hero from './sections/Hero';
import Stats from './sections/Stats';
import Services from './sections/Services';
import Gallery from './sections/Gallery';
import Films from './sections/Films';
import WhyChooseUs from './sections/WhyChooseUs';
import Testimonials from './sections/Testimonials';
import Team from './sections/Team';
import BookingProcess from './sections/BookingProcess';
import InstagramFeed from './sections/InstagramFeed';
import FAQ from './sections/FAQ';
import Contact from './sections/Contact';
import Footer from './sections/Footer';

// Dedicated Public Page Routes
import PackagesPage from './pages/PackagesPage';
import ServiceBookingPage from './pages/ServiceBookingPage';
import ClientStatusLookup from './pages/ClientStatusLookup';

// Admin Auth Context & Components
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminBookings from './pages/admin/AdminBookings';
import AdminEquipment from './pages/admin/AdminEquipment';
import AdminServices from './pages/admin/AdminServices';
import AdminSettings from './pages/admin/AdminSettings';

// Lazy Load Heavy 3D Dashboard Scene
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

// Branded Dark Loader while verifying token session
function DarkAdminAuthLoader() {
  return (
    <div className="fixed inset-0 z-[150] bg-[#1F140D] text-cream flex flex-col items-center justify-center p-4 select-none">
      <Aperture3DBackground />
      <div className="relative z-10 flex flex-col items-center gap-4 text-center">
        <div className="w-16 h-16 rounded-full border-4 border-gold/20 border-t-gold animate-spin shadow-gold-glow" />
        <div>
          <h2 className="font-serif font-bold text-2xl text-cream tracking-widest">
            AURA <span className="text-gold text-xs font-montserrat">CONTROL</span>
          </h2>
          <span className="text-[10px] uppercase font-montserrat font-bold text-rust tracking-[0.25em] block mt-1">
            Verifying Cryptographic Credentials...
          </span>
        </div>
      </div>
    </div>
  );
}

// Protected Admin Route Guard with Dev Diagnostic Logging
function ProtectedAdminRoute({ children }) {
  const { isAuthenticated, authLoading } = useAdminAuth();

  // Dev diagnostic log to verify auth check execution
  if (process.env.NODE_ENV !== 'production') {
    console.log('[ProtectedAdminRoute Guard]', { authLoading, isAuthenticated });
  }

  if (authLoading) {
    return <DarkAdminAuthLoader />;
  }

  if (!isAuthenticated) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[ProtectedAdminRoute Guard] Unauthenticated access attempt. Redirecting to /admin/login');
    }
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

function LandingPage({ onOpenBooking }) {
  const handleOpenFilms = () => {
    const filmsSection = document.getElementById('films');
    if (filmsSection) {
      filmsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main>
      <Hero
        onOpenBooking={() => onOpenBooking()}
        onOpenFilms={handleOpenFilms}
      />
      <Stats />
      <Services />
      <Gallery onBook={() => onOpenBooking()} />
      <Films onBook={() => onOpenBooking()} />
      <WhyChooseUs />
      <Testimonials />
      <Team />
      <BookingProcess onBook={() => onOpenBooking()} />
      <InstagramFeed />
      <FAQ onBook={() => onOpenBooking()} />
      <Contact />
      <Footer />
    </main>
  );
}

function AppContent() {
  const [loading, setLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedPackageForBooking, setSelectedPackageForBooking] = useState('Wedding Photography - Royal Signature');
  const location = useLocation();

  // Initialize Lenis Smooth Scroll
  useLenis();

  const handleOpenBooking = (pkgName = 'Wedding Photography - Royal Signature') => {
    setSelectedPackageForBooking(pkgName);
    setBookingOpen(true);
  };

  const isAdminRoute = location.pathname.startsWith('/admin');

  // Strictly Isolated Admin Routing Hierarchy
  if (isAdminRoute) {
    return (
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route
            index
            element={
              <Suspense fallback={<DarkAdminAuthLoader />}>
                <AdminDashboard />
              </Suspense>
            }
          />
          <Route
            path="dashboard"
            element={
              <Suspense fallback={<DarkAdminAuthLoader />}>
                <AdminDashboard />
              </Suspense>
            }
          />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="equipment" element={<AdminEquipment />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        {/* Redirect any unhandled /admin/* sub-path back to /admin */}
        <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
      </Routes>
    );
  }

  // Public Shell & Public Routes (Zero overlap with /admin)
  return (
    <div className="min-h-screen bg-cream text-charcoal relative selection:bg-gold selection:text-white">
      {/* Minimal Camera Aperture Loader Screen */}
      {loading && <Loader onFinish={() => setLoading(false)} />}

      {!loading && (
        <>
          {/* Minimal Gold Outline Cursor */}
          <CustomCursor />

          {/* Persistent Shared Glass Navbar */}
          <Navbar onOpenBooking={handleOpenBooking} />

          {/* Client-Side Public Page Routes */}
          <Routes>
            <Route
              path="/"
              element={<LandingPage onOpenBooking={handleOpenBooking} />}
            />
            <Route
              path="/packages"
              element={<PackagesPage />}
            />
            <Route
              path="/booking/:serviceId"
              element={<ServiceBookingPage />}
            />
            {/* Standalone Public Client Reservation Status Lookup Routes */}
            <Route
              path="/track-booking"
              element={<ClientStatusLookup />}
            />
            <Route
              path="/status"
              element={<ClientStatusLookup />}
            />
          </Routes>

          {/* Floating WhatsApp Direct Chat */}
          <FloatingWhatsApp />

          {/* General Reservation Booking Modal */}
          <BookingModal
            isOpen={bookingOpen}
            onClose={() => setBookingOpen(false)}
            selectedPackage={selectedPackageForBooking}
          />
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AdminAuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AdminAuthProvider>
  );
}
