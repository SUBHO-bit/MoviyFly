/**
 * Local Storage Manager
 * Stores and retrieves streaming preferences.
 */

const PREFERRED_SERVER_KEY = 'moviyfly-preferred-server';

export const LocalStorageManager = {
  getPreferredServer(defaultServer: string = 'server-a'): string {
    try {
      const saved = localStorage.getItem(PREFERRED_SERVER_KEY);
      return saved || defaultServer;
    } catch (e) {
      console.error('Failed to retrieve preferred server:', e);
      return defaultServer;
    }
  },

  setPreferredServer(serverId: string): void {
    try {
      localStorage.setItem(PREFERRED_SERVER_KEY, serverId);
    } catch (e) {
      console.error('Failed to save preferred server:', e);
    }
  },
};
