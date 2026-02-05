import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Settings, Tag, ShoppingBag, Rocket, Folder } from 'lucide-react';
import { Button } from '../components/ui/button';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { installationsMenu } from '../data/navigation';

const getIcon = (logoName) => {
  const icons = {
    'code': Code,
    'settings': Settings,
    'settings-2': Settings,
    'tag': Tag,
    'shopping-bag': ShoppingBag,
    'rocket': Rocket,
    'folder': Folder,
    'store': ShoppingBag
  };
  return icons[logoName] || Code;
};

const InstallationCard = ({ installation }) => {
  const Icon = getIcon(installation.logo);
  
  return (
    <Link to={installation.href} className="group">
      <div className="bg-white rounded-xl p-6 border border-gray-100 hover:border-[#2563EB] hover:shadow-lg transition-all duration-300 h-full flex flex-col">
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
          <Icon className="w-6 h-6 text-gray-600 group-hover:text-[#2563EB] transition-colors" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#2563EB] transition-colors">{installation.name}</h3>
        <p className="text-gray-600 text-sm flex-1">{installation.description}</p>
        <div className="flex items-center text-[#2563EB] font-medium text-sm mt-4">
          View Guide <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
};

const InstallationsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-b from-[#2563EB] to-[#3B82F6] py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Installation Guides
            </h1>
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
                <Button variant="outline" className="rounded-full">
                  Watch Tutorial
                </Button>
                <Button className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-full">
                  Get Your Code
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Installations Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Choose Your Platform</h2>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {installationsMenu.map((installation, idx) => (
                <InstallationCard key={`install-${idx}`} installation={installation} />
              ))}
            </div>
          </div>
        </section>
        
        {/* Help Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Need Help Installing?</h2>
            <p className="text-gray-600 mb-8">Our support team is available 24/7 to help you get set up.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" className="rounded-full px-6">
                Contact Support
              </Button>
              <Button className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-full px-6">
                Schedule a Call
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default InstallationsPage;
