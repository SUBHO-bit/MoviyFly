// Server-side High-Fidelity Mock TMDB Engine
// Implements complete, realistic schemas for all TMDB routes requested by the application.

export interface MockMovie {
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  vote_count: number;
  release_date?: string;
  first_air_date?: string;
  original_language: string;
  genre_ids: number[];
  popularity: number;
  adult?: boolean;
  runtime?: number;
  number_of_seasons?: number;
  number_of_episodes?: number;
}

const POSTERS = {
  jawan: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=600',
  pathaan: 'https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5b?q=80&w=600',
  animal: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600',
  rocky: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=600',
  fighter: 'https://images.unsplash.com/photo-1518364538800-6bcb3f25da49?q=80&w=600',
  dunki: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=600',
  '3idiots': 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600',
  kgf2: 'https://images.unsplash.com/photo-1611244419377-b0a72183b081?q=80&w=600',
  rrr: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?q=80&w=600',
  pushpa: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=600',
  kantara: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?q=80&w=600',
  manjummel: 'https://images.unsplash.com/photo-1507163537699-232cf6fe4663?q=80&w=600',
  kalki: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=600',
  dune2: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=600',
  oppenheimer: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=600',
  interstellar: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600',
  bladerunner: 'https://images.unsplash.com/photo-1515621061946-eff1c2a352bd?q=80&w=600',
  darkknight: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=600',
  demonslayer: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=600',
  aot: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600',
  squidgame: 'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?q=80&w=600',
  cloy: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=600',
  queenoftears: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600',
  shogun: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600',
};

const BACKDROPS = {
  jawan: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=1200',
  pathaan: 'https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5b?q=80&w=1200',
  animal: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200',
  rocky: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1200',
  fighter: 'https://images.unsplash.com/photo-1518364538800-6bcb3f25da49?q=80&w=1200',
  dunki: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200',
  '3idiots': 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200',
  kgf2: 'https://images.unsplash.com/photo-1611244419377-b0a72183b081?q=80&w=1200',
  rrr: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?q=80&w=1200',
  pushpa: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200',
  kantara: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?q=80&w=1200',
  manjummel: 'https://images.unsplash.com/photo-1507163537699-232cf6fe4663?q=80&w=1200',
  kalki: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1200',
  dune2: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1200',
  oppenheimer: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=1200',
  interstellar: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200',
  bladerunner: 'https://images.unsplash.com/photo-1515621061946-eff1c2a352bd?q=80&w=1200',
  darkknight: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=1200',
  demonslayer: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1200',
  aot: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200',
  squidgame: 'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?q=80&w=1200',
  cloy: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1200',
  queenoftears: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200',
  shogun: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200',
};

const MOCK_MOVIES: MockMovie[] = [
  // Bollywood (Hindi) - hi
  {
    id: 1001,
    title: 'Jawan',
    original_title: 'Jawan',
    overview: 'A high-octane action thriller which outlines the emotional journey of a man who is set to rectify the wrongs in the society, with help from a group of elite and fierce women warriors.',
    poster_path: POSTERS.jawan,
    backdrop_path: BACKDROPS.jawan,
    vote_average: 8.4,
    vote_count: 3241,
    release_date: '2023-09-07',
    original_language: 'hi',
    genre_ids: [28, 53],
    popularity: 98.4,
    runtime: 169,
    adult: false,
  },
  {
    id: 1002,
    title: 'Pathaan',
    original_title: 'Pathaan',
    overview: 'An Indian spy agent takes on a rogue ex-spy group leader who has plans to unleash a deadly weaponized virus on India, leading to an explosive globetrotting standoff.',
    poster_path: POSTERS.pathaan,
    backdrop_path: BACKDROPS.pathaan,
    vote_average: 7.9,
    vote_count: 2198,
    release_date: '2023-01-25',
    original_language: 'hi',
    genre_ids: [28, 12, 53],
    popularity: 88.2,
    runtime: 146,
    adult: false,
  },
  {
    id: 1003,
    title: 'Animal',
    original_title: 'Animal',
    overview: 'A fierce and complex exploration of family bonds and retribution. The protagonist embarks on a bloody path of absolute destruction against an infamous rival to avenge an assassination attempt on his beloved father.',
    poster_path: POSTERS.animal,
    backdrop_path: BACKDROPS.animal,
    vote_average: 8.1,
    vote_count: 1422,
    release_date: '2023-12-01',
    original_language: 'hi',
    genre_ids: [28, 80, 18],
    popularity: 95.1,
    runtime: 201,
    adult: true,
  },
  {
    id: 1004,
    title: 'Rocky Aur Rani Kii Prem Kahaani',
    original_title: 'Rocky Aur Rani Kii Prem Kahaani',
    overview: 'An epic romantic comedy where a flamboyant Punjabi boy Rocky and a sophisticated Bengali journalist Rani fall in love. To win over their deeply contrasting traditional families, they decide to live with each other\'s households for 3 months.',
    poster_path: POSTERS.rocky,
    backdrop_path: BACKDROPS.rocky,
    vote_average: 7.8,
    vote_count: 984,
    release_date: '2023-07-28',
    original_language: 'hi',
    genre_ids: [35, 10749, 18],
    popularity: 76.5,
    runtime: 168,
    adult: false,
  },
  {
    id: 1005,
    title: 'Fighter',
    original_title: 'Fighter',
    overview: 'Top-tier Indian Air Force combat pilots form a specialized squadron to counter cross-border threats, demonstrating extreme bravery, strategic sky battles, and ultimate self-sacrifice.',
    poster_path: POSTERS.fighter,
    backdrop_path: BACKDROPS.fighter,
    vote_average: 8.0,
    vote_count: 850,
    release_date: '2024-01-25',
    original_language: 'hi',
    genre_ids: [28, 53],
    popularity: 91.2,
    runtime: 166,
    adult: false,
  },
  {
    id: 1006,
    title: 'Dunki',
    original_title: 'Dunki',
    overview: 'Four friends from a small village in Punjab share a common dream: to travel to England. Without visas, they embark on an arduous and highly illegal journey across multiple borders, led by a friendly soldier.',
    poster_path: POSTERS.dunki,
    backdrop_path: BACKDROPS.dunki,
    vote_average: 7.7,
    vote_count: 670,
    release_date: '2023-12-21',
    original_language: 'hi',
    genre_ids: [35, 18],
    popularity: 79.4,
    runtime: 161,
    adult: false,
  },
  {
    id: 1007,
    title: '3 Idiots',
    original_title: '3 Idiots',
    overview: 'In college, Rancho, Farhan, and Raju form a deep bond. Years later, Farhan and Raju embark on an epic quest to find Rancho, who mysteriously vanished on their graduation day, reflecting on their rebellious college antics.',
    poster_path: POSTERS['3idiots'],
    backdrop_path: BACKDROPS['3idiots'],
    vote_average: 8.9,
    vote_count: 4890,
    release_date: '2009-12-25',
    original_language: 'hi',
    genre_ids: [35, 18],
    popularity: 82.5,
    runtime: 170,
    adult: false,
  },

  // South Indian Hits (Tamil, Telugu, Malayalam, Kannada) - te, ta, ml, kn
  {
    id: 2001,
    title: 'K.G.F: Chapter 2',
    original_title: 'K.G.F: Chapter 2',
    overview: 'In the blood-drenched Kolar Gold Fields, Rocky\'s name strikes fear into his foes. While his allies look up to him, the government views him as an absolute threat to law and order, leading to a brutal multi-front assault.',
    poster_path: POSTERS.kgf2,
    backdrop_path: BACKDROPS.kgf2,
    vote_average: 8.7,
    vote_count: 3822,
    release_date: '2022-04-14',
    original_language: 'te',
    genre_ids: [28, 80, 18],
    popularity: 99.5,
    runtime: 168,
    adult: false,
  },
  {
    id: 2002,
    title: 'RRR',
    original_title: 'RRR',
    overview: 'A fictional, highly-stylized tale of two legendary Indian revolutionaries, Alluri Sitarama Raju and Komaram Bheem, and their epic journey away from home before they started fighting for their country in the 1920s.',
    poster_path: POSTERS.rrr,
    backdrop_path: BACKDROPS.rrr,
    vote_average: 8.8,
    vote_count: 5120,
    release_date: '2022-03-24',
    original_language: 'te',
    genre_ids: [28, 12, 18],
    popularity: 110.1,
    runtime: 187,
    adult: false,
  },
  {
    id: 2003,
    title: 'Pushpa: The Rise',
    original_title: 'Pushpa: The Rise',
    overview: 'Pushpa Raj, a coolie, rises in the dark world of red sandalwood smuggling. Along his path, he encounters a ruthless police officer who vows to dismantle his massive network, setting off a raw clash of egos.',
    poster_path: POSTERS.pushpa,
    backdrop_path: BACKDROPS.pushpa,
    vote_average: 8.2,
    vote_count: 2100,
    release_date: '2021-12-17',
    original_language: 'te',
    genre_ids: [28, 80, 18],
    popularity: 92.4,
    runtime: 179,
    adult: false,
  },
  {
    id: 2004,
    title: 'Kantara',
    original_title: 'Kantara',
    overview: 'A champion Kambala athlete clashes with an upright forest officer in a deeply mystical coastal village. As centuries-old beliefs merge with modern laws, local deities demand blood and absolute spiritual retribution.',
    poster_path: POSTERS.kantara,
    backdrop_path: BACKDROPS.kantara,
    vote_average: 8.5,
    vote_count: 1400,
    release_date: '2022-09-30',
    original_language: 'kn',
    genre_ids: [18, 9648, 28],
    popularity: 85.3,
    runtime: 150,
    adult: false,
  },
  {
    id: 2005,
    title: 'Manjummel Boys',
    original_title: 'Manjummel Boys',
    overview: 'Based on a true story, a group of high-spirited friends from a small town in Kerala embark on a holiday trip to the infamous Guna Caves in Kodaikanal, turning into a breathtaking, nail-biting rescue mission when one falls deep into a narrow abyss.',
    poster_path: POSTERS.manjummel,
    backdrop_path: BACKDROPS.manjummel,
    vote_average: 8.6,
    vote_count: 820,
    release_date: '2024-02-22',
    original_language: 'ml',
    genre_ids: [18, 53],
    popularity: 93.6,
    runtime: 135,
    adult: false,
  },
  {
    id: 2006,
    title: 'Kalki 2898 AD',
    original_title: 'Kalki 2898 AD',
    overview: 'In a desolate, resource-depleted futuristic world ruled by a supreme tyrant, a legendary hero emerges to protect a pregnant woman carrying a divine child destined to reset the universe and launch a new golden age.',
    poster_path: POSTERS.kalki,
    backdrop_path: BACKDROPS.kalki,
    vote_average: 8.5,
    vote_count: 1980,
    release_date: '2024-06-27',
    original_language: 'te',
    genre_ids: [28, 878, 12],
    popularity: 120.4,
    runtime: 181,
    adult: false,
  },

  // Hollywood (English) - en
  {
    id: 3001,
    title: 'Dune: Part Two',
    original_title: 'Dune: Part Two',
    overview: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future only he can foresee.',
    poster_path: POSTERS.dune2,
    backdrop_path: BACKDROPS.dune2,
    vote_average: 8.6,
    vote_count: 4210,
    release_date: '2024-03-01',
    original_language: 'en',
    genre_ids: [878, 12, 18],
    popularity: 155.4,
    runtime: 166,
    adult: false,
  },
  {
    id: 3002,
    title: 'Oppenheimer',
    original_title: 'Oppenheimer',
    overview: 'The story of J. Robert Oppenheimer\'s role in the development of the atomic bomb during World War II, showing the high-stakes laboratories, deep political paranoia, and the haunting aftermath of scientific discovery.',
    poster_path: POSTERS.oppenheimer,
    backdrop_path: BACKDROPS.oppenheimer,
    vote_average: 8.9,
    vote_count: 6812,
    release_date: '2023-07-21',
    original_language: 'en',
    genre_ids: [18, 36, 12],
    popularity: 132.5,
    runtime: 180,
    adult: false,
  },
  {
    id: 3003,
    title: 'Interstellar',
    original_title: 'Interstellar',
    overview: 'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.',
    poster_path: POSTERS.interstellar,
    backdrop_path: BACKDROPS.interstellar,
    vote_average: 8.7,
    vote_count: 19800,
    release_date: '2014-11-07',
    original_language: 'en',
    genre_ids: [878, 12, 18],
    popularity: 140.2,
    runtime: 169,
    adult: false,
  },
  {
    id: 3004,
    title: 'Blade Runner 2049',
    original_title: 'Blade Runner 2049',
    overview: 'A new blade runner, LAPD Officer K, unearths a long-buried secret that has the potential to plunge what\'s left of society into chaos. His discovery leads him on a quest to find Rick Deckard, a former blade runner who\'s been missing for 30 years.',
    poster_path: POSTERS.bladerunner,
    backdrop_path: BACKDROPS.bladerunner,
    vote_average: 8.0,
    vote_count: 12500,
    release_date: '2017-10-06',
    original_language: 'en',
    genre_ids: [878, 18, 53],
    popularity: 95.8,
    runtime: 164,
    adult: false,
  },
  {
    id: 3005,
    title: 'The Dark Knight',
    original_title: 'The Dark Knight',
    overview: 'Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker.',
    poster_path: POSTERS.darkknight,
    backdrop_path: BACKDROPS.darkknight,
    vote_average: 9.0,
    vote_count: 31200,
    release_date: '2008-07-18',
    original_language: 'en',
    genre_ids: [28, 80, 53],
    popularity: 150.1,
    runtime: 152,
    adult: false,
  },
];

const MOCK_TV: MockMovie[] = [
  // Anime (Japanese) - ja
  {
    id: 4001,
    name: 'Demon Slayer: Kimetsu no Yaiba',
    original_name: '鬼滅の刃',
    overview: 'It is the Taisho Period in Japan. Tanjiro, a kindhearted boy who sells charcoal for a living, finds his family slaughtered by a demon. To make matters worse, his younger sister Nezuko, the sole survivor, has been transformed into a demon herself. Though devastated, Tanjiro resolves to become a "demon slayer" so that he can turn his sister back into a human and kill the demon who massacred his family.',
    poster_path: POSTERS.demonslayer,
    backdrop_path: BACKDROPS.demonslayer,
    vote_average: 8.7,
    vote_count: 5800,
    first_air_date: '2019-04-06',
    original_language: 'ja',
    genre_ids: [16, 10759, 14],
    popularity: 145.2,
    number_of_seasons: 4,
    number_of_episodes: 55,
  },
  {
    id: 4002,
    name: 'Attack on Titan',
    original_name: '進撃の巨人',
    overview: 'Several hundred years ago, humans were nearly exterminated by Titans. Titans are typically several stories tall, seem to have no intelligence, devour human beings and, worst of all, seem to do it for the pleasure rather than as a food source. Eren Yeager vows to wipe out every single titan on earth after witnessing a catastrophic breach of the protective walls.',
    poster_path: POSTERS.aot,
    backdrop_path: BACKDROPS.aot,
    vote_average: 8.9,
    vote_count: 9800,
    first_air_date: '2013-04-07',
    original_language: 'ja',
    genre_ids: [16, 10759, 10765],
    popularity: 130.4,
    number_of_seasons: 4,
    number_of_episodes: 88,
  },

  // Korean Dramas (K-Dramas) - ko
  {
    id: 5001,
    name: 'Squid Game',
    original_name: '오징어 게임',
    overview: 'Hundreds of cash-strapped players accept a strange invitation to compete in children\'s games. Inside, a tempting prize awaits—with deadly high stakes. A survival game that has a whopping 45.6 billion won prize pool at stake.',
    poster_path: POSTERS.squidgame,
    backdrop_path: BACKDROPS.squidgame,
    vote_average: 8.3,
    vote_count: 12400,
    first_air_date: '2021-09-17',
    original_language: 'ko',
    genre_ids: [10759, 9648, 18],
    popularity: 165.1,
    number_of_seasons: 2,
    number_of_episodes: 18,
  },
  {
    id: 5002,
    name: 'Crash Landing on You',
    original_name: '사랑의 불시착',
    overview: 'A paragliding mishap drops a South Korean heiress in North Korea - and into the life of an army officer, who decides he will help her hide and escape safely, igniting a deeply passionate cross-border romance.',
    poster_path: POSTERS.cloy,
    backdrop_path: BACKDROPS.cloy,
    vote_average: 8.8,
    vote_count: 3200,
    first_air_date: '2019-12-14',
    original_language: 'ko',
    genre_ids: [18, 35, 10749],
    popularity: 94.2,
    number_of_seasons: 1,
    number_of_episodes: 16,
  },
  {
    id: 5003,
    name: 'Queen of Tears',
    original_name: '눈물의 여왕',
    overview: 'The queen of department stores and the prince of supermarkets weather a marital crisis—until love miraculously begins to bloom again amidst corporate rivalry, deep emotional scars, and a shock terminal diagnosis.',
    poster_path: POSTERS.queenoftears,
    backdrop_path: BACKDROPS.queenoftears,
    vote_average: 8.7,
    vote_count: 1100,
    first_air_date: '2024-03-09',
    original_language: 'ko',
    genre_ids: [18, 35, 10749],
    popularity: 112.5,
    number_of_seasons: 1,
    number_of_episodes: 16,
  },

  // Premium Platform Web Series
  {
    id: 6001,
    name: 'Shōgun',
    original_name: 'Shōgun',
    overview: 'Set in Japan in the year 1600, Lord Yoshii Toranaga is fighting for his life as his enemies on the Council of Regents unite against him, when a mysterious European ship is found marooned in a nearby fishing village.',
    poster_path: POSTERS.shogun,
    backdrop_path: BACKDROPS.shogun,
    vote_average: 8.8,
    vote_count: 1950,
    first_air_date: '2024-02-27',
    original_language: 'en',
    genre_ids: [18, 36, 10768],
    popularity: 148.5,
    number_of_seasons: 1,
    number_of_episodes: 10,
  }
];

// Combine movies and TV
const ALL_CINEMATIC = [...MOCK_MOVIES, ...MOCK_TV];

export function handleMockRequest(targetPath: string, query: Record<string, string>): any {
  // 1. GENRE LISTS
  if (targetPath === 'genre/movie/list') {
    return {
      genres: [
        { id: 28, name: 'Action' },
        { id: 12, name: 'Adventure' },
        { id: 16, name: 'Animation' },
        { id: 35, name: 'Comedy' },
        { id: 80, name: 'Crime' },
        { id: 18, name: 'Drama' },
        { id: 14, name: 'Fantasy' },
        { id: 36, name: 'History' },
        { id: 27, name: 'Horror' },
        { id: 9648, name: 'Mystery' },
        { id: 10749, name: 'Romance' },
        { id: 878, name: 'Sci-Fi' },
        { id: 53, name: 'Thriller' }
      ]
    };
  }

  if (targetPath === 'genre/tv/list') {
    return {
      genres: [
        { id: 10759, name: 'Action & Adventure' },
        { id: 16, name: 'Animation' },
        { id: 35, name: 'Comedy' },
        { id: 80, name: 'Crime' },
        { id: 18, name: 'Drama' },
        { id: 9648, name: 'Mystery' },
        { id: 10765, name: 'Sci-Fi & Fantasy' }
      ]
    };
  }

  // 2. MOVIE DETAILS
  if (targetPath.startsWith('movie/') && !targetPath.includes('/')) {
    const id = parseInt(targetPath.split('/')[1]);
    const movie = MOCK_MOVIES.find(m => m.id === id) || MOCK_MOVIES[0];
    return {
      ...movie,
      genres: movie.genre_ids.map(gid => ({ id: gid, name: gid === 28 ? 'Action' : gid === 12 ? 'Adventure' : gid === 878 ? 'Sci-Fi' : gid === 18 ? 'Drama' : gid === 35 ? 'Comedy' : gid === 80 ? 'Crime' : 'Cinema' })),
    };
  }

  // 3. TV DETAILS
  if (targetPath.startsWith('tv/') && !targetPath.includes('/')) {
    const id = parseInt(targetPath.split('/')[1]);
    const show = MOCK_TV.find(t => t.id === id) || MOCK_TV[0];
    return {
      ...show,
      genres: show.genre_ids.map(gid => ({ id: gid, name: gid === 16 ? 'Animation' : gid === 10759 ? 'Action & Adventure' : gid === 18 ? 'Drama' : gid === 10765 ? 'Sci-Fi & Fantasy' : gid === 35 ? 'Comedy' : 'Drama' })),
    };
  }

  // 4. MOVIE CREDITS
  if (targetPath.startsWith('movie/') && targetPath.endsWith('/credits')) {
    const id = parseInt(targetPath.split('/')[1]);
    return {
      id,
      cast: [
        { id: 1, name: 'Shah Rukh Khan', character: 'Lead Actor', profile_path: null },
        { id: 2, name: 'Deepika Padukone', character: 'Lead Actress', profile_path: null },
        { id: 3, name: 'Vijay Sethupathi', character: 'Antagonist', profile_path: null },
        { id: 4, name: 'Timothée Chalamet', character: 'Paul Atreides', profile_path: null },
        { id: 5, name: 'Zendaya', character: 'Chani', profile_path: null },
        { id: 6, name: 'Cillian Murphy', character: 'J. Robert Oppenheimer', profile_path: null }
      ]
    };
  }

  // 5. TV CREDITS
  if (targetPath.startsWith('tv/') && targetPath.endsWith('/credits')) {
    const id = parseInt(targetPath.split('/')[1]);
    return {
      id,
      cast: [
        { id: 11, name: 'Natsuki Hanae', character: 'Tanjiro Kamado', profile_path: null },
        { id: 12, name: 'Akari Kito', character: 'Nezuko Kamado', profile_path: null },
        { id: 13, name: 'Lee Jung-jae', character: 'Seong Gi-hun', profile_path: null },
        { id: 14, name: 'Park Hae-soo', character: 'Cho Sang-woo', profile_path: null },
        { id: 15, name: 'Kim Soo-hyun', character: 'Baek Hyun-woo', profile_path: null },
        { id: 16, name: 'Kim Ji-won', character: 'Hong Hae-in', profile_path: null }
      ]
    };
  }

  // 6. MOVIE VIDEOS (Trailers)
  if (targetPath.startsWith('movie/') && targetPath.endsWith('/videos')) {
    const id = parseInt(targetPath.split('/')[1]);
    // Choose some iconic trailer IDs
    let key = 'dQw4w9WgXcQ'; // Rickroll fallback
    if (id === 1001) key = 'COv527yNh_4'; // Jawan
    if (id === 1002) key = 'vqu4z34wENw'; // Pathaan
    if (id === 1003) key = '8FkLRUJj-C0'; // Animal
    if (id === 2001) key = 'gKizDojsdvs'; // KGF 2
    if (id === 2002) key = 'NgBoMJy386M'; // RRR
    if (id === 2006) key = 'kUdB8N9P_A0'; // Kalki
    if (id === 3001) key = 'Way9Dexny3w'; // Dune 2
    if (id === 3002) key = 'uYPbbksJxIg'; // Oppenheimer
    if (id === 3003) key = 'zSWdZVtXT7E'; // Interstellar

    return {
      id,
      results: [
        {
          id: 'trailer-1',
          key,
          name: 'Official Trailer',
          site: 'YouTube',
          type: 'Trailer',
          official: true
        }
      ]
    };
  }

  // 7. TV VIDEOS (Trailers)
  if (targetPath.startsWith('tv/') && targetPath.endsWith('/videos')) {
    const id = parseInt(targetPath.split('/')[1]);
    let key = 'dQw4w9WgXcQ';
    if (id === 4001) key = 'VQGCKyvzIM4'; // Demon Slayer
    if (id === 4002) key = 'MGRm4IzK1SQ'; // Attack on Titan
    if (id === 5001) key = 'oqxAJKy0R4A'; // Squid Game
    if (id === 5002) key = 'eXbZ5f7_iLY'; // Crash Landing
    if (id === 5003) key = 'r-bS7g_2D9c'; // Queen of Tears
    if (id === 6001) key = 'f5Z77X8G4i8'; // Shogun

    return {
      id,
      results: [
        {
          id: 'trailer-2',
          key,
          name: 'Official Trailer',
          site: 'YouTube',
          type: 'Trailer',
          official: true
        }
      ]
    };
  }

  // 8. TV SEASONS / EPISODES
  if (targetPath.startsWith('tv/') && targetPath.includes('/season/')) {
    const parts = targetPath.split('/');
    const showId = parseInt(parts[1]);
    const seasonNumber = parseInt(parts[3]);
    const show = MOCK_TV.find(t => t.id === showId) || MOCK_TV[0];
    const totalEpisodes = show.number_of_episodes || 10;

    const episodes = Array.from({ length: totalEpisodes }).map((_, i) => ({
      air_date: '2023-10-12',
      episode_number: i + 1,
      id: showId * 100 + i + 1,
      name: `Episode ${i + 1}: ${show.name} Saga`,
      overview: `A gripping episode focusing on the core stakes of the conflict. The protagonists find themselves faced with intense choices as alliances are tested and secrets are revealed in this high-production chapter.`,
      production_code: `EP-${showId}-${i + 1}`,
      runtime: 45 + (i * 3) % 20,
      season_number: seasonNumber,
      show_id: showId,
      still_path: show.backdrop_path,
      vote_average: 8.2 + (i % 5) * 0.2,
      vote_count: 150 + i * 20,
    }));

    return {
      _id: `season-id-${showId}-${seasonNumber}`,
      air_date: show.first_air_date || '2023-01-01',
      episodes,
      name: `Season ${seasonNumber}`,
      overview: `The explosive and critically acclaimed Season ${seasonNumber} of ${show.name}, filled with unparalleled tension, stunning photography, and stellar performances.`,
      id: showId * 10 + seasonNumber,
      poster_path: show.poster_path,
      season_number: seasonNumber,
    };
  }

  // 9. SIMILAR & RECOMMENDATIONS
  if (targetPath.includes('/similar') || targetPath.includes('/recommendations')) {
    const isTv = targetPath.startsWith('tv/');
    const list = isTv ? MOCK_TV : MOCK_MOVIES;
    return {
      page: 1,
      results: list.slice(0, 5),
      total_pages: 1,
      total_results: list.length
    };
  }

  // 10. SEARCH
  if (targetPath.startsWith('search/')) {
    const searchTerm = String(query.query || '').trim().toLowerCase();
    
    let sourceList: any[] = [];
    if (targetPath.endsWith('tv')) {
      sourceList = MOCK_TV.map(item => ({ ...item, media_type: 'tv' }));
    } else if (targetPath.endsWith('movie')) {
      sourceList = MOCK_MOVIES.map(item => ({ ...item, media_type: 'movie' }));
    } else {
      // Default / search/multi
      sourceList = [
        ...MOCK_MOVIES.map(item => ({ ...item, media_type: 'movie' })),
        ...MOCK_TV.map(item => ({ ...item, media_type: 'tv' }))
      ];
    }

    if (!searchTerm) {
      return { page: 1, results: sourceList, total_pages: 1, total_results: sourceList.length };
    }

    const filtered = sourceList.filter(item => {
      const title = String(item.title || item.name || '').toLowerCase();
      const overview = String(item.overview || '').toLowerCase();
      return title.includes(searchTerm) || overview.includes(searchTerm);
    });

    return {
      page: 1,
      results: filtered,
      total_pages: 1,
      total_results: filtered.length
    };
  }

  // 11. DISCOVER MOVIES
  if (targetPath === 'discover/movie') {
    let list = [...MOCK_MOVIES];

    // Language filters
    if (query.with_original_language) {
      const langs = query.with_original_language.split('|');
      list = list.filter(m => langs.includes(m.original_language));
    }

    // Genre filters
    if (query.with_genres) {
      const gid = parseInt(query.with_genres);
      list = list.filter(m => m.genre_ids.includes(gid));
    }

    return {
      page: 1,
      results: list,
      total_pages: 1,
      total_results: list.length
    };
  }

  // 12. DISCOVER TV
  if (targetPath === 'discover/tv') {
    let list = [...MOCK_TV];

    // Language filters
    if (query.with_original_language) {
      const langs = query.with_original_language.split('|');
      list = list.filter(m => langs.includes(m.original_language));
    }

    // Genre filters
    if (query.with_genres) {
      const gid = parseInt(query.with_genres);
      list = list.filter(m => m.genre_ids.includes(gid));
    }

    return {
      page: 1,
      results: list,
      total_pages: 1,
      total_results: list.length
    };
  }

  // 13. TRENDING / POPULAR LISTS (DEFAULT LISTS)
  const isTvEndpoint = targetPath.includes('tv');
  const items = isTvEndpoint ? MOCK_TV : MOCK_MOVIES;

  return {
    page: 1,
    results: items,
    total_pages: 1,
    total_results: items.length
  };
}
