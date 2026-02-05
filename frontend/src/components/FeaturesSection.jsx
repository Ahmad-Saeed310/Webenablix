import React from 'react';
import { Accessibility, Globe, Users, Check } from 'lucide-react';

const FeatureIcon = ({ type }) => {
  const iconClass = "w-8 h-8 text-[#2563EB]";
  
  switch (type) {
    case 'accessibility':
      return <Accessibility className={iconClass} />;
    case 'globe':
      return <Globe className={iconClass} />;
    case 'users':
      return <Users className={iconClass} />;
    default:
      return null;
  }
};

const FeaturesSection = () => {
  const features = [
    {
      iconType: 'accessibility',
      title: 'Inclusive Design',
      description: 'Everyone can use and enjoy your site regardless of their abilities.',
      points: [
        'Create accessible designs for vision-impaired users',
        'Support screen readers, focus outlines, and WAI-ARIA for website tools'
      ]
    },
    {
      iconType: 'globe',
      title: 'Global Compliance',
      description: 'Meet ADA, WCAG and other regional accessibility standards with automated and manual checks.',
      points: [
        'Automated audits to surface WCAG issues and priority fixes',
        'Evidence & documentation to produce 100% compliance statements'
      ]
    },
    {
      iconType: 'users',
      title: 'User Satisfaction',
      description: 'Improve usability, increase engagement, and welcome more customers by removing access barriers.',
      points: [
        'Better engagement and lower bounce rates through clearer navigation and readable content',
        'Transform visitor tours - tap the 15% large-spending access of users with disabilities'
      ]
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-[#2563EB] font-semibold text-sm uppercase tracking-wide">THE WEBABILITY WAY</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mt-4">
            Make Your Website with<br />WebAbility
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Turn accessibility from a legal burden into a business advantage with our complete compliance solutions.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100"
            >
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                <FeatureIcon type={feature.iconType} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">{feature.description}</p>
              <ul className="space-y-3">
                {feature.points.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-[#2563EB] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-600 text-sm">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
