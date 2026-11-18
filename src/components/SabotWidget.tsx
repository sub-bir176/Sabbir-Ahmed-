import { FormEvent, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, Bot, RotateCcw, Send, X } from 'lucide-react';
import { PortfolioProfile } from '../data/portfolio';

interface SabotWidgetProps {
  profile: PortfolioProfile;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

const QUICK_SKILL_PROMPTS = [
  'What AI & automation tools does Sabbir use?',
  'Tell me about his EduTune operations role',
  'What is his retail & floor leadership experience?',
];

const EASE_EDITORIAL = [0.16, 1, 0.3, 1] as const;

export function WhatsAppIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm5.8 14.07c-.24.68-1.41 1.3-1.95 1.38-.51.08-1.15.11-1.86-.12-.43-.14-.98-.32-1.69-.63-2.97-1.28-4.91-4.27-5.06-4.47-.15-.2-1.21-1.61-1.21-3.07 0-1.46.76-2.18 1.03-2.48.27-.3.59-.37.79-.37.2 0 .4 0 .57.01.18.01.43-.07.67.51.24.59.83 2.03.9 2.18.08.15.13.32.02.52-.1.2-.15.32-.3.5-.15.17-.32.39-.45.52-.15.15-.31.31-.13.61.17.3.78 1.28 1.67 2.08 1.15 1.02 2.12 1.34 2.42 1.49.3.15.47.12.65-.08.17-.2.75-.87.95-1.17.2-.3.4-.25.67-.15.27.1 1.74.82 2.04.97.3.15.5.22.57.34.08.12.08.7-.16 1.38z" />
    </svg>
  );
}

export function SabotWidget({
  profile,
  isOpen,
  onToggle,
  onClose,
}: SabotWidgetProps) {
  const whatsappDigits = profile.phone.replace(/\D/g, '');
  const buildWhatsappHref = (prefillText?: string) => {
    const base = `https://wa.me/${whatsappDigits}`;
    if (!prefillText) return base;
    return `${base}?text=${encodeURIComponent(prefillText)}`;
  };

  const initialGreeting: ChatMessage = {
    id: 'greeting',
    role: 'assistant',
    text: `Hi, I'm SABOT — ${profile.name}'s bot. Ask me anything about his skills, AI workflow automation, operations, or availability.`,
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialGreeting]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (threadRef.current && isOpen) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [messages, isLoading, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const sendQuery = async (queryText: string) => {
    const trimmed = queryText.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
    };

    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInput('');
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextHistory
            .filter((m) => m.id !== 'greeting')
            .map((m) => ({ role: m.role, text: m.text })),
          profileContext: {
            name: profile.name,
            phone: profile.phone,
            email: profile.email,
            location: profile.location,
            availability: profile.availability,
          },
        }),
      });

      const data = (await response.json()) as { reply?: string; error?: string };

      if (!response.ok || !data.reply) {
        setError(
          data.error ||
            'Could not reach SABOT right now. You can message Sabbir directly on WhatsApp.'
        );
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          text: data.reply!,
        },
      ]);
    } catch {
      setError('Connection issue. Please try again or continue directly on WhatsApp.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendQuery(input);
  };

  const handleReset = () => {
    setMessages([initialGreeting]);
    setInput('');
    setError('');
  };

  const lastUserQuestion = [...messages]
    .reverse()
    .find((m) => m.role === 'user')?.text;

  const whatsappPrefill = input.trim()
    ? `Hi ${profile.name}, I have a query: ${input.trim()}`
    : lastUserQuestion
    ? `Hi ${profile.name}, following up from SABOT regarding: "${lastUserQuestion}"`
    : `Hi ${profile.name}, I visited your portfolio and would like to connect.`;

  return (
    <>
      {/* Expandable SABOT Chat Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="sabot-popover"
            role="dialog"
            aria-label="SABOT — Sabbir's Skills Chatbot"
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: EASE_EDITORIAL }}
            className="fixed bottom-20 right-5 z-50 w-[calc(100vw-2.5rem)] sm:w-[390px] origin-bottom-right bg-white/95 dark:bg-[#081129]/95 backdrop-blur-xl border border-cyan-500/35 dark:border-cyan-400/30 rounded-2xl shadow-[0_12px_40px_rgba(6,182,212,0.18)] dark:shadow-[0_0_40px_rgba(6,182,212,0.22),inset_0_1px_0_rgba(125,211,252,0.12)] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="px-4 py-3.5 border-b border-cyan-500/20 dark:border-cyan-400/20 bg-slate-50/90 dark:bg-[#050A1E]/90 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 dark:from-cyan-400 dark:to-blue-500 text-white dark:text-slate-950 shadow-[0_0_14px_rgba(34,211,238,0.4)] flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-display text-sm font-semibold text-slate-950 dark:text-white leading-tight">
                    SABOT
                  </h3>
                  <p className="text-[11px] text-cyan-700 dark:text-cyan-200/75 truncate">
                    {profile.name}’s Bot · Skills &amp; Experience
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {messages.length > 1 && (
                  <motion.button
                    type="button"
                    onClick={handleReset}
                    aria-label="Reset SABOT chat"
                    whileTap={{ scale: 0.92 }}
                    className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-cyan-500/15 dark:hover:bg-cyan-400/15 hover:text-cyan-700 dark:hover:text-cyan-200 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  </motion.button>
                )}
                <motion.button
                  type="button"
                  onClick={onClose}
                  aria-label="Close SABOT chat"
                  whileTap={{ scale: 0.92 }}
                  className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-cyan-500/15 dark:hover:bg-cyan-400/15 hover:text-cyan-700 dark:hover:text-cyan-200 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </motion.button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={threadRef}
              className="p-4 space-y-3 h-[270px] overflow-y-auto bg-transparent"
            >
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18, ease: EASE_EDITORIAL }}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-[13px] leading-relaxed whitespace-pre-wrap ${
                        isUser
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_16px_rgba(6,182,212,0.25)]'
                          : 'bg-cyan-500/[0.08] border border-cyan-500/25 dark:border-cyan-400/20 text-slate-800 dark:text-slate-100'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                );
              })}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.16 }}
                  className="flex items-start"
                >
                  <div className="rounded-2xl px-3.5 py-2.5 text-xs text-cyan-700 dark:text-cyan-200/80 bg-cyan-500/[0.08] border border-cyan-500/25 dark:border-cyan-400/20">
                    SABOT is thinking...
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div
                  role="alert"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-500/40 text-xs text-rose-700 dark:text-rose-200 flex flex-wrap items-center justify-between gap-2"
                >
                  <span>{error}</span>
                  <a
                    href={buildWhatsappHref(whatsappPrefill)}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium underline text-rose-800 dark:text-rose-100 whitespace-nowrap"
                  >
                    Ask on WhatsApp
                  </a>
                </motion.div>
              )}
            </div>

            {/* Quick skill prompts */}
            <div className="px-4 py-2.5 border-t border-cyan-500/20 dark:border-cyan-400/15 bg-slate-50/70 dark:bg-[#050A1E]/60 flex flex-wrap gap-1.5">
              {QUICK_SKILL_PROMPTS.map((prompt) => (
                <motion.button
                  key={prompt}
                  type="button"
                  disabled={isLoading}
                  onClick={() => void sendQuery(prompt)}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-2.5 py-1 text-[11px] font-medium text-cyan-800 dark:text-cyan-100 bg-cyan-500/[0.08] border border-cyan-500/25 dark:border-cyan-400/25 rounded-md hover:border-cyan-500/60 dark:hover:border-cyan-300/60 hover:bg-cyan-500/15 dark:hover:bg-cyan-400/15 hover:text-slate-950 dark:hover:text-white transition-all cursor-pointer disabled:opacity-50"
                >
                  {prompt}
                </motion.button>
              ))}
            </div>

            {/* Composer */}
            <form
              onSubmit={handleSubmit}
              className="p-3.5 border-t border-cyan-500/20 dark:border-cyan-400/20 bg-slate-50/85 dark:bg-[#050A1E]/80 space-y-2"
            >
              <div className="flex items-center gap-2">
                <label htmlFor="sabot-chat-input" className="sr-only">
                  Ask SABOT a question
                </label>
                <input
                  id="sabot-chat-input"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask SABOT about Sabbir's skills..."
                  className="flex-1 min-w-0 px-3 py-2 text-xs sm:text-sm bg-white dark:bg-[#040816]/90 border border-cyan-500/30 dark:border-cyan-400/25 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-cyan-500 dark:focus:border-cyan-300/70 focus:shadow-[0_0_12px_rgba(34,211,238,0.18)] focus:outline-none transition-all"
                />
                <motion.button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  aria-label="Send question to SABOT"
                  whileTap={{ scale: 0.92 }}
                  className="inline-flex items-center justify-center w-9 h-9 text-white dark:text-slate-950 bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-400 dark:to-blue-400 rounded-lg hover:from-cyan-400 hover:to-blue-500 dark:hover:from-cyan-300 dark:hover:to-blue-300 shadow-[0_0_16px_rgba(34,211,238,0.28)] transition-all cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed shrink-0"
                >
                  <Send className="w-3.5 h-3.5" aria-hidden="true" />
                </motion.button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>Powered by portfolio data</span>
                <a
                  href={buildWhatsappHref(whatsappPrefill)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-emerald-700 dark:text-emerald-300 hover:underline whitespace-nowrap"
                >
                  <WhatsAppIcon className="w-3 h-3" />
                  <span>Continue on WhatsApp</span>
                  <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
                </a>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Square Bottom-Right SABOT Bot Icon Launcher */}
      <motion.button
        type="button"
        onClick={onToggle}
        aria-label={isOpen ? 'Close SABOT chatbot' : 'Open SABOT — Sabbir’s Bot'}
        aria-expanded={isOpen}
        title="SABOT — Ask about Sabbir's skills"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.93 }}
        transition={{ type: 'spring', stiffness: 450, damping: 24 }}
        className="fixed bottom-5 right-5 z-40 w-12 h-12 rounded-xl bg-white/90 dark:bg-gradient-to-br dark:from-cyan-500/20 dark:via-blue-600/20 dark:to-indigo-600/25 backdrop-blur-xl text-cyan-700 dark:text-cyan-200 hover:text-cyan-900 dark:hover:text-white border border-cyan-500/45 dark:border-cyan-400/45 hover:border-cyan-500/80 dark:hover:border-cyan-300/80 shadow-[0_6px_24px_rgba(6,182,212,0.25)] dark:shadow-[0_0_24px_rgba(34,211,238,0.28),inset_0_1px_0_rgba(125,211,252,0.2)] hover:shadow-[0_8px_32px_rgba(6,182,212,0.4)] dark:hover:shadow-[0_0_32px_rgba(34,211,238,0.45)] flex items-center justify-center transition-all duration-150 cursor-pointer"
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.span
              key="close-icon"
              initial={{ opacity: 0, rotate: -90, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.7 }}
              transition={{ duration: 0.14 }}
              className="flex items-center justify-center"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </motion.span>
          ) : (
            <motion.span
              key="bot-icon"
              initial={{ opacity: 0, rotate: 90, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -90, scale: 0.7 }}
              transition={{ duration: 0.14 }}
              className="flex items-center justify-center"
            >
              <Bot className="w-5 h-5" aria-hidden="true" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
