import React from 'react';
import { Check, X, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';\nimport Header from '../components/Header';
import Footer from '../components/Footer';

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          {/* Hero */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-[#2563EB]" />
              <span className="text-sm font-medium text-[#2563EB]">Flexible Pricing</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Choose the Right Plan<br />for Your Business
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From basic automation to fully managed services, we have a plan that fits your accessibility needs.
            </p>
          </div>
          
          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-start">
            {/* Basic Protection */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-500">Automated</p>
                <h3 className="text-2xl font-bold mt-1 text-gray-900">Basic Protection</h3>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$12</span>
                <span className="text-lg text-gray-500">/month</span>
              </div>
              <p className="mb-6 text-sm text-gray-600">Our basic plan for automation-only monitoring, fixes, and online support</p>
              <Button className="w-full rounded-full py-3 font-semibold mb-8 bg-[#2563EB] text-white hover:bg-[#1d4ed8]">
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <div>
                <p className="text-sm font-semibold mb-4 text-gray-500">Features include:</p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 flex-shrink-0 text-[#2563EB]" />
                    <span className="text-sm text-gray-700">Automated tools</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 flex-shrink-0 text-[#2563EB]" />
                    <span className="text-sm text-gray-700">Developer tools</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 flex-shrink-0 text-[#2563EB]" />
                    <span className="text-sm text-gray-700">Continuous monitoring</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 flex-shrink-0 text-[#2563EB]" />
                    <span className="text-sm text-gray-700">Accessibility Help Desk</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 flex-shrink-0 text-[#2563EB]" />
                    <span className="text-sm text-gray-700">Self-paced learning platform</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Self-Managed - Highlighted */}
            <div className="relative bg-[#2563EB] text-white rounded-2xl p-8 ring-4 ring-[#2563EB]/20 scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-yellow-400 text-yellow-900 rounded-full text-sm font-semibold">
                Most Popular
              </div>
              <div className="mb-6">
                <p className="text-sm font-medium text-blue-200">Self-Managed</p>
                <h3 className="text-2xl font-bold mt-1 text-white">Self-Serviced Protection</h3>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">Custom</span>
              </div>
              <p className="mb-6 text-sm text-blue-100">Empower your developers to understand and build for accessibility at the source</p>
              <Button className="w-full rounded-full py-3 font-semibold mb-8 bg-white text-[#2563EB] hover:bg-gray-100">
                Schedule Demo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <div>
                <p className="text-sm font-semibold mb-4 text-blue-200">Features include:</p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 flex-shrink-0 text-blue-200" />
                    <span className="text-sm text-white">Developer tools</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 flex-shrink-0 text-blue-200" />
                    <span className="text-sm text-white">Certified expert guidance</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 flex-shrink-0 text-blue-200" />
                    <span className="text-sm text-white">Custom training</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 flex-shrink-0 text-blue-200" />
                    <span className="text-sm text-white">Accessibility scanner</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 flex-shrink-0 text-blue-200" />
                    <span className="text-sm text-white">Expert Audit and reporting</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Maximum Protection */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-500">Managed</p>
                <h3 className="text-2xl font-bold mt-1 text-gray-900">Maximum Protection</h3>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">Custom</span>
              </div>
              <p className="mb-6 text-sm text-gray-600">Let our team of experts get you compliant by handling everything for you</p>
              <Button variant="outline" className="w-full rounded-full py-3 font-semibold mb-8">
                Schedule Demo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <div>
                <p className="text-sm font-semibold mb-4 text-gray-500">Features include:</p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 flex-shrink-0 text-[#2563EB]" />
                    <span className="text-sm text-gray-700">Automated tools</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 flex-shrink-0 text-[#2563EB]" />
                    <span className="text-sm text-gray-700">Continuous monitoring</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 flex-shrink-0 text-[#2563EB]" />
                    <span className="text-sm text-gray-700">Custom-written fixes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 flex-shrink-0 text-[#2563EB]" />
                    <span className="text-sm text-gray-700">WebAbility Assurance*</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 flex-shrink-0 text-[#2563EB]" />
                    <span className="text-sm text-gray-700">Expert Audit and reporting</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Feature Comparison */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Our Features</h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Our plans are flexible, allowing your company to choose what solutions you need to best solve your accessibility needs.
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-900 w-1/4"></th>
                    <th className="text-center py-4 px-4">
                      <span className="font-semibold text-gray-900">Automated</span>
                      <div className="mt-2">
                        <Button variant="outline" size="sm" className="rounded-full text-xs">Start Free Trial</Button>
                      </div>
                    </th>
                    <th className="text-center py-4 px-4 bg-blue-50">
                      <span className="font-semibold text-[#2563EB]">Self Managed</span>
                      <div className="mt-2">
                        <Button size="sm" className="rounded-full text-xs bg-[#2563EB]">Schedule Demo</Button>
                      </div>
                    </th>
                    <th className="text-center py-4 px-4">
                      <span className="font-semibold text-gray-900">Managed</span>
                      <div className="mt-2">
                        <Button variant="outline" size="sm" className="rounded-full text-xs">Schedule Demo</Button>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Platform & Automation */}
                  <tr className="bg-gray-50">
                    <td colSpan={4} className="py-3 px-4 font-semibold text-gray-700">Platform & Automation</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-700">Automated Monitoring</td>
                    <td className="py-3 px-4 text-center"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                    <td className="py-3 px-4 text-center bg-blue-50"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                    <td className="py-3 px-4 text-center"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-700">Automated Fixes</td>
                    <td className="py-3 px-4 text-center"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                    <td className="py-3 px-4 text-center bg-blue-50"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                    <td className="py-3 px-4 text-center"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-700">Accessibility Help Desk</td>
                    <td className="py-3 px-4 text-center"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                    <td className="py-3 px-4 text-center bg-blue-50"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                    <td className="py-3 px-4 text-center"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-700">WebAbility Learning</td>
                    <td className="py-3 px-4 text-center"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                    <td className="py-3 px-4 text-center bg-blue-50"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                    <td className="py-3 px-4 text-center"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                  </tr>
                  
                  {/* Developer Tools */}
                  <tr className="bg-gray-50">
                    <td colSpan={4} className="py-3 px-4 font-semibold text-gray-700">Developer Tools</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-700">Developer Tools</td>
                    <td className="py-3 px-4 text-center"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                    <td className="py-3 px-4 text-center bg-blue-50"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                    <td className="py-3 px-4 text-center"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-700">Expert Support</td>
                    <td className="py-3 px-4 text-center"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                    <td className="py-3 px-4 text-center bg-blue-50"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                    <td className="py-3 px-4 text-center"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                  </tr>
                  
                  {/* Developer Support & Guidance */}
                  <tr className="bg-gray-50">
                    <td colSpan={4} className="py-3 px-4 font-semibold text-gray-700">Developer Support & Guidance</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-700">Expert Audit & Reporting</td>
                    <td className="py-3 px-4 text-center"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                    <td className="py-3 px-4 text-center bg-blue-50"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                    <td className="py-3 px-4 text-center"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-700">Custom Fixes</td>
                    <td className="py-3 px-4 text-center"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                    <td className="py-3 px-4 text-center bg-blue-50"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                    <td className="py-3 px-4 text-center"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-700">Document Remediation</td>
                    <td className="py-3 px-4 text-center"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                    <td className="py-3 px-4 text-center bg-blue-50"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                    <td className="py-3 px-4 text-center"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                  </tr>
                  
                  {/* Legal Support */}
                  <tr className="bg-gray-50">
                    <td colSpan={4} className="py-3 px-4 font-semibold text-gray-700">Legal Support</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-700">Included after purchasing Expert Audits</td>
                    <td className="py-3 px-4 text-center"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                    <td className="py-3 px-4 text-center bg-blue-50"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                    <td className="py-3 px-4 text-center"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PricingPage;
