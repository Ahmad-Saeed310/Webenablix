import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, User, Menu, X, MapPin, ChevronDown,
  Building, Landmark, GraduationCap, ShoppingCart, Code, HeartPulse,
  Car, Home, Heart, Tv, Shield, Sparkles
} from 'lucide-react';
import { Button } from './ui/button';
import { productsMenu, industriesMenu, installationsMenu } from '../data/navigation';

const DropdownMenu = ({ items, isOpen, onClose, type }) => {
  if (!isOpen) return null;

  const getColumns = () => {
    if (type === 'industries') return 'grid-cols-2 lg:grid-cols-3';
    if (type === 'installations') return 'grid-cols-2 lg:grid-cols-4';
    return 'grid-cols-1';
  };

  return (
    <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-50 min-w-[300px]" style={{ maxWidth: type === 'installations' ? '700px' : type === 'industries' ? '600px' : '350px' }}>
      <div className={`grid ${getColumns()} gap-2`}>
        {items.slice(0, 12).map((item, idx) => (
          <Link
            key={`dropdown-${type}-${idx}`}
            to={item.href}
            onClick={onClose}
            className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-800 group-hover:text-[#2563EB] text-sm">{item.name}</span>
                {item.isNew && (
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">NEW</span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const NavItem = ({ label, items, type }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-[#2563EB] transition-colors font-medium"
      >
        {label}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <DropdownMenu items={items} isOpen={isOpen} onClose={() => setIsOpen(false)} type={type} />
    </div>
  );
};

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const navigate = useNavigate();

  const simpleNavItems = [
    { name: 'Docs', href: '/docs' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'About us', href: '/about' },
    { name: 'Blogs', href: '/blogs' },
    { name: 'Agency', href: '/agency' }
  ];

  return (
    <>
      {showBanner && (
        <div className="bg-[#2563EB] text-white py-2.5 px-4 text-center text-sm relative">
          <span>Enhance accessibility audits & fixes with ABILYO</span>
          <button className="ml-4 px-4 py-1 bg-white text-[#2563EB] rounded-full text-sm font-medium hover:bg-gray-100 transition-colors">
            Get early access
          </button>
          <button onClick={() => setShowBanner(false)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white">
            <X size={16} />
          </button>
        </div>
      )}

      <header className="sticky top-0 z-50 w-full">
        <div className="bg-gradient-to-b from-[#2563EB] to-[#3B82F6] px-4 py-3">
          <div className="max-w-7xl mx-auto">
            <nav className="bg-white rounded-full px-6 py-2.5 flex items-center justify-between shadow-lg">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 12l2 2 4-4" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-[#1e293b]">Webenablix</span>
              </Link>

              <div className="hidden lg:flex items-center gap-1">
                <NavItem label="Products" items={productsMenu} type="products" />
                <NavItem label="Industries" items={industriesMenu} type="industries" />
                <NavItem label="Installation" items={installationsMenu} type="installations" />
                {simpleNavItems.map((item) => (
                  <Link key={item.name} to={item.href} className="px-3 py-2 text-sm text-gray-600 hover:text-[#2563EB] transition-colors font-medium">
                    {item.name}
                  </Link>
                ))}
              </div>

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
                <button className="lg:hidden p-2 text-gray-500" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </nav>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b shadow-lg max-h-[70vh] overflow-y-auto">
            <div className="px-4 py-4 space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase mb-2 px-4">Products</p>
                {productsMenu.map((item, idx) => (
                  <Link key={`mob-prod-${idx}`} to={item.href} className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                    {item.name}
                  </Link>
                ))}
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase mb-2 px-4">Industries</p>
                {industriesMenu.slice(0, 6).map((item, idx) => (
                  <Link key={`mob-ind-${idx}`} to={item.href} className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="border-t pt-4">
                {simpleNavItems.map((item, idx) => (
                  <Link key={`mob-nav-${idx}`} to={item.href} className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
