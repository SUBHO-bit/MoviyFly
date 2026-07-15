/**
 * Continue Watching Manager
 * Stores and retrieves progress for TV shows from local storage.
 */

export interface TVShowProgress {
  showId: string;
  season: number;
  episode: number;
  updatedAt: number;
}

const STORAGE_KEY = 'moviyfly_tv_watch_progress';

export const ContinueWatchingManager = {
  /**
   * Saves the watch progress for a TV show.
   */
  saveProgress(showId: string, season: number, episode: number): void {
    if (!showId) return;

    try {
      const allProgress = this.getAllProgress();
      const cleanId = showId.replace('tv-', '');

      allProgress[cleanId] = {
        showId: cleanId,
        season,
        episode,
        updatedAt: Date.now(),
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress));
    } catch (e) {
      console.error('Failed to save TV watch progress:', e);
    }
  },

  /**
   * Retrieves the watch progress for a specific TV show.
   */
  getProgress(showId: string): { season: number; episode: number } | null {
    if (!showId) return null;

    try {
      const allProgress = this.getAllProgress();
      const cleanId = showId.replace('tv-', '');
      const progress = allProgress[cleanId];

      if (progress) {
        return {
          season: progress.season,
          episode: progress.episode,
        };
      }
    } catch (e) {
      console.error('Failed to retrieve TV watch progress:', e);
    }

    return null;
  },

  /**
   * Gets all progress records.
   */
  getAllProgress(): Record<string, TVShowProgress> {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to parse all TV watch progress:', e);
    }
    return {};
  },
};
