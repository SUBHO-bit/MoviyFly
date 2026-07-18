import { doc, getDoc, runTransaction } from 'firebase/firestore';
import { db, serverTimestamp, handleFirestoreError, OperationType } from '../firebase/firestore';

export interface CreateUserProfileInput {
  uid: string;
  username: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  emailVerified?: boolean;
}

export interface UserProfile {
  uid: string;
  username: string;
  displayName: string;
  email: string;
  photoURL: string;
  emailVerified: boolean;
  role: string;
  status: string;
  createdAt: any;
  updatedAt: any;
  lastLogin: any;
}

export const RESERVED_USERNAMES = [
  'admin',
  'administrator',
  'support',
  'help',
  'api',
  'firebase',
  'moviyfly',
  'root',
  'owner',
  'system'
];

/**
 * Validates a username against standard production rules.
 */
export function validateUsername(username: string): { isValid: boolean; error: string | null } {
  const trimmed = username.trim();
  
  if (trimmed.length < 3) {
    return { isValid: false, error: 'Username must be at least 3 characters long.' };
  }
  
  if (trimmed.length > 20) {
    return { isValid: false, error: 'Username must not exceed 20 characters.' };
  }
  
  // Allowed: a-z, A-Z, 0-9, _, .
  const regex = /^[a-zA-Z0-9_.]+$/;
  if (!regex.test(trimmed)) {
    return { 
      isValid: false, 
      error: 'Allowed characters: letters, numbers, underscores, and periods. No spaces, emojis, or special characters.' 
    };
  }
  
  if (RESERVED_USERNAMES.includes(trimmed.toLowerCase())) {
    return { isValid: false, error: 'This username is reserved.' };
  }
  
  return { isValid: true, error: null };
}

/**
 * Service to manage Firestore user profiles in the 'users' collection.
 */
export const userService = {
  /**
   * Checks if a user profile exists in Firestore.
   * @param uid The Firebase Authentication user UID
   */
  async exists(uid: string): Promise<boolean> {
    try {
      const userDocRef = doc(db, 'users', uid);
      const docSnap = await getDoc(userDocRef);
      return docSnap.exists();
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `users/${uid}`);
    }
  },

  /**
   * Check whether a username is available.
   * Validates rules first, then checks the 'usernames' collection and 'users' collection.
   */
  async checkUsernameAvailability(username: string): Promise<{ available: boolean; reason?: string; message?: string }> {
    const trimmed = username.trim();
    const validation = validateUsername(trimmed);
    if (!validation.isValid) {
      return { available: false, reason: 'invalid', message: validation.error || 'Invalid username' };
    }

    const usernameLower = trimmed.toLowerCase();

    try {
      // 1. Direct check in the dedicated 'usernames' collection (highly efficient O(1) read)
      const usernameDocRef = doc(db, 'usernames', usernameLower);
      const usernameSnap = await getDoc(usernameDocRef);
      if (usernameSnap.exists()) {
        return { available: false, reason: 'taken', message: 'Username is already taken.' };
      }

      return { available: true };
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `usernames/${usernameLower}`);
    }
  },

  /**
   * Automatically creates or updates the user profile document in Firestore inside a transaction.
   * If the user already has a profile document, it updates only lastLogin and updatedAt.
   * If a new profile is being created, it checks username availability atomically and claims it.
   * 
   * @param input Profile details from Auth
   */
  async createOrUpdateUserProfile(input: CreateUserProfileInput): Promise<void> {
    const { uid, username, email, displayName = '', photoURL = '', emailVerified = false } = input;
    const userDocRef = doc(db, 'users', uid);
    const usernameLower = username.trim().toLowerCase();
    const usernameDocRef = doc(db, 'usernames', usernameLower);

    try {
      await runTransaction(db, async (transaction) => {
        // 1. Check if user document already exists
        const userSnap = await transaction.get(userDocRef);

        if (userSnap.exists()) {
          console.log(`[userService] User document for UID ${uid} already exists. Updating lastLogin...`);
          transaction.update(userDocRef, {
            lastLogin: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          return;
        }

        // 2. For new users, ensure username is checked inside the transaction to prevent race conditions
        const usernameSnap = await transaction.get(usernameDocRef);
        if (usernameSnap.exists()) {
          throw new Error('Username is already taken.');
        }

        console.log(`[userService] Claiming unique username '${usernameLower}' and creating user profile for UID ${uid}...`);

        // Create username lock/claim
        transaction.set(usernameDocRef, {
          uid,
          createdAt: serverTimestamp(),
        });

        // Create the user profile doc
        transaction.set(userDocRef, {
          uid,
          username: username.trim(),
          displayName: (displayName || username).trim(),
          email: email.trim(),
          photoURL,
          emailVerified,
          role: 'user',
          status: 'active',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
        });
      });
      console.log(`[userService] Successfully completed transaction for user UID ${uid}.`);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${uid}`);
    }
  }
};
