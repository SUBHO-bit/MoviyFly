/// <reference types="vite/client" />

import { getAuth, browserLocalPersistence } from 'firebase/auth';
import { app } from './firebase';

export const auth = getAuth(app);

export { browserLocalPersistence };
