import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Film, Star } from 'lucide-react';

interface CinematicSplashProps {
  onComplete: () => void;
}

// 3D Glassmorphic Butterfly Component representing "Fly" in MoviyFly
const FuturisticButterfly: React.FC<{ isFlapping: boolean; isZooming: boolean }> = ({ isFlapping, isZooming }) => {
  return (
    <motion.div
      animate={isZooming ? {
        scale: [1, 2.5, 35],
        filter: ['blur(0px)', 'blur(3px)', 'blur(20px)'],
        opacity: [1, 1, 0]
      } : {}}
      transition={isZooming ? {
        duration: 0.9,
        ease: [0.645, 0.045, 0.355, 1.0] // premium custom cubic-bezier
      } : {}}
      className="relative w-16 h-16 flex items-center justify-center pointer-events-none"
    >
      {/* High-fidelity volumetric light halo behind butterfly */}
      <div className="absolute w-24 h-24 bg-gradient-to-tr from-[#8B5CF6]/50 to-[#A855F7]/30 rounded-full blur-2xl animate-pulse" />

      {/* LEFT WING (3D flap pivoting on right border) */}
      <motion.div
        style={{ transformOrigin: 'right center' }}
        animate={isFlapping ? {
          rotateY: [0, -72, 15, -72, 0],
          skewY: [0, -10, 5, -10, 0],
          rotateZ: [0, -5, 2, -5, 0]
        } : isZooming ? {
          rotateY: [-15, -85, -15],
          scaleX: [1, 0.4, 1.3]
        } : {
          rotateY: [0, -25, 0],
          skewY: [0, -4, 0]
        }}
        transition={isFlapping ? {
          duration: 0.4,
          repeat: Infinity,
          ease: 'easeInOut'
        } : isZooming ? {
          duration: 0.45,
          repeat: Infinity,
          ease: 'linear'
        } : {
          duration: 2.2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute right-[50%] w-9 h-12 bg-gradient-to-l from-[#8B5CF6] via-[#A855F7]/50 to-[#3B82F6]/20 rounded-l-[28px] rounded-tr-[8px] border-l border-y border-white/25 shadow-[0_0_15px_rgba(139,92,246,0.5)] backdrop-blur-sm overflow-hidden"
      >
        {/* Holographic crystal reflections */}
        <div className="absolute inset-1 border-l border-b border-white/15 rounded-l-[24px] opacity-60" />
        <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-white/35 blur-[0.5px]" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#A855F7]/30 to-white/15" />
      </motion.div>

      {/* RIGHT WING (3D flap pivoting on left border) */}
      <motion.div
        style={{ transformOrigin: 'left center' }}
        animate={isFlapping ? {
          rotateY: [0, 72, -15, 72, 0],
          skewY: [0, 10, -5, 10, 0],
          rotateZ: [0, 4, -2, 4, 0]
        } : isZooming ? {
          rotateY: [15, 85, 15],
          scaleX: [1, 0.4, 1.3]
        } : {
          rotateY: [0, 25, 0],
          skewY: [0, 3, 0]
        }}
        transition={isFlapping ? {
          duration: 0.4,
          repeat: Infinity,
          ease: 'easeInOut'
        } : isZooming ? {
          duration: 0.45,
          repeat: Infinity,
          ease: 'linear'
        } : {
          duration: 2.2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute left-[50%] w-9 h-12 bg-gradient-to-r from-[#8B5CF6] via-[#A855F7]/40 to-[#3B82F6]/20 rounded-r-[28px] rounded-tl-[8px] border-r border-y border-white/25 shadow-[0_0_15px_rgba(139,92,246,0.5)] backdrop-blur-sm overflow-hidden"
      >
        {/* Holographic crystal reflections */}
        <div className="absolute inset-1 border-r border-b border-white/15 rounded-r-[24px] opacity-60" />
        <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-white/35 blur-[0.5px]" />
        <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-[#A855F7]/30 to-white/15" />
      </motion.div>

      {/* BUTTERFLY BODY (High-tech glass fibre glow core) */}
      <div className="absolute w-1.5 h-8 bg-gradient-to-b from-white via-purple-200 to-[#A855F7] rounded-full shadow-[0_0_12px_rgba(255,255,255,0.9)] z-10 flex flex-col items-center">
        {/* Subtle physical feel antennaes */}
        <div className="absolute -top-3.5 -left-1.5 w-2.5 h-4 border-r border-t border-purple-200/80 rounded-tr-md transform -rotate-15" />
        <div className="absolute -top-3.5 -right-1.5 w-2.5 h-4 border-l border-t border-purple-200/80 rounded-tl-md transform rotate-15" />
      </div>
    </motion.div>
  );
};

export const CinematicSplash: React.FC<CinematicSplashProps> = ({ onComplete }) => {
  const [muted, setMuted] = React.useState(false);
  const [audioUserControlled, setAudioUserControlled] = React.useState(false);
  const [scene, setScene] = React.useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [letterIndexRevealed, setLetterIndexRevealed] = React.useState<number>(-1);
  const [audioPlayed, setAudioPlayed] = React.useState(false);
  const [lensFlareSweep, setLensFlareSweep] = React.useState(false);
  
  const audioContextRef = React.useRef<AudioContext | null>(null);

  const wordmark = 'MOVIYFLY';

  // Comprehensive Web Audio Synthesizer specifically designed for an original cinematic score
  const playCinematicSoundtrack = React.useCallback((isMuted: boolean) => {
    if (isMuted) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContextClass();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;

      // 1. Scene 1 & 2: Ambient Deep Theatre Drone Space (starts at 0.1s)
      const droneOsc1 = ctx.createOscillator();
      const droneOsc2 = ctx.createOscillator();
      const droneFilter = ctx.createBiquadFilter();
      const droneGain = ctx.createGain();

      droneOsc1.type = 'sawtooth';
      droneOsc1.frequency.setValueAtTime(55, now); // A1 note (bass backdrop)
      droneOsc1.frequency.linearRampToValueAtTime(54.5, now + 4);

      droneOsc2.type = 'triangle';
      droneOsc2.frequency.setValueAtTime(110.3, now); // Detuned octave above

      droneFilter.type = 'lowpass';
      droneFilter.frequency.setValueAtTime(120, now);
      droneFilter.frequency.exponentialRampToValueAtTime(70, now + 4);

      droneGain.gain.setValueAtTime(0, now);
      droneGain.gain.linearRampToValueAtTime(0.18, now + 1.0);
      droneGain.gain.exponentialRampToValueAtTime(0.001, now + 4.1);

      droneOsc1.connect(droneFilter);
      droneOsc2.connect(droneFilter);
      droneFilter.connect(droneGain);
      droneGain.connect(ctx.destination);

      droneOsc1.start(now);
      droneOsc2.start(now);
      droneOsc1.stop(now + 4.3);
      droneOsc2.stop(now + 4.3);

      // 2. Scene 3: Metallic Whoosh & Air Swoop (Butterfly Flight Launch at 1.4s)
      const swoopBuffer = ctx.createBuffer(1, ctx.sampleRate * 2.0, ctx.sampleRate);
      const data = swoopBuffer.getChannelData(0);
      for (let i = 0; i < swoopBuffer.length; i++) {
        data[i] = Math.random() * 2 - 1; // white noise
      }
      const swoopNoise = ctx.createBufferSource();
      swoopNoise.buffer = swoopBuffer;

      const swoopFilter = ctx.createBiquadFilter();
      swoopFilter.type = 'bandpass';
      swoopFilter.Q.value = 3.0;
      swoopFilter.frequency.setValueAtTime(150, now + 1.4);
      swoopFilter.frequency.exponentialRampToValueAtTime(1200, now + 2.0); // Sweep up
      swoopFilter.frequency.exponentialRampToValueAtTime(300, now + 2.7);  // Sweep down

      const swoopGain = ctx.createGain();
      swoopGain.gain.setValueAtTime(0, now + 1.4);
      swoopGain.gain.linearRampToValueAtTime(0.08, now + 1.8);
      swoopGain.gain.exponentialRampToValueAtTime(0.001, now + 2.7);

      swoopNoise.connect(swoopFilter);
      swoopFilter.connect(swoopGain);
      swoopGain.connect(ctx.destination);
      swoopNoise.start(now + 1.4);

      // 3. Scene 3: Diatonic Crystal Sparks on Letter Reveals (1.8s to 2.8s)
      const letterScale = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25]; // C4-C5 Pentatonic / Diatonic
      letterScale.forEach((freq, idx) => {
        const itemTime = now + 1.8 + idx * 0.13;
        
        const bellOsc = ctx.createOscillator();
        const bellOver = ctx.createOscillator();
        const bellGain = ctx.createGain();
        const bellFilter = ctx.createBiquadFilter();

        bellOsc.type = 'sine';
        bellOsc.frequency.setValueAtTime(freq, itemTime);

        bellOver.type = 'triangle';
        bellOver.frequency.setValueAtTime(freq * 3, itemTime); // Odd harmonic chime

        bellFilter.type = 'lowpass';
        bellFilter.frequency.setValueAtTime(1800, itemTime);

        bellGain.gain.setValueAtTime(0, itemTime);
        bellGain.gain.linearRampToValueAtTime(0.045, itemTime + 0.03);
        bellGain.gain.exponentialRampToValueAtTime(0.001, itemTime + 1.4);

        bellOsc.connect(bellFilter);
        bellOver.connect(bellFilter);
        bellFilter.connect(bellGain);
        bellGain.connect(ctx.destination);

        bellOsc.start(itemTime);
        bellOver.start(itemTime);
        bellOsc.stop(itemTime + 1.5);
        bellOver.stop(itemTime + 1.5);
      });

      // 4. Scene 4: colossally rich sub-bass landing boom + metallic luster (Butterfly lands at 2.8s)
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(32.7, now + 2.8); // Ultra-deep low C0 (pure physical theater feeling)
      subOsc.frequency.linearRampToValueAtTime(28, now + 3.8);

      subGain.gain.setValueAtTime(0, now + 2.8);
      subGain.gain.linearRampToValueAtTime(0.60, now + 2.85); // Big impact
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 4.1);

      subOsc.connect(subGain);
      subGain.connect(ctx.destination);
      subOsc.start(now + 2.8);
      subOsc.stop(now + 4.2);

      // Harmonious brass swell to elevate the landing impact
      const brass1 = ctx.createOscillator();
      const brass2 = ctx.createOscillator();
      const brassGain = ctx.createGain();
      const brassFilter = ctx.createBiquadFilter();

      brass1.type = 'sawtooth';
      brass1.frequency.setValueAtTime(130.81, now + 2.8); // C3
      brass2.type = 'triangle';
      brass2.frequency.setValueAtTime(196.00, now + 2.8); // G3 (fifth chord)

      brassFilter.type = 'lowpass';
      brassFilter.frequency.setValueAtTime(120, now + 2.8);
      brassFilter.frequency.exponentialRampToValueAtTime(380, now + 3.1);
      brassFilter.frequency.exponentialRampToValueAtTime(80, now + 3.7);

      brassGain.gain.setValueAtTime(0, now + 2.8);
      brassGain.gain.linearRampToValueAtTime(0.15, now + 2.9);
      brassGain.gain.exponentialRampToValueAtTime(0.001, now + 3.9);

      brass1.connect(brassFilter);
      brass2.connect(brassFilter);
      brassFilter.connect(brassGain);
      brassGain.connect(ctx.destination);

      brass1.start(now + 2.8);
      brass2.start(now + 2.8);
      brass1.stop(now + 4.0);
      brass2.stop(now + 4.0);

      // Gorgeous lush landing chord (Glass sparkle / chime cascade)
      const landingChimes = [523.25, 659.25, 783.99, 987.77, 1174.66, 1567.98]; // C5, E5, G5, B5, D6, G6
      landingChimes.forEach((freq, idx) => {
        const chimeOsc = ctx.createOscillator();
        const cg = ctx.createGain();
        chimeOsc.type = 'sine';
        chimeOsc.frequency.setValueAtTime(freq, now + 2.8 + idx * 0.04);

        cg.gain.setValueAtTime(0, now + 2.8 + idx * 0.04);
        cg.gain.linearRampToValueAtTime(0.035, now + 2.82 + idx * 0.04);
        cg.gain.exponentialRampToValueAtTime(0.001, now + 4.1);

        chimeOsc.connect(cg);
        cg.connect(ctx.destination);
        chimeOsc.start(now + 2.8 + idx * 0.04);
        chimeOsc.stop(now + 4.2);
      });

      // 5. Scene 5 & 6: Butterfly camera push zoom swoop whoosh + dissolve shimmer (3.6s to 4.2s)
      const zoomOsc = ctx.createOscillator();
      const zoomGain = ctx.createGain();
      const zoomFilter = ctx.createBiquadFilter();

      zoomOsc.type = 'sawtooth';
      zoomOsc.frequency.setValueAtTime(65, now + 3.6);
      zoomOsc.frequency.exponentialRampToValueAtTime(1400, now + 4.1); // pitch climbs rapidly

      zoomFilter.type = 'lowpass';
      zoomFilter.frequency.setValueAtTime(100, now + 3.6);
      zoomFilter.frequency.exponentialRampToValueAtTime(2500, now + 4.15); // filter opens completely

      zoomGain.gain.setValueAtTime(0, now + 3.6);
      zoomGain.gain.linearRampToValueAtTime(0.12, now + 3.9);
      zoomGain.gain.exponentialRampToValueAtTime(0.001, now + 4.2);

      zoomOsc.connect(zoomFilter);
      zoomFilter.connect(zoomGain);
      zoomGain.connect(ctx.destination);
      zoomOsc.start(now + 3.6);
      zoomOsc.stop(now + 4.25);

      // High sparkling dissolve glitter noise
      const sparkleBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.8, ctx.sampleRate);
      const sData = sparkleBuffer.getChannelData(0);
      for (let i = 0; i < sparkleBuffer.length; i++) {
        sData[i] = Math.random() * 2 - 1;
      }
      const sparkleSource = ctx.createBufferSource();
      sparkleSource.buffer = sparkleBuffer;

      const sparkleFilter = ctx.createBiquadFilter();
      sparkleFilter.type = 'highpass';
      sparkleFilter.frequency.setValueAtTime(4500, now + 3.7);

      const sparkleGain = ctx.createGain();
      sparkleGain.gain.setValueAtTime(0, now + 3.7);
      sparkleGain.gain.linearRampToValueAtTime(0.035, now + 3.8);
      sparkleGain.gain.exponentialRampToValueAtTime(0.001, now + 4.2);

      sparkleSource.connect(sparkleFilter);
      sparkleFilter.connect(sparkleGain);
      sparkleGain.connect(ctx.destination);
      sparkleSource.start(now + 3.7);

      setAudioPlayed(true);
    } catch (e) {
      console.warn('Advanced synthesizer failed or blocked:', e);
    }
  }, []);

  // Choreograph precise Scene timings
  React.useEffect(() => {
    // Scene 1: (0s - 0.5s) Deep black & tiny initial spark
    const timer1 = setTimeout(() => {
      setScene(2); // Morph into Glass Butterfly in center
      if (!audioPlayed && !muted) {
        playCinematicSoundtrack(false);
      }
    }, 500);

    // Scene 3: (1.4s) Butterfly spreads wings and flies to draw letters
    const timer2 = setTimeout(() => {
      setScene(3);
    }, 1400);

    // Reveal individual letters as the butterfly moves across (1.8s to 2.8s)
    const timings = [1800, 1930, 2060, 2190, 2320, 2450, 2580, 2710];
    const timeouts = timings.map((delay, index) => {
      return setTimeout(() => {
        setLetterIndexRevealed(index);
      }, delay);
    });

    // Scene 4: (2.8s) Butterfly lands softly on top of the last 'Y', volumetric glows trigger
    const timer3 = setTimeout(() => {
      setScene(4);
      setLensFlareSweep(true);
    }, 2800);

    // Scene 5: (3.6s) Camera rapid push: Butterfly decouples, flies DIRECTLY into camera lens (zooms 35x)
    const timer4 = setTimeout(() => {
      setScene(5);
    }, 3600);

    // Scene 6: (3.9s) Butterfly becomes pure white/purple light, bursts into thousands of glowing particles
    const timer5 = setTimeout(() => {
      setScene(6);
    }, 3950);

    // Fade out splash completely, seamless transition to home (4.25s)
    const timer6 = setTimeout(() => {
      handleComplete();
    }, 4250);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      timeouts.forEach((id) => clearTimeout(id));
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(timer6);
    };
  }, [audioPlayed, muted, playCinematicSoundtrack]);

  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newMuted = !muted;
    setMuted(newMuted);
    setAudioUserControlled(true);
    if (!newMuted) {
      playCinematicSoundtrack(false);
    }
  };

  const handleScreenClick = () => {
    if (muted) {
      setMuted(false);
      setAudioUserControlled(true);
      playCinematicSoundtrack(false);
    }
  };

  const handleComplete = () => {
    sessionStorage.setItem('moviyfly_intro_seen', 'true');
    onComplete();
  };

  // Generate stable high-fidelity stars coordinates
  const backgroundStars = React.useMemo(() => {
    return Array.from({ length: 48 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.6,
      duration: Math.random() * 5 + 4,
      delay: Math.random() * 2,
    }));
  }, []);

  // Pre-calculated S-curve trajectory points for wing flap particle trail
  const swoopParticles = React.useMemo(() => {
    return Array.from({ length: 32 }).map((_, i) => {
      const ratio = i / 31;
      const xPercent = 10 + ratio * 76; // matches flight coords
      const yPercent = 50 + Math.sin(ratio * Math.PI * 2.5) * 14; // wave flight path
      return {
        id: i,
        x: `${xPercent}%`,
        y: `${yPercent}%`,
        delay: 1.4 + ratio * 1.3, // coordinated release
        size: Math.random() * 4.5 + 2,
      };
    });
  }, []);

  // Film-inspired magical elements emitted (Scene 3 & 4)
  const brandingSymbols = React.useMemo(() => {
    const types = ['star', 'play', 'strip', 'glow-ring'];
    return Array.from({ length: 16 }).map((_, i) => ({
      id: i,
      x: 12 + Math.random() * 76,
      y: 35 + Math.random() * 32,
      type: types[i % types.length],
      scale: Math.random() * 0.45 + 0.55,
      delay: 1.5 + Math.random() * 1.1,
    }));
  }, []);

  // Explosive particle explosion triggered when butterfly flies directly into camera (Scene 5/6)
  const lensExplosionParticles = React.useMemo(() => {
    return Array.from({ length: 28 }).map((_, i) => {
      const angle = (i / 28) * Math.PI * 2;
      const speed = Math.random() * 130 + 70;
      return {
        id: i,
        xDir: Math.cos(angle) * speed,
        yDir: Math.sin(angle) * speed,
        size: Math.random() * 5 + 3,
        delay: 3.65 + Math.random() * 0.2,
      };
    });
  }, []);

  return (
    <div
      onClick={handleScreenClick}
      className="fixed inset-0 w-full h-full bg-[#0B0B10] z-[9999] flex flex-col items-center justify-center overflow-hidden cursor-pointer select-none"
    >
      {/* 100% Solid background to fully block any flash */}
      <div className="absolute inset-0 bg-[#0B0B10] pointer-events-none" />

      {/* LUXURY RADIAL GRADIENT BACKSTAGE */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.15)_0%,rgba(59,130,246,0.05)_45%,rgba(11,11,16,0)_75%)] pointer-events-none" />

      {/* Cinematic Flash / Ambient Blast of Light at Camera Hit (Scene 6) */}
      <AnimatePresence>
        {scene === 6 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.18)_0%,rgba(168,85,247,0.12)_40%,transparent_100%)] pointer-events-none mix-blend-screen z-20"
          />
        )}
      </AnimatePresence>

      {/* DRIFTING THEATRICAL DUST & STARS */}
      <div className="absolute inset-0 pointer-events-none">
        {backgroundStars.map((s) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.55, 0.55, 0] }}
            transition={{
              duration: s.duration,
              delay: s.delay,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="absolute bg-white rounded-full"
            style={{
              width: `${s.size}px`,
              height: `${s.size}px`,
              left: `${s.x}%`,
              top: `${s.y}%`,
              boxShadow: s.size > 1.6 ? '0 0 8px rgba(255,255,255,0.45)' : 'none',
            }}
          />
        ))}
      </div>

      {/* MAIN RESPONSIVE ANIMATION AREA (Aspect ratio safe stage) */}
      <div className="relative w-full max-w-[310px] sm:max-w-[440px] md:max-w-[530px] h-[220px] sm:h-[250px] md:h-[290px] flex flex-col items-center justify-center">
        
        {/* ========================================================
            SCENE 1: INITIAL COMPACT PURPLE SPARK
            ======================================================== */}
        <AnimatePresence>
          {scene === 1 && (
            <motion.div
              key="scene1-compact-spark"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.3, 0.7], opacity: [0, 0.85, 0.25] }}
              exit={{ scale: 2.0, opacity: 0, filter: 'blur(10px)' }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="absolute w-5 h-5 bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] rounded-full blur-[1px] shadow-[0_0_20px_rgba(139,92,246,0.95)]"
            />
          )}
        </AnimatePresence>

        {/* ========================================================
            SCENE 3 & 4: SPARK TRAILS (Drawing paths left behind wings)
            ======================================================== */}
        <div className="absolute inset-0 pointer-events-none">
          {scene >= 3 && swoopParticles.map((sp) => (
            <AnimatePresence key={sp.id}>
              {scene >= 3 && (
                <motion.div
                  initial={{ scale: 0, opacity: 0, y: `calc(${sp.y} + 8px)` }}
                  animate={{
                    scale: [0, 1.4, 0.8, 0],
                    opacity: [0, 0.85, 0.4, 0],
                    y: `calc(${sp.y} - ${Math.random() * 25 + 6}px)`,
                    x: `calc(${sp.x} + ${Math.random() * 14 - 7}px)`
                  }}
                  transition={{
                    duration: 1.4,
                    delay: sp.delay - 1.4, // synchronous release
                    ease: 'easeOut'
                  }}
                  className="absolute rounded-full bg-gradient-to-tr from-[#A855F7] via-cyan-300 to-transparent blur-[0.3px] shadow-[0_0_10px_rgba(168,85,247,0.85)]"
                  style={{
                    width: `${sp.size}px`,
                    height: `${sp.size}px`,
                    left: sp.x,
                    top: sp.y,
                  }}
                />
              )}
            </AnimatePresence>
          ))}

          {/* FILM-INSPIRED BRAND SYMBOLS IN THE AIR */}
          {scene >= 3 && brandingSymbols.map((bp) => (
            <motion.div
              key={bp.id}
              initial={{ opacity: 0, scale: 0, y: bp.y + 10 }}
              animate={{
                opacity: [0, 0.5, 0.25, 0],
                scale: [0, bp.scale, bp.scale * 0.85, 0],
                y: bp.y - 30,
                rotate: [0, Math.random() * 70 - 35]
              }}
              transition={{
                duration: 1.8,
                delay: bp.delay - 1.4,
                ease: 'easeOut'
              }}
              className="absolute text-purple-200/40"
              style={{
                left: `${bp.x}%`,
                top: `${bp.y}%`,
              }}
            >
              {bp.type === 'star' && <Star className="w-4 h-4 fill-purple-300/25" />}
              {bp.type === 'play' && <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[9px] border-l-[#A855F7]/50 border-b-[5px] border-b-transparent transform rotate-[10deg]" />}
              {bp.type === 'strip' && <Film className="w-3.5 h-3.5" />}
              {bp.type === 'glow-ring' && <div className="w-3.5 h-3.5 rounded-full border border-purple-400/35 blur-[0.2px] shadow-[0_0_5px_rgba(139,92,246,0.2)]" />}
            </motion.div>
          ))}
        </div>

        {/* ========================================================
            THE MOVIYFLY WORDMARK (Scene 3+)
            ======================================================== */}
        <motion.div
          animate={scene === 4 ? {
            scale: [1.0, 1.05, 1.0], // Elegant luxury pulse on reveal
          } : {}}
          transition={{ duration: 1.0, ease: 'easeInOut' }}
          className="relative flex items-center justify-center gap-1 sm:gap-2 h-14 w-[90%] sm:w-[85%] mx-auto overflow-visible z-10 select-none"
        >
          {/* Real-time Volumetric Lens Flare Sweep Across Wordmark */}
          {lensFlareSweep && (
            <motion.div
              initial={{ x: '-120%', opacity: 0 }}
              animate={{ x: '240%', opacity: [0, 0.8, 0.8, 0] }}
              transition={{ duration: 1.4, delay: 0.2, ease: 'easeInOut' }}
              className="absolute h-10 w-[140px] bg-gradient-to-r from-transparent via-white/50 to-transparent blur-[12px] z-20 pointer-events-none transform -skew-x-[25deg] mix-blend-overlay"
            />
          )}

          {wordmark.split('').map((char, index) => {
            const isRevealed = index <= letterIndexRevealed;
            return (
              <div
                key={index}
                className="relative flex flex-col items-center justify-center w-6 sm:w-9 md:w-11"
              >
                {/* Micro flares emitted on individual character hit */}
                <AnimatePresence>
                  {isRevealed && index === letterIndexRevealed && (
                    <>
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: [0, 1.6, 0], opacity: [0, 0.95, 0] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.55 }}
                        className="absolute -top-7 w-2 h-2 bg-cyan-400 rounded-full blur-[0.2px] shadow-[0_0_8px_cyan]"
                      />
                      <motion.div
                        initial={{ scale: 0.3, opacity: 1, border: '1px solid #A855F7' }}
                        animate={{ scale: 2.2, opacity: 0, border: '0px solid transparent' }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.65 }}
                        className="absolute w-8 h-8 rounded-full pointer-events-none"
                      />
                    </>
                  )}
                </AnimatePresence>

                {/* Individual letter block */}
                <motion.span
                  initial={{ opacity: 0, y: 18, scale: 0.72, filter: 'blur(3.5px)' }}
                  animate={isRevealed ? {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    filter: 'blur(0px)',
                    color: index === 7 ? '#F3E8FF' : '#FFFFFF',
                  } : {}}
                  transition={{
                    duration: 0.48,
                    type: 'spring',
                    stiffness: 95,
                    damping: 11
                  }}
                  className="font-sans font-extrabold text-[26px] sm:text-[38px] md:text-[46px] tracking-wide inline-block leading-none select-none text-center"
                  style={{
                    textShadow: isRevealed 
                      ? '0 0 30px rgba(139,92,246,0.45), 0 0 10px rgba(168,85,247,0.2)' 
                      : 'none',
                  }}
                >
                  {char}
                </motion.span>

                {/* Letter pedestal glow underlines */}
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={isRevealed ? { scaleX: 1, opacity: 0.45 } : {}}
                  transition={{ duration: 0.5, delay: 0.12 }}
                  className="absolute -bottom-2 w-4 sm:w-6 h-[1.5px] bg-gradient-to-r from-transparent via-[#8B5CF6] to-transparent"
                />
              </div>
            );
          })}
        </motion.div>

        {/* ========================================================
            TAGLINE ("UNLIMITED ENTERTAINMENT") (Scene 4)
            ======================================================= */}
        <div className="absolute bottom-6 overflow-hidden">
          <motion.p
            initial={{ opacity: 0, y: 8, letterSpacing: '0.15em' }}
            animate={scene >= 4 ? {
              opacity: 0.75,
              y: 0,
              letterSpacing: '0.42em',
            } : {}}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[10px] md:text-[11px] text-[#C084FC]/85 uppercase font-bold text-center select-none pl-[0.42em]"
          >
            Movies • TV Shows • Anime
          </motion.p>
        </div>

        {/* ========================================================
            THE BUTTERFLY ACTOR (Precise Coordinate Keyframes)
            ======================================================== */}
        <motion.div
          style={{
            position: 'absolute',
            transform: 'translate(-50%, -50%)',
            zIndex: 35,
          }}
          animate={
            scene === 1 ? {
              left: '50%',
              top: '50%',
              scale: 0,
              rotate: 0,
              opacity: 0
            } : scene === 2 ? {
              left: '50%',
              top: '50%',
              scale: [0, 1.2, 1.0],
              rotate: [0, 6, -4, 0],
              opacity: 1
            } : scene === 3 ? {
              // S-curve trajectory left-to-right drawing letters
              left: ['50%', '5%', '14%', '36%', '58%', '78%', '86%', '86%'],
              top: ['50%', '52%', '45%', '54%', '44%', '53%', '45%', '28%'],
              scale: [1.0, 0.85, 0.9, 0.85, 0.9, 0.85, 0.75, 0.7],
              rotate: [0, -42, 18, -24, 28, -12, -35, 0],
              opacity: 1
            } : scene === 4 ? {
              // Lands softly resting precisely right above the final letter 'Y' (at index 7)
              left: '86%',
              top: '28%',
              scale: 0.65,
              rotate: -5,
              opacity: 1
            } : scene === 5 ? {
              // Flies from '86%', '28%' directly into the center and accelerates directly towards lens
              left: '50%',
              top: '50%',
              scale: [0.65, 1.6, 32],
              rotate: [-5, -20, 0],
              opacity: [1, 1, 0],
              filter: ['blur(0px)', 'blur(3px)', 'blur(20px)'],
            } : {
              // Completely vanished / dissolved (Scene 6)
              left: '50%',
              top: '50%',
              scale: 32,
              opacity: 0
            }
          }
          transition={
            scene === 2 ? {
              duration: 0.9,
              ease: 'easeOut'
            } : scene === 3 ? {
              // Drawing wing sweep
              duration: 1.3,
              times: [0, 0.15, 0.3, 0.5, 0.7, 0.85, 0.95, 1.0],
              ease: 'easeInOut'
            } : scene === 5 ? {
              // Accelerated camera push duration
              duration: 0.85,
              times: [0, 0.3, 1.0],
              ease: [0.645, 0.045, 0.355, 1.0] // premium cubicbezier zoom push
            } : {
              duration: 0.4,
              ease: 'easeOut'
            }
          }
        >
          <FuturisticButterfly
            isFlapping={scene >= 2 && scene <= 3}
            isZooming={scene === 5}
          />
        </motion.div>

        {/* Scene 5/6: Glowing particles explode outward as butterfly zooms directly into camera lens */}
        {scene >= 5 && (
          <div className="absolute left-[50%] top-[50%] pointer-events-none z-30">
            {lensExplosionParticles.map((ep) => (
              <motion.div
                key={ep.id}
                initial={{ scale: 1, opacity: 1, x: 0, y: 0 }}
                animate={{
                  scale: [1, 1.8, 0],
                  opacity: [1, 0.9, 0],
                  x: ep.xDir * 2.2,
                  y: ep.yDir * 2.2
                }}
                transition={{
                  duration: 0.8,
                  delay: ep.delay - 3.65,
                  ease: 'easeOut'
                }}
                className="absolute bg-gradient-to-tr from-[#A855F7] via-cyan-400 to-white rounded-full blur-[0.2px] shadow-[0_0_8px_rgba(168,85,247,0.9)]"
                style={{
                  width: `${ep.size}px`,
                  height: `${ep.size}px`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* FLOATING SPATIAL CONTROLS HUD */}
      {audioUserControlled && (
        <div className="absolute top-6 right-6 z-40">
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.85, scale: 1 }}
            whileHover={{ opacity: 1, scale: 1.05 }}
            onClick={handleMuteToggle}
            className="p-2.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-white hover:text-[#A855F7] hover:bg-white/[0.07] hover:border-[#A855F7]/30 transition-all duration-300 flex items-center justify-center backdrop-blur-sm shadow-lg"
            title={muted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {muted ? (
              <VolumeX className="h-4 w-4 text-red-400" />
            ) : (
              <Volume2 className="h-4 w-4 text-[#A855F7]" />
            )}
          </motion.button>
        </div>
      )}
    </div>
  );
};
