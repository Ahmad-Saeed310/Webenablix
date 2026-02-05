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
const ScoreBadge = ({ score, label, size = "normal" }) => {
  const getColor = (s) => {
    if (s >= 80) return { bg: 'bg-emerald-100', text: 'text-emerald-600', ring: 'ring-emerald-500' };
    if (s >= 60) return { bg: 'bg-yellow-100', text: 'text-yellow-600', ring: 'ring-yellow-500' };
    return { bg: 'bg-red-100', text: 'text-red-600', ring: 'ring-red-500' };
  };
  
  const colors = getColor(score);
  const sizeClasses = size === "large" 
    ? "w-24 h-24 text-3xl" 
    : "w-16 h-16 text-xl";
  
  return (
    <div className="flex flex-col items-center">
      <div className={`${sizeClasses} ${colors.bg} rounded-full flex items-center justify-center ring-4 ${colors.ring}`}>
        <span className={`font-bold ${colors.text}`}>{score}</span>
      </div>
      <span className="text-xs text-gray-500 mt-2 text-center">{label}</span>
    </div>
  );
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  const configs = {
    good: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Good' },
    'needs-improvement': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Needs Work' },
    poor: { bg: 'bg-red-100', text: 'text-red-700', label: 'Poor' },
    low: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Low Risk' },
    medium: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Medium Risk' },
    high: { bg: 'bg-red-100', text: 'text-red-700', label: 'High Risk' },
  };
  
  const config = configs[status] || configs.poor;
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

// Collapsible Section Component
const CollapsibleSection = ({ title, icon: Icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-[#2563EB]" />
          <span className="font-semibold text-gray-800">{title}</span>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
      </button>
      {isOpen && <div className="p-4">{children}</div>}
    </div>
  );
};

// Issue Item Component
const IssueItem = ({ issue, type = "accessibility" }) => {
  const bgColors = {
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    notice: 'bg-blue-50 border-blue-200'
  };
  
  const icons = {
    error: <XCircle className="w-4 h-4 text-red-500" />,
    warning: <AlertTriangle className="w-4 h-4 text-yellow-500" />,
    notice: <Eye className="w-4 h-4 text-blue-500" />
  };
  
  return (
    <div className={`p-3 rounded-lg border ${bgColors[issue.type]} text-left`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{icons[issue.type]}</div>
        <div className="flex-1">
          <p className="font-medium text-gray-800 text-sm">{issue.message}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="text-xs bg-white px-2 py-0.5 rounded text-gray-600">
              Code: {issue.code}
            </span>
            {issue.count !== undefined && (
              <span className="text-xs bg-white px-2 py-0.5 rounded text-gray-600">
                Count: {issue.count}
              </span>
            )}
            <span className={`text-xs px-2 py-0.5 rounded ${
              issue.impact === 'critical' ? 'bg-red-200 text-red-700' :
              issue.impact === 'serious' ? 'bg-orange-200 text-orange-700' :
              issue.impact === 'moderate' ? 'bg-yellow-200 text-yellow-700' :
              'bg-gray-200 text-gray-700'
            }`}>
              {issue.impact}
            </span>
          </div>
          {issue.recommendation && (
            <p className="text-xs text-gray-600 mt-2 italic">
              💡 {issue.recommendation}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Core Web Vitals Component
const CoreWebVitalsDisplay = ({ vitals }) => {
  const MetricCard = ({ label, value, unit, status, target }) => (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600">{label}</span>
        <StatusBadge status={status} />
      </div>
      <div className="text-2xl font-bold text-gray-800">
        {value}<span className="text-sm font-normal text-gray-500">{unit}</span>
      </div>
      <p className="text-xs text-gray-500 mt-1">Target: {target}</p>
    </div>
  );
  
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <MetricCard 
        label="LCP (Largest Contentful Paint)" 
        value={vitals.lcp} 
        unit="s" 
        status={vitals.lcp_status}
        target="< 2.5s"
      />
      <MetricCard 
        label="FID (First Input Delay)" 
        value={vitals.fid} 
        unit="ms" 
        status={vitals.fid_status}
        target="< 100ms"
      />
      <MetricCard 
        label="CLS (Cumulative Layout Shift)" 
        value={vitals.cls} 
        unit="" 
        status={vitals.cls_status}
        target="< 0.1"
      />
    </div>
  );
};

// Mobile Friendliness Component
const MobileFriendlinessDisplay = ({ mobile }) => {
  const CheckItem = ({ passed, label }) => (
    <div className="flex items-center gap-2">
      {passed ? (
        <CheckCircle className="w-5 h-5 text-emerald-500" />
      ) : (
        <XCircle className="w-5 h-5 text-red-500" />
      )}
      <span className={passed ? 'text-gray-700' : 'text-red-700'}>{label}</span>
    </div>
  );
  
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
          mobile.is_mobile_friendly ? 'bg-emerald-100' : 'bg-red-100'
        }`}>
          <Smartphone className={`w-6 h-6 ${
            mobile.is_mobile_friendly ? 'text-emerald-600' : 'text-red-600'
          }`} />
        </div>
        <div>
          <p className={`font-semibold ${
            mobile.is_mobile_friendly ? 'text-emerald-700' : 'text-red-700'
          }`}>
            {mobile.is_mobile_friendly ? 'Mobile Friendly' : 'Not Mobile Friendly'}
          </p>
          <p className="text-sm text-gray-500">Google Mobile-First Indexing</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <CheckItem passed={mobile.viewport_configured} label="Viewport meta tag configured" />
        <CheckItem passed={mobile.text_readable} label="Text readable without zooming" />
        <CheckItem passed={mobile.tap_targets_sized} label="Tap targets properly sized" />
        <CheckItem passed={!mobile.content_wider_than_screen} label="Content fits viewport width" />
      </div>
      
      {mobile.issues && mobile.issues.length > 0 && (
        <div className="mt-4 p-3 bg-red-50 rounded-lg">
          <p className="text-sm font-medium text-red-700 mb-2">Issues Found:</p>
          <ul className="text-sm text-red-600 space-y-1">
            {mobile.issues.map((issue, idx) => (
              <li key={`mobile-issue-${idx}`}>• {issue}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Security Check Component
const SecurityDisplay = ({ security }) => {
  const CheckItem = ({ passed, label, description }) => (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
      {passed ? (
        <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" />
      ) : (
        <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
      )}
      <div>
        <p className={`font-medium ${passed ? 'text-gray-700' : 'text-red-700'}`}>{label}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
  );
  
  return (
    <div className="space-y-3">
      <CheckItem 
        passed={security.has_https} 
        label="HTTPS Enabled" 
        description="Secure connection with SSL/TLS encryption"
      />
      <CheckItem 
        passed={security.has_hsts} 
        label="HSTS Header" 
        description="HTTP Strict Transport Security enabled"
      />
      <CheckItem 
        passed={security.has_csp} 
        label="Content Security Policy" 
        description="CSP headers configured to prevent XSS attacks"
      />
      <CheckItem 
        passed={!security.mixed_content} 
        label="No Mixed Content" 
        description="All resources loaded over HTTPS"
      />
    </div>
  );
};

// Structured Data Component
const StructuredDataDisplay = ({ data }) => {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
          data.has_schema ? 'bg-emerald-100' : 'bg-yellow-100'
        }`}>
          <Globe className={`w-6 h-6 ${
            data.has_schema ? 'text-emerald-600' : 'text-yellow-600'
          }`} />
        </div>
        <div>
          <p className={`font-semibold ${
            data.has_schema ? 'text-emerald-700' : 'text-yellow-700'
          }`}>
            {data.has_schema ? 'Schema.org Markup Found' : 'No Structured Data'}
          </p>
          <p className="text-sm text-gray-500">Rich Snippets & Knowledge Graph</p>
        </div>
      </div>
      
      {data.schema_types && data.schema_types.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Schema Types Found:</p>
          <div className="flex flex-wrap gap-2">
            {data.schema_types.map((type, idx) => (
              <span key={`schema-${idx}`} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                {type}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {data.errors && data.errors.length > 0 && (
        <div className="p-3 bg-red-50 rounded-lg mb-3">
          <p className="text-sm font-medium text-red-700 mb-1">Errors:</p>
          <ul className="text-sm text-red-600">
            {data.errors.map((err, idx) => (
              <li key={`err-${idx}`}>• {err}</li>
            ))}
          </ul>
        </div>
      )}
      
      {data.warnings && data.warnings.length > 0 && (
        <div className="p-3 bg-yellow-50 rounded-lg">
          <p className="text-sm font-medium text-yellow-700 mb-1">Warnings:</p>
          <ul className="text-sm text-yellow-600">
            {data.warnings.map((warn, idx) => (
              <li key={`warn-${idx}`}>• {warn}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Main Audit Results Component
const FullAuditResults = ({ result }) => {
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
        
        {/* Top Recommendations */}
        {result.top_recommendations && result.top_recommendations.length > 0 && (
          <div className="p-6 bg-blue-50 border-b">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#2563EB]" />
              Top Recommendations
            </h3>
            <ul className="space-y-2">
              {result.top_recommendations.map((rec, idx) => (
                <li key={`rec-${idx}`} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="w-5 h-5 bg-[#2563EB] text-white rounded-full flex items-center justify-center text-xs flex-shrink-0">
                    {idx + 1}
                  </span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Detailed Sections */}
        <div className="p-6 space-y-4">
          {/* Core Web Vitals */}
          <CollapsibleSection title="Core Web Vitals (Google)" icon={Zap} defaultOpen={true}>
            <CoreWebVitalsDisplay vitals={result.core_web_vitals} />
          </CollapsibleSection>
          
          {/* Accessibility Issues */}
          <CollapsibleSection title={`Accessibility Issues (${result.accessibility_issues?.length || 0})`} icon={Eye}>
            <div className="space-y-3">
              {result.accessibility_issues && result.accessibility_issues.length > 0 ? (
                result.accessibility_issues.map((issue, idx) => (
                  <IssueItem key={`acc-${idx}`} issue={issue} />
                ))
              ) : (
                <p className="text-emerald-600 text-center py-4">No accessibility issues found!</p>
              )}
            </div>
          </CollapsibleSection>
          
          {/* SEO Issues */}
          <CollapsibleSection title={`SEO Issues (${result.seo_issues?.length || 0})`} icon={Globe}>
            <div className="space-y-3">
              {result.seo_issues && result.seo_issues.length > 0 ? (
                result.seo_issues.map((issue, idx) => (
                  <IssueItem key={`seo-${idx}`} issue={issue} type="seo" />
                ))
              ) : (
                <p className="text-emerald-600 text-center py-4">No SEO issues found!</p>
              )}
            </div>
          </CollapsibleSection>
          
          {/* Mobile Friendliness */}
          <CollapsibleSection title="Mobile Friendliness" icon={Smartphone}>
            <MobileFriendlinessDisplay mobile={result.mobile_friendliness} />
          </CollapsibleSection>
          
          {/* Structured Data */}
          <CollapsibleSection title="Structured Data (Schema.org)" icon={Globe}>
            <StructuredDataDisplay data={result.structured_data} />
          </CollapsibleSection>
          
          {/* Security */}
          <CollapsibleSection title="Security Analysis" icon={Shield}>
            <SecurityDisplay security={result.security} />
          </CollapsibleSection>
        </div>
      </div>
    </div>
  );
};

// Main Audit Section Component
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
      const response = await axios.post(`${API}/audit`, {
        url: websiteUrl,
        audit_type: 'full'
      });
      setAuditResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to audit website. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAudit();
    }
  };

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-[#1e3a5f] to-[#0f172a] relative overflow-hidden">
      {/* Background Decorations */}
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
            Analyze accessibility, SEO, Core Web Vitals, mobile-friendliness, and security in one comprehensive report
          </p>
          
          {/* URL Input */}
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Input
                  type="url"
                  placeholder="Enter your website URL (e.g., example.com)"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full h-14 pl-12 pr-4 rounded-full bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/60 focus:border-white/40 focus:ring-white/20"
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
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    RUN FULL AUDIT
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </div>
            
            {error && (
              <p className="mt-4 text-red-400 text-sm">{error}</p>
            )}
          </div>

          {/* Audit Results */}
          {auditResult && <FullAuditResults result={auditResult} />}
        </div>
      </div>
    </section>
  );
};

export default AuditSection;
