import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IntroAnimationProps {
  onComplete: () => void;
}

export const IntroAnimation = ({ onComplete }: IntroAnimationProps) => {
  const [phase, setPhase] = useState<'cubes' | 'merge' | 'text' | 'done'>('cubes');

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase('merge'), 1500);
    const timer2 = setTimeout(() => setPhase('text'), 2800);
    const timer3 = setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  // Continuous rotation keyframes
  const continuousRotate = {
    rotateX: [0, 360],
    rotateY: [0, 360],
    rotateZ: [0, 180],
  };

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[100] bg-background flex items-center justify-center overflow-hidden"
        >
          <div className="relative w-full h-full flex items-center justify-center" style={{ perspective: '1200px' }}>
            <div className="absolute inset-0 grid-pattern opacity-30" />
            
            <AnimatePresence>
              {(phase === 'cubes' || phase === 'merge') && (
                <>
                  {/* Red cube */}
                  <motion.div
                    initial={{ x: -200, y: -120, rotateX: 0, rotateY: 0, rotateZ: 0 }}
                    animate={
                      phase === 'merge'
                        ? { x: 0, y: 0, rotateX: 720, rotateY: 720, rotateZ: 360, scale: 0.3 }
                        : { x: -150, y: -80, ...continuousRotate }
                    }
                    transition={
                      phase === 'merge'
                        ? { duration: 1.2, ease: 'easeInOut' }
                        : { duration: 3, ease: 'linear', repeat: Infinity }
                    }
                    className="absolute w-24 h-24"
                    style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
                  >
                    <div className="absolute inset-0 border-2 border-accent bg-accent/30 backdrop-blur-sm" style={{ transform: 'translateZ(48px)' }} />
                    <div className="absolute inset-0 border-2 border-accent bg-accent/20" style={{ transform: 'rotateY(180deg) translateZ(48px)' }} />
                    <div className="absolute inset-0 border-2 border-accent bg-accent/25" style={{ transform: 'rotateY(-90deg) translateZ(48px)' }} />
                    <div className="absolute inset-0 border-2 border-accent bg-accent/25" style={{ transform: 'rotateY(90deg) translateZ(48px)' }} />
                    <div className="absolute inset-0 border-2 border-accent bg-accent/35" style={{ transform: 'rotateX(90deg) translateZ(48px)' }} />
                    <div className="absolute inset-0 border-2 border-accent bg-accent/15" style={{ transform: 'rotateX(-90deg) translateZ(48px)' }} />
                  </motion.div>
                  
                  {/* White cube */}
                  <motion.div
                    initial={{ x: 200, y: 120, rotateX: 0, rotateY: 0, rotateZ: 0 }}
                    animate={
                      phase === 'merge'
                        ? { x: 0, y: 0, rotateX: -720, rotateY: -720, rotateZ: -360, scale: 0.3 }
                        : { x: 150, y: 80, rotateX: [0, -360], rotateY: [0, -360], rotateZ: [0, -180] }
                    }
                    transition={
                      phase === 'merge'
                        ? { duration: 1.2, ease: 'easeInOut' }
                        : { duration: 3, ease: 'linear', repeat: Infinity }
                    }
                    className="absolute w-24 h-24"
                    style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
                  >
                    <div className="absolute inset-0 border-2 border-foreground bg-foreground/15 backdrop-blur-sm" style={{ transform: 'translateZ(48px)' }} />
                    <div className="absolute inset-0 border-2 border-foreground bg-foreground/10" style={{ transform: 'rotateY(180deg) translateZ(48px)' }} />
                    <div className="absolute inset-0 border-2 border-foreground bg-foreground/12" style={{ transform: 'rotateY(-90deg) translateZ(48px)' }} />
                    <div className="absolute inset-0 border-2 border-foreground bg-foreground/12" style={{ transform: 'rotateY(90deg) translateZ(48px)' }} />
                    <div className="absolute inset-0 border-2 border-foreground bg-foreground/20" style={{ transform: 'rotateX(90deg) translateZ(48px)' }} />
                    <div className="absolute inset-0 border-2 border-foreground bg-foreground/8" style={{ transform: 'rotateX(-90deg) translateZ(48px)' }} />
                  </motion.div>
                  
                  {/* Dark cube */}
                  <motion.div
                    initial={{ x: 0, y: 180, rotateX: 0, rotateY: 0, rotateZ: 0 }}
                    animate={
                      phase === 'merge'
                        ? { x: 0, y: 0, rotateX: 1080, rotateY: 540, rotateZ: 180, scale: 0.3 }
                        : { x: 0, y: 100, rotateX: [0, 360], rotateY: [0, -360], rotateZ: [0, 360] }
                    }
                    transition={
                      phase === 'merge'
                        ? { duration: 1.2, ease: 'easeInOut' }
                        : { duration: 3, ease: 'linear', repeat: Infinity }
                    }
                    className="absolute w-24 h-24"
                    style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
                  >
                    <div className="absolute inset-0 border-2 border-foreground bg-foreground/90" style={{ transform: 'translateZ(48px)' }} />
                    <div className="absolute inset-0 border-2 border-foreground bg-foreground/80" style={{ transform: 'rotateY(180deg) translateZ(48px)' }} />
                    <div className="absolute inset-0 border-2 border-foreground bg-foreground/85" style={{ transform: 'rotateY(-90deg) translateZ(48px)' }} />
                    <div className="absolute inset-0 border-2 border-foreground bg-foreground/85" style={{ transform: 'rotateY(90deg) translateZ(48px)' }} />
                    <div className="absolute inset-0 border-2 border-foreground bg-foreground/95" style={{ transform: 'rotateX(90deg) translateZ(48px)' }} />
                    <div className="absolute inset-0 border-2 border-foreground bg-foreground/70" style={{ transform: 'rotateX(-90deg) translateZ(48px)' }} />
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* STRIVO text */}
            <AnimatePresence>
              {phase === 'text' && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="relative"
                >
                  <h1 className="font-display text-6xl md:text-8xl tracking-[0.3em] glitch-text">
                    <span className="text-accent">S</span>
                    <span>T</span>
                    <span className="text-accent">R</span>
                    <span>I</span>
                    <span>V</span>
                    <span className="text-accent">O</span>
                  </h1>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="h-1 bg-gradient-to-r from-transparent via-accent to-transparent mt-4"
                  />
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                    className="text-center font-display text-sm tracking-[0.5em] text-muted-foreground mt-3"
                  >
                    DEFINE YOUR METRICS
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="absolute inset-0 scanline pointer-events-none" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
