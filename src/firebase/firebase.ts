/// <reference types="vite/client" />

import { initializeApp, FirebaseApp } from 'firebase/app';


// Define the required environment variables list for validation
const REQUIRED_ENV_VARS = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
] as const;

/**
 * Validates that all required environment variables are set and non-empty.
 * Throws a developer-friendly error message if any variables are missing.
 */
function validateFirebaseConfig(): Record<string, string> {
  const missing: string[] = [];
  const configValues: Record<string, string> = {};

  for (const envKey of REQUIRED_ENV_VARS) {
    const value = import.meta.env[envKey];
    if (!value || typeof value !== 'string' || value.trim() === '') {
      missing.push(envKey);
    } else {
      configValues[envKey] = value;
    }
  }

  if (missing.length > 0) {
    const errorMsg = 
      `[Firebase Config Validation Error]: Missing required environment configuration.\n` +
      `The following variables are not defined or empty in your environment:\n` +
      missing.map((key) => `  - ${key}`).join('\n') +
      `\n\nPlease check your .env/environment configuration and ensure all parameters are correctly specified.`;
    
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  return configValues;
}

// Run validation at module-load time
const validatedConfig = validateFirebaseConfig();

// Map validated values to the standard Firebase options shape
const firebaseConfig = {
  apiKey: validatedConfig.VITE_FIREBASE_API_KEY,
  authDomain: validatedConfig.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: validatedConfig.VITE_FIREBASE_PROJECT_ID,
  storageBucket: validatedConfig.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: validatedConfig.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: validatedConfig.VITE_FIREBASE_APP_ID,
};

let app: FirebaseApp;

try {
  // Initialize the Firebase client App singleton instance
  app = initializeApp(firebaseConfig);
  console.log('[Firebase] Client App has been successfully initialized.');
} catch (error) {
  const initErrorMsg = `[Firebase] Initialization failed: ${error instanceof Error ? error.message : String(error)}`;
  console.error(initErrorMsg);
  throw new Error(initErrorMsg);
}

// Export the initialized Firebase App instance
export { app };
