import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AccessibilityWidget from './components/AccessibilityWidget';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import AuditSection from './components/AuditSection';
import WhyAccessibilitySection from './components/WhyAccessibilitySection';
import WidgetSection from './components/WidgetSection';
import TrustedBySection from './components/TrustedBySection';
import Footer from './components/Footer';
import { CookieConsent, AccessibilityReportModal } from './components/Modals';

// Pages
import PricingPage from './pages/PricingPage';
import ProductsPage from './pages/ProductsPage';
import IndustriesPage from './pages/IndustriesPage';
import InstallationsPage from './pages/InstallationsPage';
import WidgetPage from './pages/WidgetPage';
import AuditPage from './pages/AuditPage';
import FreeCheckerPage from './pages/FreeCheckerPage';

const HomePage = () => {
  const [showCookieConsent, setShowCookieConsent] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);

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

// Simple placeholder pages
const SimplePage = ({ title }) => (
  <div className="min-h-screen bg-gray-50">
    <Header />
    <main className="py-20">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
        <p className="text-gray-600">We're building something amazing. Check back soon!</p>
      </div>
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AccessibilityWidget />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/widget" element={<WidgetPage />} />
        <Route path="/products/audit" element={<AuditPage />} />
        <Route path="/products/checker" element={<FreeCheckerPage />} />
        <Route path="/products/managed" element={<SimplePage title="Managed Accessibility" />} />
        <Route path="/products/monitor" element={<SimplePage title="Accessibility Monitor" />} />
        <Route path="/products/compare" element={<SimplePage title="Compare Solutions" />} />
        <Route path="/industries" element={<IndustriesPage />} />
        <Route path="/industries/*" element={<IndustriesPage />} />
        <Route path="/installation" element={<InstallationsPage />} />
        <Route path="/installation/*" element={<InstallationsPage />} />
        <Route path="/docs" element={<SimplePage title="Documentation" />} />
        <Route path="/about" element={<SimplePage title="About Us" />} />
        <Route path="/blogs" element={<SimplePage title="Blog & Insights" />} />
        <Route path="/agency" element={<SimplePage title="Agency Partners" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
