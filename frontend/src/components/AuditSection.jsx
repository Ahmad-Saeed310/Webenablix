import React, { useState } from 'react';
import { 
  ArrowRight, Search, Loader2, CheckCircle, XCircle, AlertTriangle,
  Smartphone, Shield, Zap, Globe, Eye, ChevronDown, ChevronUp
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Score Badge Component
const ScoreBadge = ({ score, label }) => {
  let colorClasses = 'bg-red-100 text-red-600 ring-red-500';
  if (score >= 80) colorClasses = 'bg-emerald-100 text-emerald-600 ring-emerald-500';
  else if (score >= 60) colorClasses = 'bg-yellow-100 text-yellow-600 ring-yellow-500';
  
  return (
    <div className="flex flex-col items-center">
      <div className={`w-16 h-16 rounded-full flex items-center justify-center ring-4 ${colorClasses}`}>
        <span className="font-bold text-xl">{score}</span>
      </div>
      <span className="text-xs text-gray-500 mt-2 text-center">{label}</span>
    </div>
  );
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  let classes = 'bg-red-100 text-red-700';
  let label = status;
  
  if (status === 'good' || status === 'low') {
    classes = 'bg-emerald-100 text-emerald-700';
    label = status === 'low' ? 'Low Risk' : 'Good';
  } else if (status === 'needs-improvement' || status === 'medium') {
    classes = 'bg-yellow-100 text-yellow-700';
    label = status === 'medium' ? 'Medium Risk' : 'Needs Work';
  } else if (status === 'high') {
    label = 'High Risk';
  } else if (status === 'poor') {
    label = 'Poor';
  }
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${classes}`}>
      {label}
    </span>
  );
};

// Core Web Vitals Display
const CoreWebVitalsSection = ({ vitals }) => (
  <div className="grid md:grid-cols-3 gap-4">
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600">LCP (Largest Contentful Paint)</span>
        <StatusBadge status={vitals.lcp_status} />
      </div>
      <div className="text-2xl font-bold text-gray-800">
        {vitals.lcp}<span className="text-sm font-normal text-gray-500">s</span>
      </div>
      <p className="text-xs text-gray-500 mt-1">Target: &lt; 2.5s</p>
    </div>
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600">FID (First Input Delay)</span>
        <StatusBadge status={vitals.fid_status} />
      </div>
      <div className="text-2xl font-bold text-gray-800">
        {vitals.fid}<span className="text-sm font-normal text-gray-500">ms</span>
      </div>
      <p className="text-xs text-gray-500 mt-1">Target: &lt; 100ms</p>
    </div>
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600">CLS (Cumulative Layout Shift)</span>
        <StatusBadge status={vitals.cls_status} />
      </div>
      <div className="text-2xl font-bold text-gray-800">{vitals.cls}</div>
      <p className="text-xs text-gray-500 mt-1">Target: &lt; 0.1</p>
    </div>
  </div>
);

// Mobile Friendliness Section
const MobileSection = ({ mobile }) => {
  const CheckItem = ({ passed, label }) => (
    <div className="flex items-center gap-2">
      {passed ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
      <span className={passed ? 'text-gray-700' : 'text-red-700'}>{label}</span>
    </div>
  );
  
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${mobile.is_mobile_friendly ? 'bg-emerald-100' : 'bg-red-100'}`}>
          <Smartphone className={`w-6 h-6 ${mobile.is_mobile_friendly ? 'text-emerald-600' : 'text-red-600'}`} />
        </div>
        <div>
          <p className={`font-semibold ${mobile.is_mobile_friendly ? 'text-emerald-700' : 'text-red-700'}`}>
            {mobile.is_mobile_friendly ? 'Mobile Friendly' : 'Not Mobile Friendly'}
          </p>
        </div>
      </div>
      <div className="space-y-2">
        <CheckItem passed={mobile.viewport_configured} label="Viewport meta tag configured" />
        <CheckItem passed={mobile.text_readable} label="Text readable without zooming" />
        <CheckItem passed={mobile.tap_targets_sized} label="Tap targets properly sized" />
        <CheckItem passed={!mobile.content_wider_than_screen} label="Content fits viewport width" />
      </div>
    </div>
  );
};

// Security Section
const SecuritySection = ({ security }) => {
  const CheckItem = ({ passed, label, desc }) => (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
      {passed ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
      <div>
        <p className={`font-medium ${passed ? 'text-gray-700' : 'text-red-700'}`}>{label}</p>
        <p className="text-xs text-gray-500">{desc}</p>
      </div>
    </div>
  );
  
  return (
    <div className="space-y-3">
      <CheckItem passed={security.has_https} label="HTTPS Enabled" desc="Secure connection with SSL/TLS" />
      <CheckItem passed={security.has_hsts} label="HSTS Header" desc="HTTP Strict Transport Security" />
      <CheckItem passed={security.has_csp} label="Content Security Policy" desc="CSP headers configured" />
      <CheckItem passed={!security.mixed_content} label="No Mixed Content" desc="All resources over HTTPS" />
    </div>
  );
};

// Structured Data Section  
const StructuredDataSection = ({ data }) => (
  <div>
    <div className="flex items-center gap-3 mb-4">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${data.has_schema ? 'bg-emerald-100' : 'bg-yellow-100'}`}>
        <Globe className={`w-6 h-6 ${data.has_schema ? 'text-emerald-600' : 'text-yellow-600'}`} />
      </div>
      <div>
        <p className={`font-semibold ${data.has_schema ? 'text-emerald-700' : 'text-yellow-700'}`}>
          {data.has_schema ? 'Schema.org Markup Found' : 'No Structured Data'}
        </p>
      </div>
    </div>
    {data.has_schema && data.schema_types && (
      <div className="flex flex-wrap gap-2">
        {data.schema_types.slice(0, 5).map((type, i) => (
          <span key={`schema-type-${i}-${type}`} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">{type}</span>
        ))}
      </div>
    )}
  </div>
);

// Issue Display Component
const IssueDisplay = ({ issue, idx }) => {
  let bgClass = 'bg-blue-50 border-blue-200';
  let Icon = Eye;
  let iconColor = 'text-blue-500';
  
  if (issue.type === 'error') {
    bgClass = 'bg-red-50 border-red-200';
    Icon = XCircle;
    iconColor = 'text-red-500';
  } else if (issue.type === 'warning') {
    bgClass = 'bg-yellow-50 border-yellow-200';
    Icon = AlertTriangle;
    iconColor = 'text-yellow-500';
  }
  
  let impactClass = 'bg-gray-200 text-gray-700';
  if (issue.impact === 'critical') impactClass = 'bg-red-200 text-red-700';
  else if (issue.impact === 'serious') impactClass = 'bg-orange-200 text-orange-700';
  else if (issue.impact === 'moderate') impactClass = 'bg-yellow-200 text-yellow-700';
  
  return (
    <div className={`p-3 rounded-lg border ${bgClass} text-left`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-4 h-4 ${iconColor} mt-0.5`} />
        <div className="flex-1">
          <p className="font-medium text-gray-800 text-sm">{issue.message}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="text-xs bg-white px-2 py-0.5 rounded text-gray-600">Code: {issue.code}</span>
            {issue.count !== undefined && (
              <span className="text-xs bg-white px-2 py-0.5 rounded text-gray-600">Count: {issue.count}</span>
            )}
            <span className={`text-xs px-2 py-0.5 rounded ${impactClass}`}>{issue.impact}</span>
          </div>
          {issue.recommendation && (
            <p className="text-xs text-gray-600 mt-2 italic">💡 {issue.recommendation}</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Collapsible Section
const Section = ({ title, icon: Icon, children, defaultOpen }) => {
  const [open, setOpen] = useState(defaultOpen || false);
  
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100">
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-[#2563EB]" />
          <span className="font-semibold text-gray-800">{title}</span>
        </div>
        {open ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
      </button>
      {open && <div className="p-4">{children}</div>}
    </div>
  );
};

// Full Audit Results
const FullAuditResults = ({ result }) => {
  const accIssues = result.accessibility_issues || [];
  const seoIssues = result.seo_issues || [];
  const recs = result.top_recommendations || [];
  
  return (
    <div className="mt-12 max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2563EB] to-[#3B82F6] p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm opacity-80">Comprehensive Audit Report</p>
              <p className="text-lg font-semibold truncate max-w-md">{result.url}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-4xl font-bold">{result.overall_score}</p>
                <p className="text-xs opacity-80">Overall Score</p>
              </div>
              <div className="h-12 w-px bg-white/30" />
              <div>
                <StatusBadge status={result.lawsuit_risk} />
                <p className="text-xs opacity-80 mt-1">WCAG {result.wcag_level}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Score Cards */}
        <div className="p-6 border-b">
          <div className="flex flex-wrap justify-center gap-6">
            <ScoreBadge score={result.accessibility_score} label="Accessibility" />
            <ScoreBadge score={result.seo_score} label="SEO" />
            <ScoreBadge score={result.performance_score} label="Performance" />
            <ScoreBadge score={result.mobile_score} label="Mobile" />
            <ScoreBadge score={result.security_score} label="Security" />
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-3 border-b">
          <div className="p-4 text-center border-r">
            <p className="text-3xl font-bold text-red-500">{result.critical_issues}</p>
            <p className="text-sm text-gray-500">Critical Issues</p>
          </div>
          <div className="p-4 text-center border-r">
            <p className="text-3xl font-bold text-yellow-500">{result.warnings}</p>
            <p className="text-sm text-gray-500">Warnings</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-3xl font-bold text-gray-700">{result.total_issues}</p>
            <p className="text-sm text-gray-500">Total Issues</p>
          </div>
        </div>
        
        {/* Recommendations */}
        {recs.length > 0 && (
          <div className="p-6 bg-blue-50 border-b">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#2563EB]" />
              Top Recommendations
            </h3>
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-sm text-gray-700">
                <span className="w-5 h-5 bg-[#2563EB] text-white rounded-full flex items-center justify-center text-xs flex-shrink-0">1</span>
                {recs[0]}
              </div>
              {recs[1] && (
                <div className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="w-5 h-5 bg-[#2563EB] text-white rounded-full flex items-center justify-center text-xs flex-shrink-0">2</span>
                  {recs[1]}
                </div>
              )}
              {recs[2] && (
                <div className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="w-5 h-5 bg-[#2563EB] text-white rounded-full flex items-center justify-center text-xs flex-shrink-0">3</span>
                  {recs[2]}
                </div>
              )}
              {recs[3] && (
                <div className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="w-5 h-5 bg-[#2563EB] text-white rounded-full flex items-center justify-center text-xs flex-shrink-0">4</span>
                  {recs[3]}
                </div>
              )}
              {recs[4] && (
                <div className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="w-5 h-5 bg-[#2563EB] text-white rounded-full flex items-center justify-center text-xs flex-shrink-0">5</span>
                  {recs[4]}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Detailed Sections */}
        <div className="p-6 space-y-4">
          <Section title="Core Web Vitals (Google)" icon={Zap} defaultOpen={true}>
            <CoreWebVitalsSection vitals={result.core_web_vitals} />
          </Section>
          
          <Section title={`Accessibility Issues (${accIssues.length})`} icon={Eye}>
            <div className="space-y-3">
              {accIssues.length === 0 && <p className="text-emerald-600 text-center py-4">No accessibility issues found!</p>}
              {accIssues[0] && <IssueDisplay issue={accIssues[0]} idx={0} />}
              {accIssues[1] && <IssueDisplay issue={accIssues[1]} idx={1} />}
              {accIssues[2] && <IssueDisplay issue={accIssues[2]} idx={2} />}
              {accIssues[3] && <IssueDisplay issue={accIssues[3]} idx={3} />}
              {accIssues[4] && <IssueDisplay issue={accIssues[4]} idx={4} />}
              {accIssues[5] && <IssueDisplay issue={accIssues[5]} idx={5} />}
              {accIssues[6] && <IssueDisplay issue={accIssues[6]} idx={6} />}
              {accIssues[7] && <IssueDisplay issue={accIssues[7]} idx={7} />}
              {accIssues.length > 8 && <p className="text-sm text-gray-500 text-center">+ {accIssues.length - 8} more issues</p>}
            </div>
          </Section>
          
          <Section title={`SEO Issues (${seoIssues.length})`} icon={Globe}>
            <div className="space-y-3">
              {seoIssues.length === 0 && <p className="text-emerald-600 text-center py-4">No SEO issues found!</p>}
              {seoIssues[0] && <IssueDisplay issue={seoIssues[0]} idx={0} />}
              {seoIssues[1] && <IssueDisplay issue={seoIssues[1]} idx={1} />}
              {seoIssues[2] && <IssueDisplay issue={seoIssues[2]} idx={2} />}
              {seoIssues[3] && <IssueDisplay issue={seoIssues[3]} idx={3} />}
              {seoIssues[4] && <IssueDisplay issue={seoIssues[4]} idx={4} />}
              {seoIssues[5] && <IssueDisplay issue={seoIssues[5]} idx={5} />}
              {seoIssues.length > 6 && <p className="text-sm text-gray-500 text-center">+ {seoIssues.length - 6} more issues</p>}
            </div>
          </Section>
          
          <Section title="Mobile Friendliness" icon={Smartphone}>
            <MobileSection mobile={result.mobile_friendliness} />
          </Section>
          
          <Section title="Structured Data (Schema.org)" icon={Globe}>
            <StructuredDataSection data={result.structured_data} />
          </Section>
          
          <Section title="Security Analysis" icon={Shield}>
            <SecuritySection security={result.security} />
          </Section>
        </div>
      </div>
    </div>
  );
};

// Main Audit Section
const AuditSection = () => {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [auditResult, setAuditResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAudit = async () => {
    if (!websiteUrl.trim()) {
      setError('Please enter a website URL');
      return;
    }

    setLoading(true);
    setError(null);
    setAuditResult(null);

    try {
      const response = await axios.post(`${API}/audit`, { url: websiteUrl, audit_type: 'full' });
      setAuditResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to audit website. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-[#1e3a5f] to-[#0f172a] relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        <div className="text-center">
          <span className="inline-block px-4 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-sm mb-4">
            Powered by Google & WCAG Standards
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Complete Website Audit
          </h2>
          <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
            Analyze accessibility, SEO, Core Web Vitals, mobile-friendliness, and security
          </p>
          
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Input
                  type="url"
                  placeholder="Enter your website URL (e.g., example.com)"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAudit()}
                  className="w-full h-14 pl-12 pr-4 rounded-full bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/60"
                  disabled={loading}
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
              </div>
              <Button 
                onClick={handleAudit}
                disabled={loading}
                className="h-14 px-8 bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-full font-semibold flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" />Analyzing...</>
                ) : (
                  <>RUN FULL AUDIT<ArrowRight className="w-5 h-5" /></>
                )}
              </Button>
            </div>
            {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}
          </div>

          {auditResult && <FullAuditResults result={auditResult} />}
        </div>
      </div>
    </section>
  );
};

export default AuditSection;
