import { MovieData } from '../components/movie/MovieCard';

// Beautiful and precise Unsplash image URLs that represent premium cinematic look
const POSTER_URLS = {
  dune2: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600', // Deep atmospheric sci-fi
  interstellar: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600', // Deep space nebula
  bladerunner: 'https://images.unsplash.com/photo-1542204172-e7052809a862?q=80&w=600', // Neon urban rainy cyberpunk
  spiderverse: 'https://images.unsplash.com/photo-1608889174637-3c44f6326f2a?q=80&w=600', // Vibrant colors action
  darkknight: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=600', // Dark gothic minimal skyline
  oppenheimer: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=600', // Vintage orange embers flame
  avatar: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600', // Dreamy bioluminescent turquoise
  cyberpunk: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=600', // Anime cybernetic artwork
  demonslayer: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600', // Epic sword neon fantasy
  spaceodyssey: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=600', // Space station orbital sunrise
  inception: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600', // Mindbending gravity stairs
  avengers: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=600', // Hero shield / cosmic armor
  joker: 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?q=80&w=600', // Dark moody dramatic portrait
  animation: 'https://images.unsplash.com/photo-1601987177651-8edfe6c20009?q=80&w=600', // Creative vibrant 3D rendering
  matrix: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600', // Matrix green digital rain
  shogun: 'https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?q=80&w=600', // Ancient pagoda temple
  challengers: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?q=80&w=600', // High-end tennis clay court
  civilwar: 'https://images.unsplash.com/photo-1508849789987-4e5333c12b78?q=80&w=600', // Smoke battlefield flare
  furiosa: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600', // Desolate wasteland dust storm
  fallguy: 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?q=80&w=600'
};

export const CONTINUE_WATCHING: MovieData[] = [
  {
    id: 'cont-1',
    title: 'Interstellar',
    overview: 'Paul Atreides unites with Chani and the Fremen while seeking revenge.',
    genres: ['Sci-Fi', 'Drama'],
    rating: '8.7',
    year: 2014,
    runtime: '2h 49m',
    language: 'English',
    ageRating: 'PG-13',
    poster: POSTER_URLS.interstellar
  },
  {
    id: 'cont-2',
    title: 'Dune: Part Two',
    overview: 'Paul Atreides unites with Chani and the Fremen while seeking revenge.',
    genres: ['Sci-Fi', 'Adventure'],
    rating: '8.6',
    year: 2024,
    runtime: '2h 46m',
    language: 'English',
    ageRating: 'PG-13',
    poster: POSTER_URLS.dune2
  },
  {
    id: 'cont-3',
    title: 'Blade Runner 2049',
    overview: 'A new blade runner, LAPD Officer K, unearths a long-buried secret.',
    genres: ['Sci-Fi', 'Thriller'],
    rating: '8.0',
    year: 2017,
    runtime: '2h 44m',
    language: 'English',
    ageRating: 'R',
    poster: POSTER_URLS.bladerunner
  }
];

export const TRENDING_MOVIES: MovieData[] = [
  {
    id: 'trend-1',
    title: 'Dune: Part Two',
    overview: 'Paul Atreides unites with Chani and the Fremen while seeking revenge.',
    genres: ['Sci-Fi', 'Adventure', 'Drama'],
    rating: '8.6',
    year: 2024,
    runtime: '2h 46m',
    language: 'English',
    ageRating: 'PG-13',
    poster: POSTER_URLS.dune2
  },
  {
    id: 'trend-2',
    title: 'Oppenheimer',
    overview: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
    genres: ['Biography', 'Drama', 'History'],
    rating: '8.9',
    year: 2023,
    runtime: '3h 00m',
    language: 'English',
    ageRating: 'R',
    poster: POSTER_URLS.oppenheimer
  },
  {
    id: 'trend-3',
    title: 'Spider-Man: Across the Spider-Verse',
    overview: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.',
    genres: ['Animation', 'Action', 'Adventure'],
    rating: '8.6',
    year: 2023,
    runtime: '2h 20m',
    language: 'English',
    ageRating: 'PG',
    poster: POSTER_URLS.spiderverse
  },
  {
    id: 'trend-4',
    title: 'Interstellar',
    overview: 'The adventures of explorers who make use of a newly discovered wormhole.',
    genres: ['Sci-Fi', 'Adventure', 'Drama'],
    rating: '8.7',
    year: 2014,
    runtime: '2h 49m',
    language: 'English',
    ageRating: 'PG-13',
    poster: POSTER_URLS.interstellar
  },
  {
    id: 'trend-5',
    title: 'The Dark Knight',
    overview: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham.',
    genres: ['Action', 'Crime', 'Drama'],
    rating: '9.0',
    year: 2008,
    runtime: '2h 32m',
    language: 'English',
    ageRating: 'PG-13',
    poster: POSTER_URLS.darkknight
  },
  {
    id: 'trend-6',
    title: 'Avatar: The Way of Water',
    overview: 'Jake Sully lives with his newfound family formed on the extrasolar moon Pandora.',
    genres: ['Action', 'Adventure', 'Fantasy'],
    rating: '7.6',
    year: 2022,
    runtime: '3h 12m',
    language: 'English',
    ageRating: 'PG-13',
    poster: POSTER_URLS.avatar
  }
];

export const POPULAR_MOVIES: MovieData[] = [
  {
    id: 'pop-1',
    title: 'Blade Runner 2049',
    overview: 'A new blade runner, LAPD Officer K, unearths a long-buried secret.',
    genres: ['Sci-Fi', 'Drama', 'Thriller'],
    rating: '8.0',
    year: 2017,
    runtime: '2h 44m',
    language: 'English',
    ageRating: 'R',
    poster: POSTER_URLS.bladerunner
  },
  {
    id: 'pop-2',
    title: 'Inception',
    overview: 'A thief who steals corporate secrets through the use of dream-sharing technology.',
    genres: ['Action', 'Sci-Fi', 'Adventure'],
    rating: '8.8',
    year: 2010,
    runtime: '2h 28m',
    language: 'English',
    ageRating: 'PG-13',
    poster: POSTER_URLS.inception
  },
  {
    id: 'pop-3',
    title: 'The Joker',
    overview: 'A socially demoted stand-up comedian embarking on a spiral of revolution.',
    genres: ['Crime', 'Drama', 'Thriller'],
    rating: '8.4',
    year: 2019,
    runtime: '2h 02m',
    language: 'English',
    ageRating: 'R',
    poster: POSTER_URLS.joker
  },
  {
    id: 'pop-4',
    title: 'Avengers: Endgame',
    overview: 'After the devastating events of Infinity War, the universe is in ruins.',
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    rating: '8.4',
    year: 2019,
    runtime: '3h 01m',
    language: 'English',
    ageRating: 'PG-13',
    poster: POSTER_URLS.avengers
  },
  {
    id: 'pop-5',
    title: 'The Matrix Resurrections',
    overview: 'Return to a world of two realities: one, everyday life; the other, what lies behind it.',
    genres: ['Action', 'Sci-Fi'],
    rating: '5.7',
    year: 2021,
    runtime: '2h 28m',
    language: 'English',
    ageRating: 'R',
    poster: POSTER_URLS.matrix
  }
];

export const TOP_RATED: MovieData[] = [
  {
    id: 'top-1',
    title: 'The Dark Knight',
    overview: 'Batman must accept one of the greatest psychological and physical tests.',
    genres: ['Action', 'Crime', 'Drama'],
    rating: '9.0',
    year: 2008,
    runtime: '2h 32m',
    language: 'English',
    ageRating: 'PG-13',
    poster: POSTER_URLS.darkknight
  },
  {
    id: 'top-2',
    title: 'Inception',
    overview: 'A thief who steals corporate secrets through the use of dream-sharing technology.',
    genres: ['Action', 'Sci-Fi', 'Adventure'],
    rating: '8.8',
    year: 2010,
    runtime: '2h 28m',
    language: 'English',
    ageRating: 'PG-13',
    poster: POSTER_URLS.inception
  },
  {
    id: 'top-3',
    title: 'Interstellar',
    overview: 'Exploring new wormholes to guarantee human survival.',
    genres: ['Sci-Fi', 'Adventure', 'Drama'],
    rating: '8.7',
    year: 2014,
    runtime: '2h 49m',
    language: 'English',
    ageRating: 'PG-13',
    poster: POSTER_URLS.interstellar
  },
  {
    id: 'top-4',
    title: 'Dune: Part Two',
    overview: 'Paul Atreides unites with Chani and the Fremen.',
    genres: ['Sci-Fi', 'Adventure', 'Drama'],
    rating: '8.6',
    year: 2024,
    runtime: '2h 46m',
    language: 'English',
    ageRating: 'PG-13',
    poster: POSTER_URLS.dune2
  },
  {
    id: 'top-5',
    title: 'Spider-Man: Into the Spider-Verse',
    overview: 'Miles Morales becomes the Spider-Man of his universe.',
    genres: ['Animation', 'Action', 'Adventure'],
    rating: '8.4',
    year: 2018,
    runtime: '1h 57m',
    language: 'English',
    ageRating: 'PG',
    poster: POSTER_URLS.spiderverse
  }
];

export const ACTION_MOVIES: MovieData[] = [
  {
    id: 'act-1',
    title: 'The Dark Knight',
    overview: 'Batman must accept one of the greatest psychological and physical tests.',
    genres: ['Action', 'Crime', 'Drama'],
    rating: '9.0',
    year: 2008,
    runtime: '2h 32m',
    language: 'English',
    ageRating: 'PG-13',
    poster: POSTER_URLS.darkknight
  },
  {
    id: 'act-2',
    title: 'Avengers: Endgame',
    overview: 'After the devastating events of Infinity War, the universe is in ruins.',
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    rating: '8.4',
    year: 2019,
    runtime: '3h 01m',
    language: 'English',
    ageRating: 'PG-13',
    poster: POSTER_URLS.avengers
  },
  {
    id: 'act-3',
    title: 'Inception',
    overview: 'A thief who steals corporate secrets through the use of dream-sharing technology.',
    genres: ['Action', 'Sci-Fi', 'Adventure'],
    rating: '8.8',
    year: 2010,
    runtime: '2h 28m',
    language: 'English',
    ageRating: 'PG-13',
    poster: POSTER_URLS.inception
  }
];

export const ADVENTURE_MOVIES: MovieData[] = [
  {
    id: 'adv-1',
    title: 'Dune: Part Two',
    overview: 'Paul Atreides unites with Chani and the Fremen.',
    genres: ['Sci-Fi', 'Adventure', 'Drama'],
    rating: '8.6',
    year: 2024,
    runtime: '2h 46m',
    language: 'English',
    ageRating: 'PG-13',
    poster: POSTER_URLS.dune2
  },
  {
    id: 'adv-2',
    title: 'Avatar: The Way of Water',
    overview: 'Jake Sully lives with his newfound family formed on the extrasolar moon Pandora.',
    genres: ['Action', 'Adventure', 'Fantasy'],
    rating: '7.6',
    year: 2022,
    runtime: '3h 12m',
    language: 'English',
    ageRating: 'PG-13',
    poster: POSTER_URLS.avatar
  },
  {
    id: 'adv-3',
    title: 'Interstellar',
    overview: 'Exploring new wormholes to guarantee human survival.',
    genres: ['Sci-Fi', 'Adventure', 'Drama'],
    rating: '8.7',
    year: 2014,
    runtime: '2h 49m',
    language: 'English',
    ageRating: 'PG-13',
    poster: POSTER_URLS.interstellar
  }
];

export const SCI_FI_MOVIES: MovieData[] = [
  {
    id: 'scifi-1',
    title: 'Blade Runner 2049',
    overview: 'A new blade runner, LAPD Officer K, unearths a long-buried secret.',
    genres: ['Sci-Fi', 'Drama', 'Thriller'],
    rating: '8.0',
    year: 2017,
    runtime: '2h 44m',
    language: 'English',
    ageRating: 'R',
    poster: POSTER_URLS.bladerunner
  },
  {
    id: 'scifi-2',
    title: 'Interstellar',
    overview: 'Exploring new wormholes to guarantee human survival.',
    genres: ['Sci-Fi', 'Adventure', 'Drama'],
    rating: '8.7',
    year: 2014,
    runtime: '2h 49m',
    language: 'English',
    ageRating: 'PG-13',
    poster: POSTER_URLS.interstellar
  },
  {
    id: 'scifi-3',
    title: 'The Matrix Resurrections',
    overview: 'Return to a world of two realities.',
    genres: ['Action', 'Sci-Fi'],
    rating: '5.7',
    year: 2021,
    runtime: '2h 28m',
    language: 'English',
    ageRating: 'R',
    poster: POSTER_URLS.matrix
  },
  {
    id: 'scifi-4',
    title: 'Dune: Part Two',
    overview: 'Paul Atreides unites with Chani and the Fremen.',
    genres: ['Sci-Fi', 'Adventure', 'Drama'],
    rating: '8.6',
    year: 2024,
    runtime: '2h 46m',
    language: 'English',
    ageRating: 'PG-13',
    poster: POSTER_URLS.dune2
  }
];

export const ANIMATION_MOVIES: MovieData[] = [
  {
    id: 'anim-1',
    title: 'Spider-Man: Into the Spider-Verse',
    overview: 'Miles Morales becomes the Spider-Man of his universe.',
    genres: ['Animation', 'Action', 'Adventure'],
    rating: '8.4',
    year: 2018,
    runtime: '1h 57m',
    language: 'English',
    ageRating: 'PG',
    poster: POSTER_URLS.spiderverse
  },
  {
    id: 'anim-2',
    title: 'Neon Odyssey',
    overview: 'A stylized animation journey across artificial cities and digital horizons.',
    genres: ['Animation', 'Sci-Fi'],
    rating: '7.8',
    year: 2023,
    runtime: '1h 44m',
    language: 'English',
    ageRating: 'PG',
    poster: POSTER_URLS.animation
  }
];

export const TV_SHOWS: MovieData[] = [
  {
    id: 'show-1',
    title: 'Cyberpunk: Edgerunners',
    overview: 'A street kid trying to survive in a technology and body modification-obsessed city of the future.',
    genres: ['Action', 'Sci-Fi', 'Animation'],
    rating: '8.3',
    year: 2022,
    runtime: '10 Episodes',
    language: 'Japanese',
    ageRating: 'TV-MA',
    poster: POSTER_URLS.cyberpunk
  },
  {
    id: 'show-2',
    title: 'Shōgun',
    overview: 'When a mysterious European ship is found marooned in a nearby fishing village.',
    genres: ['Drama', 'History', 'War'],
    rating: '8.8',
    year: 2024,
    runtime: '10 Episodes',
    language: 'Japanese',
    ageRating: 'TV-MA',
    poster: POSTER_URLS.shogun
  }
];

export const RECENTLY_ADDED: MovieData[] = [
  {
    id: 'recent-1',
    title: 'Challengers',
    overview: 'Tashi, a former tennis prodigy turned coach, has turned her husband into a world-famous champion.',
    genres: ['Drama', 'Sport', 'Romance'],
    rating: '7.3',
    year: 2024,
    runtime: '2h 11m',
    language: 'English',
    ageRating: 'R',
    poster: POSTER_URLS.challengers
  },
  {
    id: 'recent-2',
    title: 'Civil War',
    overview: 'A journey across a dystopian future America, following a team of military-embedded journalists.',
    genres: ['Action', 'Drama', 'Thriller'],
    rating: '7.1',
    year: 2024,
    runtime: '1h 49m',
    language: 'English',
    ageRating: 'R',
    poster: POSTER_URLS.civilwar
  },
  {
    id: 'recent-3',
    title: 'Oppenheimer',
    overview: 'The story of J. Robert Oppenheimer role in developing the atomic bomb.',
    genres: ['Biography', 'Drama', 'History'],
    rating: '8.9',
    year: 2023,
    runtime: '3h 00m',
    language: 'English',
    ageRating: 'R',
    poster: POSTER_URLS.oppenheimer
  }
];
