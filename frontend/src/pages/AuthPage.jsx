import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Shield, Mail, Lock, User, Building, ArrowRight, CheckCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    company: ''
  });

  useEffect(() => {
    // Check if already logged in
    const token = localStorage.getItem('webenablix_token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const body = isLogin 
      ? { email: formData.email, password: formData.password }
      : formData;

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || 'Authentication failed');
      }

      // Store token and user data
      localStorage.setItem('webenablix_token', data.access_token);
      localStorage.setItem('webenablix_user', JSON.stringify(data.user));

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    'Real-time accessibility scanning',
    'WCAG 2.1/2.2 compliance reports',
    'AI-powered fix suggestions',
    'Customizable accessibility widget'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Info */}
            <div className="hidden lg:block">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="h-12 w-12 text-blue-600" />
                <span className="text-3xl font-bold text-gray-900">Webenablix</span>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Make Your Website Accessible to Everyone
              </h1>
              
              <p className="text-lg text-gray-600 mb-8">
                Join thousands of businesses using Webenablix to ensure their websites are accessible, compliant, and user-friendly.
              </p>
              
              <div className="space-y-4">
                {features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-800">
                  <strong>Free Plan Available:</strong> Start with 3 free scans per month, no credit card required.
                </p>
              </div>
            </div>
            
            {/* Right Side - Auth Form */}
            <div>
              <Card className="shadow-xl">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4 lg:hidden">
                    <Shield className="h-10 w-10 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl">
                    {isLogin ? 'Welcome Back' : 'Create Your Account'}
                  </CardTitle>
                  <CardDescription>
                    {isLogin 
                      ? 'Sign in to access your accessibility dashboard' 
                      : 'Start your accessibility journey today'}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="name"
                              name="name"
                              placeholder="John Doe"
                              value={formData.name}
                              onChange={handleChange}
                              className="pl-10"
                              required={!isLogin}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="company">Company (Optional)</Label>
                          <div className="relative">
                            <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="company"
                              name="company"
                              placeholder="Acme Inc."
                              value={formData.company}
                              onChange={handleChange}
                              className="pl-10"
                            />
                          </div>
                        </div>
                      </>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={handleChange}
                          className="pl-10"
                          required
                          minLength={6}
                        />
                      </div>
                    </div>
                    
                    {error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                        {error}
                      </div>
                    )}
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      size="lg"
                      disabled={loading}
                    >
                      {loading ? (
                        'Please wait...'
                      ) : (
                        <>
                          {isLogin ? 'Sign In' : 'Create Account'}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                  
                  <div className="mt-6 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setIsLogin(!isLogin);
                        setError('');
                      }}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {isLogin 
                        ? "Don't have an account? Sign up" 
                        : 'Already have an account? Sign in'}
                    </button>
                  </div>
                  
                  {isLogin && (
                    <div className="mt-4 text-center">
                      <Link to="/forgot-password" className="text-sm text-gray-500 hover:underline">
                        Forgot your password?
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <p className="mt-4 text-center text-xs text-gray-500">
                By signing up, you agree to our{' '}
                <Link to="/terms" className="underline">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="underline">Privacy Policy</Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AuthPage;
