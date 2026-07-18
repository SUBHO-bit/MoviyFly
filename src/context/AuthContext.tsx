/// <reference types="vite/client" />

import * as React from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { onSnapshot, doc } from 'firebase/firestore';
import { auth } from '../firebase/auth';
import { db, handleFirestoreError, OperationType } from '../firebase/firestore';
import { UserProfile } from '../services/userService';

export interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  isSignInOpen: boolean;
  isSignUpOpen: boolean;
  openSignIn: () => void;
  closeSignIn: () => void;
  openSignUp: () => void;
  closeSignUp: () => void;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

// Lazy load modals to optimize performance and prevent circular imports
const SignInModal = React.lazy(() => import('../components/auth/SignInModal').then(module => ({ default: module.SignInModal })));
const SignUpModal = React.lazy(() => import('../components/auth/SignUpModal').then(module => ({ default: module.SignUpModal })));

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [isSignInOpen, setIsSignInOpen] = React.useState<boolean>(false);
  const [isSignUpOpen, setIsSignUpOpen] = React.useState<boolean>(false);

  const openSignIn = React.useCallback(() => {
    setIsSignUpOpen(false);
    setIsSignInOpen(true);
  }, []);

  const closeSignIn = React.useCallback(() => {
    setIsSignInOpen(false);
  }, []);

  const openSignUp = React.useCallback(() => {
    setIsSignInOpen(false);
    setIsSignUpOpen(true);
  }, []);

  const closeSignUp = React.useCallback(() => {
    setIsSignUpOpen(false);
  }, []);

  const logout = React.useCallback(async () => {
    try {
      console.log('[AuthContext] Signing out...');
      await signOut(auth);
      console.log('[AuthContext] Successfully signed out.');
    } catch (error) {
      console.error('[AuthContext] Sign out error:', error);
      throw error;
    }
  }, []);

  // Monitor Firebase Auth state
  React.useEffect(() => {
    console.log('[AuthContext] Setting up onAuthStateChanged listener...');
    
    // Subscribe to onAuthStateChanged to keep session in sync automatically
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setCurrentUser(user);
        // Do not set loading to false here; set it after the profile has been processed/synced
        if (!user) {
          setLoading(false);
        }
        console.log('[AuthContext] Auth state changed. User:', user ? user.email : 'Guest');
      },
      (error) => {
        console.error('[AuthContext] onAuthStateChanged error:', error);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      console.log('[AuthContext] Cleaning up onAuthStateChanged listener...');
      unsubscribe();
    };
  }, []);

  // Sync user profile from Firestore in real-time
  React.useEffect(() => {
    let unsubscribeProfile: (() => void) | null = null;

    if (currentUser) {
      setLoading(true);
      const userDocRef = doc(db, 'users', currentUser.uid);
      
      console.log('[AuthContext] Subscribing to profile document in Firestore for UID:', currentUser.uid);
      unsubscribeProfile = onSnapshot(
        userDocRef,
        (docSnap) => {
          if (docSnap.exists()) {
            console.log('[AuthContext] Real-time profile sync received:', docSnap.data());
            setUserProfile(docSnap.data() as UserProfile);
          } else {
            console.warn('[AuthContext] Profile document not found. Falling back to Auth user data.');
            setUserProfile({
              uid: currentUser.uid,
              username: currentUser.displayName || currentUser.email?.split('@')[0] || 'User',
              displayName: currentUser.displayName || 'User',
              email: currentUser.email || '',
              photoURL: currentUser.photoURL || '',
              emailVerified: currentUser.emailVerified,
              role: 'user',
              status: 'active',
              createdAt: null,
              updatedAt: null,
              lastLogin: null,
            });
          }
          setLoading(false);
        },
        (error) => {
          setLoading(false);
          handleFirestoreError(error, OperationType.GET, `users/${currentUser.uid}`);
        }
      );
    } else {
      setUserProfile(null);
    }

    return () => {
      if (unsubscribeProfile) {
        console.log('[AuthContext] Unsubscribing from profile document.');
        unsubscribeProfile();
      }
    };
  }, [currentUser]);

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    isAuthenticated: !!currentUser,
    isSignInOpen,
    isSignUpOpen,
    openSignIn,
    closeSignIn,
    openSignUp,
    closeSignUp,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      <React.Suspense fallback={null}>
        <SignInModal
          isOpen={isSignInOpen}
          onClose={closeSignIn}
          onSignUpRedirect={openSignUp}
        />
        <SignUpModal
          isOpen={isSignUpOpen}
          onClose={closeSignUp}
          onSignInRedirect={openSignIn}
        />
      </React.Suspense>
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    const errorMsg = '[useAuth] useAuth must be used within an AuthProvider';
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
  return context;
};
