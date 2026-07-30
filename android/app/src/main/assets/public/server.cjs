var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_vite = require("vite");
var import_dotenv = __toESM(require("dotenv"), 1);
var import_dns = __toESM(require("dns"), 1);

// api/server-mock-data.ts
var POSTERS = {
  jawan: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=600",
  pathaan: "https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5b?q=80&w=600",
  animal: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600",
  rocky: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=600",
  fighter: "https://images.unsplash.com/photo-1518364538800-6bcb3f25da49?q=80&w=600",
  dunki: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=600",
  "3idiots": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600",
  kgf2: "https://images.unsplash.com/photo-1611244419377-b0a72183b081?q=80&w=600",
  rrr: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?q=80&w=600",
  pushpa: "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=600",
  kantara: "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?q=80&w=600",
  manjummel: "https://images.unsplash.com/photo-1507163537699-232cf6fe4663?q=80&w=600",
  kalki: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=600",
  dune2: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=600",
  oppenheimer: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=600",
  interstellar: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600",
  bladerunner: "https://images.unsplash.com/photo-1515621061946-eff1c2a352bd?q=80&w=600",
  darkknight: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=600",
  demonslayer: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=600",
  aot: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600",
  squidgame: "https://images.unsplash.com/photo-1627856013091-fed6e4e30025?q=80&w=600",
  cloy: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=600",
  queenoftears: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600",
  shogun: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600"
};
var BACKDROPS = {
  jawan: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=1200",
  pathaan: "https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5b?q=80&w=1200",
  animal: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200",
  rocky: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1200",
  fighter: "https://images.unsplash.com/photo-1518364538800-6bcb3f25da49?q=80&w=1200",
  dunki: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200",
  "3idiots": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200",
  kgf2: "https://images.unsplash.com/photo-1611244419377-b0a72183b081?q=80&w=1200",
  rrr: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?q=80&w=1200",
  pushpa: "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200",
  kantara: "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?q=80&w=1200",
  manjummel: "https://images.unsplash.com/photo-1507163537699-232cf6fe4663?q=80&w=1200",
  kalki: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1200",
  dune2: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1200",
  oppenheimer: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=1200",
  interstellar: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200",
  bladerunner: "https://images.unsplash.com/photo-1515621061946-eff1c2a352bd?q=80&w=1200",
  darkknight: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=1200",
  demonslayer: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1200",
  aot: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200",
  squidgame: "https://images.unsplash.com/photo-1627856013091-fed6e4e30025?q=80&w=1200",
  cloy: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1200",
  queenoftears: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200",
  shogun: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200"
};
var MOCK_MOVIES = [
  // Bollywood (Hindi) - hi
  {
    id: 1001,
    title: "Jawan",
    original_title: "Jawan",
    overview: "A high-octane action thriller which outlines the emotional journey of a man who is set to rectify the wrongs in the society, with help from a group of elite and fierce women warriors.",
    poster_path: POSTERS.jawan,
    backdrop_path: BACKDROPS.jawan,
    vote_average: 8.4,
    vote_count: 3241,
    release_date: "2023-09-07",
    original_language: "hi",
    genre_ids: [28, 53],
    popularity: 98.4,
    runtime: 169,
    adult: false
  },
  {
    id: 1002,
    title: "Pathaan",
    original_title: "Pathaan",
    overview: "An Indian spy agent takes on a rogue ex-spy group leader who has plans to unleash a deadly weaponized virus on India, leading to an explosive globetrotting standoff.",
    poster_path: POSTERS.pathaan,
    backdrop_path: BACKDROPS.pathaan,
    vote_average: 7.9,
    vote_count: 2198,
    release_date: "2023-01-25",
    original_language: "hi",
    genre_ids: [28, 12, 53],
    popularity: 88.2,
    runtime: 146,
    adult: false
  },
  {
    id: 1003,
    title: "Animal",
    original_title: "Animal",
    overview: "A fierce and complex exploration of family bonds and retribution. The protagonist embarks on a bloody path of absolute destruction against an infamous rival to avenge an assassination attempt on his beloved father.",
    poster_path: POSTERS.animal,
    backdrop_path: BACKDROPS.animal,
    vote_average: 8.1,
    vote_count: 1422,
    release_date: "2023-12-01",
    original_language: "hi",
    genre_ids: [28, 80, 18],
    popularity: 95.1,
    runtime: 201,
    adult: true
  },
  {
    id: 1004,
    title: "Rocky Aur Rani Kii Prem Kahaani",
    original_title: "Rocky Aur Rani Kii Prem Kahaani",
    overview: "An epic romantic comedy where a flamboyant Punjabi boy Rocky and a sophisticated Bengali journalist Rani fall in love. To win over their deeply contrasting traditional families, they decide to live with each other's households for 3 months.",
    poster_path: POSTERS.rocky,
    backdrop_path: BACKDROPS.rocky,
    vote_average: 7.8,
    vote_count: 984,
    release_date: "2023-07-28",
    original_language: "hi",
    genre_ids: [35, 10749, 18],
    popularity: 76.5,
    runtime: 168,
    adult: false
  },
  {
    id: 1005,
    title: "Fighter",
    original_title: "Fighter",
    overview: "Top-tier Indian Air Force combat pilots form a specialized squadron to counter cross-border threats, demonstrating extreme bravery, strategic sky battles, and ultimate self-sacrifice.",
    poster_path: POSTERS.fighter,
    backdrop_path: BACKDROPS.fighter,
    vote_average: 8,
    vote_count: 850,
    release_date: "2024-01-25",
    original_language: "hi",
    genre_ids: [28, 53],
    popularity: 91.2,
    runtime: 166,
    adult: false
  },
  {
    id: 1006,
    title: "Dunki",
    original_title: "Dunki",
    overview: "Four friends from a small village in Punjab share a common dream: to travel to England. Without visas, they embark on an arduous and highly illegal journey across multiple borders, led by a friendly soldier.",
    poster_path: POSTERS.dunki,
    backdrop_path: BACKDROPS.dunki,
    vote_average: 7.7,
    vote_count: 670,
    release_date: "2023-12-21",
    original_language: "hi",
    genre_ids: [35, 18],
    popularity: 79.4,
    runtime: 161,
    adult: false
  },
  {
    id: 1007,
    title: "3 Idiots",
    original_title: "3 Idiots",
    overview: "In college, Rancho, Farhan, and Raju form a deep bond. Years later, Farhan and Raju embark on an epic quest to find Rancho, who mysteriously vanished on their graduation day, reflecting on their rebellious college antics.",
    poster_path: POSTERS["3idiots"],
    backdrop_path: BACKDROPS["3idiots"],
    vote_average: 8.9,
    vote_count: 4890,
    release_date: "2009-12-25",
    original_language: "hi",
    genre_ids: [35, 18],
    popularity: 82.5,
    runtime: 170,
    adult: false
  },
  // South Indian Hits (Tamil, Telugu, Malayalam, Kannada) - te, ta, ml, kn
  {
    id: 2001,
    title: "K.G.F: Chapter 2",
    original_title: "K.G.F: Chapter 2",
    overview: "In the blood-drenched Kolar Gold Fields, Rocky's name strikes fear into his foes. While his allies look up to him, the government views him as an absolute threat to law and order, leading to a brutal multi-front assault.",
    poster_path: POSTERS.kgf2,
    backdrop_path: BACKDROPS.kgf2,
    vote_average: 8.7,
    vote_count: 3822,
    release_date: "2022-04-14",
    original_language: "te",
    genre_ids: [28, 80, 18],
    popularity: 99.5,
    runtime: 168,
    adult: false
  },
  {
    id: 2002,
    title: "RRR",
    original_title: "RRR",
    overview: "A fictional, highly-stylized tale of two legendary Indian revolutionaries, Alluri Sitarama Raju and Komaram Bheem, and their epic journey away from home before they started fighting for their country in the 1920s.",
    poster_path: POSTERS.rrr,
    backdrop_path: BACKDROPS.rrr,
    vote_average: 8.8,
    vote_count: 5120,
    release_date: "2022-03-24",
    original_language: "te",
    genre_ids: [28, 12, 18],
    popularity: 110.1,
    runtime: 187,
    adult: false
  },
  {
    id: 2003,
    title: "Pushpa: The Rise",
    original_title: "Pushpa: The Rise",
    overview: "Pushpa Raj, a coolie, rises in the dark world of red sandalwood smuggling. Along his path, he encounters a ruthless police officer who vows to dismantle his massive network, setting off a raw clash of egos.",
    poster_path: POSTERS.pushpa,
    backdrop_path: BACKDROPS.pushpa,
    vote_average: 8.2,
    vote_count: 2100,
    release_date: "2021-12-17",
    original_language: "te",
    genre_ids: [28, 80, 18],
    popularity: 92.4,
    runtime: 179,
    adult: false
  },
  {
    id: 2004,
    title: "Kantara",
    original_title: "Kantara",
    overview: "A champion Kambala athlete clashes with an upright forest officer in a deeply mystical coastal village. As centuries-old beliefs merge with modern laws, local deities demand blood and absolute spiritual retribution.",
    poster_path: POSTERS.kantara,
    backdrop_path: BACKDROPS.kantara,
    vote_average: 8.5,
    vote_count: 1400,
    release_date: "2022-09-30",
    original_language: "kn",
    genre_ids: [18, 9648, 28],
    popularity: 85.3,
    runtime: 150,
    adult: false
  },
  {
    id: 2005,
    title: "Manjummel Boys",
    original_title: "Manjummel Boys",
    overview: "Based on a true story, a group of high-spirited friends from a small town in Kerala embark on a holiday trip to the infamous Guna Caves in Kodaikanal, turning into a breathtaking, nail-biting rescue mission when one falls deep into a narrow abyss.",
    poster_path: POSTERS.manjummel,
    backdrop_path: BACKDROPS.manjummel,
    vote_average: 8.6,
    vote_count: 820,
    release_date: "2024-02-22",
    original_language: "ml",
    genre_ids: [18, 53],
    popularity: 93.6,
    runtime: 135,
    adult: false
  },
  {
    id: 2006,
    title: "Kalki 2898 AD",
    original_title: "Kalki 2898 AD",
    overview: "In a desolate, resource-depleted futuristic world ruled by a supreme tyrant, a legendary hero emerges to protect a pregnant woman carrying a divine child destined to reset the universe and launch a new golden age.",
    poster_path: POSTERS.kalki,
    backdrop_path: BACKDROPS.kalki,
    vote_average: 8.5,
    vote_count: 1980,
    release_date: "2024-06-27",
    original_language: "te",
    genre_ids: [28, 878, 12],
    popularity: 120.4,
    runtime: 181,
    adult: false
  },
  // Hollywood (English) - en
  {
    id: 3001,
    title: "Dune: Part Two",
    original_title: "Dune: Part Two",
    overview: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future only he can foresee.",
    poster_path: POSTERS.dune2,
    backdrop_path: BACKDROPS.dune2,
    vote_average: 8.6,
    vote_count: 4210,
    release_date: "2024-03-01",
    original_language: "en",
    genre_ids: [878, 12, 18],
    popularity: 155.4,
    runtime: 166,
    adult: false
  },
  {
    id: 3002,
    title: "Oppenheimer",
    original_title: "Oppenheimer",
    overview: "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II, showing the high-stakes laboratories, deep political paranoia, and the haunting aftermath of scientific discovery.",
    poster_path: POSTERS.oppenheimer,
    backdrop_path: BACKDROPS.oppenheimer,
    vote_average: 8.9,
    vote_count: 6812,
    release_date: "2023-07-21",
    original_language: "en",
    genre_ids: [18, 36, 12],
    popularity: 132.5,
    runtime: 180,
    adult: false
  },
  {
    id: 3003,
    title: "Interstellar",
    original_title: "Interstellar",
    overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
    poster_path: POSTERS.interstellar,
    backdrop_path: BACKDROPS.interstellar,
    vote_average: 8.7,
    vote_count: 19800,
    release_date: "2014-11-07",
    original_language: "en",
    genre_ids: [878, 12, 18],
    popularity: 140.2,
    runtime: 169,
    adult: false
  },
  {
    id: 3004,
    title: "Blade Runner 2049",
    original_title: "Blade Runner 2049",
    overview: "A new blade runner, LAPD Officer K, unearths a long-buried secret that has the potential to plunge what's left of society into chaos. His discovery leads him on a quest to find Rick Deckard, a former blade runner who's been missing for 30 years.",
    poster_path: POSTERS.bladerunner,
    backdrop_path: BACKDROPS.bladerunner,
    vote_average: 8,
    vote_count: 12500,
    release_date: "2017-10-06",
    original_language: "en",
    genre_ids: [878, 18, 53],
    popularity: 95.8,
    runtime: 164,
    adult: false
  },
  {
    id: 3005,
    title: "The Dark Knight",
    original_title: "The Dark Knight",
    overview: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker.",
    poster_path: POSTERS.darkknight,
    backdrop_path: BACKDROPS.darkknight,
    vote_average: 9,
    vote_count: 31200,
    release_date: "2008-07-18",
    original_language: "en",
    genre_ids: [28, 80, 53],
    popularity: 150.1,
    runtime: 152,
    adult: false
  }
];
var MOCK_TV = [
  // Anime (Japanese) - ja
  {
    id: 4001,
    name: "Demon Slayer: Kimetsu no Yaiba",
    original_name: "\u9B3C\u6EC5\u306E\u5203",
    overview: 'It is the Taisho Period in Japan. Tanjiro, a kindhearted boy who sells charcoal for a living, finds his family slaughtered by a demon. To make matters worse, his younger sister Nezuko, the sole survivor, has been transformed into a demon herself. Though devastated, Tanjiro resolves to become a "demon slayer" so that he can turn his sister back into a human and kill the demon who massacred his family.',
    poster_path: POSTERS.demonslayer,
    backdrop_path: BACKDROPS.demonslayer,
    vote_average: 8.7,
    vote_count: 5800,
    first_air_date: "2019-04-06",
    original_language: "ja",
    genre_ids: [16, 10759, 14],
    popularity: 145.2,
    number_of_seasons: 4,
    number_of_episodes: 55
  },
  {
    id: 4002,
    name: "Attack on Titan",
    original_name: "\u9032\u6483\u306E\u5DE8\u4EBA",
    overview: "Several hundred years ago, humans were nearly exterminated by Titans. Titans are typically several stories tall, seem to have no intelligence, devour human beings and, worst of all, seem to do it for the pleasure rather than as a food source. Eren Yeager vows to wipe out every single titan on earth after witnessing a catastrophic breach of the protective walls.",
    poster_path: POSTERS.aot,
    backdrop_path: BACKDROPS.aot,
    vote_average: 8.9,
    vote_count: 9800,
    first_air_date: "2013-04-07",
    original_language: "ja",
    genre_ids: [16, 10759, 10765],
    popularity: 130.4,
    number_of_seasons: 4,
    number_of_episodes: 88
  },
  // Korean Dramas (K-Dramas) - ko
  {
    id: 5001,
    name: "Squid Game",
    original_name: "\uC624\uC9D5\uC5B4 \uAC8C\uC784",
    overview: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games. Inside, a tempting prize awaits\u2014with deadly high stakes. A survival game that has a whopping 45.6 billion won prize pool at stake.",
    poster_path: POSTERS.squidgame,
    backdrop_path: BACKDROPS.squidgame,
    vote_average: 8.3,
    vote_count: 12400,
    first_air_date: "2021-09-17",
    original_language: "ko",
    genre_ids: [10759, 9648, 18],
    popularity: 165.1,
    number_of_seasons: 2,
    number_of_episodes: 18
  },
  {
    id: 5002,
    name: "Crash Landing on You",
    original_name: "\uC0AC\uB791\uC758 \uBD88\uC2DC\uCC29",
    overview: "A paragliding mishap drops a South Korean heiress in North Korea - and into the life of an army officer, who decides he will help her hide and escape safely, igniting a deeply passionate cross-border romance.",
    poster_path: POSTERS.cloy,
    backdrop_path: BACKDROPS.cloy,
    vote_average: 8.8,
    vote_count: 3200,
    first_air_date: "2019-12-14",
    original_language: "ko",
    genre_ids: [18, 35, 10749],
    popularity: 94.2,
    number_of_seasons: 1,
    number_of_episodes: 16
  },
  {
    id: 5003,
    name: "Queen of Tears",
    original_name: "\uB208\uBB3C\uC758 \uC5EC\uC655",
    overview: "The queen of department stores and the prince of supermarkets weather a marital crisis\u2014until love miraculously begins to bloom again amidst corporate rivalry, deep emotional scars, and a shock terminal diagnosis.",
    poster_path: POSTERS.queenoftears,
    backdrop_path: BACKDROPS.queenoftears,
    vote_average: 8.7,
    vote_count: 1100,
    first_air_date: "2024-03-09",
    original_language: "ko",
    genre_ids: [18, 35, 10749],
    popularity: 112.5,
    number_of_seasons: 1,
    number_of_episodes: 16
  },
  // Premium Platform Web Series
  {
    id: 6001,
    name: "Sh\u014Dgun",
    original_name: "Sh\u014Dgun",
    overview: "Set in Japan in the year 1600, Lord Yoshii Toranaga is fighting for his life as his enemies on the Council of Regents unite against him, when a mysterious European ship is found marooned in a nearby fishing village.",
    poster_path: POSTERS.shogun,
    backdrop_path: BACKDROPS.shogun,
    vote_average: 8.8,
    vote_count: 1950,
    first_air_date: "2024-02-27",
    original_language: "en",
    genre_ids: [18, 36, 10768],
    popularity: 148.5,
    number_of_seasons: 1,
    number_of_episodes: 10
  }
];
var ALL_CINEMATIC = [...MOCK_MOVIES, ...MOCK_TV];
function handleMockRequest(targetPath, query) {
  if (targetPath === "genre/movie/list") {
    return {
      genres: [
        { id: 28, name: "Action" },
        { id: 12, name: "Adventure" },
        { id: 16, name: "Animation" },
        { id: 35, name: "Comedy" },
        { id: 80, name: "Crime" },
        { id: 18, name: "Drama" },
        { id: 14, name: "Fantasy" },
        { id: 36, name: "History" },
        { id: 27, name: "Horror" },
        { id: 9648, name: "Mystery" },
        { id: 10749, name: "Romance" },
        { id: 878, name: "Sci-Fi" },
        { id: 53, name: "Thriller" }
      ]
    };
  }
  if (targetPath === "genre/tv/list") {
    return {
      genres: [
        { id: 10759, name: "Action & Adventure" },
        { id: 16, name: "Animation" },
        { id: 35, name: "Comedy" },
        { id: 80, name: "Crime" },
        { id: 18, name: "Drama" },
        { id: 9648, name: "Mystery" },
        { id: 10765, name: "Sci-Fi & Fantasy" }
      ]
    };
  }
  const parts = targetPath.split("/");
  if (parts.length === 2 && parts[0] === "movie") {
    const id = parseInt(parts[1], 10);
    const movie = MOCK_MOVIES.find((m) => m.id === id) || MOCK_MOVIES[0];
    return {
      ...movie,
      genres: movie.genre_ids.map((gid) => ({ id: gid, name: gid === 28 ? "Action" : gid === 12 ? "Adventure" : gid === 878 ? "Sci-Fi" : gid === 18 ? "Drama" : gid === 35 ? "Comedy" : gid === 80 ? "Crime" : "Cinema" }))
    };
  }
  if (parts.length === 2 && parts[0] === "tv") {
    const id = parseInt(parts[1], 10);
    const show = MOCK_TV.find((t) => t.id === id) || MOCK_TV[0];
    return {
      ...show,
      genres: show.genre_ids.map((gid) => ({ id: gid, name: gid === 16 ? "Animation" : gid === 10759 ? "Action & Adventure" : gid === 18 ? "Drama" : gid === 10765 ? "Sci-Fi & Fantasy" : gid === 35 ? "Comedy" : "Drama" }))
    };
  }
  if (targetPath.startsWith("movie/") && targetPath.endsWith("/credits")) {
    const id = parseInt(targetPath.split("/")[1]);
    return {
      id,
      cast: [
        { id: 1, name: "Shah Rukh Khan", character: "Lead Actor", profile_path: null },
        { id: 2, name: "Deepika Padukone", character: "Lead Actress", profile_path: null },
        { id: 3, name: "Vijay Sethupathi", character: "Antagonist", profile_path: null },
        { id: 4, name: "Timoth\xE9e Chalamet", character: "Paul Atreides", profile_path: null },
        { id: 5, name: "Zendaya", character: "Chani", profile_path: null },
        { id: 6, name: "Cillian Murphy", character: "J. Robert Oppenheimer", profile_path: null }
      ]
    };
  }
  if (targetPath.startsWith("tv/") && targetPath.endsWith("/credits")) {
    const id = parseInt(targetPath.split("/")[1]);
    return {
      id,
      cast: [
        { id: 11, name: "Natsuki Hanae", character: "Tanjiro Kamado", profile_path: null },
        { id: 12, name: "Akari Kito", character: "Nezuko Kamado", profile_path: null },
        { id: 13, name: "Lee Jung-jae", character: "Seong Gi-hun", profile_path: null },
        { id: 14, name: "Park Hae-soo", character: "Cho Sang-woo", profile_path: null },
        { id: 15, name: "Kim Soo-hyun", character: "Baek Hyun-woo", profile_path: null },
        { id: 16, name: "Kim Ji-won", character: "Hong Hae-in", profile_path: null }
      ]
    };
  }
  if (targetPath.startsWith("movie/") && targetPath.endsWith("/videos")) {
    const id = parseInt(targetPath.split("/")[1]);
    let key = "dQw4w9WgXcQ";
    if (id === 1001) key = "COv527yNh_4";
    if (id === 1002) key = "vqu4z34wENw";
    if (id === 1003) key = "8FkLRUJj-C0";
    if (id === 2001) key = "gKizDojsdvs";
    if (id === 2002) key = "NgBoMJy386M";
    if (id === 2006) key = "kUdB8N9P_A0";
    if (id === 3001) key = "Way9Dexny3w";
    if (id === 3002) key = "uYPbbksJxIg";
    if (id === 3003) key = "zSWdZVtXT7E";
    return {
      id,
      results: [
        {
          id: "trailer-1",
          key,
          name: "Official Trailer",
          site: "YouTube",
          type: "Trailer",
          official: true
        }
      ]
    };
  }
  if (targetPath.startsWith("tv/") && targetPath.endsWith("/videos")) {
    const id = parseInt(targetPath.split("/")[1]);
    let key = "dQw4w9WgXcQ";
    if (id === 4001) key = "VQGCKyvzIM4";
    if (id === 4002) key = "MGRm4IzK1SQ";
    if (id === 5001) key = "oqxAJKy0R4A";
    if (id === 5002) key = "eXbZ5f7_iLY";
    if (id === 5003) key = "r-bS7g_2D9c";
    if (id === 6001) key = "f5Z77X8G4i8";
    return {
      id,
      results: [
        {
          id: "trailer-2",
          key,
          name: "Official Trailer",
          site: "YouTube",
          type: "Trailer",
          official: true
        }
      ]
    };
  }
  if (targetPath.startsWith("tv/") && targetPath.includes("/season/")) {
    const parts2 = targetPath.split("/");
    const showId = parseInt(parts2[1]);
    const seasonNumber = parseInt(parts2[3]);
    const show = MOCK_TV.find((t) => t.id === showId) || MOCK_TV[0];
    const totalEpisodes = show.number_of_episodes || 10;
    const episodes = Array.from({ length: totalEpisodes }).map((_, i) => ({
      air_date: "2023-10-12",
      episode_number: i + 1,
      id: showId * 100 + i + 1,
      name: `Episode ${i + 1}: ${show.name} Saga`,
      overview: `A gripping episode focusing on the core stakes of the conflict. The protagonists find themselves faced with intense choices as alliances are tested and secrets are revealed in this high-production chapter.`,
      production_code: `EP-${showId}-${i + 1}`,
      runtime: 45 + i * 3 % 20,
      season_number: seasonNumber,
      show_id: showId,
      still_path: show.backdrop_path,
      vote_average: 8.2 + i % 5 * 0.2,
      vote_count: 150 + i * 20
    }));
    return {
      _id: `season-id-${showId}-${seasonNumber}`,
      air_date: show.first_air_date || "2023-01-01",
      episodes,
      name: `Season ${seasonNumber}`,
      overview: `The explosive and critically acclaimed Season ${seasonNumber} of ${show.name}, filled with unparalleled tension, stunning photography, and stellar performances.`,
      id: showId * 10 + seasonNumber,
      poster_path: show.poster_path,
      season_number: seasonNumber
    };
  }
  if (targetPath.includes("/similar") || targetPath.includes("/recommendations")) {
    const isTv = targetPath.startsWith("tv/");
    const list = isTv ? MOCK_TV : MOCK_MOVIES;
    return {
      page: 1,
      results: list.slice(0, 5),
      total_pages: 1,
      total_results: list.length
    };
  }
  if (targetPath.startsWith("search/")) {
    const searchTerm = String(query.query || "").trim().toLowerCase();
    let sourceList = [];
    if (targetPath.endsWith("tv")) {
      sourceList = MOCK_TV.map((item) => ({ ...item, media_type: "tv" }));
    } else if (targetPath.endsWith("movie")) {
      sourceList = MOCK_MOVIES.map((item) => ({ ...item, media_type: "movie" }));
    } else {
      sourceList = [
        ...MOCK_MOVIES.map((item) => ({ ...item, media_type: "movie" })),
        ...MOCK_TV.map((item) => ({ ...item, media_type: "tv" }))
      ];
    }
    if (!searchTerm) {
      return { page: 1, results: sourceList, total_pages: 1, total_results: sourceList.length };
    }
    const filtered = sourceList.filter((item) => {
      const title = String(item.title || item.name || "").toLowerCase();
      const overview = String(item.overview || "").toLowerCase();
      return title.includes(searchTerm) || overview.includes(searchTerm);
    });
    return {
      page: 1,
      results: filtered,
      total_pages: 1,
      total_results: filtered.length
    };
  }
  if (targetPath === "discover/movie") {
    let list = [...MOCK_MOVIES];
    if (query.with_original_language) {
      const langs = query.with_original_language.split("|");
      list = list.filter((m) => langs.includes(m.original_language));
    }
    if (query.with_genres) {
      const gid = parseInt(query.with_genres);
      list = list.filter((m) => m.genre_ids.includes(gid));
    }
    return {
      page: 1,
      results: list,
      total_pages: 1,
      total_results: list.length
    };
  }
  if (targetPath === "discover/tv") {
    let list = [...MOCK_TV];
    if (query.with_original_language) {
      const langs = query.with_original_language.split("|");
      list = list.filter((m) => langs.includes(m.original_language));
    }
    if (query.with_genres) {
      const gid = parseInt(query.with_genres);
      list = list.filter((m) => m.genre_ids.includes(gid));
    }
    return {
      page: 1,
      results: list,
      total_pages: 1,
      total_results: list.length
    };
  }
  const isTvEndpoint = targetPath.includes("tv");
  const items = isTvEndpoint ? MOCK_TV : MOCK_MOVIES;
  return {
    page: 1,
    results: items,
    total_pages: 1,
    total_results: items.length
  };
}

// src/lib/sitemap.ts
var DEFAULT_BASE_URL = "https://moviyfly.vercel.app";
function formatSitemapDate(date = /* @__PURE__ */ new Date()) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
function normalizeSitemapDate(input) {
  if (!input) {
    return formatSitemapDate();
  }
  if (input instanceof Date) {
    return formatSitemapDate(input);
  }
  const match = input.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  const parsed = new Date(input);
  if (!isNaN(parsed.getTime())) {
    return formatSitemapDate(parsed);
  }
  return formatSitemapDate();
}
function getCoreRoutes(options) {
  const baseUrl = options?.baseUrl || DEFAULT_BASE_URL;
  const lastmod = options?.defaultLastMod || formatSitemapDate();
  return [
    {
      loc: `${baseUrl}/`,
      lastmod,
      changefreq: "daily",
      priority: 1
    },
    {
      loc: `${baseUrl}/movies`,
      lastmod,
      changefreq: "daily",
      priority: 0.9
    },
    {
      loc: `${baseUrl}/tvshows`,
      lastmod,
      changefreq: "daily",
      priority: 0.9
    },
    {
      loc: `${baseUrl}/watchlist`,
      lastmod,
      changefreq: "weekly",
      priority: 0.7
    },
    {
      loc: `${baseUrl}/search`,
      lastmod,
      changefreq: "weekly",
      priority: 0.6
    }
  ];
}
function getMovieSlug(item) {
  const idStr = String(item.id);
  if (idStr.startsWith("movie-")) {
    return idStr;
  }
  return `movie-${idStr}`;
}
function getTVSlug(item) {
  const idStr = String(item.id);
  if (idStr.startsWith("tv-")) {
    return idStr;
  }
  return `tv-${idStr}`;
}
function generateMovieSitemapEntry(item, options) {
  const baseUrl = options?.baseUrl || DEFAULT_BASE_URL;
  const slug = getMovieSlug(item);
  return {
    loc: `${baseUrl}/movie/${slug}`,
    lastmod: normalizeSitemapDate(item.lastmod),
    changefreq: "weekly",
    priority: 0.8
  };
}
function generateTVSitemapEntry(item, options) {
  const baseUrl = options?.baseUrl || DEFAULT_BASE_URL;
  const slug = getTVSlug(item);
  return {
    loc: `${baseUrl}/tv/${slug}`,
    lastmod: normalizeSitemapDate(item.lastmod),
    changefreq: "weekly",
    priority: 0.8
  };
}
var moviesCache = null;
var tvsCache = null;
var CACHE_DURATION_MS = 24 * 60 * 60 * 1e3;
async function fetchMoviesFromTMDB(baseUrl) {
  const now = Date.now();
  if (moviesCache && now - moviesCache.lastFetched < CACHE_DURATION_MS) {
    console.log(`[Sitemap Cache] Serving cached movie list. Age: ${Math.round((now - moviesCache.lastFetched) / 1e3)} seconds.`);
    return moviesCache.data;
  }
  console.log("[Sitemap Cache] Fetching fresh movie data from TMDB endpoints...");
  const fetched = await fetchFreshMoviesFromTMDB(baseUrl);
  if (fetched.length > 0) {
    moviesCache = {
      data: fetched,
      lastFetched: now
    };
    return fetched;
  } else if (moviesCache && moviesCache.data.length > 0) {
    console.warn("[Sitemap Cache] TMDB movie fetch failed. Serving stale cache as fallback.");
    return moviesCache.data;
  }
  return [];
}
async function fetchFreshMoviesFromTMDB(baseUrl) {
  const endpoints = [
    "/movie/popular",
    "/movie/top_rated",
    "/movie/now_playing",
    "/movie/upcoming",
    "/trending/movie/week"
  ];
  const allMovies = [];
  try {
    const promises = endpoints.map(
      (endpoint) => fetch(`${baseUrl}/api/tmdb${endpoint}`).then((res) => {
        if (!res.ok) {
          console.error(`Sitemap TMDB Fetch Error for ${endpoint}: Status ${res.status}`);
          return null;
        }
        return res.json();
      }).catch((err) => {
        console.error(`Sitemap TMDB Fetch Exception for ${endpoint}:`, err);
        return null;
      })
    );
    const results = await Promise.all(promises);
    for (const data of results) {
      if (data && Array.isArray(data.results)) {
        for (const movie of data.results) {
          if (movie && movie.id) {
            const hasReleaseDate = !!movie.release_date && typeof movie.release_date === "string" && movie.release_date.trim().length > 0;
            allMovies.push({
              id: movie.id,
              title: movie.title || movie.original_title || "Untitled Movie",
              lastmod: hasReleaseDate ? normalizeSitemapDate(movie.release_date) : formatSitemapDate(),
              popularity: typeof movie.popularity === "number" ? movie.popularity : 0
            });
          }
        }
      }
    }
  } catch (err) {
    console.error("Failed to fetch movies from TMDB for sitemap:", err);
  }
  const seenIds = /* @__PURE__ */ new Set();
  const uniqueMovies = [];
  let releaseDateCount = 0;
  for (const movie of allMovies) {
    if (!seenIds.has(movie.id)) {
      seenIds.add(movie.id);
      uniqueMovies.push(movie);
      if (movie.lastmod && movie.lastmod !== formatSitemapDate()) {
        releaseDateCount++;
      }
    }
  }
  uniqueMovies.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
  console.log(`[Sitemap Generator] Movie duplicates removed and sorted by popularity. Total: ${uniqueMovies.length}. Items with native release_date: ${releaseDateCount}.`);
  return uniqueMovies;
}
async function fetchTVsFromTMDB(baseUrl) {
  const now = Date.now();
  if (tvsCache && now - tvsCache.lastFetched < CACHE_DURATION_MS) {
    console.log(`[Sitemap Cache] Serving cached TV list. Age: ${Math.round((now - tvsCache.lastFetched) / 1e3)} seconds.`);
    return tvsCache.data;
  }
  console.log("[Sitemap Cache] Fetching fresh TV data from TMDB endpoints...");
  const fetched = await fetchFreshTVsFromTMDB(baseUrl);
  if (fetched.length > 0) {
    tvsCache = {
      data: fetched,
      lastFetched: now
    };
    return fetched;
  } else if (tvsCache && tvsCache.data.length > 0) {
    console.warn("[Sitemap Cache] TMDB TV fetch failed. Serving stale cache as fallback.");
    return tvsCache.data;
  }
  return [];
}
async function fetchFreshTVsFromTMDB(baseUrl) {
  const endpoints = [
    "/tv/popular",
    "/tv/top_rated",
    "/trending/tv/week"
  ];
  const allTVs = [];
  try {
    const promises = endpoints.map(
      (endpoint) => fetch(`${baseUrl}/api/tmdb${endpoint}`).then((res) => {
        if (!res.ok) {
          console.error(`Sitemap TMDB Fetch Error for ${endpoint}: Status ${res.status}`);
          return null;
        }
        return res.json();
      }).catch((err) => {
        console.error(`Sitemap TMDB Fetch Exception for ${endpoint}:`, err);
        return null;
      })
    );
    const results = await Promise.all(promises);
    for (const data of results) {
      if (data && Array.isArray(data.results)) {
        for (const tv of data.results) {
          if (tv && tv.id) {
            const hasFirstAirDate = !!tv.first_air_date && typeof tv.first_air_date === "string" && tv.first_air_date.trim().length > 0;
            allTVs.push({
              id: tv.id,
              name: tv.name || tv.original_name || "Untitled TV Show",
              lastmod: hasFirstAirDate ? normalizeSitemapDate(tv.first_air_date) : formatSitemapDate(),
              popularity: typeof tv.popularity === "number" ? tv.popularity : 0
            });
          }
        }
      }
    }
  } catch (err) {
    console.error("Failed to fetch TV shows from TMDB for sitemap:", err);
  }
  const seenIds = /* @__PURE__ */ new Set();
  const uniqueTVs = [];
  let firstAirDateCount = 0;
  for (const tv of allTVs) {
    if (!seenIds.has(tv.id)) {
      seenIds.add(tv.id);
      uniqueTVs.push(tv);
      if (tv.lastmod && tv.lastmod !== formatSitemapDate()) {
        firstAirDateCount++;
      }
    }
  }
  uniqueTVs.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
  console.log(`[Sitemap Generator] TV duplicates removed and sorted by popularity. Total: ${uniqueTVs.length}. Items with native first_air_date: ${firstAirDateCount}.`);
  return uniqueTVs;
}
function paginateEntries(items, page, pageSize = 1e3) {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  if (startIndex < 0 || startIndex >= items.length) return [];
  return items.slice(startIndex, endIndex);
}
function validateSitemapProtocol(xml, isIndex = false) {
  const errors = [];
  const byteLength = typeof Buffer !== "undefined" ? Buffer.from(xml, "utf-8").byteLength : xml.length * 2;
  if (byteLength > 52428800) {
    errors.push(`Sitemap size of ${byteLength} bytes exceeds the 50 MB uncompressed protocol limit.`);
  }
  if (!xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')) {
    errors.push("Sitemap missing standard XML UTF-8 declaration.");
  }
  if (isIndex) {
    if (!xml.includes("<sitemapindex") || !xml.includes("</sitemapindex>")) {
      errors.push("Sitemap index is missing valid <sitemapindex> envelope tags.");
    }
    if (!xml.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')) {
      errors.push("Sitemap index is missing correct xmlns namespace.");
    }
    const sitemapCount = (xml.match(/<sitemap>/g) || []).length;
    if (sitemapCount > 5e4) {
      errors.push(`Sitemap index contains ${sitemapCount} sitemaps, exceeding the 50,000 limit.`);
    }
  } else {
    if (!xml.includes("<urlset") || !xml.includes("</urlset>")) {
      errors.push("Sitemap is missing valid <urlset> envelope tags.");
    }
    if (!xml.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')) {
      errors.push("Sitemap is missing correct xmlns namespace.");
    }
    const urlCount = (xml.match(/<url>/g) || []).length;
    if (urlCount > 5e4) {
      errors.push(`Sitemap contains ${urlCount} URLs, exceeding the 50,000 limit per sitemap file.`);
    }
    const locMatches = xml.match(/<loc>(.*?)<\/loc>/g);
    if (locMatches) {
      for (const locTag of locMatches) {
        const urlText = locTag.replace(/<\/?loc>/g, "");
        if (urlText.includes("&") && !/&amp;|&quot;|&apos;|&lt;|&gt;/.test(urlText)) {
          errors.push(`Sitemap contains unescaped ampersand in location: ${urlText}`);
        }
      }
    }
  }
  return {
    valid: errors.length === 0,
    errors
  };
}
function generateSitemapIndexXml(sitemapUrls) {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  const indexStart = '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const indexEnd = "</sitemapindex>";
  const lastmod = formatSitemapDate();
  const xmlSitemaps = sitemapUrls.map((url) => {
    return [
      "  <sitemap>",
      `    <loc>${url}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      "  </sitemap>"
    ].join("\n");
  });
  const xml = [xmlHeader, indexStart, ...xmlSitemaps, indexEnd].join("\n");
  const validation = validateSitemapProtocol(xml, true);
  if (!validation.valid) {
    console.error(`[Sitemap Validator] Validation errors in sitemap index:`, validation.errors);
  } else {
    console.log(`[Sitemap Validator] Sitemap index is 100% compliant with Google/Sitemaps.org protocol.`);
  }
  return xml;
}
function generateSitemapRegistry(movies, tvs, options) {
  const baseUrl = options?.baseUrl || DEFAULT_BASE_URL;
  const pageSize = options?.pageSize || 5e4;
  const sortedMovies = [...movies].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
  const sortedTVs = [...tvs].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
  const totalMoviePages = Math.max(1, Math.ceil(sortedMovies.length / pageSize));
  const totalTvPages = Math.max(1, Math.ceil(sortedTVs.length / pageSize));
  const indexUrls = [`${baseUrl}/sitemaps/static.xml`];
  for (let page = 1; page <= totalMoviePages; page++) {
    indexUrls.push(`${baseUrl}/sitemaps/movies-${page}.xml`);
  }
  for (let page = 1; page <= totalTvPages; page++) {
    indexUrls.push(`${baseUrl}/sitemaps/tv-${page}.xml`);
  }
  const coreEntries = getCoreRoutes(options);
  return {
    index: indexUrls,
    getSitemapContent: (filename) => {
      let content = null;
      if (filename === "static.xml") {
        content = buildSitemapXml(coreEntries);
      } else {
        const movieMatch = filename.match(/^movies-(\d+)\.xml$/);
        if (movieMatch) {
          const page = parseInt(movieMatch[1], 10);
          if (page >= 1 && page <= totalMoviePages) {
            const chunk = paginateEntries(sortedMovies, page, pageSize);
            const entries = chunk.map((item) => generateMovieSitemapEntry(item, options));
            content = buildSitemapXml(entries);
          }
        } else {
          const tvMatch = filename.match(/^tv-(\d+)\.xml$/);
          if (tvMatch) {
            const page = parseInt(tvMatch[1], 10);
            if (page >= 1 && page <= totalTvPages) {
              const chunk = paginateEntries(sortedTVs, page, pageSize);
              const entries = chunk.map((item) => generateTVSitemapEntry(item, options));
              content = buildSitemapXml(entries);
            }
          }
        }
      }
      if (content !== null) {
        const validation = validateSitemapProtocol(content, false);
        if (!validation.valid) {
          console.error(`[Sitemap Validator] Validation errors found in ${filename}:`, validation.errors);
        } else {
          console.log(`[Sitemap Validator] ${filename} is 100% compliant with Google/Sitemaps.org protocol.`);
        }
      }
      return content;
    }
  };
}
function buildSitemapXml(entries) {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  const urlsetStart = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const urlsetEnd = "</urlset>";
  const escapeXml = (unsafe) => {
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case "<":
          return "&lt;";
        case ">":
          return "&gt;";
        case "&":
          return "&amp;";
        case "'":
          return "&apos;";
        case '"':
          return "&quot;";
        default:
          return c;
      }
    });
  };
  const xmlEntries = entries.map((entry) => {
    const lines = ["  <url>"];
    lines.push(`    <loc>${escapeXml(entry.loc)}</loc>`);
    if (entry.lastmod) {
      lines.push(`    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`);
    }
    if (entry.changefreq) {
      lines.push(`    <changefreq>${entry.changefreq}</changefreq>`);
    }
    if (entry.priority !== void 0 && entry.priority !== null) {
      lines.push(`    <priority>${entry.priority.toFixed(1)}</priority>`);
    }
    lines.push("  </url>");
    return lines.join("\n");
  });
  return [xmlHeader, urlsetStart, ...xmlEntries, urlsetEnd].join("\n");
}

// server.ts
import_dns.default.setDefaultResultOrder("ipv4first");
import_dotenv.default.config({ path: ".env.local" });
import_dotenv.default.config();
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json());
  const cache = /* @__PURE__ */ new Map();
  const CACHE_TTL = 10 * 60 * 1e3;
  let isTmdbOffline = false;
  let lastFailureTime = 0;
  const CIRCUIT_BREAKER_COOLDOWN = 5 * 60 * 1e3;
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  });
  app.get(["/robots.txt", "/api/robots"], (req, res) => {
    res.type("text/plain");
    res.set("Cache-Control", "public, max-age=86400");
    res.send(`User-agent: *
Allow: /

Sitemap: https://moviyfly.vercel.app/sitemap.xml
`);
  });
  app.get(["/sitemap.xml", "/api/sitemap"], async (req, res) => {
    try {
      const host = req.headers.host || "localhost:3000";
      const protocol = req.secure ? "https" : "http";
      const baseUrl = `${protocol}://${host}`;
      const [movies, tvs] = await Promise.all([
        fetchMoviesFromTMDB(baseUrl),
        fetchTVsFromTMDB(baseUrl)
      ]);
      const sub = req.query.sub;
      const registry = generateSitemapRegistry(movies, tvs, { baseUrl });
      res.set("Cache-Control", "public, max-age=43200, s-maxage=43200");
      if (sub) {
        const filename = sub.endsWith(".xml") ? sub : `${sub}.xml`;
        const content = registry.getSitemapContent(filename);
        if (content) {
          res.type("application/xml");
          res.send(content);
          return;
        } else {
          res.status(404).send("Sitemap not found");
          return;
        }
      }
      const indexXml = generateSitemapIndexXml(registry.index);
      res.type("application/xml");
      res.send(indexXml);
    } catch (err) {
      console.error("Error generating sitemap:", err);
      res.status(500).send("Internal Server Error");
    }
  });
  app.get("/sitemaps/:filename", async (req, res) => {
    try {
      const host = req.headers.host || "localhost:3000";
      const protocol = req.secure ? "https" : "http";
      const baseUrl = `${protocol}://${host}`;
      const [movies, tvs] = await Promise.all([
        fetchMoviesFromTMDB(baseUrl),
        fetchTVsFromTMDB(baseUrl)
      ]);
      const filename = req.params.filename;
      const registry = generateSitemapRegistry(movies, tvs, { baseUrl });
      res.set("Cache-Control", "public, max-age=43200, s-maxage=43200");
      const content = registry.getSitemapContent(filename);
      if (content) {
        res.type("application/xml");
        res.send(content);
      } else {
        res.status(404).send("Sitemap not found");
      }
    } catch (err) {
      console.error("Error serving sub sitemap:", err);
      res.status(500).send("Internal Server Error");
    }
  });
  function isMockId(idStr) {
    const idNum = parseInt(idStr, 10);
    if (isNaN(idNum)) return false;
    const mockIds = [
      1001,
      1002,
      1003,
      1004,
      1005,
      1006,
      1007,
      1008,
      1009,
      1010,
      1011,
      1012,
      1013,
      1014,
      1015,
      1016,
      1017,
      1018,
      1019,
      1020,
      1021,
      2001,
      2002,
      2003,
      2004,
      2005,
      2006,
      2007,
      2008,
      2009,
      2010,
      2011,
      3001,
      3002,
      3003,
      3004,
      3005,
      4001,
      4002,
      5001,
      5002,
      5003,
      6001
    ];
    return mockIds.includes(idNum);
  }
  app.all("/api/tmdb/*", async (req, res) => {
    const token = process.env.TMDB_READ_ACCESS_TOKEN || process.env.TMDB_ACCESS_TOKEN;
    const targetPath = req.params[0] || "";
    const queryParamsObj = {};
    if (req.query) {
      Object.entries(req.query).forEach(([k, v]) => {
        queryParamsObj[k] = String(v);
      });
    }
    const cacheKey = req.originalUrl;
    const now = Date.now();
    const pathParts = targetPath.split("/");
    const isMovieOrTvDetails = (pathParts[0] === "movie" || pathParts[0] === "tv") && pathParts[1] && /^\d+$/.test(pathParts[1]);
    const clickedTmdbId = isMovieOrTvDetails ? pathParts[1] : null;
    const hasValidTmdbId = clickedTmdbId && !isMockId(clickedTmdbId);
    const queryParams = new URLSearchParams(req.query).toString();
    const tmdbUrl = `https://api.themoviedb.org/3/${targetPath}${queryParams ? `?${queryParams}` : ""}`;
    if (clickedTmdbId && isMockId(clickedTmdbId)) {
      console.log(`[TMDB Proxy] Mock ID detected (${clickedTmdbId}). Routing to mock engine...`);
      try {
        const fallbackData = handleMockRequest(targetPath, queryParamsObj);
        return res.json(fallbackData);
      } catch (mockErr) {
        return res.status(500).json({
          error: "Mock data resolution failed",
          message: mockErr.message
        });
      }
    }
    if (cache.has(cacheKey)) {
      const cachedItem = cache.get(cacheKey);
      if (now < cachedItem.expiry) {
        if (hasValidTmdbId) {
          console.log(`[TMDB Proxy] Serving cached TMDB response for ID: ${clickedTmdbId}, endpoint: ${targetPath}`);
        }
        return res.json(cachedItem.data);
      }
    }
    if (isTmdbOffline && !hasValidTmdbId) {
      if (now - lastFailureTime < CIRCUIT_BREAKER_COOLDOWN) {
        console.log(`[TMDB Proxy] Circuit breaker active. Bypassing live TMDB API for endpoint: ${targetPath}`);
        try {
          const fallbackData = handleMockRequest(targetPath, queryParamsObj);
          return res.json(fallbackData);
        } catch (mockErr) {
          return res.status(500).json({
            error: "Internal server error",
            message: "TMDB API is offline and local fallback engine failed",
            details: mockErr.message
          });
        }
      } else {
        isTmdbOffline = false;
        console.log("[TMDB Proxy] Circuit breaker cooldown passed. Resetting to online mode.");
      }
    }
    if (!token) {
      const fallbackReason2 = "TMDB Read Access Token is missing in environment variables";
      console.log("--- TMDB PROXY DETAIL ---");
      console.log(`clicked TMDB ID: ${clickedTmdbId || "None"}`);
      console.log(`requested endpoint: ${tmdbUrl}`);
      console.log(`TMDB response status: No response (Token Detail)`);
      console.log(`fallback detail: ${fallbackReason2}`);
      console.log("-------------------------");
      try {
        const fallbackData = handleMockRequest(targetPath, queryParamsObj);
        return res.json(fallbackData);
      } catch (mockErr) {
        return res.status(500).json({
          error: "Missing TMDB Token & Fallback Engine failed",
          message: mockErr.message
        });
      }
    }
    let responseData = null;
    let responseOk = false;
    let responseStatus = "Unknown";
    let fallbackReason = null;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 1e4);
    try {
      console.log(`[TMDB Proxy] Requesting live TMDB -> ${tmdbUrl}`);
      const response = await fetch(tmdbUrl, {
        method: req.method,
        headers: {
          "Authorization": `Bearer ${token.trim()}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      responseStatus = response.status;
      if (response.ok) {
        responseData = await response.json();
        responseOk = true;
      } else {
        const statusText = response.statusText || "";
        fallbackReason = `TMDB returned non-OK status ${response.status}: ${statusText}`;
      }
    } catch (err) {
      clearTimeout(timeoutId);
      responseStatus = err.name === "AbortError" ? "offline/timeout" : "offline/network";
      fallbackReason = "offline status";
    }
    console.log("--- TMDB PROXY LOGGING ---");
    console.log(`clicked TMDB ID: ${clickedTmdbId || "None"}`);
    console.log(`requested endpoint: ${tmdbUrl}`);
    console.log(`TMDB response status: ${responseStatus}`);
    if (fallbackReason) {
      console.log(`fallback detail: ${fallbackReason}`);
    }
    console.log("--------------------------");
    if (responseOk && responseData) {
      if (req.method === "GET") {
        cache.set(cacheKey, {
          data: responseData,
          expiry: now + CACHE_TTL
        });
      }
      return res.json(responseData);
    }
    if (!hasValidTmdbId) {
      isTmdbOffline = true;
      lastFailureTime = Date.now();
      console.log(`[TMDB Proxy] Tripped circuit breaker for non-details endpoint: ${targetPath}`);
    }
    console.log(`[TMDB Proxy] TMDB live query unavailable (${responseStatus}). Serving from mock engine: ${targetPath}`);
    try {
      const fallbackData = handleMockRequest(targetPath, queryParamsObj);
      return res.json(fallbackData);
    } catch (mockErr) {
      if (hasValidTmdbId) {
        console.log(`[TMDB Proxy] Mock engine status for ${targetPath}. Generating dynamic data...`);
        const isTv = targetPath.startsWith("tv/");
        const isVideos = targetPath.endsWith("/videos");
        const isCredits = targetPath.endsWith("/credits");
        const isSimilar = targetPath.endsWith("/similar") || targetPath.endsWith("/recommendations");
        const id = clickedTmdbId ? parseInt(clickedTmdbId, 10) : 99999;
        if (isVideos) {
          return res.json({
            id,
            results: [
              {
                id: "trailer-fallback",
                key: "dQw4w9WgXcQ",
                name: "Official Trailer",
                site: "YouTube",
                type: "Trailer",
                official: true
              }
            ]
          });
        }
        if (isCredits) {
          return res.json({
            id,
            cast: [
              { id: 1, name: "Lead Actor", character: "Protagonist", profile_path: null },
              { id: 2, name: "Supporting Actor", character: "Antagonist", profile_path: null }
            ]
          });
        }
        if (isSimilar) {
          return res.json({
            page: 1,
            results: isTv ? [] : [],
            // Empty array is safe and valid
            total_pages: 1,
            total_results: 0
          });
        }
        return res.json({
          id,
          title: isTv ? "Cinematic TV Show" : "Cinematic Movie",
          name: isTv ? "Cinematic TV Show" : "Cinematic Movie",
          overview: "This title is temporarily unavailable due to a live TMDB connection timeout. Enjoy our offline catalog.",
          poster_path: "",
          backdrop_path: "",
          vote_average: 8,
          vote_count: 100,
          release_date: "2024-01-01",
          first_air_date: "2024-01-01",
          original_language: "en",
          genres: [{ id: 18, name: "Drama" }],
          runtime: 120,
          number_of_seasons: 1,
          number_of_episodes: 10
        });
      }
      return res.status(500).json({
        error: "Internal server error",
        message: "Both TMDB API and local fallback engine failed",
        details: mockErr.message
      });
    }
  });
  let viteInstance = null;
  function formatImageUrl(imagePath) {
    if (!imagePath) {
      return "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200";
    }
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    return `https://image.tmdb.org/t/p/w1280${imagePath}`;
  }
  function getShortDescription(desc) {
    if (!desc) return "Discover trending films, popular series, and build your personal watchlist on MoviyFly.";
    if (desc.length <= 200) return desc;
    return desc.substring(0, 197) + "...";
  }
  function injectMetaTags(html, meta) {
    let cleanedHtml = html;
    cleanedHtml = cleanedHtml.replace(/<title>[^]*?<\/title>/gi, "");
    cleanedHtml = cleanedHtml.replace(/<meta[^>]*?name="description"[^>]*?\/?>/gi, "");
    cleanedHtml = cleanedHtml.replace(/<link[^>]*?rel="canonical"[^>]*?\/?>/gi, "");
    cleanedHtml = cleanedHtml.replace(/<meta[^>]*?property="og:[^"]*"[^>]*?\/?>/gi, "");
    cleanedHtml = cleanedHtml.replace(/<meta[^>]*?name="twitter:[^"]*"[^>]*?\/?>/gi, "");
    const metaBlock = `
    <title>${meta.title}</title>
    <meta name="description" content="${meta.description.replace(/"/g, "&quot;")}" />
    <link rel="canonical" href="${meta.url}" />
    
    <!-- Open Graph / Facebook / Discord / Telegram / WhatsApp -->
    <meta property="og:title" content="${meta.title.replace(/"/g, "&quot;")}" />
    <meta property="og:description" content="${meta.description.replace(/"/g, "&quot;")}" />
    <meta property="og:type" content="${meta.type}" />
    <meta property="og:url" content="${meta.url}" />
    ${meta.image ? `<meta property="og:image" content="${meta.image}" />` : ""}
    <meta property="og:site_name" content="MoviyFly" />

    <!-- Twitter / X -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${meta.title.replace(/"/g, "&quot;")}" />
    <meta name="twitter:description" content="${meta.description.replace(/"/g, "&quot;")}" />
    ${meta.image ? `<meta name="twitter:image" content="${meta.image}" />` : ""}
    `.trim();
    cleanedHtml = cleanedHtml.replace(/<head>/i, `<head>
    ${metaBlock}`);
    return cleanedHtml;
  }
  async function fetchMetadataForRoute(type, idStr, token) {
    const idNum = parseInt(idStr, 10);
    if (isNaN(idNum)) return null;
    const targetPath = `${type}/${idStr}`;
    const queryParamsObj = {};
    if (isMockId(idStr) || !token) {
      try {
        const data = handleMockRequest(targetPath, queryParamsObj);
        if (data) {
          return {
            title: data.title || data.name || (type === "movie" ? "Cinematic Movie" : "Cinematic TV Show"),
            description: data.overview || "Watch on MoviyFly.",
            image: data.backdrop_path || data.poster_path || ""
          };
        }
      } catch (e) {
        console.error(`Mock fallback failed for ${targetPath}:`, e);
      }
    }
    if (token && !isMockId(idStr)) {
      const tmdbUrl = `https://api.themoviedb.org/3/${targetPath}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4e3);
      try {
        console.log(`[SEO Engine] Fetching live metadata from TMDB -> ${tmdbUrl}`);
        const response = await fetch(tmdbUrl, {
          headers: {
            "Authorization": `Bearer ${token.trim()}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (response.ok) {
          const data = await response.json();
          return {
            title: data.title || data.name || (type === "movie" ? "Cinematic Movie" : "Cinematic TV Show"),
            description: data.overview || "Watch on MoviyFly.",
            image: data.backdrop_path || data.poster_path || ""
          };
        }
      } catch (err) {
        clearTimeout(timeoutId);
        console.error(`[SEO Engine] Live metadata fetch failed for ${targetPath}. Falling back.`, err);
      }
    }
    try {
      const data = handleMockRequest(targetPath, queryParamsObj);
      if (data) {
        return {
          title: data.title || data.name || (type === "movie" ? "Cinematic Movie" : "Cinematic TV Show"),
          description: data.overview || "Watch on MoviyFly.",
          image: data.backdrop_path || data.poster_path || ""
        };
      }
    } catch (e) {
      return {
        title: type === "movie" ? "Cinematic Movie" : "Cinematic TV Show",
        description: "Discover trending films, popular series, and build your personal watchlist on MoviyFly.",
        image: ""
      };
    }
    return null;
  }
  app.get(["/movie/:id", "/tv/:id", "/watch/movie/:id", "/watch/tv/:id"], async (req, res, next) => {
    try {
      const { id } = req.params;
      const cleanId = id.replace("movie-", "").replace("tv-", "").split("-")[0];
      const pathName = req.path;
      const isTv = pathName.includes("/tv/") || pathName.includes("/watch/tv/");
      const type = isTv ? "tv" : "movie";
      const token = process.env.TMDB_READ_ACCESS_TOKEN || process.env.TMDB_ACCESS_TOKEN;
      const metaData = await fetchMetadataForRoute(type, cleanId, token);
      const isProd = process.env.NODE_ENV === "production";
      let html = "";
      if (!isProd) {
        const indexTemplate = import_fs.default.readFileSync(import_path.default.resolve(process.cwd(), "index.html"), "utf-8");
        html = await (viteInstance || app.get("vite")).transformIndexHtml(req.url, indexTemplate);
      } else {
        html = import_fs.default.readFileSync(import_path.default.resolve(process.cwd(), "dist/index.html"), "utf-8");
      }
      if (metaData) {
        const meta = {
          title: `${metaData.title} - MoviyFly`,
          description: getShortDescription(metaData.description),
          image: formatImageUrl(metaData.image),
          url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
          type: isTv ? "video.tv_show" : "video.movie"
        };
        html = injectMetaTags(html, meta);
      }
      res.set("Content-Type", "text/html");
      res.send(html);
    } catch (err) {
      console.error("Error in SEO meta injection:", err);
      next();
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    viteInstance = vite;
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
