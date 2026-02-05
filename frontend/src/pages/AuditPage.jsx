import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Check, Search, BarChart3, FileText, AlertTriangle,
  Eye, Globe, Shield, Zap, Clock, Download, Users, TrendingUp
} from 'lucide-react';
import { Button } from '../components/ui/button';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AuditPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[#2563EB] to-[#3B82F6] py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-sm mb-6">
              Professional Accessibility Audits
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Comprehensive Accessibility<br />Audit Services
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
              Get detailed reports on your website's ADA & WCAG compliance with actionable recommendations from certified accessibility experts.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button className="bg-white text-[#2563EB] hover:bg-gray-100 rounded-full px-8 py-4 h-auto font-semibold">
                Request an Audit
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10 rounded-full px-8 py-4 h-auto font-semibold">
                View Sample Report
              </Button>
            </div>
          </div>
        </section>

        {/* Audit Types */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Audit Services</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Choose the audit level that fits your needs
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Automated Audit */}
              <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-[#2563EB] hover:shadow-xl transition-all">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                  <Zap className="w-7 h-7 text-[#2563EB]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Automated Audit</h3>
                <p className="text-gray-600 mb-6">AI-powered scanning that detects common accessibility issues instantly.</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2"><Check className="w-5 h-5 text-emerald-500" /><span className="text-sm text-gray-700">Instant results</span></li>
                  <li className="flex items-center gap-2"><Check className="w-5 h-5 text-emerald-500" /><span className="text-sm text-gray-700">WCAG 2.1 coverage</span></li>
                  <li className="flex items-center gap-2"><Check className="w-5 h-5 text-emerald-500" /><span className="text-sm text-gray-700">Continuous monitoring</span></li>
                </ul>
                <Button className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-full">Try Free Scan</Button>
              </div>
              
              {/* Expert Audit */}
              <div className="bg-[#2563EB] rounded-2xl p-8 text-white relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-yellow-400 text-yellow-900 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                  <Eye className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Expert Audit</h3>
                <p className="text-blue-100 mb-6">Manual review by certified accessibility experts with detailed recommendations.</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2"><Check className="w-5 h-5 text-blue-200" /><span className="text-sm">Human expert review</span></li>
                  <li className="flex items-center gap-2"><Check className="w-5 h-5 text-blue-200" /><span className="text-sm">Priority recommendations</span></li>
                  <li className="flex items-center gap-2"><Check className="w-5 h-5 text-blue-200" /><span className="text-sm">Compliance statement</span></li>
                </ul>
                <Button className="w-full bg-white text-[#2563EB] hover:bg-gray-100 rounded-full">Schedule Audit</Button>
              </div>
              
              {/* Enterprise Audit */}
              <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-[#2563EB] hover:shadow-xl transition-all">
                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                  <Shield className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Enterprise Audit</h3>
                <p className="text-gray-600 mb-6">Complete audit with remediation support and legal documentation.</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2"><Check className="w-5 h-5 text-emerald-500" /><span className="text-sm text-gray-700">Full site coverage</span></li>
                  <li className="flex items-center gap-2"><Check className="w-5 h-5 text-emerald-500" /><span className="text-sm text-gray-700">Remediation support</span></li>
                  <li className="flex items-center gap-2"><Check className="w-5 h-5 text-emerald-500" /><span className="text-sm text-gray-700">Legal documentation</span></li>
                </ul>
                <Button variant="outline" className="w-full rounded-full">Contact Sales</Button>
              </div>
            </div>
          </div>
        </section>

        {/* What We Check */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What We Audit</h2>
              <p className="text-gray-600">Comprehensive checks based on WCAG 2.1 AA guidelines</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl">
                <Eye className="w-8 h-8 text-[#2563EB] mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Perceivable</h3>
                <p className="text-sm text-gray-600">Text alternatives, captions, color contrast, text resize</p>
              </div>
              <div className="bg-white p-6 rounded-xl">
                <Globe className="w-8 h-8 text-[#2563EB] mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Operable</h3>
                <p className="text-sm text-gray-600">Keyboard access, timing, navigation, input modalities</p>
              </div>
              <div className="bg-white p-6 rounded-xl">
                <FileText className="w-8 h-8 text-[#2563EB] mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Understandable</h3>
                <p className="text-sm text-gray-600">Readable content, predictable UI, input assistance</p>
              </div>
              <div className="bg-white p-6 rounded-xl">
                <Shield className="w-8 h-8 text-[#2563EB] mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Robust</h3>
                <p className="text-sm text-gray-600">Compatible with assistive technologies, valid markup</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-4xl font-bold text-[#2563EB]">50,000+</p>
                <p className="text-gray-600 mt-2">Audits Completed</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-[#2563EB]">99.9%</p>
                <p className="text-gray-600 mt-2">Client Satisfaction</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-[#2563EB]">48hrs</p>
                <p className="text-gray-600 mt-2">Average Turnaround</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-[#2563EB]">100+</p>
                <p className="text-gray-600 mt-2">Certified Experts</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-r from-[#2563EB] to-[#3B82F6]">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Start Your Accessibility Journey</h2>
            <p className="text-white/80 text-lg mb-8">Get a comprehensive audit and actionable roadmap to compliance</p>
            <Button className="bg-white text-[#2563EB] hover:bg-gray-100 rounded-full px-8 py-4 h-auto font-semibold">
              Request Free Consultation
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AuditPage;
