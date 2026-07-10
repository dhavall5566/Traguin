"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Send, X } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { SafeImage } from "@/components/ui/SafeImage";
import { contactInfo } from "@/data/contact";
import { nikiAgent, getNikiQuickReplies, nikiWelcomeMessages, type NikiQuickReply } from "@/data/nikiAgent";
import { cn } from "@/lib/utils";

type ChatMessage = {
  id: string;
  from: "niki" | "user";
  text: string;
  href?: string;
  external?: boolean;
};

const TYPING_MS = 900;
const BUBBLE_REVEAL_SCROLL = 480;

export function NikiAgent() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const [welcomed, setWelcomed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messageId = useRef(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setShowBubble(window.scrollY > BUBBLE_REVEAL_SCROLL);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const pushMessage = useCallback((msg: Omit<ChatMessage, "id">) => {
    messageId.current += 1;
    setMessages((prev) => [...prev, { ...msg, id: `msg-${messageId.current}` }]);
  }, []);

  const playWelcome = useCallback(async () => {
    if (welcomed) return;
    setWelcomed(true);
    setTyping(true);

    for (const text of nikiWelcomeMessages) {
      await new Promise((r) => window.setTimeout(r, TYPING_MS));
      pushMessage({ from: "niki", text });
    }

    setTyping(false);
  }, [pushMessage, welcomed]);

  useEffect(() => {
    if (open) void playWelcome();
  }, [open, playWelcome]);

  const handleQuickReply = (reply: NikiQuickReply) => {
    pushMessage({ from: "user", text: reply.label });
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      pushMessage({
        from: "niki",
        text: reply.response,
        href: reply.href,
        external: reply.external,
      });
    }, TYPING_MS);
  };

  const toggle = () => setOpen((prev) => !prev);

  if (!mounted) return null;

  return createPortal(
    <div className="niki-agent" aria-live="polite">
      {open && (
        <div
          className="niki-agent__panel flex w-[min(100vw-2rem,22rem)] flex-col overflow-hidden rounded-2xl border border-glass-border bg-surface shadow-[0_28px_80px_-24px_rgba(0,0,0,0.55)] sm:w-[22rem]"
          role="dialog"
          aria-label={`Chat with ${nikiAgent.name}`}
        >
          <header className="flex items-center gap-3 border-b border-glass-border bg-[color-mix(in_srgb,var(--gold)_6%,var(--surface))] px-4 py-3">
            <div className="niki-agent__avatar relative h-11 w-11 shrink-0">
              <SafeImage
                src={nikiAgent.avatar}
                alt={nikiAgent.name}
                className="h-full w-full object-cover object-center"
              />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-surface bg-emerald-500" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display text-base leading-tight text-foreground">{nikiAgent.name}</p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400">{nikiAgent.status}</p>
            </div>
            <button
              type="button"
              onClick={toggle}
              className="rounded-full p-2 text-muted transition-colors hover:bg-gold/10 hover:text-foreground"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </header>

          <div ref={scrollRef} className="niki-agent__messages flex max-h-[min(50vh,20rem)] flex-col gap-3 overflow-y-auto px-4 py-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn("flex", msg.from === "user" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                    msg.from === "user"
                      ? "rounded-br-md bg-gold text-on-gold"
                      : "rounded-bl-md border border-glass-border bg-[color-mix(in_srgb,var(--surface)_92%,var(--gold)_4%)] text-foreground"
                  )}
                >
                  {msg.text}
                  {msg.href && msg.from === "niki" && (
                    <span className="mt-2 block">
                      {msg.external ? (
                        <a
                          href={msg.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-gold underline-offset-2 hover:underline"
                        >
                          Continue on WhatsApp
                          <Send size={12} />
                        </a>
                      ) : (
                        <Link
                          href={msg.href}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-gold underline-offset-2 hover:underline"
                          onClick={() => setOpen(false)}
                        >
                          View details
                        </Link>
                      )}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex justify-start">
                <div className="flex gap-1 rounded-2xl rounded-bl-md border border-glass-border bg-surface/80 px-4 py-3">
                  <span className="niki-agent__dot" />
                  <span className="niki-agent__dot animation-delay-150" />
                  <span className="niki-agent__dot animation-delay-300" />
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-glass-border px-3 py-3">
            <p className="mb-2 px-1 text-[10px] tracking-[0.18em] text-muted uppercase">Quick topics</p>
            <div className="flex flex-wrap gap-1.5">
              {getNikiQuickReplies().map((reply) => (
                <button
                  key={reply.id}
                  type="button"
                  onClick={() => handleQuickReply(reply)}
                  className="rounded-full border border-glass-border bg-background/50 px-3 py-1.5 text-[11px] font-medium text-foreground transition-colors hover:border-gold/35 hover:bg-gold/8"
                >
                  {reply.label}
                </button>
              ))}
            </div>
            <a
              href={contactInfo.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-2.5 text-[11px] font-bold tracking-wide text-on-gold uppercase transition-colors hover:bg-gold-light"
            >
              <WhatsAppIcon size={16} />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      )}

      {!open && (
        <div className="niki-agent__teaser flex items-center gap-2.5">
          {showBubble && (
            <button
              type="button"
              onClick={toggle}
              className="niki-agent__bubble max-w-[min(100vw-5.5rem,16rem)] shrink cursor-pointer rounded-full border border-gold/35 px-4 py-2.5 text-left text-[13px] leading-snug font-semibold transition-[opacity,transform] duration-300 hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:max-w-none sm:whitespace-nowrap sm:px-5 sm:text-sm"
            >
              {nikiAgent.greeting}
            </button>
          )}
          <button
            type="button"
            onClick={toggle}
            className="niki-agent__avatar niki-agent__avatar--teaser relative h-14 w-14 shrink-0 cursor-pointer transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            aria-label={`Open chat with ${nikiAgent.name}`}
          >
            <SafeImage
              src={nikiAgent.avatar}
              alt={nikiAgent.name}
              className="h-full w-full object-cover object-center"
            />
          </button>
        </div>
      )}

      {open && (
        <button
          type="button"
          onClick={toggle}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gold text-on-gold shadow-lg transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          aria-label="Close chat"
        >
          <X size={24} />
        </button>
      )}
    </div>,
    document.body
  );
}
