import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';

const CookieConsent = ({ onClose }) => {
  return (
    <div className="fixed bottom-6 left-6 z-50 max-w-sm bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
      <h3 className="font-bold text-gray-900 mb-2">Help us improve WebAbility</h3>
      <p className="text-gray-600 text-sm mb-4">
        We'd like to use analytics to make our accessibility tools better for everyone. You can change this anytime.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button 
          variant="outline" 
          className="rounded-full px-4 py-2 text-sm"
          onClick={onClose}
        >
          Reject All
        </Button>
        <Button 
          variant="outline" 
          className="rounded-full px-4 py-2 text-sm"
          onClick={onClose}
        >
          Accept All
        </Button>
        <Button 
          className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-full px-4 py-2 text-sm"
          onClick={onClose}
        >
          Customize
        </Button>
      </div>
    </div>
  );
};

const AccessibilityReportModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-8">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Is your website truly accessible to everyone?
        </h2>
        <p className="text-gray-600 mb-6">
          Get a free accessibility report and discover how you can create a more welcoming experience for all visitors— while also protecting your business.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button className="flex-1 bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-full py-3 font-semibold">
            Get my free report
          </Button>
          <Button 
            variant="outline" 
            className="rounded-full py-3 px-6"
            onClick={onClose}
          >
            Maybe later
          </Button>
        </div>
      </div>
    </div>
  );
};

export { CookieConsent, AccessibilityReportModal };
