import React, { useState } from 'react';
import { ArrowRight, Search, Loader2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const IssueItem = ({ issue }) => {
  const bgColor = issue.type === 'error' ? 'bg-red-50' : 
                  issue.type === 'warning' ? 'bg-yellow-50' : 'bg-blue-50';
  const iconBgColor = issue.type === 'error' ? 'bg-red-100' : 
                      issue.type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100';
  
  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg text-left ${bgColor}`}>
      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${iconBgColor}`}>
        {issue.type === 'error' ? (
          <XCircle className="w-4 h-4 text-red-500" />
        ) : issue.type === 'warning' ? (
          <AlertTriangle className="w-4 h-4 text-yellow-500" />
        ) : (
          <CheckCircle className="w-4 h-4 text-blue-500" />
        )}
      </div>
      <div>
        <p className="font-medium text-gray-800">{issue.message}</p>
        <p className="text-sm text-gray-500">
          Code: {issue.code} · Count: {issue.count} · Impact: {issue.impact}
        </p>
      </div>
    </div>
  );
};

const IssuesList = ({ issues }) => {
  if (!issues || issues.length === 0) return null;
  
  return (
    <div className="mt-6 border-t pt-6">
      <h3 className="font-semibold text-gray-800 mb-4 text-left">Issues Detected:</h3>
      <div className="space-y-3">
        {issues.slice(0, 10).map((issue, idx) => (
          <IssueItem key={`issue-${idx}`} issue={issue} />
        ))}
      </div>
    </div>
  );
};

const AuditResults = ({ result }) => {
  const getRiskIcon = (risk) => {
    if (risk === 'low') return <CheckCircle className="w-5 h-5 text-emerald-500" />;
    if (risk === 'medium') return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  const getRiskColor = (risk) => {
    if (risk === 'low') return 'text-emerald-500';
    if (risk === 'medium') return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="mt-12 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="text-left">
            <p className="text-gray-500 text-sm">Audit Results for</p>
            <p className="font-semibold text-gray-800 truncate max-w-md">{result.url}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-500 text-sm">WCAG Level</p>
            <p className="font-bold text-[#2563EB] text-lg">{result.wcag_level}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Score */}
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <p className="text-gray-500 text-sm mb-2">Accessibility Score</p>
            <p className={`text-5xl font-bold ${getScoreColor(result.score)}`}>
              {result.score}
              <span className="text-xl text-gray-400">%</span>
            </p>
          </div>

          {/* Lawsuit Risk */}
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <p className="text-gray-500 text-sm mb-2">Lawsuit Risk</p>
            <div className="flex items-center justify-center gap-2">
              {getRiskIcon(result.lawsuit_risk)}
              <p className={`text-xl font-bold capitalize ${getRiskColor(result.lawsuit_risk)}`}>
                {result.lawsuit_risk}
              </p>
            </div>
          </div>

          {/* Issues */}
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <p className="text-gray-500 text-sm mb-2">Issues Found</p>
            <p className="text-xl font-bold text-gray-800">
              <span className="text-red-500">{result.errors}</span> errors, 
              <span className="text-yellow-500 ml-1">{result.warnings}</span> warnings
            </p>
          </div>
        </div>

        <IssuesList issues={result.issues} />
      </div>
    </div>
  );
};

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
        url: websiteUrl
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
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Find out now if your<br />website is accessible
          </h2>
          
          {/* URL Input */}
          <div className="max-w-2xl mx-auto mt-10">
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
                    GET AUDIT
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
          {auditResult && <AuditResults result={auditResult} />}
        </div>
      </div>
    </section>
  );
};

export default AuditSection;
