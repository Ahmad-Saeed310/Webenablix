import React from 'react';
import { Facebook, Twitter, Linkedin, Youtube } from 'lucide-react';
import { footerLinks } from '../data/mock';

const Footer = () => {
  return (
    <footer className="bg-[#0f172a] text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Compliance */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Compliance</h3>
            <ul className="space-y-3">
              {footerLinks.compliance.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Industries */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Industries</h3>
            <ul className="space-y-3">
              {footerLinks.industries.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Help */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Support & Help</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#2563EB] rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                  <path d="M8 12l2 2 4-4" />
                </svg>
              </div>
              <span className="text-xl font-bold">WebAbility</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-[#2563EB] rounded-full flex items-center justify-center transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-[#2563EB] rounded-full flex items-center justify-center transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-[#2563EB] rounded-full flex items-center justify-center transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-[#2563EB] rounded-full flex items-center justify-center transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>

            {/* Copyright */}
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} WebAbility. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
