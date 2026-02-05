import React, { useState } from 'react';
import { 
  ArrowRight, Search, Loader2, CheckCircle, XCircle, AlertTriangle,
  Smartphone, Shield, Zap, Globe, Eye, ChevronDown, ChevronUp, Download
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Score Badge Component
const ScoreBadge = ({ score, label }) => {
  let colorClasses = 'bg-red-100 text-red-600 ring-red-500';
  if (score >= 80) colorClasses = 'bg-emerald-100 text-emerald-600 ring-emerald-500';
  else if (score >= 60) colorClasses = 'bg-yellow-100 text-yellow-600 ring-yellow-500';
  
  return (
    <div className="flex flex-col items-center">
      <div className={`w-20 h-20 rounded-full flex items-center justify-center ring-4 ${colorClasses}`}>
        <span className="font-bold text-2xl">{score}</span>
      </div>
      <span className="text-xs text-gray-500 mt-2 text-center">{label}</span>
    </div>
  );
};

const FreeCheckerPage = () => {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [auditResult, setAuditResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAudit = async () => {
    if (!websiteUrl.trim()) {
      setError('Please enter a website URL');
      return;
    }

    setLoading(true);
    setError(null);
    setAuditResult(null);

    try {
      const response = await axios.post(`${API}/audit`, { url: websiteUrl, audit_type: 'full' });
      setAuditResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to audit website. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[#2563EB] to-[#3B82F6] py-20 lg:py-28">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-full text-sm font-medium mb-6">
              <Zap className="w-4 h-4" /> FREE Tool
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Free WCAG & ADA<br />Compliance Checker
            </h1>
            <p className="text-xl text-white/80 mb-8">
              Instantly scan your website for accessibility issues and get a comprehensive compliance report.
            </p>
            
            {/* URL Input */}
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Input
                    type="url"
                    placeholder="Enter your website URL (e.g., example.com)"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAudit()}
                    className="w-full h-14 pl-12 pr-4 rounded-full bg-white text-gray-800 placeholder:text-gray-400"
                    disabled={loading}
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                <Button 
                  onClick={handleAudit}
                  disabled={loading}
                  className="h-14 px-8 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-semibold flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
                >
                  {loading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" />Scanning...</>
                  ) : (
                    <>Check Now<ArrowRight className="w-5 h-5" /></>
                  )}
                </Button>
              </div>
              {error && <p className="mt-4 text-red-200 text-sm">{error}</p>}
            </div>
          </div>
        </section>

        {/* Results Section */}
        {auditResult && (
          <section className="py-12 -mt-8">
            <div className="max-w-5xl mx-auto px-4">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <p className="text-sm opacity-80">Accessibility Report</p>
                      <p className="text-lg font-semibold truncate max-w-md">{auditResult.url}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-4xl font-bold">{auditResult.overall_score}</p>
                        <p className="text-xs opacity-80">Overall Score</p>
                      </div>
                      <Button variant="outline" size="sm" className="border-white text-white hover:bg-white/10 rounded-full">
                        <Download className="w-4 h-4 mr-2" /> Export PDF
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Scores */}
                <div className="p-6 border-b">
                  <div className="flex flex-wrap justify-center gap-8">
                    <ScoreBadge score={auditResult.accessibility_score} label="Accessibility" />
                    <ScoreBadge score={auditResult.seo_score} label="SEO" />
                    <ScoreBadge score={auditResult.performance_score} label="Performance" />
                    <ScoreBadge score={auditResult.mobile_score} label="Mobile" />
                    <ScoreBadge score={auditResult.security_score} label="Security" />
                  </div>
                </div>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-3 border-b">
                  <div className="p-4 text-center border-r">
                    <p className="text-3xl font-bold text-red-500">{auditResult.critical_issues}</p>
                    <p className="text-sm text-gray-500">Critical Issues</p>
                  </div>
                  <div className="p-4 text-center border-r">
                    <p className="text-3xl font-bold text-yellow-500">{auditResult.warnings}</p>
                    <p className="text-sm text-gray-500">Warnings</p>
                  </div>
                  <div className="p-4 text-center">
                    <p className="text-3xl font-bold text-gray-700">{auditResult.total_issues}</p>
                    <p className="text-sm text-gray-500">Total Issues</p>
                  </div>
                </div>
                
                {/* Recommendations */}
                {auditResult.top_recommendations && auditResult.top_recommendations.length > 0 && (
                  <div className="p-6 bg-blue-50">
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-[#2563EB]" /> Top Recommendations
                    </h3>
                    <div className="space-y-2">
                      {auditResult.top_recommendations[0] && (
                        <div className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="w-5 h-5 bg-[#2563EB] text-white rounded-full flex items-center justify-center text-xs flex-shrink-0">1</span>
                          {auditResult.top_recommendations[0]}
                        </div>
                      )}
                      {auditResult.top_recommendations[1] && (
                        <div className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="w-5 h-5 bg-[#2563EB] text-white rounded-full flex items-center justify-center text-xs flex-shrink-0">2</span>
                          {auditResult.top_recommendations[1]}
                        </div>
                      )}
                      {auditResult.top_recommendations[2] && (
                        <div className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="w-5 h-5 bg-[#2563EB] text-white rounded-full flex items-center justify-center text-xs flex-shrink-0">3</span>
                          {auditResult.top_recommendations[2]}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* CTA */}
                <div className="p-6 bg-gray-50 text-center">
                  <p className="text-gray-600 mb-4">Want a more detailed analysis with expert recommendations?</p>
                  <Button className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-full px-8">
                    Get Full Audit Report
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Features */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Free Checker Analyzes</h2>
              <p className="text-gray-600">Comprehensive scanning based on WCAG 2.1 & 2.2 guidelines</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl">
                <Eye className="w-10 h-10 text-[#2563EB] mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Accessibility Issues</h3>
                <p className="text-gray-600 text-sm">Alt text, color contrast, form labels, ARIA attributes, keyboard navigation</p>
              </div>
              <div className="bg-white p-6 rounded-xl">
                <Globe className="w-10 h-10 text-[#2563EB] mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">SEO Analysis</h3>
                <p className="text-gray-600 text-sm">Meta tags, headings, structured data, sitemap, robots.txt</p>
              </div>
              <div className="bg-white p-6 rounded-xl">
                <Zap className="w-10 h-10 text-[#2563EB] mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Core Web Vitals</h3>
                <p className="text-gray-600 text-sm">LCP, FID, CLS metrics based on Google's ranking factors</p>
              </div>
              <div className="bg-white p-6 rounded-xl">
                <Smartphone className="w-10 h-10 text-[#2563EB] mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Mobile Friendliness</h3>
                <p className="text-gray-600 text-sm">Viewport, tap targets, text readability, responsive design</p>
              </div>
              <div className="bg-white p-6 rounded-xl">
                <Shield className="w-10 h-10 text-[#2563EB] mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Security Checks</h3>
                <p className="text-gray-600 text-sm">HTTPS, HSTS, Content Security Policy, mixed content</p>
              </div>
              <div className="bg-white p-6 rounded-xl">
                <CheckCircle className="w-10 h-10 text-[#2563EB] mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Compliance Status</h3>
                <p className="text-gray-600 text-sm">WCAG 2.1 level, lawsuit risk assessment, ADA compliance</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-r from-[#2563EB] to-[#3B82F6]">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Need More Than a Free Check?</h2>
            <p className="text-white/80 text-lg mb-8">Our expert audits provide in-depth analysis with remediation support</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button className="bg-white text-[#2563EB] hover:bg-gray-100 rounded-full px-8 py-4 h-auto font-semibold">
                Explore Audit Services
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10 rounded-full px-8 py-4 h-auto font-semibold">
                Install Widget
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default FreeCheckerPage;
