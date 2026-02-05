import React from 'react';
import { Type, Link2, Contrast, PlayCircle, Keyboard, Eye } from 'lucide-react';

const WidgetSection = () => {
  const widgetFeatures = [
    { icon: <Type className="w-6 h-6" />, label: 'Larger Text' },
    { icon: <Link2 className="w-6 h-6" />, label: 'Highlight Links' },
    { icon: <Contrast className="w-6 h-6" />, label: 'Contrast+' },
    { icon: <PlayCircle className="w-6 h-6" />, label: 'Video Spacing' },
  ];

  return (
    <section className="py-20 lg:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-[#2563EB] font-semibold text-sm uppercase tracking-wide">OUR WIDGET FEATURES</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mt-4">
            Your <span className="text-[#2563EB]">Widget</span> for instant<br />compliance.
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Web accessibility at your fingertips
            </h3>
            <p className="text-gray-600 leading-relaxed mb-8">
              Our accessibility widget automatically adapts your website for various disabilities. From screen reader optimization to keyboard navigation, every visitor will enjoy a perfectly tailored experience.
            </p>
            
            {/* Widget Preview Features Grid */}
            <div className="grid grid-cols-2 gap-4">
              {widgetFeatures.map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-[#2563EB] hover:shadow-md transition-all duration-300"
                >
                  <div className="text-[#2563EB]">{feature.icon}</div>
                  <span className="font-medium text-gray-800">{feature.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Widget Preview */}
          <div className="relative">
            <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-sm mx-auto">
              {/* Widget Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-[#2563EB] rounded-full flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 8v4M12 16h.01" />
                    </svg>
                  </div>
                  <span className="font-semibold text-gray-800">Accessibility</span>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Widget Features */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Type className="w-5 h-5 text-[#2563EB]" />
                    <span className="text-sm font-medium">Larger Text</span>
                  </div>
                  <div className="w-10 h-6 bg-[#2563EB] rounded-full relative cursor-pointer">
                    <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Link2 className="w-5 h-5 text-gray-400" />
                    <span className="text-sm font-medium">Highlight Links</span>
                  </div>
                  <div className="w-10 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                    <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Contrast className="w-5 h-5 text-gray-400" />
                    <span className="text-sm font-medium">High Contrast</span>
                  </div>
                  <div className="w-10 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                    <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Keyboard className="w-5 h-5 text-gray-400" />
                    <span className="text-sm font-medium">Keyboard Nav</span>
                  </div>
                  <div className="w-10 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                    <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5 text-gray-400" />
                    <span className="text-sm font-medium">Screen Reader</span>
                  </div>
                  <div className="w-10 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                    <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow" />
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-50" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WidgetSection;
