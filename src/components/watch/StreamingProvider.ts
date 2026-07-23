export interface StreamServer {
  id: string;
  name: string;
  category: 'sources' | 'backups';
}

export const STREAM_SERVERS: StreamServer[] = [
  // STREAMING SOURCE category
  { id: 'server-a', name: 'Server A', category: 'sources' },
  { id: 'server-b', name: 'Server B', category: 'sources' },
  { id: 'server-c', name: 'Server C', category: 'sources' },
  { id: 'server-d', name: 'Server D', category: 'sources' },
  // BACKUP SERVERS category
  { id: 'backup-1', name: 'Server 1', category: 'backups' },
  { id: 'backup-2', name: 'Server 2', category: 'backups' },
  { id: 'backup-3', name: 'Server 3', category: 'backups' },
  { id: 'backup-4', name: 'Server 4', category: 'backups' },
];

export const StreamingProvider = {
  /**
   * Generates the streaming URL for a movie or TV episode based on active server
   */
  getStreamUrl(
    serverId: string,
    tmdbId: string,
    type: 'movie' | 'tv',
    season?: number,
    episode?: number
  ): string {
    const s = season || 1;
    const e = episode || 1;
    const cleanId = tmdbId.replace('movie-', '').replace('tv-', '');

    switch (serverId) {
      // SECTION 1: STREAMING SOURCE (VidSrc API 1-4)
      case 'server-a': // Server A -> VidSrc API 2
        return type === 'movie'
          ? `https://vidsrc.wtf/2/movie/${tmdbId}`
          : `https://vidsrc.wtf/2/tv/${tmdbId}/${s}/${e}`;

      case 'server-b': // Server B -> VidSrc API 1
        return type === 'movie'
          ? `https://vidsrc.wtf/1/movie/${tmdbId}`
          : `https://vidsrc.wtf/1/tv/${tmdbId}/${s}/${e}`;

      case 'server-c': // Server C -> VidSrc API 3
        return type === 'movie'
          ? `https://vidsrc.wtf/3/movie/${tmdbId}`
          : `https://vidsrc.wtf/3/tv/${tmdbId}/${s}/${e}`;

      case 'server-d': // Server D -> VidSrc API 4
        return type === 'movie'
          ? `https://vidsrc.wtf/4/movie/${tmdbId}`
          : `https://vidsrc.wtf/4/tv/${tmdbId}/${s}/${e}`;

      // SECTION 2: BACKUP SERVERS
      case 'backup-1': // Server 1 -> Viduki (Replaced Vidlove)
        return type === 'movie'
          ? `https://www.viduki.net/1/movie/${cleanId}?color=7c3aed`
          : `https://www.viduki.net/1/tv/${cleanId}/${s}/${e}?color=7c3aed`;

      case 'backup-2': // Server 2 -> VidNest
        return type === 'movie'
          ? `https://vidnest.fun/movie/${tmdbId}`
          : `https://vidnest.fun/tv/${tmdbId}/${s}/${e}`;

      case 'backup-3': // Server 3 -> XPass
        return type === 'movie'
          ? `https://play.xpass.top/e/movie/${tmdbId}`
          : `https://play.xpass.top/e/tv/${tmdbId}/${s}/${e}`;

      case 'backup-4': // Server 4 -> 2Embed
        return type === 'movie'
          ? `https://www.2embed.cc/embed/movie/${tmdbId}`
          : `https://www.2embed.cc/embedtv/${tmdbId}&s=${s}&e=${e}`;

      default:
        // Fallback to Server A
        return type === 'movie'
          ? `https://vidsrc.wtf/2/movie/${tmdbId}`
          : `https://vidsrc.wtf/2/tv/${tmdbId}/${s}/${e}`;
    }
  },

  /**
   * Automatic provider fallback progression
   */
  getNextServerId(currentServerId: string): string {
    switch (currentServerId) {
      case 'server-a':
        return 'server-b';
      case 'server-b':
        return 'server-c';
      case 'server-c':
        return 'server-d';
      case 'server-d':
        return 'backup-1';
      case 'backup-1':
        return 'backup-2';
      case 'backup-2':
        return 'backup-3';
      case 'backup-3':
        return 'backup-4';
      case 'backup-4':
        return 'server-a';
      default:
        return 'server-a';
    }
  },
};
