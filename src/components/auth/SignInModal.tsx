/// <reference types="vite/client" />

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Eye, EyeOff, Lock, Mail, ShieldCheck, AlertCircle } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/auth';
import { userService } from '../../services/userService';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export interface SignInFormData {
  email: string;
  password?: string;
}

export interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignUpRedirect?: () => void;
  isLoading?: boolean;
  onSubmit?: (data: SignInFormData) => void;
  className?: string;
}

export const SignInModal: React.FC<SignInModalProps> = ({
  isOpen,
  onClose,
  onSignUpRedirect,
  isLoading = false,
  onSubmit,
  className,
}) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [rememberMe, setRememberMe] = React.useState(false);
  const [localLoading, setLocalLoading] = React.useState(false);

  const isFormSubmitting = isLoading || localLoading;

  // Show/Hide password states
  const [showPassword, setShowPassword] = React.useState(false);

  // Form local errors
  const [formError, setFormError] = React.useState<string | null>(null);

  // Refs for accessibility focus trap
  const modalRef = React.useRef<HTMLDivElement>(null);
  const firstInputRef = React.useRef<HTMLInputElement>(null);
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);

  // Reset state when opening/closing
  React.useEffect(() => {
    if (isOpen) {
      setEmail('');
      setPassword('');
      setRememberMe(false);
      setShowPassword(false);
      setFormError(null);
      
      // Auto-focus on the first field with a slight delay for animation smoothness
      setTimeout(() => {
        firstInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Prevent background scrolling when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Listen to Escape key to close modal
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Handle focus trapping
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab' || !modalRef.current) return;

    const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Basic Validations
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setFormError('Password is required.');
      return;
    }

    try {
      setLocalLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('[SignInModal] Successfully signed in user:', userCredential.user.email);
      
      if (onSubmit) {
        onSubmit({
          email,
          password,
        });
      }
      onClose();
    } catch (error: any) {
      console.error('[SignInModal] Firebase Auth sign-in error:', error);
      const errorCode = error?.code;
      let friendlyMessage = 'An unexpected error occurred. Please try again.';

      if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password' || errorCode === 'auth/invalid-credential') {
        friendlyMessage = 'Invalid email or password. Please double check your credentials and try again.';
      } else if (errorCode === 'auth/invalid-email') {
        friendlyMessage = 'The email address provided is invalid.';
      } else if (errorCode === 'auth/user-disabled') {
        friendlyMessage = 'This account has been disabled.';
      } else if (errorCode === 'auth/network-request-failed') {
        friendlyMessage = 'Network error. Please check your internet connection.';
      } else {
        friendlyMessage = error?.message || friendlyMessage;
      }
      setFormError(friendlyMessage);
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="signin-modal-title"
          aria-describedby="signin-modal-desc"
          onKeyDown={handleKeyDown}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
        >
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#06060A]/85 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className={cn(
              'relative w-full max-w-md bg-[#13131A] border border-white/[0.06] rounded-2xl shadow-2xl p-6 md:p-8 overflow-hidden z-10 flex flex-col',
              className
            )}
          >
            {/* Dynamic visual ambient glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

            {/* Close Button */}
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl text-[#B3B3B8] hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer outline-none focus:ring-1 focus:ring-white/20"
              aria-label="Close modal dialog"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>

            {/* Header */}
            <div className="mb-6">
              <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 text-[#8B5CF6] mb-3">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h2 id="signin-modal-title" className="text-xl font-bold text-white tracking-tight leading-none">
                Sign In
              </h2>
              <p id="signin-modal-desc" className="text-xs text-[#B3B3B8] mt-2 leading-relaxed">
                Log in to MoviyFly to access your personal watchlist, resume playback, and sync history.
              </p>
            </div>

            {/* Alert Error Box */}
            {formError && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg flex items-start gap-2 text-xs text-[#EF4444]"
              >
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{formError}</span>
              </motion.div>
            )}

            {/* SignIn Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <Input
                ref={firstInputRef}
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="h-4 w-4" />}
                required
                disabled={isFormSubmitting}
                aria-required="true"
              />

              {/* Password Input */}
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="h-4 w-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#B3B3B8] hover:text-white transition-colors p-1 rounded-md cursor-pointer outline-none focus:ring-1 focus:ring-white/10"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
                required
                disabled={isFormSubmitting}
                aria-required="true"
              />

              {/* Remember Me */}
              <div className="flex items-center justify-start pt-1">
                <div className="flex items-center gap-2">
                  <input
                    id="signin-remember"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isFormSubmitting}
                    className="h-4.5 w-4.5 rounded-md border border-white/10 bg-[#1A1A22] text-[#8B5CF6] focus:ring-2 focus:ring-primary/20 accent-[#8B5CF6] cursor-pointer"
                  />
                  <label htmlFor="signin-remember" className="text-caption text-[#B3B3B8] leading-none select-none cursor-pointer">
                    Remember me
                  </label>
                </div>
              </div>

              {/* Submit Action */}
              <Button
                type="submit"
                className="w-full h-11 text-xs font-bold bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] hover:from-[#7C3AED] hover:to-[#9333EA]"
                isLoading={isFormSubmitting}
              >
                Sign In
              </Button>
            </form>


            {/* Don't have an account? Sign Up */}
            <div className="mt-5 text-center">
              <p className="text-xs text-[#B3B3B8]">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onSignUpRedirect) {
                      onSignUpRedirect();
                    } else {
                      alert('Redirect to Sign Up');
                    }
                  }}
                  className="text-[#8B5CF6] hover:text-[#A855F7] font-bold cursor-pointer hover:underline outline-none focus:underline"
                >
                  Sign Up
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
