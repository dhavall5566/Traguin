"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingGlobe } from "@/components/three";

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 800);
          return 100;
        }
        const increment = prev < 70 ? Math.random() * 12 + 3 : Math.random() * 5 + 1;
        return Math.min(prev + increment, 100);
      });
    }, 150);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-background"
        exit={{
          opacity: 0,
          scale: 1.2,
          transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
        }}
      >
        <div className="absolute inset-0 luxury-gradient opacity-30" />

        <motion.div
          className="relative h-[50vh] w-full max-w-2xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <LoadingGlobe progress={progress} />
        </motion.div>

        <motion.div
          className="relative z-10 mt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <h1 className="font-display text-4xl tracking-[0.3em] text-foreground md:text-5xl">
            TRAGUIN
          </h1>
          <p className="mt-2 text-sm tracking-[0.4em] text-gold uppercase">
            Luxury Travel
          </p>
        </motion.div>

        <div className="relative z-10 mt-12 w-64">
          <div className="h-px w-full bg-surface-elevated">
            <motion.div
              className="h-full bg-gold"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="mt-4 text-center font-display text-2xl text-gold">
            {Math.round(progress)}%
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
