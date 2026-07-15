export interface MediaItem {
  id: string; // Unified prefix format, e.g. "movie-123" or "tv-456"
  mediaType: 'movie' | 'tv';
  title: string;
  originalTitle: string;
  poster: string;
  backdrop: string;
  logo: string | null;
  overview: string;
  tagline: string | null;
  rating: string;
  runtime: string; // Mapped dynamically: "2h 15m" for movies, "5 Seasons" for TV shows
  genres: { id: number; name: string }[];
  language: string;
  releaseDate: string;
  status: string;
  trailer: string | null; // YouTube video ID or null
  cast: any[];
  similar: any[];
  recommendations: any[];
  seasonCount?: number;
  episodeCount?: number;
  network?: string;
  ageRating?: string;
  
  // Extended TV specific fields preserved for fidelity
  created_by?: { id: number; name: string; profile_path: string | null }[];
  production_companies?: { id: number; name: string; logo_path: string | null; origin_country: string }[];
  last_air_date?: string;
  type?: string;
}
