/// <reference types="vite/client" />

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Eye, EyeOff, Lock, Mail, User, ShieldCheck, Check, AlertCircle } from 'lucide-react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../firebase/auth';
import { userService, validateUsername } from '../../services/userService';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export interface SignUpFormData {
  username: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  termsAccepted: boolean;
}

export interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignInRedirect?: () => void;
  isLoading?: boolean;
  onSubmit?: (data: SignUpFormData) => void;
  className?: string;
}

export const SignUpModal: React.FC<SignUpModalProps> = ({
  isOpen,
  onClose,
  onSignInRedirect,
  isLoading = false,
  onSubmit,
  className,
}) => {
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [termsAccepted, setTermsAccepted] = React.useState(false);
  const [localLoading, setLocalLoading] = React.useState(false);

  const [usernameStatus, setUsernameStatus] = React.useState<'idle' | 'validating' | 'available' | 'taken' | 'invalid'>('idle');
  const [usernameMessage, setUsernameMessage] = React.useState<string | null>(null);

  const isPending = isLoading || localLoading;

  // Show/Hide password states
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  // Form local errors
  const [formError, setFormError] = React.useState<string | null>(null);

  // Refs for accessibility focus trap
  const modalRef = React.useRef<HTMLDivElement>(null);
  const firstInputRef = React.useRef<HTMLInputElement>(null);
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);

  // Reset state when opening/closing
  React.useEffect(() => {
    if (isOpen) {
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setTermsAccepted(false);
      setShowPassword(false);
      setShowConfirmPassword(false);
      setFormError(null);
      setUsernameStatus('idle');
      setUsernameMessage(null);
      
      // Auto-focus on the first field with a slight delay for animation smoothness
      setTimeout(() => {
        firstInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Live username check with 500ms debouncing and local/remote validation
  React.useEffect(() => {
    const trimmed = username.trim();
    if (!trimmed) {
      setUsernameStatus('idle');
      setUsernameMessage(null);
      return;
    }

    // 1. Immediate local validation rules
    const validation = validateUsername(trimmed);
    if (!validation.isValid) {
      setUsernameStatus('invalid');
      setUsernameMessage(validation.error);
      return;
    }

    setUsernameStatus('validating');
    setUsernameMessage('Checking availability...');

    const timer = setTimeout(async () => {
      try {
        const result = await userService.checkUsernameAvailability(trimmed);
        if (result.available) {
          setUsernameStatus('available');
          setUsernameMessage('✔ Username available');
        } else {
          setUsernameStatus('taken');
          setUsernameMessage('✖ Username already taken');
        }
      } catch (err: any) {
        console.error('[SignUpModal] Live check failed:', err);
        if (err && typeof err === 'object') {
          console.error('[SignUpModal] Complete error object:', err);
          console.error('[SignUpModal] Error Code:', err.code);
          console.error('[SignUpModal] Error Message:', err.message);
          console.error('[SignUpModal] Error Stack:', err.stack);
        }
        setUsernameStatus('invalid');
        setUsernameMessage(`Could not verify username: ${err?.message || String(err)}`);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [username]);

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

  // Password strength logic
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: 'None', color: 'bg-white/10', textColor: 'text-text-muted' };
    
    let currentScore = 0;
    if (pwd.length >= 8) currentScore += 1;
    if (/[a-z]/.test(pwd)) currentScore += 1;
    if (/[A-Z]/.test(pwd)) currentScore += 1;
    if (/[0-9]/.test(pwd)) currentScore += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) currentScore += 1;

    switch (currentScore) {
      case 1:
        return { score: 1, label: 'Weak', color: 'bg-[#EF4444]', textColor: 'text-[#EF4444]' };
      case 2:
      case 3:
        return { score: 3, label: 'Fair', color: 'bg-[#F59E0B]', textColor: 'text-[#F59E0B]' };
      case 4:
        return { score: 4, label: 'Good', color: 'bg-[#A855F7]', textColor: 'text-[#A855F7]' };
      case 5:
        return { score: 5, label: 'Strong', color: 'bg-[#22C55E]', textColor: 'text-[#22C55E]' };
      default:
        return { score: 0, label: 'None', color: 'bg-white/10', textColor: 'text-text-muted' };
    }
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const trimmedUsername = username.trim();

    // Basic Validations
    if (!trimmedUsername) {
      setFormError('Username is required.');
      return;
    }

    // Live validation rule check
    const validation = validateUsername(trimmedUsername);
    if (!validation.isValid) {
      setFormError(validation.error);
      return;
    }

    // Pre-emptively reject if live check showed taken or invalid
    if (usernameStatus === 'taken' || usernameStatus === 'invalid') {
      setFormError(usernameMessage || 'Username is invalid or already taken.');
      return;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError('Please enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      setFormError('Password must be at least 8 characters long.');
      return;
    }

    // Strict password strength validation checks
    if (!/[A-Z]/.test(password)) {
      setFormError('Password must contain at least one uppercase letter (A-Z).');
      return;
    }
    if (!/[a-z]/.test(password)) {
      setFormError('Password must contain at least one lowercase letter (a-z).');
      return;
    }
    if (!/[0-9]/.test(password)) {
      setFormError('Password must contain at least one number (0-9).');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }
    if (!termsAccepted) {
      setFormError('You must accept the Terms of Service & Privacy Policy.');
      return;
    }

    try {
      setLocalLoading(true);

      // Final non-debounced check to eliminate race conditions before initiating Auth signup
      const checkResult = await userService.checkUsernameAvailability(trimmedUsername);
      if (!checkResult.available) {
        setFormError('Username is already taken.');
        setUsernameStatus('taken');
        setUsernameMessage('✖ Username already taken');
        setLocalLoading(false);
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      try {
        await updateProfile(userCredential.user, { displayName: username.trim() });
      } catch (profileError) {
        console.warn('[SignUpModal] Failed to update user display name profile:', profileError);
      }

      // Automatically create a Firestore user document in the 'users' collection
      try {
        await userService.createOrUpdateUserProfile({
          uid: userCredential.user.uid,
          username: username.trim(),
          email: email.trim(),
          displayName: username.trim(),
          photoURL: userCredential.user.photoURL || '',
          emailVerified: userCredential.user.emailVerified,
        });
      } catch (dbError: any) {
        console.error('[SignUpModal] Safe Firestore profile creation failed. Keeping the Auth account:', dbError);
        setFormError(`Your account was created successfully, but we encountered an issue initializing your profile in our database. [Developer Info: ${dbError?.message || 'Firestore write failed'}]. You can close this modal and try signing in.`);
        setLocalLoading(false);
        return; // Halt and display the database initialization error to the user
      }

      if (onSubmit) {
        onSubmit({
          username,
          email,
          password,
          confirmPassword,
          termsAccepted,
        });
      }

      onClose();
    } catch (error: any) {
      console.error('[SignUpModal] Firebase Auth signup error:', error);
      const errorCode = error?.code;
      let friendlyMessage = 'An unexpected error occurred during registration. Please try again.';

      if (errorCode === 'auth/email-already-in-use') {
        friendlyMessage = 'This email address is already in use by another account.';
      } else if (errorCode === 'auth/weak-password') {
        friendlyMessage = 'The password is too weak. Please choose a stronger password.';
      } else if (errorCode === 'auth/invalid-email') {
        friendlyMessage = 'The email address provided is invalid.';
      } else if (errorCode === 'auth/network-request-failed') {
        friendlyMessage = 'A network error occurred. Please check your internet connection and try again.';
      } else if (error?.message) {
        friendlyMessage = error.message;
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
          aria-labelledby="signup-modal-title"
          aria-describedby="signup-modal-desc"
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
              <h2 id="signup-modal-title" className="text-xl font-bold text-white tracking-tight leading-none">
                Create Account
              </h2>
              <p id="signup-modal-desc" className="text-xs text-[#B3B3B8] mt-2 leading-relaxed">
                Join MoviyFly to sync your watchlist, track history and unlock personalized cinematic recommendations.
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

            {/* SignUp Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Input */}
              <div className="space-y-1">
                <Input
                  ref={firstInputRef}
                  label="Username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  leftIcon={<User className="h-4 w-4" />}
                  required
                  disabled={isPending}
                  aria-required="true"
                />
                {usernameStatus !== 'idle' && (
                  <div
                    className={cn(
                      "text-[10px] font-semibold tracking-wide transition-all duration-200 pl-1",
                      usernameStatus === 'available' && "text-[#22C55E]",
                      usernameStatus === 'taken' && "text-[#EF4444]",
                      usernameStatus === 'invalid' && "text-[#EF4444]",
                      usernameStatus === 'validating' && "text-[#B3B3B8] animate-pulse"
                    )}
                  >
                    {usernameMessage}
                  </div>
                )}
              </div>

              {/* Email Input */}
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="h-4 w-4" />}
                required
                disabled={isPending}
                aria-required="true"
              />

              {/* Password Input */}
              <div className="space-y-2">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 8 characters"
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
                  disabled={isPending}
                  aria-required="true"
                />

                {/* Password Strength Indicator */}
                {password && (
                  <div className="space-y-1.5" aria-live="polite">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-text-muted font-medium">Password Strength:</span>
                      <span className={cn('font-bold', strength.textColor)}>{strength.label}</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden flex gap-0.5">
                      <div
                        className={cn(
                          'h-full transition-all duration-300 rounded-full',
                          strength.color,
                          strength.score >= 1 ? 'w-1/4' : 'w-0'
                        )}
                      />
                      <div
                        className={cn(
                          'h-full transition-all duration-300 rounded-full',
                          strength.color,
                          strength.score >= 3 ? 'w-1/4' : 'w-0'
                        )}
                      />
                      <div
                        className={cn(
                          'h-full transition-all duration-300 rounded-full',
                          strength.color,
                          strength.score >= 4 ? 'w-1/4' : 'w-0'
                        )}
                      />
                      <div
                        className={cn(
                          'h-full transition-all duration-300 rounded-full',
                          strength.color,
                          strength.score >= 5 ? 'w-1/4' : 'w-0'
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Input */}
              <Input
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                leftIcon={<Lock className="h-4 w-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-[#B3B3B8] hover:text-white transition-colors p-1 rounded-md cursor-pointer outline-none focus:ring-1 focus:ring-white/10"
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
                required
                disabled={isPending}
                aria-required="true"
              />

              {/* Terms Checkbox */}
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  id="signup-terms"
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  disabled={isPending}
                  className="mt-0.5 h-4.5 w-4.5 rounded-md border border-white/10 bg-[#1A1A22] text-[#8B5CF6] focus:ring-2 focus:ring-primary/20 accent-[#8B5CF6] cursor-pointer"
                  required
                  aria-required="true"
                />
                <label htmlFor="signup-terms" className="text-caption text-[#B3B3B8] leading-tight select-none cursor-pointer">
                  I agree to the{' '}
                  <a href="#" className="text-[#8B5CF6] hover:underline" onClick={(e) => e.preventDefault()}>
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-[#8B5CF6] hover:underline" onClick={(e) => e.preventDefault()}>
                    Privacy Policy
                  </a>.
                </label>
              </div>

              {/* Submit Action */}
              <Button
                type="submit"
                className="w-full h-11 text-xs font-bold bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] hover:from-[#7C3AED] hover:to-[#9333EA]"
                isLoading={isPending}
              >
                Create Account
              </Button>
            </form>

            {/* Already have an account? Sign In */}
            <div className="mt-5 text-center">
              <p className="text-xs text-[#B3B3B8]">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onSignInRedirect) {
                      onSignInRedirect();
                    } else {
                      alert('Redirect to Sign In');
                    }
                  }}
                  className="text-[#8B5CF6] hover:text-[#A855F7] font-bold cursor-pointer hover:underline outline-none focus:underline"
                >
                  Sign In
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
