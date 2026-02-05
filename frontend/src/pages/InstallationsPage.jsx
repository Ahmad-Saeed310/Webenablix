import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Settings, Tag, ShoppingBag, Rocket, Folder } from 'lucide-react';
import { Button } from '../components/ui/button';
import Header from '../components/Header';
import Footer from '../components/Footer';

const InstallationsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-b from-[#2563EB] to-[#3B82F6] py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Installation Guides</h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Easy step-by-step instructions to integrate WebAbility with your platform.
            </p>
          </div>
        </section>
        
        {/* Quick Start */}
        <section className="py-12 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Quick Start</h2>
                <p className="text-gray-600">Add WebAbility to your website in under 5 minutes</p>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" className="rounded-full">Watch Tutorial</Button>
                <Button className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-full">Get Your Code</Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Installations Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Choose Your Platform</h2>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {/* Embed */}
              <Link to="/installation/embed" className="group">
                <div className="bg-white rounded-xl p-6 border border-gray-100 hover:border-[#2563EB] hover:shadow-lg transition-all h-full flex flex-col">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                    <Code className="w-6 h-6 text-gray-600 group-hover:text-[#2563EB] transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#2563EB] transition-colors">Embed</h3>
                  <p className="text-gray-600 text-sm flex-1">Embed WebAbility's code into any site</p>
                  <div className="flex items-center text-[#2563EB] font-medium text-sm mt-4">
                    View Guide <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
              
              {/* WordPress */}
              <Link to="/installation/wordpress" className="group">
                <div className="bg-white rounded-xl p-6 border border-gray-100 hover:border-[#2563EB] hover:shadow-lg transition-all h-full flex flex-col">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                    <span className="text-2xl font-bold text-gray-600 group-hover:text-[#2563EB] transition-colors">W</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#2563EB] transition-colors">WordPress</h3>
                  <p className="text-gray-600 text-sm flex-1">Installing WebAbility on WordPress</p>
                  <div className="flex items-center text-[#2563EB] font-medium text-sm mt-4">
                    View Guide <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
              
              {/* Custom */}
              <Link to="/installation/custom" className="group">
                <div className="bg-white rounded-xl p-6 border border-gray-100 hover:border-[#2563EB] hover:shadow-lg transition-all h-full flex flex-col">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                    <Settings className="w-6 h-6 text-gray-600 group-hover:text-[#2563EB] transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#2563EB] transition-colors">Custom</h3>
                  <p className="text-gray-600 text-sm flex-1">Install WebAbility on custom sites with ease</p>
                  <div className="flex items-center text-[#2563EB] font-medium text-sm mt-4">
                    View Guide <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
              
              {/* Wix */}
              <Link to="/installation/wix" className="group">
                <div className="bg-white rounded-xl p-6 border border-gray-100 hover:border-[#2563EB] hover:shadow-lg transition-all h-full flex flex-col">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                    <span className="text-xl font-bold text-gray-600 group-hover:text-[#2563EB] transition-colors">Wix</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#2563EB] transition-colors">Wix</h3>
                  <p className="text-gray-600 text-sm flex-1">Integrate WebAbility on Wix</p>
                  <div className="flex items-center text-[#2563EB] font-medium text-sm mt-4">
                    View Guide <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
              
              {/* Shopify */}
              <Link to="/installation/shopify" className="group">
                <div className="bg-white rounded-xl p-6 border border-gray-100 hover:border-[#2563EB] hover:shadow-lg transition-all h-full flex flex-col">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                    <ShoppingBag className="w-6 h-6 text-gray-600 group-hover:text-[#2563EB] transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#2563EB] transition-colors">Shopify</h3>
                  <p className="text-gray-600 text-sm flex-1">Step-by-step instructions for Shopify integration</p>
                  <div className="flex items-center text-[#2563EB] font-medium text-sm mt-4">
                    View Guide <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
              
              {/* Squarespace */}
              <Link to="/installation/squarespace" className="group">
                <div className="bg-white rounded-xl p-6 border border-gray-100 hover:border-[#2563EB] hover:shadow-lg transition-all h-full flex flex-col">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                    <span className="text-lg font-bold text-gray-600 group-hover:text-[#2563EB] transition-colors">SS</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#2563EB] transition-colors">Squarespace</h3>
                  <p className="text-gray-600 text-sm flex-1">Integrate WebAbility with Squarespace</p>
                  <div className="flex items-center text-[#2563EB] font-medium text-sm mt-4">
                    View Guide <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
              
              {/* HubSpot */}
              <Link to="/installation/hubspot" className="group">
                <div className="bg-white rounded-xl p-6 border border-gray-100 hover:border-[#2563EB] hover:shadow-lg transition-all h-full flex flex-col">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                    <span className="text-lg font-bold text-gray-600 group-hover:text-[#2563EB] transition-colors">HS</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#2563EB] transition-colors">HubSpot</h3>
                  <p className="text-gray-600 text-sm flex-1">Install WebAbility on your HubSpot website</p>
                  <div className="flex items-center text-[#2563EB] font-medium text-sm mt-4">
                    View Guide <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
              
              {/* GTM */}
              <Link to="/installation/gtm" className="group">
                <div className="bg-white rounded-xl p-6 border border-gray-100 hover:border-[#2563EB] hover:shadow-lg transition-all h-full flex flex-col">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                    <Tag className="w-6 h-6 text-gray-600 group-hover:text-[#2563EB] transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#2563EB] transition-colors">GTM</h3>
                  <p className="text-gray-600 text-sm flex-1">Add WebAbility using Google Tag Manager</p>
                  <div className="flex items-center text-[#2563EB] font-medium text-sm mt-4">
                    View Guide <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
              
              {/* Webflow */}
              <Link to="/installation/webflow" className="group">
                <div className="bg-white rounded-xl p-6 border border-gray-100 hover:border-[#2563EB] hover:shadow-lg transition-all h-full flex flex-col">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                    <span className="text-lg font-bold text-gray-600 group-hover:text-[#2563EB] transition-colors">WF</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#2563EB] transition-colors">Webflow</h3>
                  <p className="text-gray-600 text-sm flex-1">Guide to embedding WebAbility in Webflow</p>
                  <div className="flex items-center text-[#2563EB] font-medium text-sm mt-4">
                    View Guide <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
              
              {/* BigCommerce */}
              <Link to="/installation/bigcommerce" className="group">
                <div className="bg-white rounded-xl p-6 border border-gray-100 hover:border-[#2563EB] hover:shadow-lg transition-all h-full flex flex-col">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                    <span className="text-lg font-bold text-gray-600 group-hover:text-[#2563EB] transition-colors">BC</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#2563EB] transition-colors">BigCommerce</h3>
                  <p className="text-gray-600 text-sm flex-1">Learn to integrate WebAbility on BigCommerce</p>
                  <div className="flex items-center text-[#2563EB] font-medium text-sm mt-4">
                    View Guide <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
              
              {/* Go High Level */}
              <Link to="/installation/gohighlevel" className="group">
                <div className="bg-white rounded-xl p-6 border border-gray-100 hover:border-[#2563EB] hover:shadow-lg transition-all h-full flex flex-col">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                    <Rocket className="w-6 h-6 text-gray-600 group-hover:text-[#2563EB] transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#2563EB] transition-colors">Go High Level</h3>
                  <p className="text-gray-600 text-sm flex-1">Learn to integrate WebAbility on GoHighLevel</p>
                  <div className="flex items-center text-[#2563EB] font-medium text-sm mt-4">
                    View Guide <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
              
              {/* Manage */}
              <Link to="/installation/manage" className="group">
                <div className="bg-white rounded-xl p-6 border border-gray-100 hover:border-[#2563EB] hover:shadow-lg transition-all h-full flex flex-col">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                    <Settings className="w-6 h-6 text-gray-600 group-hover:text-[#2563EB] transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#2563EB] transition-colors">Manage</h3>
                  <p className="text-gray-600 text-sm flex-1">Access plugin management settings</p>
                  <div className="flex items-center text-[#2563EB] font-medium text-sm mt-4">
                    View Guide <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Help Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Need Help Installing?</h2>
            <p className="text-gray-600 mb-8">Our support team is available 24/7 to help you get set up.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" className="rounded-full px-6">Contact Support</Button>
              <Button className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-full px-6">Schedule a Call</Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default InstallationsPage;
