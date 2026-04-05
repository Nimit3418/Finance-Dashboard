import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFinance } from '../../context/FinanceContext';
import { X, Sparkles, Send } from 'lucide-react';

const WELCOME_MSG = "Hi Nimit! 👋 I noticed you saved **12% more** this month. Your largest spending category was **'Cloud Servers'** at **₹54,000**. Want me to help you optimize your budget?";

const INITIAL_MESSAGES = [
  {
    id: 1,
    role: 'user',
    content: 'How is my spending this month?',
    time: '2:31 PM',
  },
  {
    id: 2,
    role: 'ai',
    content: "Based on your activity, you've saved **12% more** than last month, Nimit! Would you like a breakdown of your **Cloud Server** expenses?",
    time: '2:31 PM',
    chips: ['Show Breakdown', 'Budget Tips'],
  },
];

// Render **bold** markdown inline
function Formatted({ text }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

const AI_REPLIES = [
  "Great question! Based on your transaction patterns, I'd recommend reviewing your **Rent** and **Shopping** categories. Want me to generate a personalized monthly report?",
  "You're on track! Your net balance has grown **₹1,69,905** this period. Shall I flag any recurring subscriptions that might be worth cancelling?",
  "Interesting — your discretionary spending tends to spike on weekends. Setting a **weekend budget alert** could help you stay on track. Would you like me to set one?",
];
let replyIndex = 0;

export default function AIChatDrawer() {
  const { isChatOpen, setIsChatOpen, theme } = useFinance();
  const isLight = theme === 'light';
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasAutoTyped, setHasAutoTyped] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [isAutoTyping, setIsAutoTyping] = useState(false);
  const bottomRef = useRef(null);
  const typeIntervalRef = useRef(null);

  // Auto-type demo on first open
  useEffect(() => {
    if (isChatOpen && !hasAutoTyped) {
      setHasAutoTyped(true);
      setIsAutoTyping(true);
      let i = 0;
      typeIntervalRef.current = setInterval(() => {
        i++;
        setTypingText(WELCOME_MSG.slice(0, i));
        if (i >= WELCOME_MSG.length) {
          clearInterval(typeIntervalRef.current);
          setIsAutoTyping(false);
          const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
          setMessages((prev) => {
            if (prev.some(m => m.content === WELCOME_MSG)) return prev;
            return [...prev, {
              id: Date.now(),
              role: 'ai',
              content: WELCOME_MSG,
              time: now,
              chips: ['Optimize Budget', 'Cloud Breakdown'],
            }];
          });
          setTypingText('');
        }
      }, 28);
    }
  }, [isChatOpen, hasAutoTyped]);

  // Clean up only on unmount
  useEffect(() => {
    return () => clearInterval(typeIntervalRef.current);
  }, []);

  useEffect(() => {
    if (isChatOpen) {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 120);
    }
  }, [messages, isChatOpen]);

  const handleSend = () => {
    if (!inputValue.trim() || isTyping || isAutoTyping) return;
    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [...prev, { id: Date.now(), role: 'user', content: inputValue, time: now }]);
    setInputValue('');
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'ai',
          content: AI_REPLIES[replyIndex % AI_REPLIES.length],
          time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          chips: ['Generate Plan', 'Set Alert'],
        },
      ]);
      replyIndex++;
    }, 1600);
  };

  // Theme tokens — Obsidian dark / #F8FAFC light
  const bg = isLight ? 'rgba(255,255,255,0.96)' : 'rgba(5, 5, 5, 0.97)';
  const border = isLight ? '1px solid rgba(203,213,225,0.5)' : '1px solid rgba(255,255,255,0.05)';
  const headingColor = isLight ? '#0F172A' : '#e2e8f0';
  const mutedColor = isLight ? '#64748B' : '#475569';
  const bubbleBg = isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.04)';
  const bubbleBorder = isLight ? '1px solid rgba(203,213,225,0.5)' : '1px solid rgba(255,255,255,0.05)';
  const divider = isLight ? 'rgba(203,213,225,0.5)' : 'rgba(255,255,255,0.05)';
  // Brand tokens
  const BRAND_GRAD = 'linear-gradient(135deg, #225bcde4 0%, #5426cae1 100%)';
  const BRAND_GLOW = '0 0 24px rgba(128,94,217,0.5)';

  return (
    <AnimatePresence>
      {isChatOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(3px)' }}
            onClick={() => setIsChatOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%', opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            className="fixed right-0 top-0 h-screen z-50 flex flex-col"
            style={{
              width: '420px',
              background: bg,
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)',
              borderLeft: border,
              boxShadow: isLight ? '-20px 0 60px rgba(0,0,0,0.06)' : '-20px 0 80px rgba(0,0,0,0.6)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-5 flex-shrink-0"
              style={{ borderBottom: `1px solid ${divider}` }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: BRAND_GRAD, boxShadow: BRAND_GLOW }}
                >
                  <Sparkles className="w-5 h-5 text-white no-transition" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-base font-bold tracking-tight" style={{ color: headingColor }}>
                    Zorvyn AI
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0"
                      style={{ boxShadow: '0 0 6px rgba(52,211,153,0.8)' }}
                    />
                    <p className="text-xs font-medium" style={{ color: mutedColor }}>
                      Finance Copilot · Online
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-opacity hover:opacity-60 flex-shrink-0"
                style={{ background: bubbleBg, border: bubbleBorder }}
              >
                <X className="w-4 h-4 no-transition" style={{ color: mutedColor }} strokeWidth={1.5} />
              </button>
            </div>

            {/* Quick Prompt Chips */}
            <div
              className="flex gap-2 px-5 py-3 overflow-x-auto flex-shrink-0"
              style={{ borderBottom: `1px solid ${divider}` }}
            >
              {['Monthly Summary', 'Top Expenses', 'Savings Tips', 'Set Budget'].map((label) => (
                <button
                  key={label}
                  onClick={() => setInputValue(label)}
                  className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap"
                  style={{
                    background: 'rgba(67,124,239,0.08)',
                    color: '#437CEF',
                    border: '1px solid rgba(67,124,239,0.18)',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`flex flex-col gap-1.5 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                    style={{ maxWidth: '84%' }}
                  >
                    {msg.role === 'ai' && (
                      <div className="flex items-center gap-2 mb-0.5">
                        <div
                          className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                          style={{ background: BRAND_GRAD }}
                        >
                          <Sparkles className="w-2.5 h-2.5 text-white no-transition" strokeWidth={1.5} />
                        </div>
                        <span className="text-xs font-semibold" style={{ color: mutedColor }}>
                          Zorvyn AI
                        </span>
                      </div>
                    )}
                    <div
                      className="px-4 py-3 rounded-2xl text-sm leading-relaxed"
                      style={
                        msg.role === 'user'
                          ? {
                            background: BRAND_GRAD,
                            color: '#fff',
                            borderBottomRightRadius: '6px',
                            fontWeight: 500,
                          }
                          : {
                            background: bubbleBg,
                            border: bubbleBorder,
                            color: headingColor,
                            borderBottomLeftRadius: '6px',
                          }
                      }
                    >
                      {msg.role === 'ai' ? <Formatted text={msg.content} /> : msg.content}
                    </div>
                    {msg.chips && (
                      <div className="flex gap-2 flex-wrap mt-0.5">
                        {msg.chips.map((chip) => (
                          <button
                            key={chip}
                            className="px-3 py-1 rounded-lg text-xs font-semibold"
                            style={{
                              background: 'rgba(128,94,217,0.08)',
                              color: '#805ED9',
                              border: '1px solid rgba(128,94,217,0.2)',
                            }}
                          >
                            {chip}
                          </button>
                        ))}
                      </div>
                    )}
                    <span className="text-[10px] px-1" style={{ color: mutedColor }}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}

              {/* Auto-typing stream bubble */}
              {isAutoTyping && typingText && (
                <div className="flex justify-start">
                  <div className="flex flex-col gap-1.5 items-start" style={{ maxWidth: '84%' }}>
                    <div className="flex items-center gap-2 mb-0.5">
                      <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: BRAND_GRAD }}>
                        <Sparkles className="w-2.5 h-2.5 text-white no-transition" strokeWidth={1.5} />
                      </div>
                      <span className="text-xs font-semibold" style={{ color: mutedColor }}>Zorvyn AI</span>
                    </div>
                    <div
                      className="px-4 py-3 rounded-2xl text-sm leading-relaxed"
                      style={{ background: bubbleBg, border: bubbleBorder, color: headingColor, borderBottomLeftRadius: '6px' }}
                    >
                      <Formatted text={typingText} />
                      <motion.span
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 0.7, repeat: Infinity }}
                        className="inline-block w-0.5 h-3.5 ml-0.5 rounded-full align-middle"
                        style={{ background: '#805ED9' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Regular typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div
                    className="px-4 py-3.5 rounded-2xl rounded-bl"
                    style={{ background: bubbleBg, border: bubbleBorder }}
                  >
                    <div className="flex gap-1.5 items-center">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="block w-1.5 h-1.5 rounded-full"
                          style={{ background: BRAND_GRAD }}
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.65, delay: i * 0.16, repeat: Infinity }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-5 py-5 flex-shrink-0" style={{ borderTop: `1px solid ${divider}` }}>
              <div
                className="flex items-center gap-3 rounded-2xl px-4 py-3"
                style={{ background: bubbleBg, border: bubbleBorder }}
              >
                <input
                  type="text"
                  placeholder="Ask Zorvyn AI anything..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1 bg-transparent outline-none text-sm font-medium placeholder:font-normal"
                  style={{ color: headingColor }}
                />
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  whileHover={inputValue.trim() && !isTyping ? { boxShadow: '0 0 15px rgba(128,94,217,0.6)' } : {}}
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isTyping}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                    inputValue.trim()
                      ? 'border-transparent text-white'
                      : ''
                  }`}
                  style={{
                    background: inputValue.trim() ? 'linear-gradient(135deg, #437cef 0%, #805ed9 100%)' : bubbleBg,
                    border: inputValue.trim() ? 'none' : bubbleBorder,
                    opacity: isTyping ? 0.5 : 1,
                  }}
                >
                  <Send
                    className="w-3.5 h-3.5 no-transition"
                    strokeWidth={2}
                    style={{ color: inputValue.trim() ? '#fff' : mutedColor }}
                  />
                </motion.button>
              </div>
              <p className="text-center text-[10px] mt-3 font-medium" style={{ color: mutedColor }}>
                Zorvyn AI · Powered by financial intelligence
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
