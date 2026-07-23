import * as React from 'react';
import {
  ArrowRight,
  MessageCircle,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { navigate } from '../../lib/router';

export const LandingPage: React.FC = () => {
  const [copied, setCopied] = React.useState(false);
  const [showToast, setShowToast] = React.useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin);
    setCopied(true);
    setShowToast(true);
    setTimeout(() => {
      setCopied(false);
      setShowToast(false);
    }, 3000);
  };

  // Dynamically Inject SEO Metadata & JSON-LD schema on mount
  React.useEffect(() => {
    const seoTitle = "MoviyFly - Stream Movies, TV Shows, Anime & K-Dramas";
    const seoDesc = "Discover trending movies, TV shows, anime and K-dramas on MoviyFly. Browse thousands of titles, explore new releases, and enjoy a modern entertainment discovery platform.";
    const canonicalUrl = "https://moviyfly.vercel.app/";
    const ogImage = "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200";

    // 1. Title & Description
    document.title = seoTitle;
    
    let descMeta = document.querySelector('meta[name="description"]');
    if (!descMeta) {
      descMeta = document.createElement('meta');
      descMeta.setAttribute('name', 'description');
      document.head.appendChild(descMeta);
    }
    descMeta.setAttribute('content', seoDesc);

    // 2. Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // 3. Open Graph Metadata
    const setOgMeta = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    setOgMeta('og:title', seoTitle);
    setOgMeta('og:description', seoDesc);
    setOgMeta('og:image', ogImage);
    setOgMeta('og:url', canonicalUrl);
    setOgMeta('og:type', 'website');
    setOgMeta('og:site_name', 'MoviyFly');

    // 4. Twitter Card Metadata
    const setTwitterMeta = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    setTwitterMeta('twitter:card', 'summary_large_image');
    setTwitterMeta('twitter:title', seoTitle);
    setTwitterMeta('twitter:description', seoDesc);
    setTwitterMeta('twitter:image', ogImage);

    // 5. Inject Structured Data JSON-LD
    let schemaScript = document.getElementById('moviyfly-landing-schema') as HTMLScriptElement | null;
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'moviyfly-landing-schema';
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }

    const schemaGraph = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": `${canonicalUrl}#website`,
          "url": canonicalUrl,
          "name": "MoviyFly",
          "description": seoDesc,
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${canonicalUrl}search?q={search_term_string}`,
            "query-input": "required name=search_term_string"
          },
          "inLanguage": "en"
        },
        {
          "@type": "Organization",
          "@id": `${canonicalUrl}#organization`,
          "name": "MoviyFly",
          "url": canonicalUrl,
          "logo": {
            "@type": "ImageObject",
            "url": `${canonicalUrl}assets/logo.svg`
          }
        },
        {
          "@type": "BreadcrumbList",
          "@id": `${canonicalUrl}#breadcrumb`,
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": canonicalUrl
            }
          ]
        }
      ]
    };

    schemaScript.textContent = JSON.stringify(schemaGraph, null, 2);

    return () => {
      if (schemaScript) {
        schemaScript.remove();
      }
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#282828] text-[#FFFFFF] selection:bg-[#8B5CF6]/40 relative overflow-x-hidden font-sans scroll-smooth">
      {/* Self-contained styling for Space Grotesk and minimal fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
        
        .font-display {
          font-family: 'Space Grotesk', 'Inter', sans-serif;
        }
        
        .font-body {
          font-family: 'Inter', sans-serif;
        }

        .landing-logo {
          width: 64px !important;
          height: 64px !important;
        }

        .landing-title {
          font-size: 38px;
          line-height: 1.1;
        }
        @media (min-width: 640px) {
          .landing-title {
            font-size: 54px;
          }
        }
        @media (min-width: 1024px) {
          .landing-title {
            font-size: 72px;
          }
        }

        .landing-subtitle {
          font-size: 22px;
          line-height: 1.2;
        }
        @media (min-width: 640px) {
          .landing-subtitle {
            font-size: 28px;
          }
        }
        @media (min-width: 1024px) {
          .landing-subtitle {
            font-size: 34px;
          }
        }

        .landing-desc {
          font-size: 16px;
          line-height: 1.5;
        }
        @media (min-width: 640px) {
          .landing-desc {
            font-size: 18px;
          }
        }
        @media (min-width: 1024px) {
          .landing-desc {
            font-size: 22px;
            line-height: 1.6;
          }
        }

        .landing-btn-primary {
          font-size: 16px;
        }
        @media (min-width: 640px) {
          .landing-btn-primary {
            font-size: 20px;
          }
        }

        .custom-prose h2 {
          font-family: 'Space Grotesk', 'Inter', sans-serif;
          color: #FFFFFF;
          font-weight: 700;
          letter-spacing: -0.025em;
          font-size: 28px;
          line-height: 1.2;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
        }
        @media (min-width: 640px) {
          .custom-prose h2 {
            font-size: 40px;
          }
        }
        @media (min-width: 1024px) {
          .custom-prose h2 {
            font-size: 54px;
          }
        }

        .custom-prose p {
          color: #BFBFBF;
          line-height: 1.75;
          margin-bottom: 1.5rem;
          font-size: 16px;
        }
        @media (min-width: 640px) {
          .custom-prose p {
            font-size: 18px;
          }
        }
        @media (min-width: 1024px) {
          .custom-prose p {
            font-size: 22px;
          }
        }

        @keyframes toastSlideUp {
          from {
            transform: translateY(24px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-toast {
          animation: toastSlideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 md:px-8 py-12 flex flex-col items-center">
        
        {/* SECTION 1 - Logo & Header */}
        <section className="text-center mt-8 mb-10 w-full flex flex-col items-center">
          <div className="mb-4 inline-block p-2 bg-[#353535] rounded-full">
            <Logo variant="icon" color="purple" className="landing-logo h-16 w-16" />
          </div>
          
          <h1 className="font-display landing-title font-bold tracking-tight text-white mb-3">
            MoviyFly
          </h1>
          
          <p className="font-display landing-subtitle font-medium text-[#8B5CF6] tracking-tight mb-4">
            The Ultimate Movie & TV Show Discovery Platform
          </p>
          
          <p className="font-body landing-desc text-[#BFBFBF] leading-relaxed max-w-3xl mb-8">
            Discover trending movies, popular TV shows, upcoming releases, top-rated entertainment, trailers, ratings, and build your personal watchlist—all in one place.
          </p>
        </section>

        {/* SECTION 2 - Full Site CTA Button */}
        <section className="mb-14 w-full flex justify-center">
          <button
            onClick={() => navigate('/home')}
            className="font-display landing-btn-primary w-full sm:w-auto py-4 px-12 font-bold tracking-wide bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer shadow-md transform active:scale-98"
          >
            <span>Enter Full Site</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </section>

        {/* SECTION 3 - Share MoviyFly Section */}
        <section className="w-full bg-[#353535] rounded-2xl p-6 mb-14 max-w-[900px] flex flex-col md:flex-row items-center justify-between gap-6 shadow-md border border-white/[0.03]">
          {/* Left side: Avatar + Text */}
          <div className="flex items-center gap-4 text-left w-full md:w-auto">
            <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border-2 border-[#8B5CF6] shadow-sm bg-neutral-800">
              <img 
                src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExbG1xOHIwOGxvMndqdmEyenNzemtvbnltNnp4bmtrN2Y3ODgxcjk3ZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/0aIY8ZCncOtgh35ftC/giphy.gif"
                alt="MoviyFly Mascot"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-white leading-tight">
                Share MoviyFly
              </h3>
              <p className="font-body text-sm text-white font-medium mt-0.5">
                Join thousands of movie lovers.
              </p>
              <p className="font-body text-xs text-[#BFBFBF]">
                Share MoviyFly with your friends.
              </p>
            </div>
          </div>
          
          {/* Right side: Share buttons */}
          <div className="flex flex-wrap gap-2.5 justify-center md:justify-end items-center w-full md:w-auto max-w-md">
            <a
              href="https://whatsapp.com/channel/0029Vb8UscdBKfhyoPsumk1r"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-white bg-[#25D366] hover:bg-[#20ba5a] transition-all duration-200 cursor-pointer shadow-sm"
            >
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp Channel</span>
            </a>

            <button
              onClick={handleCopyLink}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-white transition-all duration-200 cursor-pointer ${copied ? "bg-[#22C55E]" : "bg-neutral-600 hover:bg-neutral-500"}`}
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? "Copied!" : "Copy Link"}</span>
            </button>
          </div>
        </section>

        {/* SEO ARTICLES & CONTENT (SECTIONS 4 - 9) */}
        <div className="w-full max-w-4xl custom-prose text-left border-t border-white/10 pt-12 space-y-12">
          
          {/* SECTION 4 - Brief Overview of MoviyFly */}
          <section className="space-y-4">
            <h2 className="font-display font-bold">
              Brief Overview of MoviyFly
            </h2>
            <p>
              MoviyFly is a modern, high-performance entertainment discovery platform designed to cater to movie buffs and television series enthusiasts around the globe. Operating as a comprehensive metadata center, MoviyFly indexes thousands of cinematic titles, drawing data directly from real-time global databases. Rather than offering unauthorized streaming or direct video downloads, our platform acts as a secure catalog and deep discovery portal where users can evaluate, catalog, and research films and television releases.
            </p>
            <p>
              On MoviyFly, you can instantly search for <strong>Trending Movies</strong>, ongoing <strong>TV Shows</strong>, <strong>Upcoming Releases</strong>, and critically acclaimed <strong>Top Rated</strong> masterpieces. Our user interface is engineered with a ultra-fast, responsive web engine that guarantees instant query loading, full responsive compatibility, and smooth menu transitions. Each title page incorporates detailed genre tags, cast biographies, theatrical trailers, production ratings, and community reviews.
            </p>
            <p>
              Furthermore, MoviyFly supports a fully local <strong>Personal Watchlist</strong> experience, allowing you to curate your next cinematic journey securely. Built with a fast interface and adaptive design, MoviyFly displays perfectly across all desktops, laptops, tablets, and smart mobile viewports.
            </p>
          </section>

          {/* SECTION 5 - Why Choose MoviyFly */}
          <section className="space-y-4">
            <h2>
              Why Choose MoviyFly
            </h2>
            <p>
              In the fragmented landscape of modern television and digital media, finding what to watch is often more tedious than the viewing experience itself. Multiple subscription services host separate, closed catalogs, making general content discovery a frustrating process. MoviyFly solves this dilemma by presenting a single, unified database where you can search, filter, and discover titles regardless of their distributing networks.
            </p>
            <p>
              We prioritize user experience above everything else. Unlike typical discovery platforms cluttered with invasive advertising, slow redirect links, or unnecessary page weight, MoviyFly is optimized for speed and visual cleanliness. Our architecture employs server-side API proxying and client caching to fetch search results, ratings, and trailers instantly. This creates a highly fluid browsing experience that works seamlessly even on low-bandwidth mobile connections.
            </p>
            <p>
              Another significant advantage of MoviyFly is our privacy-centric approach to curation. Your personal watchlist and viewing preferences are stored locally on your device, giving you immediate cataloging capabilities without forcing you through tedious registration processes. If you choose to sync your data across devices, lightweight integrations are available, but you always retain complete control over your entertainment profile.
            </p>
          </section>

          {/* SECTION 6 - Explore Trending Movies & TV Shows */}
          <section className="space-y-4">
            <h2>
              Explore Trending Movies & TV Shows
            </h2>
            <p>
              The global entertainment ecosystem moves incredibly fast. From viral television series releases to theatrical blockbusters, keeping track of trending media requires constant updating. MoviyFly features dedicated, real-time trending segments on our homepage and sub-pages to highlight content that is currently capturing the attention of worldwide audiences.
            </p>
            <p>
              Our trending index updates dynamically, analyzing user interaction patterns, global search queries, and real-time database updates. Whether it is an episodic science-fiction series airing weekly, an independent documentary gaining international acclaim, or a massive cinematic launch, MoviyFly guarantees you are always aware of the hottest releases. By reviewing cast biographies, high-definition trailers, and community ratings for each trending title, you can make informed decisions before dedicating your valuable free time.
            </p>
          </section>

          {/* SECTION 7 - Hollywood, Bollywood & International Entertainment */}
          <section className="space-y-4">
            <h2>
              Hollywood, Bollywood & International Entertainment
            </h2>
            <p>
              Great stories are told in every language and region. MoviyFly is designed as a truly global portal, showcasing content from all corners of the world with equal detail and structural precision. We believe in providing robust discoverability for Hollywood productions, Bollywood dramas, and diverse international cinema.
            </p>
            <p>
              Our index spans from major United States studio blockbusters to the epic scale of Indian cinema—including Hindi, Tamil, and Telugu productions. Beyond that, MoviyFly serves as an excellent gateway for discovering high-concept European thrillers, East Asian dramas, Japanese anime series, and South American telenovelas. By structuring languages and country metadata cleanly, our search system allows you to easily filter by origin, helping you discover hidden cinematic gems you might otherwise miss on traditional regional platforms.
            </p>
          </section>

          {/* SECTION 8 - Personal Watchlist Experience */}
          <section className="space-y-4">
            <h2>
              Personal Watchlist Experience
            </h2>
            <p>
              Building a personal collection of films and shows you plan to watch is a core feature of the MoviyFly experience. Traditional watchlist tools often require complex profile setups, email verifications, and unnecessary notifications. We have redesigned this feature to be completely frictionless.
            </p>
            <p>
              With a single click on the bookmark or heart icon of any title, it is instantly added to your Personal Watchlist. This list is saved locally to your browser state, meaning it loads instantly without calling slow external databases. When you are ready to watch, you can open your watchlist tab to find your curated queue, complete with immediate links to trailers, ratings, and release schedules. It is a streamlined, clean notebook for your cinematic adventures.
            </p>
          </section>

          {/* SECTION 9 - Supported Genres */}
          <section className="space-y-4">
            <h2>
              Supported Genres
            </h2>
            <p>
              Every viewer has a unique mood and taste, which is why accurate genre classification is vital. MoviyFly supports deep classification across a wide spectrum of cinematic categories. Whether you are searching for high-octane <strong>Action</strong> sequences, heart-racing <strong>Adventure</strong> stories, or mind-bending <strong>Science Fiction</strong> concepts, our filters make search navigation effortless.
            </p>
            <p>
              If your preferences lean towards lighter entertainment, you can easily browse our curated sections for witty <strong>Comedy</strong> releases, family-friendly <strong>Animation</strong>, and lighthearted <strong>Fantasy</strong>. For viewers seeking intense narratives, we catalog rich historical <strong>Drama</strong> series, dark <strong>Mystery</strong> puzzles, atmospheric <strong>Horror</strong> films, and cerebral <strong>Thrillers</strong>. From independent <strong>Documentary</strong> features to passionate <strong>Romance</strong> stories, MoviyFly ensures every niche genre is indexed thoroughly with instant filtering.
            </p>
          </section>

          {/* SECTION 10 - Final CTA */}
          <section className="text-center py-10 border-t border-white/10 mt-12 flex flex-col items-center">
            <h2 className="font-display font-bold text-white mb-3">
              Ready to Explore?
            </h2>
            <p className="font-body text-[#BFBFBF] text-base sm:text-lg md:text-[22px] max-w-2xl mb-6 leading-relaxed">
              Enter the full MoviyFly catalog now to start browsing thousands of movies, TV shows, official trailers, and more.
            </p>
            <button
              onClick={() => navigate('/home')}
              className="font-display landing-btn-primary py-4 px-12 font-bold bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl transition-all duration-200 cursor-pointer shadow-md transform active:scale-98"
            >
              Enter Full Site
            </button>
          </section>

        </div>

        {/* MINIMAL FOOTER */}
        <footer className="w-full border-t border-white/10 mt-16 pt-8 pb-4 text-center">
          <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-[#BFBFBF] mb-5 font-display">
            <button onClick={() => navigate('/home')} className="hover:text-white transition-colors cursor-pointer">Home</button>
            <button onClick={() => navigate('/movies')} className="hover:text-white transition-colors cursor-pointer">Movies</button>
            <button onClick={() => navigate('/tvshows')} className="hover:text-white transition-colors cursor-pointer">TV Shows</button>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="mailto:contact@moviyfly.com" className="hover:text-white transition-colors">Contact</a>
          </div>
          <p className="font-body text-xs text-[#BFBFBF]">
            Copyright © 2026 MoviyFly. All rights reserved.
          </p>
        </footer>

      </div>

      {/* Copy Confirmation Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-[#353535] border border-[#22C55E]/30 text-white px-5 py-3.5 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.5)] flex items-center gap-3 z-[9999] animate-toast">
          <Check className="h-5 w-5 text-[#22C55E]" />
          <span className="font-body text-sm font-semibold">Link copied successfully!</span>
        </div>
      )}
    </div>
  );
};
