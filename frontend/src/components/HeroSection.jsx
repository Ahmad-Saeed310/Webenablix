import React from 'react';
import { Check, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-b from-[#3B82F6] to-[#60a5fa] overflow-hidden">
      {/* Decorative 3D Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Cards - Left Side */}
        <div className="absolute -left-20 top-1/4 w-64 h-40 bg-white/10 backdrop-blur-sm rounded-2xl transform -rotate-12 shadow-xl" />
        <div className="absolute left-10 bottom-1/4 w-48 h-32 bg-white/10 backdrop-blur-sm rounded-2xl transform rotate-6 shadow-xl" />
        
        {/* Floating Cards - Right Side */}
        <div className="absolute -right-20 top-1/3 w-64 h-40 bg-white/10 backdrop-blur-sm rounded-2xl transform rotate-12 shadow-xl" />
        <div className="absolute right-20 bottom-1/4 w-48 h-32 bg-white/10 backdrop-blur-sm rounded-2xl transform -rotate-6 shadow-xl" />
        
        {/* Additional Floating Elements */}
        <div className="absolute left-1/4 top-20 w-32 h-24 bg-white/5 backdrop-blur-sm rounded-xl transform rotate-3" />
        <div className="absolute right-1/4 top-32 w-40 h-28 bg-white/5 backdrop-blur-sm rounded-xl transform -rotate-6" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-20 lg:py-28">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#1e3a5f]/40 backdrop-blur-sm text-white px-5 py-2.5 rounded-full mb-8">
            <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                <path d="M8 12l2 2 4-4" />
              </svg>
            </div>
            <span className="text-sm font-medium">Navigate ADA & WCAG compliance</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Ultimate Web Accessibility<br />Compliance Tool
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Navigate ADA & WCAG Compliance with WebAbility's Accessibility Solutions
          </p>

          {/* CTA Button */}
          <Button className="bg-white text-[#2563EB] hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 h-auto">
            Enable Accessibility Today
          </Button>
        </div>

        {/* Feature Cards */}
        <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Compliance Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-[#2563EB]" />
              </div>
              <span className="text-gray-500 text-sm">Check compliance</span>
            </div>
            <p className="text-gray-600 text-sm">Your website comply with WCAG</p>
          </div>

          {/* Accessibility Score Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#2563EB] rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-gray-500 text-xs">WebAbility</span>
                  <p className="font-semibold text-gray-800">Accessibility Score</p>
                </div>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#2563EB]" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                  <path d="M8 12l2 2 4-4" />
                </svg>
              </div>
            </div>
            <div className="text-center">
              <span className="text-6xl font-bold text-[#2563EB]">90</span>
              <span className="text-2xl text-gray-400">%</span>
            </div>
          </div>

          {/* Lawsuit Risk Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-gray-800">Lawsuit Risk</span>
              <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-emerald-600">
              <Check className="w-5 h-5" />
              <span className="text-sm">Your website is safe against any legal violation.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
