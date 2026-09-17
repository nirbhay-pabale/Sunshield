import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  MapPin, 
  Sun, 
  Thermometer, 
  Wind, 
  ShieldCheck, 
  Users, 
  ArrowRight, 
  Check, 
  AlertCircle, 
  User as UserIcon, 
  Building2, 
  X,
  Sparkles,
  ChevronDown
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, register, forgotPassword, selectedCity, setSelectedCity } = useApp();

  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [cityDropdown, setCityDropdown] = useState<boolean>(false);
  const [showForgotModal, setShowForgotModal] = useState<boolean>(false);
  const [forgotEmail, setForgotEmail] = useState<string>('');
  const [forgotMessage, setForgotMessage] = useState<string | null>(null);

  // Sign in form state
  const [email, setEmail] = useState<string>('officer@sahayya.ai');
  const [password, setPassword] = useState<string>('sahayya123');

  // Register form state
  const [regName, setRegName] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regConfirmPassword, setRegConfirmPassword] = useState<string>('');
  const [regRole, setRegRole] = useState<string>('Disaster Management Officer');
  const [regWard, setRegWard] = useState<string>('Central Pune');
  const [regAgreeTerms, setRegAgreeTerms] = useState<boolean>(true);

  // UI state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const availableCities = [
    'Pune, Maharashtra',
    'Pimpri-Chinchwad, Maharashtra',
    'Shivajinagar, Pune',
    'Kothrud, Pune',
    'Hadapsar, Pune',
    'Katraj-Bibwewadi, Pune'
  ];

  // Quick Demo Account Auto-Fill
  const handleQuickDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage(null);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await login(email.trim(), password, rememberMe);
      if (!res.success) {
        setErrorMessage(res.message || 'Invalid email or password.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error signing in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!regName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@') || !regEmail.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }
    if (!regAgreeTerms) {
      setErrorMessage('Please accept the Municipal Heat Action Terms to continue.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await register({
        name: regName.trim(),
        email: regEmail.trim(),
        password: regPassword,
        role: regRole,
        ward: regWard
      });
      if (res.success) {
        setSuccessMessage('Account created successfully! Logging you in...');
      } else {
        setErrorMessage(res.message || 'Registration failed.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error registering account.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await login('officer@sahayya.ai', 'sahayya123', true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim() || !forgotEmail.includes('@')) {
      setForgotMessage('Please provide a valid email address.');
      return;
    }
    const res = await forgotPassword(forgotEmail.trim());
    setForgotMessage(res.message || `Password reset link dispatched to ${forgotEmail}.`);
  };

  return (
    <div 
      className="relative min-h-screen w-full flex flex-col justify-between bg-cover bg-center font-sans overflow-x-hidden"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(240, 247, 243, 0.92) 0%, rgba(240, 247, 243, 0.75) 45%, rgba(240, 247, 243, 0.88) 100%), url('/login_bg.jpg')`,
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover'
      }}
    >
      {/* Top Header Bar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between z-20">
        {/* SUNSHIELD Brand Logo (Unbordered & Seamlessly Blended) */}
        <div className="flex items-center gap-3.5">
          <div className="w-13 h-13 flex items-center justify-center shrink-0">
            <img 
              src="/sunshield_logo.png" 
              alt="SUNSHIELD" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="font-display text-[24px] font-bold text-[#143d2b] tracking-tight leading-[1.1]">
              SUNSHIELD
            </h1>
            <p className="font-sans text-[11px] text-[#39624f] font-normal leading-[1.4] mt-0.5">
              Heat & Climate Health Intelligence System
            </p>
          </div>
        </div>

        {/* Top Right Quick Badges */}
        <div className="flex items-center gap-3 font-sans">
          {/* Location Selector Pill */}
          <div className="relative">
            <button
              onClick={() => setCityDropdown(!cityDropdown)}
              className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#cbe0d2] shadow-2xs hover:bg-white text-[13px] font-semibold text-[#143d2b] transition-all cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-[#1b4d3e]" />
              <span>{selectedCity}</span>
              <ChevronDown className="w-3 h-3 text-[#5b7a6b]" />
            </button>

            {cityDropdown && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#d6e5da] py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-1 text-[11px] uppercase font-semibold text-[#718f80] tracking-wider">
                  Select Region / Ward
                </div>
                {availableCities.map(city => (
                  <button
                    key={city}
                    onClick={() => {
                      setSelectedCity(city);
                      setCityDropdown(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-[13px] flex items-center justify-between hover:bg-[#edf5ef] transition-colors cursor-pointer ${
                      selectedCity === city ? 'text-[#1b4d3e] bg-[#f0f7f2] font-semibold' : 'text-[#2a4537] font-normal'
                    }`}
                  >
                    <span>{city}</span>
                    {selectedCity === city && <Check className="w-3.5 h-3.5 text-[#236c43]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Live Weather Pill */}
          <div className="hidden sm:flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#cbe0d2] shadow-2xs text-[13px] font-semibold text-[#143d2b]">
            <Sun className="w-4 h-4 text-[#ea580c] animate-[spin_12s_linear_infinite]" />
            <span>32°C Sunny</span>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="w-full max-w-7xl mx-auto px-6 py-6 md:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center flex-1 z-10 font-sans">
        
        {/* Left Hero Section (5 Feature Pillars & Taglines) */}
        <div className="lg:col-span-7 space-y-6 md:space-y-8">
          
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-[#1b4d3e]/10 border border-[#1b4d3e]/20 px-3.5 py-1.5 rounded-full text-[11px] font-semibold text-[#1b4d3e] tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#236c43]" />
              <span>Heat Risk Intelligence</span>
            </div>

            <h2 className="font-display text-4xl sm:text-5xl lg:text-[48px] font-semibold text-[#0e3020] tracking-[-0.02em] leading-[1.1]">
              Smarter Insights.<br />
              <span className="text-[#1b4d3e]">Safer Communities.</span>
            </h2>

            <p className="font-sans text-[16px] font-normal text-[#2c5340] max-w-xl leading-[1.5]">
              AI-powered heat risk prediction, real-time air quality, and actionable insights for a healthier, safer tomorrow.
            </p>
          </div>

          {/* 5 Feature Highlight Badges Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
            
            {/* Feature 1 */}
            <div className="bg-white/85 backdrop-blur-sm p-3.5 rounded-2xl border border-[#d2e2d6] shadow-2xs hover:shadow-card hover:border-[#aed0b7] transition-all flex flex-col items-center text-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-[#eaf4ec] text-[#1b4d3e] group-hover:bg-[#1b4d3e] group-hover:text-white transition-colors flex items-center justify-center">
                <Thermometer className="w-5 h-5" />
              </div>
              <span className="text-[12px] font-semibold text-[#143d2b] leading-[1.3]">
                Heat Risk Prediction
              </span>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/85 backdrop-blur-sm p-3.5 rounded-2xl border border-[#d2e2d6] shadow-2xs hover:shadow-card hover:border-[#aed0b7] transition-all flex flex-col items-center text-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-[#eaf4ec] text-[#1b4d3e] group-hover:bg-[#1b4d3e] group-hover:text-white transition-colors flex items-center justify-center">
                <Wind className="w-5 h-5" />
              </div>
              <span className="text-[12px] font-semibold text-[#143d2b] leading-[1.3]">
                Air Quality Monitoring
              </span>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/85 backdrop-blur-sm p-3.5 rounded-2xl border border-[#d2e2d6] shadow-2xs hover:shadow-card hover:border-[#aed0b7] transition-all flex flex-col items-center text-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-[#eaf4ec] text-[#1b4d3e] group-hover:bg-[#1b4d3e] group-hover:text-white transition-colors flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-[12px] font-semibold text-[#143d2b] leading-[1.3]">
                Hyper-Local Risk Mapping
              </span>
            </div>

            {/* Feature 4 */}
            <div className="bg-white/85 backdrop-blur-sm p-3.5 rounded-2xl border border-[#d2e2d6] shadow-2xs hover:shadow-card hover:border-[#aed0b7] transition-all flex flex-col items-center text-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-[#eaf4ec] text-[#1b4d3e] group-hover:bg-[#1b4d3e] group-hover:text-white transition-colors flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-[12px] font-semibold text-[#143d2b] leading-[1.3]">
                Vulnerable Communities
              </span>
            </div>

            {/* Feature 5 */}
            <div className="bg-white/85 backdrop-blur-sm p-3.5 rounded-2xl border border-[#d2e2d6] shadow-2xs hover:shadow-card hover:border-[#aed0b7] transition-all flex flex-col items-center text-center gap-2 group col-span-2 sm:col-span-1">
              <div className="w-10 h-10 rounded-xl bg-[#eaf4ec] text-[#1b4d3e] group-hover:bg-[#1b4d3e] group-hover:text-white transition-colors flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-[12px] font-semibold text-[#143d2b] leading-[1.3]">
                Actionable Alerts
              </span>
            </div>

          </div>

          {/* Inspirational Tagline using Space Grotesk */}
          <div className="pt-4">
            <p className="font-display text-2xl sm:text-3xl text-[#184d34] font-medium italic drop-shadow-xs select-none">
              "A safer, healthier future is possible."
            </p>
          </div>

        </div>

        {/* Right Glassmorphic Card (Sign In & Register) */}
        <div className="lg:col-span-5 w-full max-w-md mx-auto">
          
          <div className="bg-white/95 backdrop-blur-xl rounded-[28px] border border-white/80 shadow-[0_20px_50px_rgba(20,61,43,0.15)] p-7 sm:p-9 transition-all">
            
            {/* Form Title & Subtitle */}
            <div className="mb-6">
              <h3 className="font-display text-[28px] sm:text-[30px] font-semibold text-[#113826] tracking-tight">
                {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
              </h3>
              <p className="font-sans text-[13px] text-[#527463] mt-1 font-normal">
                {mode === 'signin' 
                  ? 'Sign in to your SUNSHIELD command account' 
                  : 'Join SUNSHIELD Heat & Climate Health Intelligence Platform'}
              </p>
            </div>

            {/* Error & Success Alert Banners */}
            {errorMessage && (
              <div className="mb-4 p-3.5 bg-[#fee2e2] border border-[#f87171] text-[13px] font-semibold text-[#b91c1c] rounded-xl flex items-center gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#dc2626]" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3.5 bg-[#eaf4ec] border border-[#bfe0ca] text-[13px] font-semibold text-[#1b4d3e] rounded-xl flex items-center gap-2.5 animate-in fade-in">
                <Check className="w-4 h-4 shrink-0 text-[#236c43]" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* 1. Sign In Form Mode */}
            {mode === 'signin' ? (
              <form onSubmit={handleSignIn} className="space-y-4 font-sans">
                
                {/* Email Address */}
                <div>
                  <label className="block text-[13px] font-medium text-[#1b4d3e] mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#718f80]">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full bg-[#fbfdfb] border border-[#d2e2d6] focus:border-[#236c43] focus:ring-2 focus:ring-[#236c43]/15 rounded-xl pl-10 pr-4 py-2.5 text-[14px] font-normal text-[#143d2b] placeholder:text-[13px] placeholder-[#8ca497] outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-[13px] font-medium text-[#1b4d3e] mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#718f80]">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full bg-[#fbfdfb] border border-[#d2e2d6] focus:border-[#236c43] focus:ring-2 focus:ring-[#236c43]/15 rounded-xl pl-10 pr-10 py-2.5 text-[14px] font-normal text-[#143d2b] placeholder:text-[13px] placeholder-[#8ca497] outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#718f80] hover:text-[#1b4d3e] transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-[#5f7e6f]" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between pt-0.5 text-[12px]">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="w-4 h-4 accent-[#1b4d3e] rounded"
                    />
                    <span className="font-normal text-[#2b4b3b] text-[12px]">Remember me</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-[12px] font-medium text-[#5a7c6c] hover:text-[#1b4d3e] transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Sign In Primary CTA Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#1b4d3e] hover:bg-[#143d2b] active:scale-[0.99] text-white py-3 px-4 rounded-xl text-[14px] font-semibold flex items-center justify-center gap-2 shadow-md shadow-[#1b4d3e]/20 transition-all cursor-pointer disabled:opacity-70 mt-2"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-[#e2ece5]" />
                  <span className="flex-shrink mx-3 text-[11px] font-medium text-[#799889]">or</span>
                  <div className="flex-grow border-t border-[#e2ece5]" />
                </div>

                {/* Continue with Google */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full bg-white hover:bg-[#f8faf8] border border-[#d2e2d6] text-[#2a4537] py-2.5 px-4 rounded-xl text-[13px] font-medium flex items-center justify-center gap-2.5 shadow-2xs hover:border-[#b8d6c0] transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Continue with Google</span>
                </button>

                {/* 1-Click Quick Demo Switcher */}
                <div className="pt-2.5 border-t border-[#edf4ee]">
                  <p className="text-[11px] font-semibold text-[#718f80] uppercase tracking-wider mb-2 text-center">
                    Quick Demo Credentials
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-[12px]">
                    <button
                      type="button"
                      onClick={() => handleQuickDemo('officer@sahayya.ai', 'sahayya123')}
                      className="p-2 bg-[#f0f7f2] hover:bg-[#e2f0e6] border border-[#d2e6d8] rounded-xl font-semibold text-[#1b4d3e] text-center transition-colors cursor-pointer"
                    >
                      Disaster HQ
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickDemo('ward@sahayya.ai', 'sahayya123')}
                      className="p-2 bg-[#f0f7f2] hover:bg-[#e2f0e6] border border-[#d2e6d8] rounded-xl font-semibold text-[#1b4d3e] text-center transition-colors cursor-pointer"
                    >
                      Ward Officer
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickDemo('citizen@sahayya.ai', 'sahayya123')}
                      className="p-2 bg-[#f0f7f2] hover:bg-[#e2f0e6] border border-[#d2e6d8] rounded-xl font-semibold text-[#1b4d3e] text-center transition-colors cursor-pointer"
                    >
                      Citizen User
                    </button>
                  </div>
                </div>

                {/* Switch to Register */}
                <div className="text-center pt-2">
                  <p className="text-[13px] text-[#527463]">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('register');
                        setErrorMessage(null);
                        setSuccessMessage(null);
                      }}
                      className="font-semibold text-[#1b4d3e] hover:underline cursor-pointer"
                    >
                      Register
                    </button>
                    {' • '}
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-[#236c43] font-medium hover:underline cursor-pointer"
                    >
                      Contact admin
                    </button>
                  </p>
                </div>

              </form>
            ) : (
              /* 2. Register Form Mode */
              <form onSubmit={handleRegister} className="space-y-3.5 animate-in fade-in font-sans">
                
                {/* Full Name */}
                <div>
                  <label className="block text-[13px] font-medium text-[#1b4d3e] mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#718f80]">
                      <UserIcon className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={e => setRegName(e.target.value)}
                      placeholder="e.g. Officer Vikram Rao"
                      className="w-full bg-[#fbfdfb] border border-[#d2e2d6] focus:border-[#236c43] rounded-xl pl-9 pr-3 py-2 text-[14px] font-normal text-[#143d2b] placeholder:text-[13px] placeholder-[#8ca497] outline-none"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-[13px] font-medium text-[#1b4d3e] mb-1">
                    Official Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#718f80]">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={e => setRegEmail(e.target.value)}
                      placeholder="name@organization.gov.in"
                      className="w-full bg-[#fbfdfb] border border-[#d2e2d6] focus:border-[#236c43] rounded-xl pl-9 pr-3 py-2 text-[14px] font-normal text-[#143d2b] placeholder:text-[13px] placeholder-[#8ca497] outline-none"
                    />
                  </div>
                </div>

                {/* Operational Role & Jurisdiction Grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[12px] font-medium text-[#1b4d3e] mb-1">
                      Platform Role
                    </label>
                    <select
                      value={regRole}
                      onChange={e => setRegRole(e.target.value)}
                      className="w-full bg-[#fbfdfb] border border-[#d2e2d6] rounded-xl px-2.5 py-2 text-[13px] font-semibold text-[#143d2b] outline-none"
                    >
                      <option value="Disaster Management Officer">Disaster Officer</option>
                      <option value="Municipal Ward Officer">Ward Officer</option>
                      <option value="Healthcare / First Responder">First Responder</option>
                      <option value="Citizen Observer">Citizen Observer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium text-[#1b4d3e] mb-1">
                      Jurisdiction Ward
                    </label>
                    <select
                      value={regWard}
                      onChange={e => setRegWard(e.target.value)}
                      className="w-full bg-[#fbfdfb] border border-[#d2e2d6] rounded-xl px-2.5 py-2 text-[13px] font-semibold text-[#143d2b] outline-none"
                    >
                      <option value="Central Pune">Central Pune</option>
                      <option value="Shivajinagar">Shivajinagar</option>
                      <option value="Kothrud">Kothrud</option>
                      <option value="Hadapsar">Hadapsar</option>
                      <option value="Katraj-Bibwewadi">Katraj-Bibwewadi</option>
                    </select>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-[13px] font-medium text-[#1b4d3e] mb-1">
                    Password (min 6 characters)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#718f80]">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                      placeholder="Create secure password"
                      className="w-full bg-[#fbfdfb] border border-[#d2e2d6] focus:border-[#236c43] rounded-xl pl-9 pr-9 py-2 text-[14px] font-normal text-[#143d2b] placeholder:text-[13px] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#718f80] hover:text-[#1b4d3e] cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-[13px] font-medium text-[#1b4d3e] mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#718f80]">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={regConfirmPassword}
                      onChange={e => setRegConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full bg-[#fbfdfb] border border-[#d2e2d6] focus:border-[#236c43] rounded-xl pl-9 pr-9 py-2 text-[14px] font-normal text-[#143d2b] placeholder:text-[13px] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#718f80] hover:text-[#1b4d3e] cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Terms Agreement */}
                <div className="pt-1">
                  <label className="flex items-start gap-2 cursor-pointer select-none text-[12px] text-[#2b4b3b]">
                    <input
                      type="checkbox"
                      checked={regAgreeTerms}
                      onChange={e => setRegAgreeTerms(e.target.checked)}
                      className="w-4 h-4 accent-[#1b4d3e] rounded mt-0.5"
                    />
                    <span>I agree to Municipal Heat Action Protocols and emergency data dissemination terms.</span>
                  </label>
                </div>

                {/* Create Account CTA Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#1b4d3e] hover:bg-[#143d2b] text-white py-3 px-4 rounded-xl text-[14px] font-semibold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-70 mt-1"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Switch to Sign In */}
                <div className="text-center pt-2">
                  <p className="text-xs text-[#527463]">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signin');
                        setErrorMessage(null);
                        setSuccessMessage(null);
                      }}
                      className="font-bold text-[#1b4d3e] hover:underline cursor-pointer"
                    >
                      Sign In
                    </button>
                  </p>
                </div>

              </form>
            )}

          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#4d705f] font-medium z-10 border-t border-black/5">
        <p>© 2026 SUNSHIELD — Heat & Climate Health Intelligence System</p>
        <div className="flex items-center gap-4 mt-2 sm:mt-0">
          <span>NDMA CAP v1.2 Compliant</span>
          <span>•</span>
          <span>IMD / WMO Biomet Standard</span>
          <span>•</span>
          <span>Smart Cities Mission</span>
        </div>
      </footer>

      {/* Forgot Password Modal Dialog */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#d6e5da] max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#edf4ee] pb-3">
              <h4 className="text-base font-bold text-[#143d2b] flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#236c43]" /> Reset Account Password
              </h4>
              <button
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotMessage(null);
                }}
                className="text-[#718f80] hover:text-[#143d2b] p-1 rounded-lg hover:bg-[#edf4ee]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#527463]">
              Enter your registered official email address to receive password reset instructions and a secure one-time verification token.
            </p>

            {forgotMessage && (
              <div className="p-3 bg-[#eaf4ec] border border-[#bfe0ca] text-xs font-bold text-[#1b4d3e] rounded-xl flex items-center gap-2">
                <Check className="w-4 h-4 text-[#236c43] shrink-0" />
                <span>{forgotMessage}</span>
              </div>
            )}

            <form onSubmit={handleForgotSubmit} className="space-y-3">
              <input
                type="email"
                required
                value={forgotEmail}
                onChange={e => setForgotEmail(e.target.value)}
                placeholder="Enter your registered email"
                className="w-full bg-[#fbfdfb] border border-[#d2e2d6] rounded-xl px-3 py-2 text-xs font-semibold text-[#143d2b] outline-none"
              />

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 bg-[#1b4d3e] hover:bg-[#143d2b] text-white py-2 rounded-xl text-xs font-bold shadow-xs transition-all"
                >
                  Send Reset Link
                </button>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-3 py-2 bg-[#f4f7f4] hover:bg-[#e5ece6] text-[#2a4537] rounded-xl text-xs font-bold transition-all"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
