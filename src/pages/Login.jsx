import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaLock, FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Email dan password wajib diisi');
      return;
    }

    setLoading(true);
    setError('');

    const result = await loginUser(email, password);
    setLoading(false);

    if (result.success) {
      login(result.data);
      navigate('/dashboard');
    } else {
      setError(result.message || 'Login gagal, silakan coba lagi');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0f4f8] via-white to-[#e8edf3] p-4 relative overflow-hidden">
      {}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#1a3a5c]/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#1a3a5c]/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#1a3a5c]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 bg-white rounded-2xl p-8 w-full max-w-md shadow-xl border border-slate-200/50">
        {}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#1a3a5c] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#1a3a5c]/25">
            <span className="text-2xl font-bold text-white">TS</span>
          </div>
          <h1 className="text-2xl font-bold text-[#1a3a5c]">Selamat Datang</h1>
          <p className="text-slate-500 text-sm mt-1">Masuk ke akun Anda</p>
        </div>

        {}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 p-3 rounded-lg text-sm mb-4 flex items-center gap-2 animate-shake">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-slate-400" />
              </div>
              <input
                type="email"
                placeholder="Masukkan email Anda"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 pl-10 pr-3 py-3 rounded-lg focus:outline-none focus:border-[#1a3a5c] focus:ring-2 focus:ring-[#1a3a5c]/10 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-slate-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Masukkan password Anda"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 pl-10 pr-12 py-3 rounded-lg focus:outline-none focus:border-[#1a3a5c] focus:ring-2 focus:ring-[#1a3a5c]/10 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1a3a5c] text-white py-3.5 rounded-lg font-semibold hover:bg-[#264d73] transition-all duration-300 hover:shadow-lg hover:shadow-[#1a3a5c]/25 disabled:opacity-50 disabled:hover:bg-[#1a3a5c] disabled:hover:shadow-none flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memproses...
              </>
            ) : (
              'Masuk'
            )}
          </button>
        </form>

        {}
        <div className="mt-6 pt-6 border-t border-slate-200">
          <p className="text-center text-xs text-slate-400 mb-3">
           Akun Demo (untuk testing)
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-50 rounded-lg p-2.5 text-center border border-slate-100">
              <p className="text-[10px] font-semibold text-slate-600">Admin</p>
              <p className="text-[9px] text-slate-400 truncate">admin@company.com</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-2.5 text-center border border-slate-100">
              <p className="text-[10px] font-semibold text-slate-600">User</p>
              <p className="text-[9px] text-slate-400 truncate">user@company.com</p>
            </div>
          </div>
          <p className="text-center text-[10px] text-slate-400 mt-2">
            Password: <span className="font-mono bg-slate-100 px-2 py-0.5 rounded">Admin123!</span> / <span className="font-mono bg-slate-100 px-2 py-0.5 rounded">User123!</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;