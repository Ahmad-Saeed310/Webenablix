import React, { useState } from 'react';
import { ArrowRight, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const AuditSection = () => {
  const [websiteUrl, setWebsiteUrl] = useState('');

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-[#1e3a5f] to-[#0f172a] relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Find out now if your<br />website is accessible
          </h2>
          
          {/* URL Input */}
          <div className="max-w-2xl mx-auto mt-10">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Input
                  type="url"
                  placeholder="Enter your website URL"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 rounded-full bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/60 focus:border-white/40 focus:ring-white/20"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
              </div>
              <Button className="h-14 px-8 bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-full font-semibold flex items-center gap-2 whitespace-nowrap">
                GET AUDIT
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuditSection;
