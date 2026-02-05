import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Zap, Eye, Globe, BarChart3, Users } from 'lucide-react';
import { Button } from '../components/ui/button';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ProductsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-b from-[#2563EB] to-[#3B82F6] py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Products</h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Comprehensive accessibility solutions to make your website compliant and inclusive for everyone.
            </p>
          </div>
        </section>
        
        {/* Products Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Free Accessibility Checker */}
              <Link to="/products/checker" className="group">
                <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-[#2563EB] hover:shadow-xl transition-all duration-300">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#2563EB] transition-colors">
                    <Shield className="w-7 h-7 text-[#2563EB] group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#2563EB] transition-colors">Free Accessibility Checker</h3>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">NEW</span>
                  </div>
                  <p className="text-gray-600 mb-6">Free WCAG & ADA Compliance Checker</p>
                  <div className="flex items-center text-[#2563EB] font-medium">
                    Learn more <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
              
              {/* Widget */}
              <Link to="/products/widget" className="group">
                <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-[#2563EB] hover:shadow-xl transition-all duration-300">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#2563EB] transition-colors">
                    <Zap className="w-7 h-7 text-[#2563EB] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#2563EB] transition-colors mb-2">Widget</h3>
                  <p className="text-gray-600 mb-6">AI-Enhanced Accessibility for Your Website</p>
                  <div className="flex items-center text-[#2563EB] font-medium">
                    Learn more <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
              
              {/* Audit */}
              <Link to="/products/audit" className="group">
                <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-[#2563EB] hover:shadow-xl transition-all duration-300">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#2563EB] transition-colors">
                    <Eye className="w-7 h-7 text-[#2563EB] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#2563EB] transition-colors mb-2">Audit</h3>
                  <p className="text-gray-600 mb-6">Audit for ADA & WCAG accessibility compliance</p>
                  <div className="flex items-center text-[#2563EB] font-medium">
                    Learn more <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
              
              {/* Managed Accessibility */}
              <Link to="/products/managed" className="group">
                <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-[#2563EB] hover:shadow-xl transition-all duration-300">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#2563EB] transition-colors">
                    <Globe className="w-7 h-7 text-[#2563EB] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#2563EB] transition-colors mb-2">Managed Accessibility</h3>
                  <p className="text-gray-600 mb-6">Redefining Accessibility Excellence</p>
                  <div className="flex items-center text-[#2563EB] font-medium">
                    Learn more <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
              
              {/* Accessibility Monitor */}
              <Link to="/products/monitor" className="group">
                <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-[#2563EB] hover:shadow-xl transition-all duration-300">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#2563EB] transition-colors">
                    <BarChart3 className="w-7 h-7 text-[#2563EB] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#2563EB] transition-colors mb-2">Accessibility Monitor</h3>
                  <p className="text-gray-600 mb-6">Analyze, and Export accessibility issues with AI</p>
                  <div className="flex items-center text-[#2563EB] font-medium">
                    Learn more <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
              
              {/* Compare */}
              <Link to="/products/compare" className="group">
                <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-[#2563EB] hover:shadow-xl transition-all duration-300">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#2563EB] transition-colors">
                    <Users className="w-7 h-7 text-[#2563EB] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#2563EB] transition-colors mb-2">Compare</h3>
                  <p className="text-gray-600 mb-6">Discover how WebAbility offers a better solution</p>
                  <div className="flex items-center text-[#2563EB] font-medium">
                    Learn more <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Not sure which product is right for you?</h2>
            <p className="text-gray-600 mb-8">Our accessibility experts can help you find the perfect solution for your needs.</p>
            <Button className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-full px-8 py-4 h-auto font-semibold">
              Schedule a Consultation
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductsPage;
