import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, X, ShieldAlert, KeyRound } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthorize: () => void;
  theme?: 'light' | 'dark' | 'funky';
}

export default function AdminAuthModal({
  isOpen,
  onClose,
  onAuthorize,
  theme = 'light'
}: AdminAuthModalProps): React.JSX.Element {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Developer access: "dev@morphiq" -> "ZGV2QG1vcnBoaXE="
    // Artist access: "morphiq@2026" -> "bW9ycGhpcUAyMDI2"
    const encoded = btoa(password);
    if (encoded === 'ZGV2QG1vcnBoaXE=' || encoded === 'bW9ycGhpcUAyMDI2') {
      setError(false);
      setPassword('');
      onAuthorize();
    } else {
      setError(true);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className={`relative w-full max-w-sm border p-6 rounded-2xl shadow-xl overflow-hidden ${
              theme === 'dark' ? 'bg-[#0f111e] border-white/10 text-stone-100' :
              theme === 'funky' ? 'bg-[#150d2c] border-purple-900/60 text-purple-100' :
              'bg-white border-stone-200 text-stone-900'
            }`}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-full text-stone-400 hover:text-stone-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col items-center text-center space-y-4">
              {/* Header Icon */}
              <div className={`p-3 rounded-full ${
                theme === 'funky' ? 'bg-fuchsia-500/10 text-fuchsia-400' :
                'bg-amber-100 text-amber-700'
              }`}>
                <KeyRound className="w-6 h-6 animate-pulse" />
              </div>

              {/* Title & Description */}
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-bold tracking-wide uppercase">Admin Authorization</h3>
                <p className="font-sans text-[11px] text-stone-500 max-w-[260px] leading-relaxed">
                  Enter the secure access code to unlock editing features and the registry ledger dashboard.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="w-full space-y-4">
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError(false);
                    }}
                    placeholder="Access Code"
                    autoFocus
                    className={`w-full font-sans text-xs px-4 py-2.5 border rounded-lg focus:outline-hidden transition-all ${
                      error
                        ? 'border-red-500 bg-red-50/10 focus:border-red-650'
                        : theme === 'dark'
                          ? 'bg-black/20 border-white/10 text-stone-100 focus:border-amber-500/50'
                          : 'bg-stone-50 border-stone-200 text-stone-900 focus:border-amber-805'
                    }`}
                  />
                </div>

                {/* Error message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1.5 justify-center text-red-500 font-sans text-[10px] font-semibold"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Invalid access code. Access Denied.</span>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-1/2 px-4 py-2 border rounded-lg font-sans text-xs font-semibold uppercase tracking-wider text-stone-500 hover:bg-stone-100/50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`w-1/2 px-4 py-2 rounded-lg font-sans text-xs font-bold uppercase tracking-wider text-white transition-all shadow-md cursor-pointer ${
                      theme === 'funky' ? 'bg-fuchsia-600 hover:bg-fuchsia-500' :
                      'bg-stone-900 hover:bg-stone-850'
                    }`}
                  >
                    Authorize
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
