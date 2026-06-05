"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

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
          scale: 1.05,
          transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
        }}
      >
        <div className="absolute inset-0 luxury-gradient opacity-30" />

        <motion.div
          className="relative z-10 text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src="/traguin-logo.png"
            alt="TRAGUIN"
            width={120}
            height={120}
            className="mx-auto h-24 w-auto object-contain md:h-28"
            priority
          />
          <h2 className="mt-8 font-display text-4xl tracking-[0.3em] text-foreground md:text-5xl">
            TRAGUIN
          </h2>
          <p className="mt-2 text-sm tracking-[0.4em] text-gold uppercase">Luxury Travel</p>
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
