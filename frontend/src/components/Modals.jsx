import React, { useState } from 'react';
import { X, Loader2, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CookieConsent = ({ onClose }) => {
  return (
    <div className="fixed bottom-6 left-6 z-50 max-w-sm bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
      <h3 className="font-bold text-gray-900 mb-2">Help us improve Webenablix</h3>
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
  const [email, setEmail] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await axios.post(`${API}/leads`, {
        email: email.trim(),
        website_url: websiteUrl.trim() || null
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setEmail('');
        setWebsiteUrl('');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
        
        {success ? (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank you!</h2>
            <p className="text-gray-600">We'll send your free accessibility report shortly.</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Is your website truly accessible to everyone?
            </h2>
            <p className="text-gray-600 mb-6">
              Get a free accessibility report and discover how you can create a more welcoming experience for all visitors— while also protecting your business.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 rounded-lg"
                required
              />
              <Input
                type="url"
                placeholder="Website URL (optional)"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="w-full h-12 rounded-lg"
              />
              
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
              
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button 
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-full py-3 font-semibold"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  ) : (
                    'Get my free report'
                  )}
                </Button>
                <Button 
                  type="button"
                  variant="outline" 
                  className="rounded-full py-3 px-6"
                  onClick={onClose}
                >
                  Maybe later
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export { CookieConsent, AccessibilityReportModal };
