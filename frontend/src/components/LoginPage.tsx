import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Mail, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (user: { name: string; isGuest: boolean; email: string | null }) => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [emailInput, setEmailInput] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [nameInput, setNameInput] = useState('');

  const handleGuestLogin = () => {
    onLoginSuccess({
      name: "Siddharth Sharma",
      isGuest: true,
      email: null
    });
  };

  const handleGoogleLogin = () => {
    onLoginSuccess({
      name: "Ananya Mehta",
      isGuest: false,
      email: "ananya.mehta@gmail.com"
    });
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    const extractedName = nameInput.trim() || emailInput.split('@')[0];
    onLoginSuccess({
      name: extractedName,
      isGuest: false,
      email: emailInput
    });
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden" id="login-container">
      {/* Background Decorative Ambient Radial Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#D4AF37]/10 blur-[130px] pointer-events-none"></div>
      <div className="absolute -bottom-20 left-10 w-[400px] h-[400px] rounded-full bg-[#B76E79]/5 blur-[100px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Block: Interactive Premium Login Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 bg-white border border-[#E8E3DC] rounded-3xl p-8 sm:p-10 shadow-xl shadow-zinc-200/40"
          >
            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-8">
              <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-[#B76E79] text-white font-serif font-bold text-lg shadow-sm">
                L
              </div>
              <div>
                <span className="font-serif text-lg font-bold tracking-tight text-[#1F1F1F] block leading-none">
                  Luxora AI
                </span>
                <span className="text-[9px] font-mono tracking-widest text-[#D4AF37] block uppercase font-medium mt-0.5">
                  PREMIUM ADVISOR
                </span>
              </div>
            </div>

            {/* Typography Heading & Subheading */}
            <div className="space-y-3 mb-8">
              <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[#1F1F1F] leading-tight">
                India's Smartest AI Shopping Advisor
              </h1>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Describe your desired look, budget, or specifications and find the perfect product with customized AI-powered recommendations instantly.
              </p>
            </div>

            <div className="space-y-3">
              {/* Google Social Single Click */}
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-[#E8E3DC] rounded-xl text-xs font-semibold text-[#1F1F1F] bg-white hover:bg-zinc-50 hover:border-[#B76E79] transition-all active:scale-[0.98]"
                id="btn-google-login"
              >
                {/* Embedded SVG Google Icon */}
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.54 14.98 1 12 1 7.35 1 3.37 3.65 1.39 7.5l3.85 2.99c.92-2.75 3.48-4.45 6.76-4.45z"/>
                  <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.42 3.57v2.96h3.91c2.28-2.1 3.54-5.19 3.54-8.68z"/>
                  <path fill="#FBBC05" d="M5.24 10.49c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29L1.39 2.92C.5 4.7 0 6.69 0 8.8s.5 4.1 1.39 5.88l3.85-2.99z"/>
                  <path fill="#34A853" d="M12 17.51c3.24 0 5.97-1.07 7.96-2.91l-3.91-2.96c-1.11.75-2.53 1.2-4.05 1.2-3.28 0-5.84-2.18-6.76-4.93L1.39 10.9c1.98 3.85 5.96 6.5 10.61 6.5z"/>
                </svg>
                Continue with Google
              </button>

              {/* Email Login Flow Toggle */}
              {!showEmailForm ? (
                <button
                  onClick={() => setShowEmailForm(true)}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-[#E8E3DC] rounded-xl text-xs font-semibold text-[#1F1F1F] bg-white hover:bg-zinc-50 hover:border-[#B76E79] transition-all active:scale-[0.98]"
                  id="btn-email-flow-toggle"
                >
                  <Mail className="h-4 w-4 text-zinc-400" />
                  Continue with Email
                </button>
              ) : (
                <motion.form 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  onSubmit={handleEmailSubmit}
                  className="space-y-2 border border-[#E8E3DC] rounded-xl p-4 bg-zinc-50/50"
                  id="email-login-form"
                >
                  <span className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase font-semibold block">Email Authentication</span>
                  <div>
                    <input
                      type="text"
                      placeholder="Your Name (optional)"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#E8E3DC] rounded-lg text-xs focus:ring-1 focus:ring-[#B76E79] focus:outline-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      required
                      placeholder="name@domain.com"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="flex-1 px-3 py-2 bg-white border border-[#E8E3DC] rounded-lg text-xs focus:ring-1 focus:ring-[#B76E79] focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#B76E79] text-white rounded-lg text-xs font-semibold hover:bg-[#a35d68] active:scale-[0.96] transition-transform flex items-center gap-1"
                    >
                      Go <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setShowEmailForm(false)} 
                    className="text-[10px] text-zinc-400 hover:text-zinc-600"
                  >
                    Cancel
                  </button>
                </motion.form>
              )}

              {/* Guest Authentication */}
              <button
                onClick={handleGuestLogin}
                className="w-full flex items-center justify-center px-4 py-3 border border-[#B76E79] bg-[#B76E79] text-white hover:bg-[#a35d68] rounded-xl text-xs font-semibold shadow-md active:scale-[0.98] transition-transform hover:shadow-lg hover:shadow-[#B76E79]/10"
                id="btn-guest-login"
              >
                Continue as Guest
              </button>
            </div>

            {/* Footer markers */}
            <div className="mt-8 pt-6 border-t border-[#E8E3DC] flex items-center justify-between text-[11px] text-zinc-400 font-mono">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-[#D4AF37]" />
                SECURE SANDBOX
              </span>
              <span className="uppercase text-[#D4AF37] font-bold">INR STORE DEFAULT</span>
            </div>
          </motion.div>

          {/* Right Block: Elegant, Editorial Modern Hero Section */}
          <div className="lg:col-span-7 h-full flex flex-col justify-center pl-0 lg:pl-8">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6 text-left"
            >
              {/* Gold luxury tag */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#E8E3DC] bg-white">
                <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37] animate-pulse"></span>
                <span className="text-[10px] font-semibold text-zinc-600 tracking-wider font-mono uppercase">
                  Exclusively for Indian Shoppers
                </span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-[#1F1F1F] leading-[1.10]">
                Shop in <span className="underline decoration-[#D4AF37] decoration-wavy underline-offset-8">Natural Language</span>. Let AI Do the Rest.
              </h2>
              
              <p className="text-zinc-500 text-sm sm:text-base max-w-xl leading-relaxed">
                No complex filters, endless matching pages, or sponsored listing clutter. Just type exactly what you want like you’re speaking with a luxury personal shopper.
              </p>

              {/* Luxury feature metrics */}
              <div className="grid grid-cols-3 gap-6 pt-4 border-t border-[#E8E3DC] max-w-lg font-sans">
                <div>
                  <span className="block text-xl sm:text-2xl font-serif font-bold text-[#1F1F1F]">0%</span>
                  <span className="block text-[10px] font-mono tracking-wider text-zinc-400 uppercase mt-1">sponsored ads</span>
                </div>
                <div>
                   <span className="block text-xl sm:text-2xl font-serif font-bold text-[#1F1F1F]">₹ INR</span>
                  <span className="block text-[10px] font-mono tracking-wider text-zinc-400 uppercase mt-1">localized prices</span>
                </div>
                <div>
                  <span className="block text-xl sm:text-2xl font-serif font-bold text-[#1F1F1F]">Instant</span>
                  <span className="block text-[10px] font-mono tracking-wider text-zinc-400 uppercase mt-1">match score mapping</span>
                </div>
              </div>

              {/* Float Card Preview */}
              <div className="pt-6 relative">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#D4AF37]/30 to-[#D4AF37]/10 opacity-20 blur-xl"></div>
                <div className="relative bg-white border border-[#E8E3DC] rounded-xl p-5 shadow-lg max-w-md">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] font-bold uppercase block">AI HIGHLIGHT RECOMMENDATION</span>
                      <h4 className="text-xs font-bold text-[#1F1F1F] mt-1">MacBook Air M3 [Indian Spec]</h4>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-zinc-900 text-[#D4AF37] font-mono text-[9px] font-semibold">98% MATCH</span>
                  </div>
                  <p className="text-zinc-500 text-[11px] leading-relaxed italic">
                    "Fitted with robust native thermal throttling protection to combat peak North/South Indian summer room heat, paired inside a silent fanless framework. Perfect for Indian tech students."
                  </p>
                  <div className="mt-3 flex items-center justify-between border-t border-zinc-50 pt-2.5">
                    <span className="text-xs font-bold text-[#1F1F1F] font-mono">₹94,900</span>
                    <span className="text-[9px] font-mono text-emerald-600 font-semibold flex items-center gap-1">✨ Best Value Engineering</span>
                  </div>
                </div>
              </div>

            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
