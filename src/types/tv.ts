export interface TMDBTVShow {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  first_air_date: string;
  original_language: string;
  genre_ids: number[];
  popularity: number;
}

export interface TMDBTVDetails extends TMDBTVShow {
  genres: { id: number; name: string }[];
  number_of_episodes: number;
  number_of_seasons: number;
  status: string;
  type: string;
  homepage: string | null;
  created_by?: { id: number; name: string; profile_path: string | null }[];
  production_companies?: { id: number; name: string; logo_path: string | null; origin_country: string }[];
  production_countries?: { iso_3166_1: string; name: string }[];
  languages?: string[];
  last_air_date?: string;
}

export interface TMDBEpisode {
  air_date: string | null;
  episode_number: number;
  id: number;
  name: string;
  overview: string;
  production_code: string;
  runtime: number | null;
  season_number: number;
  show_id: number;
  still_path: string | null;
  vote_average: number;
  vote_count: number;
}

export interface TMDBSeasonDetails {
  _id: string;
  air_date: string;
  episodes: TMDBEpisode[];
  name: string;
  overview: string;
  id: number;
  poster_path: string | null;
  season_number: number;
}

export interface TMDBTVResponse {
  page: number;
  results: TMDBTVShow[];
  total_pages: number;
  total_results: number;
}
