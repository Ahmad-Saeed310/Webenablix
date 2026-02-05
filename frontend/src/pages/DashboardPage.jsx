import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { 
  BarChart3, Shield, Globe, Settings, Plus, ExternalLink,
  TrendingUp, AlertTriangle, CheckCircle, Clock, LogOut, User
} from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Auth helper functions
const getToken = () => localStorage.getItem('webenablix_token');
const getUser = () => {
  const user = localStorage.getItem('webenablix_user');
  return user ? JSON.parse(user) : null;
};
const logout = () => {
  localStorage.removeItem('webenablix_token');
  localStorage.removeItem('webenablix_user');
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sites, setSites] = useState([]);
  const [stats, setStats] = useState({ total_audits: 0, average_score: 0 });
  const [newSiteUrl, setNewSiteUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(null);
  const [recentAudits, setRecentAudits] = useState([]);

  useEffect(() => {
    const storedUser = getUser();
    const token = getToken();
    
    if (!token || !storedUser) {
      navigate('/login');
      return;
    }
    
    setUser(storedUser);
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const token = getToken();
      
      // Fetch stats
      const statsRes = await fetch(`${API_URL}/api/stats`);
      if (statsRes.ok) {
        setStats(await statsRes.json());
      }
      
      // Fetch recent audits
      const auditsRes = await fetch(`${API_URL}/api/audits?limit=5`);
      if (auditsRes.ok) {
        const audits = await auditsRes.json();
        setRecentAudits(audits);
        
        // Extract unique sites from audits
        const uniqueSites = [...new Set(audits.map(a => a.url))].map(url => {
          const siteAudits = audits.filter(a => a.url === url);
          const latestAudit = siteAudits[0];
          return {
            url,
            score: latestAudit?.overall_score || 0,
            lastScan: latestAudit?.created_at,
            issues: latestAudit?.total_issues || 0
          };
        });
        setSites(uniqueSites.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSite = async (e) => {
    e.preventDefault();
    if (!newSiteUrl.trim()) return;
    
    setScanning(newSiteUrl);
    
    try {
      const res = await fetch(`${API_URL}/api/audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: newSiteUrl })
      });
      
      if (res.ok) {
        setNewSiteUrl('');
        fetchData();
      }
    } catch (error) {
      console.error('Error adding site:', error);
    } finally {
      setScanning(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 50) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <Shield className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">Webenablix</span>
              </Link>
              <span className="ml-4 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                Dashboard
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                {user?.name}
              </div>
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded uppercase">
                {user?.plan || 'Free'}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name?.split(' ')[0]}!</h1>
          <p className="text-gray-600">Monitor and improve your websites' accessibility.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Scans</p>
                  <p className="text-2xl font-bold">{stats.total_audits}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Avg Score</p>
                  <p className={`text-2xl font-bold ${getScoreColor(stats.average_score)}`}>
                    {stats.average_score}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Sites Monitored</p>
                  <p className="text-2xl font-bold">{sites.length}</p>
                </div>
                <Globe className="h-8 w-8 text-purple-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Plan</p>
                  <p className="text-2xl font-bold capitalize">{user?.plan || 'Free'}</p>
                </div>
                <Shield className="h-8 w-8 text-yellow-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add New Site */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Scan New Website
            </CardTitle>
            <CardDescription>
              Enter a URL to perform a comprehensive accessibility audit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddSite} className="flex gap-4">
              <Input
                type="url"
                placeholder="https://example.com"
                value={newSiteUrl}
                onChange={(e) => setNewSiteUrl(e.target.value)}
                className="flex-1"
                disabled={scanning}
              />
              <Button type="submit" disabled={scanning || !newSiteUrl.trim()}>
                {scanning ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Start Scan
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Audits */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Audits</CardTitle>
              <CardDescription>Your latest accessibility scans</CardDescription>
            </CardHeader>
            <CardContent>
              {recentAudits.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No audits yet. Start by scanning a website above.
                </p>
              ) : (
                <div className="space-y-4">
                  {recentAudits.slice(0, 5).map((audit, i) => (
                    <div key={audit.id || i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${getScoreBg(audit.overall_score)}`}>
                          {audit.overall_score >= 80 ? (
                            <CheckCircle className={`h-4 w-4 ${getScoreColor(audit.overall_score)}`} />
                          ) : (
                            <AlertTriangle className={`h-4 w-4 ${getScoreColor(audit.overall_score)}`} />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm truncate max-w-[200px]">{audit.url}</p>
                          <p className="text-xs text-gray-500">
                            {audit.total_issues} issues • {new Date(audit.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${getScoreColor(audit.overall_score)}`}>
                          {audit.overall_score}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Monitored Sites */}
          <Card>
            <CardHeader>
              <CardTitle>Your Websites</CardTitle>
              <CardDescription>Sites you've scanned for accessibility</CardDescription>
            </CardHeader>
            <CardContent>
              {sites.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No websites added yet. Scan a site to get started.
                </p>
              ) : (
                <div className="space-y-4">
                  {sites.map((site, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <Globe className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-sm truncate max-w-[200px]">{site.url}</p>
                          <p className="text-xs text-gray-500">
                            Last scan: {site.lastScan ? new Date(site.lastScan).toLocaleDateString() : 'Never'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded text-sm font-medium ${getScoreBg(site.score)} ${getScoreColor(site.score)}`}>
                          {site.score}%
                        </span>
                        <a href={site.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/products/widget">
            <Card className="hover:border-blue-300 transition-colors cursor-pointer h-full">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Settings className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Configure Widget</h3>
                  <p className="text-sm text-gray-500">Customize your accessibility widget</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/products/checker">
            <Card className="hover:border-green-300 transition-colors cursor-pointer h-full">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Run Free Check</h3>
                  <p className="text-sm text-gray-500">Quick accessibility scan</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/pricing">
            <Card className="hover:border-purple-300 transition-colors cursor-pointer h-full">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Upgrade Plan</h3>
                  <p className="text-sm text-gray-500">Get more features & scans</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
