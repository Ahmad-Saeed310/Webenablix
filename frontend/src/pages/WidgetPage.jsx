import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Check, Eye, Keyboard, Palette, Brain, Zap, EyeOff, Focus,
  Globe, BarChart3, Settings, Play, Pause, Type, MousePointer, Sun, Moon,
  Volume2, Languages, ChevronLeft, ChevronRight, Accessibility, Users, DollarSign, Shield
} from 'lucide-react';
import { Button } from '../components/ui/button';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Language data
const languages = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Dutch',
  'Russian', 'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Turkish',
  'Polish', 'Swedish', 'Norwegian', 'Danish', 'Finnish', 'Greek', 'Czech',
  'Hungarian', 'Romanian', 'Bulgarian', 'Croatian', 'Hebrew'
];

// Widget Demo Component
const WidgetDemo = () => {
  const [activeFeatures, setActiveFeatures] = useState({
    highlightTitle: false,
    highlightLink: true,
    dyslexiaFont: false,
    letterSpacing: false,
    lineHeight: false,
    fontWeight: false,
    hideImage: false,
    textAlignment: false
  });

  const toggleFeature = (feature) => {
    setActiveFeatures(prev => ({ ...prev, [feature]: !prev[feature] }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#2563EB] rounded-full flex items-center justify-center">
            <Accessibility className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-gray-800">Accessibility</span>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-3">
        <WidgetToggle label="Highlight Title" icon={<Type className="w-4 h-4" />} active={activeFeatures.highlightTitle} onClick={() => toggleFeature('highlightTitle')} />
        <WidgetToggle label="Highlight Link" icon={<MousePointer className="w-4 h-4" />} active={activeFeatures.highlightLink} onClick={() => toggleFeature('highlightLink')} />
        <WidgetToggle label="Dyslexia Font" icon={<Type className="w-4 h-4" />} active={activeFeatures.dyslexiaFont} onClick={() => toggleFeature('dyslexiaFont')} />
        <WidgetToggle label="Letter Spacing" icon={<Type className="w-4 h-4" />} active={activeFeatures.letterSpacing} onClick={() => toggleFeature('letterSpacing')} />
        <WidgetToggle label="Line Height" icon={<Type className="w-4 h-4" />} active={activeFeatures.lineHeight} onClick={() => toggleFeature('lineHeight')} />
        <WidgetToggle label="Font Weight" icon={<Type className="w-4 h-4" />} active={activeFeatures.fontWeight} onClick={() => toggleFeature('fontWeight')} />
        <WidgetToggle label="Hide Image" icon={<EyeOff className="w-4 h-4" />} active={activeFeatures.hideImage} onClick={() => toggleFeature('hideImage')} />
        <WidgetToggle label="Text Alignment" icon={<Type className="w-4 h-4" />} active={activeFeatures.textAlignment} onClick={() => toggleFeature('textAlignment')} />
      </div>
    </div>
  );
};

const WidgetToggle = ({ label, icon, active, onClick }) => (
  <button onClick={onClick} className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
    <div className="flex items-center gap-3">
      <span className={active ? 'text-[#2563EB]' : 'text-gray-400'}>{icon}</span>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </div>
    <div className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${active ? 'bg-[#2563EB]' : 'bg-gray-200'}`}>
      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${active ? 'right-0.5' : 'left-0.5'}`} />
    </div>
  </button>
);

// Widget Variant Card
const WidgetVariant = ({ title, description, variant }) => {
  const bgClass = variant === 'dark' ? 'bg-gray-900' : 'bg-white';
  const textClass = variant === 'dark' ? 'text-white' : 'text-gray-800';
  
  return (
    <div className="bg-gray-50 rounded-2xl p-8">
      <div className="flex flex-col lg:flex-row gap-8 items-center">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
          <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
        <div className={`${bgClass} rounded-2xl shadow-xl p-4 w-64`}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[#2563EB] rounded-full flex items-center justify-center">
              <Accessibility className="w-4 h-4 text-white" />
            </div>
            <span className={`font-semibold text-sm ${textClass}`}>Accessibility</span>
          </div>
          <div className="space-y-2">
            <div className={`h-8 ${variant === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg`} />
            <div className={`h-8 ${variant === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg`} />
            <div className={`h-8 ${variant === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg`} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Disability Profile Card
const ProfileCard = ({ icon: Icon, title, description, color }) => (
  <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#2563EB] hover:shadow-xl transition-all">
    <div className={`w-14 h-14 ${color} rounded-xl flex items-center justify-center mb-4`}>
      <Icon className="w-7 h-7 text-white" />
    </div>
    <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
  </div>
);

// Add-on Card
const AddOnCard = ({ icon: Icon, title, subtitle, description }) => (
  <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all">
    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
      <Icon className="w-6 h-6 text-[#2563EB]" />
    </div>
    <h3 className="text-lg font-bold text-gray-900">{title}</h3>
    <p className="text-[#2563EB] text-sm font-medium mb-2">{subtitle}</p>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

const WidgetPage = () => {
  const [currentLang, setCurrentLang] = useState(0);

  const nextLang = () => setCurrentLang((prev) => (prev + 1) % languages.length);
  const prevLang = () => setCurrentLang((prev) => (prev - 1 + languages.length) % languages.length);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[#2563EB] to-[#3B82F6] py-20 lg:py-28 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                  Website, meet<br />Accessibility Widget
                </h1>
                <p className="text-xl text-white/80 mb-8">
                  Start your ADA compliance journey with the Accessibility Widget. Conform to WCAG 2.1 & 2.2 and boost performance along the way.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button className="bg-white text-[#2563EB] hover:bg-gray-100 rounded-full px-8 py-4 h-auto font-semibold">
                    Request a demo
                  </Button>
                  <Button variant="outline" className="border-white text-white hover:bg-white/10 rounded-full px-8 py-4 h-auto font-semibold">
                    Start free trial
                  </Button>
                </div>
              </div>
              <div className="flex justify-center">
                <WidgetDemo />
              </div>
            </div>
          </div>
        </section>

        {/* Trusted By Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Trusted by thousands of websites globally</h2>
            <p className="text-gray-600 max-w-3xl mx-auto mb-8">
              Our Widget has quickly become the best accessibility plugin and compliance solution, now installed on millions of websites worldwide.
            </p>
            <div className="flex flex-wrap justify-center gap-8">
              <div className="px-6 py-3 bg-white rounded-full shadow-sm"><span className="font-semibold text-gray-700">Salesforce</span></div>
              <div className="px-6 py-3 bg-white rounded-full shadow-sm"><span className="font-semibold text-gray-700">IBM</span></div>
              <div className="px-6 py-3 bg-white rounded-full shadow-sm"><span className="font-semibold text-gray-700">Zendesk</span></div>
              <div className="px-6 py-3 bg-white rounded-full shadow-sm"><span className="font-semibold text-gray-700">BMW</span></div>
              <div className="px-6 py-3 bg-white rounded-full shadow-sm"><span className="font-semibold text-gray-700">British Airways</span></div>
            </div>
          </div>
        </section>

        {/* Widget Features Section */}
        <section className="py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <span className="text-[#2563EB] font-semibold text-sm uppercase tracking-wide">OUR ACCESSIBILITY SERVICES</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mt-4">
                Your <span className="text-[#2563EB]">Widget</span> for instant compliance.
              </h2>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Powerful accessibility at your fingertips</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Our intelligent accessibility widget automatically adapts your website for users with disabilities. From screen reader optimization to keyboard navigation, color contrast adjustment to seizure-safe modes, everything works seamlessly out of the box.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  With support for 50+ languages, the widget automatically detects each visitor's preferred language, ensuring accessibility for a truly global audience.
                </p>
              </div>
              <div className="flex justify-center">
                <WidgetDemo />
              </div>
            </div>

            {/* Language Selector */}
            <div className="bg-gray-50 rounded-2xl p-8 mb-20">
              <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Try it now - Select a language</h3>
              <div className="flex items-center justify-center gap-4">
                <button onClick={prevLang} className="p-2 bg-white rounded-full shadow hover:shadow-md transition-shadow">
                  <ChevronLeft className="w-6 h-6 text-gray-600" />
                </button>
                <div className="bg-white px-8 py-4 rounded-full shadow-lg min-w-[200px] text-center">
                  <span className="font-semibold text-gray-800">{languages[currentLang]}</span>
                </div>
                <button onClick={nextLang} className="p-2 bg-white rounded-full shadow hover:shadow-md transition-shadow">
                  <ChevronRight className="w-6 h-6 text-gray-600" />
                </button>
              </div>
              <p className="text-center text-gray-500 text-sm mt-4">Slide {currentLang + 1} of {languages.length}</p>
            </div>
          </div>
        </section>

        {/* Widget Variants Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Lightweight Widget.<br />More impact at any size.
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                The Widget improves your website's user experience, constantly monitoring and fixing violations behind-the-scenes.
              </p>
            </div>
            
            <div className="space-y-8">
              <WidgetVariant 
                title="Oversize Widget" 
                description="Our compact widget delivers powerful accessibility features in a minimalist design. It includes essential tools like text adjustments, cursor enhancements, and color contrast controls everything your users need without overwhelming your interface. Powered by AI to automatically fix accessibility issues in real-time."
                variant="light"
              />
              <WidgetVariant 
                title="Dark Widget" 
                description="Built for modern websites that embrace dark mode aesthetics. This version offers the complete accessibility toolkit wrapped in an elegant dark interface that blends seamlessly with contemporary designs while reducing eye strain for your visitors during extended browsing sessions."
                variant="dark"
              />
              <WidgetVariant 
                title="Full Widget" 
                description="Experience the complete Webenablix solution with over 50 accessibility features at your fingertips. Give your visitors total control with voice navigation, built-in screen reader support, multiple accessibility profiles, translations in 50+ languages, and detailed usage analytics."
                variant="light"
              />
            </div>
          </div>
        </section>

        {/* Integrations Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">The solution for every website</h2>
              <p className="text-gray-600">accessWidget integrates with any website builder or CMS, enabling accessibility without complicated setup</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <IntegrationCard name="WordPress" desc="How to install Webenablix on a WordPress website" />
              <IntegrationCard name="Custom CMS" desc="Install Webenablix on Custom CMS or websites with no CMS" />
              <IntegrationCard name="Wix" desc="How to install Webenablix on a Wix website" />
              <IntegrationCard name="Weebly" desc="How to install Webenablix on a Weebly website" />
              <IntegrationCard name="Webflow" desc="How to install Webenablix on a Webflow website" />
              <IntegrationCard name="Volusion" desc="How to install Webenablix on a Volusion website" />
              <IntegrationCard name="Squarespace" desc="How to install Webenablix on a Squarespace website" />
              <IntegrationCard name="Shopify" desc="How to install Webenablix on a Shopify store" />
              <IntegrationCard name="HubSpot" desc="How to install Webenablix on a HubSpot website" />
              <IntegrationCard name="GTM" desc="How to install Webenablix using Google Tag Manager" />
              <IntegrationCard name="Duda" desc="How to install Webenablix on a Duda website" />
              <IntegrationCard name="BigCommerce" desc="How to install Webenablix on a BigCommerce store" />
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-2xl font-bold text-[#2563EB] mb-2">Loaded more than 2.5 billion times per month</p>
              <p className="text-gray-600">Achieve WCAG & ADA Compliance at Any Scale</p>
            </div>
          </div>
        </section>

        {/* Disability Profiles Section */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Welcome all visitors with a<br />customizable browsing experience
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Each user can select a pre-made disability profile from an easy-to-access menu and adjust the interface to fit their unique needs
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <ProfileCard 
                icon={Volume2} 
                title="Screen readers" 
                description="Advanced AI adds ARIA attributes and alt text to your website, enabling screen readers to accurately interpret content for blind users."
                color="bg-purple-500"
              />
              <ProfileCard 
                icon={Keyboard} 
                title="Keyboard navigation" 
                description="Automatically implement focus indicators and skip-to-content links for users with motor disabilities. Full keyboard control ensures all elements are accessible."
                color="bg-blue-500"
              />
              <ProfileCard 
                icon={Palette} 
                title="Color blind" 
                description="Automatically enhance color contrast ratios and provide alternative visual cues. Supports protanopia, deuteranopia, and tritanopia with custom filters."
                color="bg-green-500"
              />
              <ProfileCard 
                icon={Brain} 
                title="Cognitive disability" 
                description="Reduce cognitive load with simplified layouts, content highlighting, and reading guides. Features dyslexia-friendly fonts and clear visual hierarchy."
                color="bg-yellow-500"
              />
              <ProfileCard 
                icon={Zap} 
                title="Seizure safe" 
                description="Automatically pause animations, stop auto-playing videos, and remove flashing elements that could trigger photosensitive epilepsy."
                color="bg-red-500"
              />
              <ProfileCard 
                icon={Eye} 
                title="Vision impaired" 
                description="Increase font sizes, adjust spacing, invert colors, and enhance contrast for users with partial sight. Features customizable cursor sizes."
                color="bg-indigo-500"
              />
              <ProfileCard 
                icon={Focus} 
                title="ADHD friendly" 
                description="Remove visual distractions, reduce animation speeds, and provide reading masks to help users with ADHD maintain focus."
                color="bg-orange-500"
              />
            </div>
          </div>
        </section>

        {/* Add-ons Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Enhance the Widget with powerful add-ons.
              </h2>
              <p className="text-gray-600">Unlock advanced features to customize your accessibility experience</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <AddOnCard 
                icon={Languages} 
                title="Live Translations" 
                subtitle="50+ languages on demand"
                description="Automatically translate your web pages to welcome global visitors to your website."
              />
              <AddOnCard 
                icon={BarChart3} 
                title="Usage Statistics" 
                subtitle="Actionable real-time data"
                description="Monitor and analyze your site's accessibility performance in real-time."
              />
              <AddOnCard 
                icon={Settings} 
                title="Modify Menu" 
                subtitle="Powerful UI customizations"
                description="Easily adjust your site's accessibility options with customizable settings."
              />
            </div>
          </div>
        </section>

        {/* Why Accessibility Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-[#2563EB] font-semibold text-sm uppercase tracking-wide">MORE THAN COMPLIANCE</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4 mb-4">
                Web accessibility is the right thing to do<br />and good for business
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-[#2563EB]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Inclusivity for everyone</h3>
                <p className="text-gray-600">Make your website accessible to all users regardless of their abilities</p>
              </div>
              <div className="bg-white rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Attract new customers</h3>
                <p className="text-gray-600">Tap into the $13T global disability market spending power</p>
              </div>
              <div className="bg-white rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Comply with legislation</h3>
                <p className="text-gray-600">Meet ADA, WCAG 2.1, and Section 508 requirements</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-[#2563EB] to-[#3B82F6]">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to make your website accessible?</h2>
            <p className="text-white/80 text-lg mb-8">Join thousands of businesses using Webenablix to create inclusive digital experiences.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button className="bg-white text-[#2563EB] hover:bg-gray-100 rounded-full px-8 py-4 h-auto font-semibold">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10 rounded-full px-8 py-4 h-auto font-semibold">
                Schedule Demo
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

// Integration Card Component
const IntegrationCard = ({ name, desc }) => (
  <Link to={`/installation/${name.toLowerCase().replace(/\s+/g, '-')}`} className="group">
    <div className="bg-white p-4 rounded-xl border border-gray-100 hover:border-[#2563EB] hover:shadow-lg transition-all">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
          <span className="text-xs font-bold text-gray-600 group-hover:text-[#2563EB]">{name.charAt(0)}</span>
        </div>
        <span className="font-semibold text-gray-800 text-sm">{name}</span>
      </div>
      <p className="text-gray-500 text-xs">{desc}</p>
    </div>
  </Link>
);

export default WidgetPage;
