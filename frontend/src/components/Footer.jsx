import React from 'react';
import { Facebook, Twitter, Linkedin, Youtube } from 'lucide-react';

const FooterColumn = ({ title, links }) => (
  <div>
    <h3 className="font-semibold text-lg mb-4">{title}</h3>
    <ul className="space-y-3">
      {links}
    </ul>
  </div>
);

const FooterLink = ({ href, children }) => (
  <li>
    <a href={href} className="text-gray-400 hover:text-white text-sm transition-colors">
      {children}
    </a>
  </li>
);

const Footer = () => {
  return (
    <footer className="bg-[#0f172a] text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Compliance */}
          <FooterColumn 
            title="Compliance"
            links={
              <>
                <FooterLink href="#">Overview</FooterLink>
                <FooterLink href="#">What is WCAG?</FooterLink>
                <FooterLink href="#">What is ADA?</FooterLink>
                <FooterLink href="#">What is AODA?</FooterLink>
                <FooterLink href="#">What is 508?</FooterLink>
              </>
            }
          />

          {/* Company */}
          <FooterColumn 
            title="Company"
            links={
              <>
                <FooterLink href="#">About Us</FooterLink>
                <FooterLink href="#">Our Impact</FooterLink>
                <FooterLink href="#">Contact Us</FooterLink>
                <FooterLink href="#">Global Locations</FooterLink>
                <FooterLink href="#">Australia Office</FooterLink>
                <FooterLink href="#">Managed Services</FooterLink>
                <FooterLink href="#">Pricing</FooterLink>
              </>
            }
          />

          {/* Industries */}
          <FooterColumn 
            title="Industries"
            links={
              <>
                <FooterLink href="#">Government</FooterLink>
                <FooterLink href="#">Banking & Finance</FooterLink>
                <FooterLink href="#">Accommodation</FooterLink>
                <FooterLink href="#">Education</FooterLink>
                <FooterLink href="#">Healthcare</FooterLink>
              </>
            }
          />

          {/* Resources */}
          <FooterColumn 
            title="Resources"
            links={
              <>
                <FooterLink href="#">Accessibility FAQ</FooterLink>
                <FooterLink href="#">Documentation</FooterLink>
                <FooterLink href="#">Installation Guides</FooterLink>
                <FooterLink href="#">Blog & Insights</FooterLink>
              </>
            }
          />

          {/* Legal */}
          <FooterColumn 
            title="Legal"
            links={
              <>
                <FooterLink href="#">Privacy Policy</FooterLink>
                <FooterLink href="#">Terms of Service</FooterLink>
                <FooterLink href="#">Accessibility Statement</FooterLink>
              </>
            }
          />

          {/* Support & Help */}
          <FooterColumn 
            title="Support & Help"
            links={
              <>
                <FooterLink href="#">Documentation</FooterLink>
                <FooterLink href="#">Contact Support</FooterLink>
                <FooterLink href="#">Installation Guides</FooterLink>
              </>
            }
          />
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
              <span className="text-xl font-bold">Webenablix</span>
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
              © 2025 Webenablix. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
