import React from 'react';

const TrustedBySection = () => {
  const companies = [
    { name: 'Salesforce', color: '#00A1E0' },
    { name: 'IBM', color: '#1F70C1' },
    { name: 'Zendesk', color: '#03363D' },
    { name: 'BMW', color: '#0066B1' },
    { name: 'British', color: '#EB2226' }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-center text-gray-500 text-sm font-medium mb-10 uppercase tracking-wide">
          Trusted by leading companies worldwide
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16">
          {companies.map((company, index) => (
            <div 
              key={index}
              className="flex items-center gap-2 px-6 py-3 bg-gray-50 rounded-full"
            >
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: company.color }}
              />
              <span className="font-semibold text-gray-700">{company.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBySection;
