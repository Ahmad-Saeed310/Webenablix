import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import AuditSection from './components/AuditSection';
import WhyAccessibilitySection from './components/WhyAccessibilitySection';
import WidgetSection from './components/WidgetSection';
import TrustedBySection from './components/TrustedBySection';
import Footer from './components/Footer';
import { CookieConsent, AccessibilityReportModal } from './components/Modals';

const HomePage = () => {
  const [showCookieConsent, setShowCookieConsent] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    // Show the report modal after 5 seconds
    const timer = setTimeout(() => {
      setShowReportModal(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <AuditSection />
        <WhyAccessibilitySection />
        <WidgetSection />
        <TrustedBySection />
      </main>
      <Footer />
      
      {/* Modals */}
      {showCookieConsent && (
        <CookieConsent onClose={() => setShowCookieConsent(false)} />
      )}
      <AccessibilityReportModal 
        isOpen={showReportModal} 
        onClose={() => setShowReportModal(false)} 
      />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
