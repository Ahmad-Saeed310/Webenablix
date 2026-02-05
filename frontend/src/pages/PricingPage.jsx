import React from 'react';
import { Check, X, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { pricingPlans, featureComparison } from '../data/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PricingCard = ({ plan, index }) => {
  const isHighlighted = plan.highlighted;
  
  return (
    <div className={`relative rounded-2xl p-8 ${isHighlighted ? 'bg-[#2563EB] text-white ring-4 ring-[#2563EB]/20 scale-105' : 'bg-white border border-gray-200'}`}>
      {isHighlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-yellow-400 text-yellow-900 rounded-full text-sm font-semibold">
          Most Popular
        </div>
      )}
      
      <div className="mb-6">
        <p className={`text-sm font-medium ${isHighlighted ? 'text-blue-200' : 'text-gray-500'}`}>{plan.tier}</p>
        <h3 className={`text-2xl font-bold mt-1 ${isHighlighted ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
      </div>
      
      <div className="mb-6">
        <span className={`text-4xl font-bold ${isHighlighted ? 'text-white' : 'text-gray-900'}`}>{plan.price}</span>
        <span className={`text-lg ${isHighlighted ? 'text-blue-200' : 'text-gray-500'}`}>{plan.period}</span>
      </div>
      
      <p className={`mb-6 text-sm ${isHighlighted ? 'text-blue-100' : 'text-gray-600'}`}>{plan.description}</p>
      
      <Button className={`w-full rounded-full py-3 font-semibold mb-8 ${isHighlighted ? 'bg-white text-[#2563EB] hover:bg-gray-100' : 'bg-[#2563EB] text-white hover:bg-[#1d4ed8]'}`}>
        {plan.cta}
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
      
      <div>
        <p className={`text-sm font-semibold mb-4 ${isHighlighted ? 'text-blue-200' : 'text-gray-500'}`}>Features include:</p>
        <ul className="space-y-3">
          {plan.features.map((feature, idx) => (
            <li key={`feature-${index}-${idx}`} className="flex items-start gap-3">
              <Check className={`w-5 h-5 flex-shrink-0 ${isHighlighted ? 'text-blue-200' : 'text-[#2563EB]'}`} />
              <span className={`text-sm ${isHighlighted ? 'text-white' : 'text-gray-700'}`}>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const FeatureComparisonTable = () => {
  return (
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
            {featureComparison.categories.map((category, catIdx) => (
              <React.Fragment key={`cat-${catIdx}`}>
                <tr className="bg-gray-50">
                  <td colSpan={4} className="py-3 px-4 font-semibold text-gray-700">{category.name}</td>
                </tr>
                {category.features.map((feature, featIdx) => (
                  <tr key={`feat-${catIdx}-${featIdx}`} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-700">{feature.name}</td>
                    <td className="py-3 px-4 text-center">
                      {feature.automated ? <Check className="w-5 h-5 text-emerald-500 mx-auto" /> : <X className="w-5 h-5 text-gray-300 mx-auto" />}
                    </td>
                    <td className="py-3 px-4 text-center bg-blue-50">
                      {feature.selfManaged ? <Check className="w-5 h-5 text-emerald-500 mx-auto" /> : <X className="w-5 h-5 text-gray-300 mx-auto" />}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {feature.managed ? <Check className="w-5 h-5 text-emerald-500 mx-auto" /> : <X className="w-5 h-5 text-gray-300 mx-auto" />}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

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
            {pricingPlans.map((plan, idx) => (
              <PricingCard key={`plan-${idx}`} plan={plan} index={idx} />
            ))}
          </div>
          
          {/* Feature Comparison */}
          <FeatureComparisonTable />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PricingPage;
