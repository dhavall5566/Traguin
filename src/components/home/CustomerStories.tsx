"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play } from "lucide-react";
import { testimonials } from "@/data/moods";
import { SafeImage } from "@/components/ui/SafeImage";

export function CustomerStories() {
  const [activeStory, setActiveStory] = useState<(typeof testimonials)[0] | null>(null);

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="mb-4 text-xs tracking-[0.3em] text-gold uppercase">Testimonials</p>
          <h2 className="font-display text-4xl text-foreground md:text-6xl">
            Customer Stories
          </h2>
        </div>

        <div className="mt-12 flex gap-4 overflow-x-auto hide-scrollbar pb-4 md:justify-center">
          {testimonials.map((story) => (
            <button
              key={story.id}
              onClick={() => setActiveStory(story)}
              className="group relative h-64 w-44 shrink-0 overflow-hidden rounded-2xl md:h-80 md:w-52"
              data-cursor="pointer"
            >
              <SafeImage
                src={story.image}
                alt={story.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/80">
                  <Play size={20} className="ml-0.5 text-on-gold" fill="currentColor" />
                </div>
              </div>
              <div className="absolute bottom-0 p-4 text-left">
                <p className="text-sm font-medium text-foreground">{story.name}</p>
                <p className="text-xs text-sand">{story.destination}</p>
              </div>
              <div className="absolute top-3 left-3 h-1 w-8 rounded-full bg-gold/60" />
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeStory && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 p-6 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveStory(null)}
          >
            <motion.div
              className="relative max-w-2xl rounded-3xl glass p-8 md:p-12"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveStory(null)}
                className="absolute top-4 right-4 text-muted hover:text-foreground"
                aria-label="Close"
              >
                <X size={24} />
              </button>

              <SafeImage
                src={activeStory.image}
                alt={activeStory.name}
                className="mx-auto h-20 w-20 rounded-full object-cover"
              />
              <blockquote className="mt-8 text-center font-display text-2xl leading-relaxed text-foreground md:text-3xl">
                &ldquo;{activeStory.quote}&rdquo;
              </blockquote>
              <p className="mt-6 text-center text-sm text-gold">
                — {activeStory.name}, {activeStory.destination}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
