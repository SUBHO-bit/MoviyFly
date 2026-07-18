/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { AuthProvider } from './context/AuthContext';
import { WatchlistProvider } from './context/WatchlistContext';

export default function App() {
  return (
    <AuthProvider>
      <WatchlistProvider>
        <AppLayout />
      </WatchlistProvider>
    </AuthProvider>
  );
}
