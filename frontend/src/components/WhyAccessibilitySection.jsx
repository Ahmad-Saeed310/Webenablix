import React from 'react';
import { Check, Heart, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

const WhyAccessibilitySection = () => {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div>
            <span className="text-[#2563EB] font-semibold text-sm uppercase tracking-wide">WHY ACCESSIBILITY?</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mt-4 leading-tight">
              Web accessibility is<br />the right thing to do<br />and good for business
            </h2>
            <Button className="mt-8 bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-full px-8 py-4 h-auto font-semibold flex items-center gap-2">
              TRY WEBABILITY NOW
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Right Content */}
          <div className="space-y-8">
            {/* Point 1 */}
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Heart className="w-6 h-6 text-[#2563EB]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Inclusivity for everyone</h3>
                <p className="text-gray-600">
                  Make your website accessible to all users regardless of their abilities.
                </p>
              </div>
            </div>

            {/* Point 2 */}
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Check className="w-6 h-6 text-[#2563EB]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Comply with legislation</h3>
                <p className="text-gray-600">
                  Meet ADA, WCAG 2.1 and Section 508 requirements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyAccessibilitySection;
