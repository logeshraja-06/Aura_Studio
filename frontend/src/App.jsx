import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useLenis } from './hooks/useLenis';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import CustomCursor from './components/CustomCursor';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import BookingModal from './components/BookingModal';

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

// Dedicated Page Routes
import PackagesPage from './pages/PackagesPage';
import ServiceBookingPage from './pages/ServiceBookingPage';

function LandingPage({ onOpenBooking }) {
  const handleOpenFilms = () => {
    const filmsSection = document.getElementById('films');
    if (filmsSection) {
      filmsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <Navbar onOpenBooking={() => onOpenBooking()} />
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
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedPackageForBooking, setSelectedPackageForBooking] = useState('Wedding Photography - Royal Signature');

  // Initialize Lenis Smooth Scroll
  useLenis();

  const handleOpenBooking = (pkgName = 'Wedding Photography - Royal Signature') => {
    setSelectedPackageForBooking(pkgName);
    setBookingOpen(true);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-cream text-charcoal relative selection:bg-gold selection:text-white">
        {/* Minimal Camera Shutter Loader Screen */}
        {loading && <Loader onFinish={() => setLoading(false)} />}

        {!loading && (
          <>
            {/* Minimal Custom Ring Cursor */}
            <CustomCursor />

            {/* Client-Side Page Routes */}
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
    </BrowserRouter>
  );
}
