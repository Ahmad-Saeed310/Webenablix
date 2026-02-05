import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building, Landmark, GraduationCap, ShoppingCart, Code, HeartPulse, Car, Home, Heart, Tv, Shield } from 'lucide-react';
import { Button } from '../components/ui/button';
import Header from '../components/Header';
import Footer from '../components/Footer';

const IndustriesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-b from-[#2563EB] to-[#3B82F6] py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Industries We Serve</h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Tailored accessibility solutions for every industry, ensuring compliance and inclusivity across all sectors.
            </p>
          </div>
        </section>
        
        {/* Industries Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* Government */}
              <Link to="/industries/government" className="group">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#2563EB] hover:shadow-xl transition-all duration-300 h-full">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#2563EB] transition-colors">
                    <Building className="w-6 h-6 text-[#2563EB] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#2563EB] transition-colors">Government</h3>
                  <p className="text-gray-600 text-sm mb-4">Make government websites accessible to all citizens</p>
                  <div className="flex items-center text-[#2563EB] font-medium text-sm">
                    Learn more <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
              
              {/* Banking */}
              <Link to="/industries/banking" className="group">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#2563EB] hover:shadow-xl transition-all duration-300 h-full">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#2563EB] transition-colors">
                    <Landmark className="w-6 h-6 text-[#2563EB] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#2563EB] transition-colors">Banking</h3>
                  <p className="text-gray-600 text-sm mb-4">Ensure financial services are available to everyone</p>
                  <div className="flex items-center text-[#2563EB] font-medium text-sm">
                    Learn more <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
              
              {/* Academic */}
              <Link to="/industries/academic" className="group">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#2563EB] hover:shadow-xl transition-all duration-300 h-full">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#2563EB] transition-colors">
                    <GraduationCap className="w-6 h-6 text-[#2563EB] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#2563EB] transition-colors">Academic</h3>
                  <p className="text-gray-600 text-sm mb-4">Create inclusive educational environments</p>
                  <div className="flex items-center text-[#2563EB] font-medium text-sm">
                    Learn more <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
              
              {/* Retail */}
              <Link to="/industries/retail" className="group">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#2563EB] hover:shadow-xl transition-all duration-300 h-full">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#2563EB] transition-colors">
                    <ShoppingCart className="w-6 h-6 text-[#2563EB] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#2563EB] transition-colors">Retail</h3>
                  <p className="text-gray-600 text-sm mb-4">Build accessible shopping experiences</p>
                  <div className="flex items-center text-[#2563EB] font-medium text-sm">
                    Learn more <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
              
              {/* IT */}
              <Link to="/industries/it" className="group">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#2563EB] hover:shadow-xl transition-all duration-300 h-full">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#2563EB] transition-colors">
                    <Code className="w-6 h-6 text-[#2563EB] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#2563EB] transition-colors">IT</h3>
                  <p className="text-gray-600 text-sm mb-4">Implement accessibility across digital platforms</p>
                  <div className="flex items-center text-[#2563EB] font-medium text-sm">
                    Learn more <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
              
              {/* HealthCare */}
              <Link to="/industries/healthcare" className="group">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#2563EB] hover:shadow-xl transition-all duration-300 h-full">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#2563EB] transition-colors">
                    <HeartPulse className="w-6 h-6 text-[#2563EB] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#2563EB] transition-colors">HealthCare</h3>
                  <p className="text-gray-600 text-sm mb-4">Improve accessibility in healthcare services</p>
                  <div className="flex items-center text-[#2563EB] font-medium text-sm">
                    Learn more <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
              
              {/* Automotive */}
              <Link to="/industries/automotive" className="group">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#2563EB] hover:shadow-xl transition-all duration-300 h-full">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#2563EB] transition-colors">
                    <Car className="w-6 h-6 text-[#2563EB] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#2563EB] transition-colors">Automotive</h3>
                  <p className="text-gray-600 text-sm mb-4">Ensure accessibility in automotive technology</p>
                  <div className="flex items-center text-[#2563EB] font-medium text-sm">
                    Learn more <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
              
              {/* Real Estate */}
              <Link to="/industries/real-estate" className="group">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#2563EB] hover:shadow-xl transition-all duration-300 h-full">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#2563EB] transition-colors">
                    <Home className="w-6 h-6 text-[#2563EB] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#2563EB] transition-colors">Real Estate</h3>
                  <p className="text-gray-600 text-sm mb-4">Make real estate listings accessible to everyone</p>
                  <div className="flex items-center text-[#2563EB] font-medium text-sm">
                    Learn more <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
              
              {/* NGO/NPO */}
              <Link to="/industries/ngo" className="group">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#2563EB] hover:shadow-xl transition-all duration-300 h-full">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#2563EB] transition-colors">
                    <Heart className="w-6 h-6 text-[#2563EB] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#2563EB] transition-colors">NGO/NPO</h3>
                  <p className="text-gray-600 text-sm mb-4">Support accessibility for nonprofit organizations</p>
                  <div className="flex items-center text-[#2563EB] font-medium text-sm">
                    Learn more <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
              
              {/* Media & Entertainment */}
              <Link to="/industries/media" className="group">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#2563EB] hover:shadow-xl transition-all duration-300 h-full">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#2563EB] transition-colors">
                    <Tv className="w-6 h-6 text-[#2563EB] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#2563EB] transition-colors">Media & Entertainment</h3>
                  <p className="text-gray-600 text-sm mb-4">Provide inclusive media experience</p>
                  <div className="flex items-center text-[#2563EB] font-medium text-sm">
                    Learn more <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
              
              {/* Law Enforcement */}
              <Link to="/industries/law-enforcement" className="group">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#2563EB] hover:shadow-xl transition-all duration-300 h-full">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#2563EB] transition-colors">
                    <Shield className="w-6 h-6 text-[#2563EB] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#2563EB] transition-colors">Law Enforcement</h3>
                  <p className="text-gray-600 text-sm mb-4">Ensure accessibility in public safety services</p>
                  <div className="flex items-center text-[#2563EB] font-medium text-sm">
                    Learn more <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-4xl font-bold text-[#2563EB]">10,000+</p>
                <p className="text-gray-600 mt-2">Websites Made Accessible</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-[#2563EB]">50+</p>
                <p className="text-gray-600 mt-2">Industries Served</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-[#2563EB]">99.9%</p>
                <p className="text-gray-600 mt-2">Compliance Rate</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-[#2563EB]">24/7</p>
                <p className="text-gray-600 mt-2">Support Available</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to make your industry accessible?</h2>
            <p className="text-gray-600 mb-8">Contact us to learn how we can help your organization achieve accessibility compliance.</p>
            <Button className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-full px-8 py-4 h-auto font-semibold">
              Get Started Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default IndustriesPage;
