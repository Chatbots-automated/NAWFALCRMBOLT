import React, { useState } from 'react';
import { Zap, Shield, Eye, EyeOff } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate loading for dramatic effect
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (password.toLowerCase() === 'dominate') {
      onLogin();
    } else {
      setError('ACCESS DENIED. ELITE AUTHORIZATION REQUIRED.');
      setPassword('');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-black to-purple-900/20"></div>
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Login Container */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-black/80 backdrop-blur-xl border border-red-500/30 rounded-2xl p-8 shadow-2xl">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="relative group mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/30 to-orange-500/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              <div className="relative bg-black/40 backdrop-blur-sm border border-red-500/30 rounded-2xl p-4 hover:border-red-500/50 transition-all duration-300">
                <img 
                  src="https://filaligroup.com/sizenewfilali.png" 
                  alt="FILALI EMPIRE" 
                  className="h-16 w-auto mx-auto filter brightness-110 hover:brightness-125 transition-all duration-300"
                />
              </div>
            </div>
            
            <h1 className="text-3xl font-black text-white mb-2">
              FILALI EMPIRE
            </h1>
            <p className="text-red-400 font-bold text-lg mb-1">ELITE ACCESS REQUIRED</p>
            <p className="text-gray-400 text-sm font-semibold">ENTER THE COMMAND TO PROCEED</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-red-400 mb-3 uppercase tracking-wide">
                Elite Authorization Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Shield className="h-5 w-5 text-red-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-black/50 border border-red-500/40 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-white placeholder-gray-500 font-medium"
                  placeholder="Enter elite command..."
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-red-400 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-center">
                <p className="text-red-400 font-bold text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !password}
              className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-red-500 to-red-600 text-white font-black text-lg rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  AUTHENTICATING...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  ENTER EMPIRE
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500 font-medium">
              ELITE AUTHORIZATION SYSTEM v2.0
            </p>
            <p className="text-xs text-gray-600 mt-1">
              UNAUTHORIZED ACCESS WILL BE TERMINATED
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;