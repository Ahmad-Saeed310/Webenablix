import React, { useState } from 'react';
import { Search, User, Menu, X, MapPin } from 'lucide-react';
import { Button } from './ui/button';

const navigationItems = [
  { name: 'Products', href: '#products' },
  { name: 'Industries', href: '#industries' },
  { name: 'Installation', href: '#installation' },
  { name: 'Docs', href: '#docs' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'About us', href: '#about' },
  { name: 'Blogs', href: '#blogs' },
  { name: 'Agency', href: '#agency' },
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  return (
    <>
      {/* Top Banner */}
      {showBanner && (
        <div className="bg-[#2563EB] text-white py-2.5 px-4 text-center text-sm relative">
          <span>Enhance accessibility audits & fixes with ABILYO</span>
          <button className="ml-4 px-4 py-1 bg-white text-[#2563EB] rounded-full text-sm font-medium hover:bg-gray-100 transition-colors">
            Get early access
          </button>
          <button 
            onClick={() => setShowBanner(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Main Header */}
      <header className="sticky top-0 z-50 w-full">
        <div className="bg-gradient-to-b from-[#2563EB] to-[#3B82F6] px-4 py-3">
          <div className="max-w-7xl mx-auto">
            <nav className="bg-white rounded-full px-6 py-2.5 flex items-center justify-between shadow-lg">
              {/* Logo */}
              <a href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 12l2 2 4-4" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-[#1e293b]">WebAbility</span>
              </a>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-1">
                {navigationItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="px-3 py-2 text-sm text-gray-600 hover:text-[#2563EB] transition-colors font-medium"
                  >
                    {item.name}
                  </a>
                ))}
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-3">
                <button className="p-2 text-gray-500 hover:text-[#2563EB] transition-colors hidden sm:block">
                  <Search size={20} />
                </button>
                <button className="p-2 text-gray-500 hover:text-[#2563EB] transition-colors hidden sm:block">
                  <MapPin size={20} />
                </button>
                <Button className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-full px-5 py-2 flex items-center gap-2 text-sm font-medium">
                  <User size={16} />
                  <span className="hidden sm:inline">Login/Signup</span>
                </Button>
                
                {/* Mobile Menu Toggle */}
                <button 
                  className="lg:hidden p-2 text-gray-500"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </nav>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b shadow-lg">
            <div className="px-4 py-4 space-y-2">
              {navigationItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
