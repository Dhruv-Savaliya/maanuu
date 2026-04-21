"use client";

import { motion, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import CustomCursor from "@/components/ui/CustomCursor";
import ParticleCanvas from "@/components/ui/ParticleCanvas";
import MusicPlayer from "@/components/MusicPlayer";
import { Heart, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Ultra-smooth mobile-optimized animations
const fadeInUp = {
  hidden: { opacity: 0, y: 30, filter: "blur(5px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -30, filter: "blur(3px)" },
  visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

export default function Home() {
  const { scrollYProgress } = useScroll();
  const [activeSection, setActiveSection] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [tapResponse, setTapResponse] = useState("");
  const [daysCount, setDaysCount] = useState(0);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    setMounted(true);
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);

    const startDate = new Date("2025-02-24");
    const now = new Date();
    const diff = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diff > 0) {
      let count = 0;
      const step = Math.max(1, Math.floor(diff / 60));
      const timer = setInterval(() => {
        count += step;
        if (count >= diff) {
          setDaysCount(diff);
          clearInterval(timer);
        } else {
          setDaysCount(count);
        }
      }, 30);
      return () => {
        clearInterval(timer);
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  const sections = [
    "hero", "music", "beginning", "chat-sim", "confession", 
    "nicknames", "gallery", "love-notes", "interaction", "future", "final"
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2.5;
      let current = 0;
      for (let i = 0; i < sections.length; i++) {
        const element = document.getElementById(sections[i]);
        if (element && element.offsetTop <= scrollPosition) {
          current = i;
        }
      }
      setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
    // Determine tap coordinates regardless of touch or mouse event
    let clientX = 0;
    let clientY = 0;
    
    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else {
      // Fallback for centered explosion if coords aren't available
      clientX = window.innerWidth / 2;
      clientY = window.innerHeight / 2;
    }

    const responses = [
      "I knew it, Maanuuu. I always knew it. 💖",
      "Joti hati tane ej kehti, Gobari. 😄",
      "Have bol — ketlo prem kare chhe? 😳💗",
      "Every tap = one more reason to smile, Maanu. 💕",
      "Bas aji ek var tap kar… please? 🥺",
    ];
    setTapResponse(responses[tapCount % responses.length]);
    setTapCount((p) => p + 1);

    // Dynamic particle explosion optimized for mobile rendering
    const particleCount = isMobile ? 12 : 20;
    for (let i = 0; i < particleCount; i++) {
      setTimeout(() => {
        const h = document.createElement("div");
        h.className = "fixed pointer-events-none z-[9999]";
        h.textContent = ["💖", "💗", "💕", "💓", "💝", "🩷"][Math.floor(Math.random() * 6)];
        const spread = isMobile ? 120 : 200;
        const x = clientX + (-spread/2 + Math.random() * spread);
        const y = clientY;
        const size = isMobile ? (1 + Math.random() * 0.8) : (1 + Math.random() * 1.5);
        
        h.style.left = `${x}px`;
        h.style.top = `${y}px`;
        h.style.fontSize = `${size}rem`;
        h.style.transition = "all 2s cubic-bezier(0.16, 1, 0.3, 1)";
        h.style.transform = "translateY(0) scale(1) rotate(0deg)";
        h.style.opacity = "1";
        
        document.body.appendChild(h);
        
        requestAnimationFrame(() => {
          h.style.transform = `translateY(-${isMobile ? 200 : 300}px) scale(0.2) rotate(${Math.random() * 90 - 45}deg)`;
          h.style.opacity = "0";
        });
        
        setTimeout(() => h.remove(), 2000);
      }, i * 30);
    }
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  if (!mounted) return null;

  return (
    <main className="relative min-h-screen bg-[var(--color-bg-2)] selection:bg-[#f4a0b5]/30 overflow-x-hidden">
      {!isMobile && <CustomCursor />}
      <ParticleCanvas />
      <MusicPlayer />

      {/* Progress Bar - Thin on mobile */}
      <motion.div 
        className="fixed top-0 left-0 h-[3px] md:h-[2px] z-[1001] bg-gradient-to-r from-[#f4a0b5] via-[#c9b8e8] to-[#e8c47a] origin-left shadow-[0_0_15px_rgba(244,160,181,0.6)]"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Nav Dots - Hidden on very small screens, small on tablets */}
      <nav className="fixed right-3 md:right-6 top-1/2 -translate-y-1/2 hidden sm:flex flex-col gap-2 md:gap-3 z-[100] bg-white/[0.03] p-2 md:p-3 rounded-full backdrop-blur-md border border-white/5">
        {sections.map((id, i) => (
          <div
            key={id}
            onClick={() => scrollTo(id)}
            className={cn(
              "w-1.5 h-1.5 md:w-2 md:h-2 rounded-full cursor-pointer transition-all duration-500",
              activeSection === i 
                ? "bg-[#f4a0b5] scale-[1.7] shadow-[0_0_12px_rgba(244,160,181,0.8)]" 
                : "bg-[#f4a0b5]/20 hover:bg-[#f4a0b5]/50"
            )}
          />
        ))}
      </nav>

      {/* 1. HERO - Mobile Optimized Text */}
      <section id="hero" className="relative min-h-[100svh] flex flex-col items-center justify-center text-center px-5 md:px-6 overflow-hidden bg-[radial-gradient(ellipse_at_top,#1a0826,var(--color-bg-2)_65%)]">
        <motion.div 
          className="absolute w-[150vw] md:w-[800px] h-[150vw] md:h-[800px] rounded-full bg-[radial-gradient(circle,rgba(194,84,122,0.15),transparent_60%)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute w-[100vw] md:w-[500px] h-[100vw] md:h-[500px] rounded-full bg-[radial-gradient(circle,rgba(201,184,232,0.1),transparent_60%)] top-1/3 left-[20%] -translate-x-1/2 -translate-y-1/2 z-0"
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.p 
          className="font-serif italic text-base md:text-xl tracking-[0.15em] md:tracking-[0.2em] text-[#f4a0b5]/60 mb-4 md:mb-6 z-10"
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 1.5, ease: "easeOut" }}
        >
          For someone who changed everything…
        </motion.p>
        <motion.h1 
          className="font-serif font-light text-[4.5rem] sm:text-[6rem] md:text-[8rem] lg:text-[11rem] leading-[0.9] text-gradient drop-shadow-[0_0_25px_rgba(244,160,181,0.25)] mb-3 md:mb-4 z-10"
          initial={{ opacity: 0, scale: 0.9, filter: "blur(15px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} transition={{ duration: 1.8, ease: "easeOut", delay: 0.2 }}
        >
          Maanuuu
        </motion.h1>
        <motion.p 
          className="text-[0.6rem] md:text-xs tracking-[0.3em] md:tracking-[0.4em] uppercase text-[#f4a0b5]/40 mb-10 md:mb-14 z-10"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.8 }}
        >
          A living love story · Made only for you
        </motion.p>
        <motion.button 
          onClick={() => scrollTo("music")}
          className="relative z-10 inline-flex items-center gap-3 px-8 md:px-12 py-4 md:py-5 border border-[#f4a0b5]/25 rounded-full bg-white/[0.03] text-[#f4a0b5] text-[0.85rem] md:text-[0.95rem] tracking-wider backdrop-blur-xl transition-all duration-300 hover:bg-[#f4a0b5]/10 hover:border-[#f4a0b5]/60 active:scale-95 shadow-[0_10px_30px_rgba(194,84,122,0.2)] md:shadow-[0_20px_50px_rgba(194,84,122,0.3)] overflow-hidden group"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.2 }}
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[100%] animate-[shimmer_2.5s_infinite]" />
          <motion.span animate={{ scale: [1, 1.25, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <Heart className="w-4 h-4 fill-current drop-shadow-[0_0_8px_rgba(244,160,181,0.8)]" />
          </motion.span>
          Enter Maanu's World
        </motion.button>
        
        <motion.div 
          className="absolute bottom-10 z-10 text-[#f4a0b5]/30 flex flex-col items-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5, duration: 1 }}
        >
          <p className="text-[0.6rem] uppercase tracking-widest mb-2 font-light">Scroll Down</p>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
            <ChevronDown className="w-4 h-4 opacity-50" />
          </motion.div>
        </motion.div>
      </section>

      {/* 2. MUSIC - Mobile Sized */}
      <section id="music" className="relative min-h-[100svh] flex flex-col items-center justify-center text-center px-6 bg-gradient-to-b from-[var(--color-bg-2)] to-[var(--color-bg-3)]">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: isMobile ? "-50px" : "-100px" }} variants={fadeInUp} className="flex flex-col items-center">
          <div 
            onClick={() => scrollTo("beginning")}
            className="relative flex items-center justify-center w-36 h-36 md:w-48 md:h-48 rounded-full bg-[radial-gradient(circle_at_35%_35%,rgba(244,160,181,0.15),rgba(124,92,191,0.08),transparent)] border border-[#f4a0b5]/15 cursor-pointer mb-8 md:mb-10 group"
          >
            <motion.div 
              className="absolute inset-0 border border-[#f4a0b5]/20 rounded-full"
              animate={{ scale: [1, 1.3], opacity: [1, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.div 
              className="absolute inset-[-20px] md:inset-[-30px] border border-[#c9b8e8]/10 rounded-full"
              animate={{ scale: [1, 1.3], opacity: [1, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeOut", delay: 1.75 }}
            />
            <span className="text-4xl md:text-5xl z-10 transition-transform duration-500 group-hover:scale-110 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">🎵</span>
          </div>
          <h2 className="font-serif italic text-2xl md:text-4xl text-[#f4a0b5]/90 mb-3 drop-shadow-md">"Tu chhe to badhu chhe…"</h2>
          <p className="text-[0.65rem] md:text-xs tracking-[0.25em] uppercase text-[#f4a0b5]/40 font-light">Scroll to feel the magic</p>
        </motion.div>
      </section>

      {/* 3. THE BEGINNING - Timeline Mobile Layout */}
      <section id="beginning" className="relative py-24 md:py-32 flex flex-col items-center justify-center px-5 md:px-6 bg-gradient-to-b from-[var(--color-bg-3)] to-[var(--color-bg-4)] overflow-hidden">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: isMobile ? "-50px" : "-100px" }} variants={fadeInUp} className="text-center w-full">
          <p className="text-[0.65rem] md:text-[0.7rem] tracking-[0.3em] md:tracking-[0.4em] uppercase text-[#f4a0b5]/50 mb-4 md:mb-5">Chapter One</p>
          <h2 className="font-serif font-light text-[2.2rem] md:text-[4.5rem] text-white/90 mb-16 md:mb-20 drop-shadow-lg leading-tight">How It All <em className="text-gradient-simple not-italic">Started</em></h2>
        </motion.div>

        <div className="relative w-full max-w-[640px]">
          {/* Mobile timeline line */}
          <div className="absolute left-[20px] md:left-[27px] top-4 bottom-4 w-[1px] bg-gradient-to-b from-[#f4a0b5]/5 via-[#f4a0b5]/30 to-[#f4a0b5]/5" />
          
          {[
            { emoji: "🌅", date: "24 February 2025", title: "The First Day", text: '"Ek random divas hato — pan tara jode vaat thai ane badhuj badlai gayu."', note: "The day I didn't know would change my life forever." },
            { emoji: "😊", date: "The First Smile", title: "Just You", text: '"Taru a hasvu — Maanu — I don\'t think you realise ke e maru shu haal kare chhe."', note: "Still one of my favourite views in the whole world." },
            { emoji: "💬", date: "Late Night Conversations", title: "Time Stopped", text: '"Pela ek message, pachi ek kalak, pachi aakhi raat…"', note: "I didn't notice time passing. I still don't, when it's you." },
            { emoji: "🌸", date: "The Realisation", title: "More Than A Name", text: '"Jyare samjayu ke tane \'Maanuuu\' bolavvu e khali naam nathi — ek feeling chhe."', note: "Gobari, you became my peace before I even knew it." },
            { emoji: "✨", date: "Every day since", title: "Our Story", text: '"Tari sathe vitaraveli ekek ordinary moment aevi lage jaqne koi geet ni line hoy."', note: "This is our story. And it's just getting started." }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInLeft}
              className="flex gap-5 md:gap-8 mb-12 md:mb-14 last:mb-0 group"
            >
              <div className="w-[40px] h-[40px] md:w-[54px] md:h-[54px] shrink-0 rounded-full bg-[#140d1e] border border-[#f4a0b5]/30 shadow-[0_0_15px_rgba(244,160,181,0.15)] flex items-center justify-center text-lg md:text-2xl z-10 transition-all duration-500 group-hover:scale-110 group-hover:bg-[#f4a0b5]/15 group-hover:border-[#f4a0b5]/70 group-hover:shadow-[0_0_25px_rgba(244,160,181,0.4)] mt-1 md:mt-0">
                {item.emoji}
              </div>
              <div className="pt-1">
                <p className="text-[0.65rem] md:text-[0.7rem] tracking-[0.2em] md:tracking-[0.25em] uppercase text-[#e8c47a]/60 mb-1.5 md:mb-2">{item.date}</p>
                <p className="font-serif italic text-[1.05rem] md:text-[1.45rem] text-white/85 leading-relaxed md:leading-relaxed drop-shadow-sm mb-1.5">{item.text}</p>
                <p className="text-[0.75rem] md:text-[0.85rem] text-[#f4a0b5]/40 font-light leading-snug">{item.note}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. CHAT SIMULATION - Dynamic Island & iOS style rendering */}
      <section id="chat-sim" className="relative py-24 md:py-32 flex flex-col items-center justify-center px-4 sm:px-6 bg-gradient-to-b from-[var(--color-bg-4)] to-[#100c1a]">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: isMobile ? "-50px" : "-100px" }} variants={fadeInUp} className="text-center w-full">
          <p className="text-[0.65rem] md:text-[0.7rem] tracking-[0.3em] md:tracking-[0.4em] uppercase text-[#f4a0b5]/50 mb-4 md:mb-5">Rewinding Time</p>
          <h2 className="font-serif font-light text-[2.2rem] md:text-[4.5rem] text-white/90 mb-12 md:mb-16 drop-shadow-lg leading-tight">Our First <em className="text-gradient-simple not-italic">Conversations</em></h2>
        </motion.div>

        {/* iPhone Style Mockup Container */}
        <motion.div 
          initial={{ opacity: 0, y: 50, filter: "blur(10px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once: true }} transition={{ duration: 1 }}
          className="w-full max-w-[400px] md:max-w-[420px] bg-[#0d0810]/80 border-[6px] border-[#221833] rounded-[40px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(194,84,122,0.15)] relative"
        >
          {/* iOS Status Bar Mock */}
          <div className="absolute top-0 left-0 w-full h-12 bg-transparent z-20 flex justify-between items-center px-6 pt-2">
            <span className="text-[0.65rem] font-medium text-white/80">9:41</span>
            {/* Dynamic Island Mock */}
            <div className="w-[100px] h-6 bg-black rounded-full shadow-[inset_0_0_4px_rgba(255,255,255,0.1)] absolute left-1/2 -translate-x-1/2 top-2" />
            <div className="flex gap-1.5 items-center">
              <span className="w-4 h-2.5 border border-white/40 rounded-[2px] relative"><span className="absolute top-[1px] left-[1px] bottom-[1px] right-[2px] bg-white/80 rounded-[1px]" /><span className="absolute -right-[2px] top-1/2 -translate-y-1/2 w-[1px] h-1 bg-white/40" /></span>
            </div>
          </div>

          <div className="pt-12 p-4 md:p-5 bg-gradient-to-r from-[#f4a0b5]/10 to-transparent border-b border-white/5 flex items-center gap-4 backdrop-blur-2xl">
            <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-gradient-to-br from-[#f4a0b5] to-[#7c5cbf] shadow-[0_0_15px_rgba(244,160,181,0.4)] flex items-center justify-center text-sm md:text-lg">🌸</div>
            <div>
              <p className="text-[0.95rem] md:text-[1rem] font-medium text-white/95 tracking-wide">Maanuuu 💖</p>
              <p className="text-[0.65rem] md:text-xs text-[#f4a0b5]/70 mt-0.5">typing…</p>
            </div>
          </div>
          
          <div className="p-4 md:p-5 flex flex-col gap-3 min-h-[350px] md:min-h-[380px] bg-[#140d1e]/50 pb-8">
            <div className="text-[0.65rem] text-white/25 text-center tracking-widest mb-3 font-light mt-1">24 Feb · The beginning</div>
            {[
              { type: "recv", text: "Happy Birthday! 🎉", isUnsent: false },
              { type: "recv", text: "Maanuuu unsent a message", isUnsent: true },
              { type: "sent", text: "Thank you 😊", isUnsent: false },
              { type: "sent", text: "Kem message unsend kariyo? 👀", isUnsent: false },
              { type: "recv", text: "Kain nai aem j 😅", isUnsent: false },
              { type: "sent", text: "Achaa okay 😄", isUnsent: false }
            ].map((msg, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 15, scale: 0.95 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.45, type: "spring" }}
                className={cn(
                  "max-w-[80%] px-3.5 py-2.5 rounded-[18px] text-[0.85rem] leading-snug shadow-sm",
                  msg.type === "sent" 
                    ? "bg-gradient-to-br from-[#c2547a]/50 to-[#7c5cbf]/40 border border-[#f4a0b5]/25 self-end rounded-br-[4px] text-white/95" 
                    : msg.isUnsent
                      ? "bg-transparent border border-white/10 self-start rounded-bl-[4px] text-white/30 italic text-[0.75rem] py-1.5 px-3"
                      : "bg-[#251e33]/80 border border-white/5 self-start rounded-bl-[4px] text-white/90 backdrop-blur-md"
                )}
              >
                {msg.text}
              </motion.div>
            ))}
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 3.5, duration: 1 }} className="text-[0.65rem] md:text-[0.7rem] text-[#f4a0b5]/50 text-center tracking-widest mt-5 bg-white/5 py-1.5 rounded-full w-max mx-auto px-4">…and we never stopped talking 💕</motion.div>
          </div>
        </motion.div>
      </section>

      {/* 5. CONFESSION - Cinematic Centerpiece */}
      <section id="confession" className="relative min-h-[100svh] flex flex-col items-center justify-center px-5 md:px-6 bg-[radial-gradient(ellipse_at_center,#1e0a20,var(--color-bg-1))]">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: isMobile ? "-50px" : "-100px" }} variants={fadeInUp} className="text-center w-full">
          <p className="text-[0.65rem] md:text-[0.7rem] tracking-[0.3em] md:tracking-[0.4em] uppercase text-[#f4a0b5]/50 mb-4 md:mb-5">Chapter Two</p>
          <h2 className="font-serif font-light text-[2.2rem] md:text-[4.5rem] text-white/90 mb-12 md:mb-16 drop-shadow-lg leading-tight">The Day I <em className="text-gradient-simple not-italic">Said It</em></h2>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }} whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }} viewport={{ once: true }} transition={{ duration: 1.2, ease: "easeOut" }}
          className="w-full max-w-[540px] bg-gradient-to-br from-[#f4a0b5]/10 via-[#1a0826]/80 to-transparent border border-[#f4a0b5]/20 rounded-[28px] md:rounded-[32px] p-8 md:p-14 text-center backdrop-blur-xl shadow-[0_0_50px_rgba(194,84,122,0.15)] relative overflow-hidden"
        >
          {/* Internal Glows */}
          <div className="absolute -top-32 -right-32 w-48 md:w-64 h-48 md:h-64 bg-[#c2547a]/25 rounded-full blur-[60px] md:blur-[80px]" />
          <div className="absolute -bottom-32 -left-32 w-48 md:w-64 h-48 md:h-64 bg-[#7c5cbf]/25 rounded-full blur-[60px] md:blur-[80px]" />
          
          <div className="relative z-10">
            <p className="text-[0.65rem] md:text-[0.7rem] tracking-[0.25em] md:tracking-[0.3em] text-[#e8c47a]/70 uppercase mb-6 md:mb-8 font-medium">7 March 2025</p>
            <motion.span animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} className="text-6xl md:text-7xl block mb-8 md:mb-10 drop-shadow-[0_0_25px_rgba(244,160,181,0.6)]">💝</motion.span>
            <p className="font-serif italic text-[1.1rem] md:text-[1.7rem] text-white/95 leading-relaxed mb-5 md:mb-6 drop-shadow-md">
              "Maanu… Mane khabar chhe bau time nathi thayo, pan tara mate je feel thay chhe — e bau real chhe."
            </p>
            <p className="font-serif italic text-[1.1rem] md:text-[1.7rem] text-white/95 leading-relaxed mb-8 md:mb-10 drop-shadow-md">
              "Mane nathi khabar perfect words shu hoy. Bas aatlu khabar chhe — I really, really like you. Ane hu aa feeling have chupavi nathi shakto."
            </p>
            <div className="w-16 md:w-20 h-[1px] bg-gradient-to-r from-transparent via-[#f4a0b5]/60 to-transparent mx-auto my-8 md:my-10" />
            <p className="text-[0.8rem] md:text-[0.9rem] text-[#f4a0b5]/70 leading-relaxed font-light">That was the moment everything became real.<br className="md:hidden" /> No going back. No wanting to.</p>
          </div>
        </motion.div>
      </section>

      {/* 6. NICKNAMES - Tight Grid on Mobile */}
      <section id="nicknames" className="relative py-24 md:py-32 flex flex-col items-center justify-center px-5 md:px-6 bg-gradient-to-b from-[var(--color-bg-1)] to-[var(--color-bg-3)]">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: isMobile ? "-50px" : "-100px" }} variants={fadeInUp} className="text-center w-full">
          <p className="text-[0.65rem] md:text-[0.7rem] tracking-[0.3em] md:tracking-[0.4em] uppercase text-[#f4a0b5]/50 mb-4 md:mb-5">The Names Only I Call You</p>
          <h2 className="font-serif font-light text-[2.2rem] md:text-[4.5rem] text-white/90 mb-12 md:mb-16 drop-shadow-lg leading-tight">My <em className="text-gradient-simple not-italic">Favourite</em> Words</h2>
        </motion.div>

        <motion.div 
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: isMobile ? "-20px" : "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 w-full max-w-[640px]"
        >
          {[
            { emoji: "💖", name: "Maanuuu", text: "The one I can't stop saying. My favourite sound in the world." },
            { emoji: "🐾", name: "Gobari", text: "Because you're adorably, helplessly, perfectly you." },
            { emoji: "🌪️", name: "Vaydo", text: "When you go full crazy-cute mode and I just watch and smile." },
            { emoji: "🧸", name: "Gobaro", text: "My favourite weirdo. My comfort. My person." }
          ].map((nick, i) => (
            <motion.div 
              key={i} variants={fadeInUp}
              className="group bg-gradient-to-br from-white/[0.05] to-transparent border border-white/[0.08] rounded-[20px] md:rounded-[24px] p-6 md:p-8 text-center backdrop-blur-lg transition-all duration-500 hover:-translate-y-1.5 hover:border-[#f4a0b5]/40 hover:shadow-[0_20px_60px_rgba(194,84,122,0.2)] relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(244,160,181,0.15),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="text-3xl md:text-4xl block mb-3 md:mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">{nick.emoji}</span>
              <p className="font-serif italic font-light text-2xl md:text-3xl text-gradient mb-2 md:mb-3 drop-shadow-sm">{nick.name}</p>
              <p className="text-[0.75rem] md:text-[0.8rem] text-white/50 leading-relaxed font-light">{nick.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 7. GALLERY - Staggered Mobile Grid */}
      <section id="gallery" className="relative py-24 md:py-32 flex flex-col items-center justify-center px-5 md:px-6 bg-[var(--color-bg-4)]">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: isMobile ? "-50px" : "-100px" }} variants={fadeInUp} className="text-center w-full">
          <p className="text-[0.65rem] md:text-[0.7rem] tracking-[0.3em] md:tracking-[0.4em] uppercase text-[#f4a0b5]/50 mb-4 md:mb-5">Memory Lane</p>
          <h2 className="font-serif font-light text-[2.2rem] md:text-[4.5rem] text-white/90 mb-10 md:mb-16 drop-shadow-lg leading-tight">Moments I <em className="text-gradient-simple not-italic">Keep</em></h2>
        </motion.div>

        <motion.div 
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: isMobile ? "-20px" : "-50px" }}
          className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-8 w-full max-w-[640px]"
        >
          {[
            { emoji: "🌄", title: "Golden hour", msg: '"Tara jode memories banavvanu kyarey bandh nathi karvu, Maanu."', rot: "-3deg", grad: "from-[#f4a0b5]/20 to-[#c9b8e8]/15" },
            { emoji: "😂", title: "That silly laugh", msg: '"Gobari nu a hasvu — it\'s my favourite sound. Period."', rot: "2.5deg", grad: "from-[#c9b8e8]/20 to-[#7c5cbf]/15" },
            { emoji: "🌙", title: "Late night talks", msg: '"Tara jode ni 2 AM conversations a duniya ma sau thi real lage chhe."', rot: "-2deg", grad: "from-[#e8c47a]/20 to-[#f4a0b5]/15" },
            { emoji: "🫶", title: "Just us", msg: '"Tu chhe to badhuj sachu lage chhe, Maanuuu. That\'s just the truth."', rot: "3deg", grad: "from-[#f4a0b5]/20 to-[#e8c47a]/15" }
          ].map((pic, i) => (
            <motion.div 
              key={i} variants={fadeInUp}
              className="relative group bg-white/[0.05] border border-white/[0.12] rounded-[16px] md:rounded-[24px] p-3 md:p-5 pb-5 md:pb-8 transition-all duration-500 hover:z-20 hover:-translate-y-3 hover:rotate-0 md:hover:scale-110 active:scale-95 hover:shadow-[0_25px_50px_rgba(194,84,122,0.35)] shadow-xl"
              style={{ transform: `rotate(${pic.rot})` }}
            >
              <div className={cn("w-full aspect-square rounded-[12px] md:rounded-xl flex items-center justify-center text-4xl md:text-5xl mb-2 md:mb-3 bg-gradient-to-br shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]", pic.grad)}>
                {pic.emoji}
              </div>
              <p className="font-serif italic text-[0.75rem] md:text-[0.9rem] text-white/60 text-center tracking-wide">{pic.title}</p>
              
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0810] via-[#0d0810]/95 to-[#0d0810]/80 flex items-center justify-center p-4 md:p-6 rounded-[16px] md:rounded-[24px] opacity-0 transition-all duration-400 group-hover:opacity-100 flex-col backdrop-blur-md">
                <p className="font-serif italic text-[0.85rem] md:text-[1.1rem] text-[#f4a0b5] text-center leading-relaxed drop-shadow-[0_0_12px_rgba(244,160,181,0.5)]">{pic.msg}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
        <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-[0.65rem] md:text-[0.75rem] tracking-[0.25em] text-[#f4a0b5]/40 uppercase mt-12 md:mt-16 font-light">{isMobile ? "Tap card to feel the memory" : "Hover to feel the memory"}</motion.p>
      </section>

      {/* 8. LOVE NOTES - iOS Mockup Refined */}
      <section id="love-notes" className="relative py-24 md:py-32 flex flex-col items-center justify-center px-4 sm:px-6 bg-gradient-to-b from-[var(--color-bg-4)] to-[#100c1a]">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: isMobile ? "-50px" : "-100px" }} variants={fadeInUp} className="text-center w-full">
          <p className="text-[0.65rem] md:text-[0.7rem] tracking-[0.3em] md:tracking-[0.4em] uppercase text-[#f4a0b5]/50 mb-4 md:mb-5">Unsent Messages</p>
          <h2 className="font-serif font-light text-[2.2rem] md:text-[4.5rem] text-white/90 mb-12 md:mb-16 drop-shadow-lg leading-tight">Things I <em className="text-gradient-simple not-italic">Wanted</em><br/>To Say</h2>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 50, filter: "blur(10px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once: true }} transition={{ duration: 1 }}
          className="w-full max-w-[400px] md:max-w-[460px] bg-[#0d0810]/80 border-[6px] border-[#221833] rounded-[40px] overflow-hidden backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(194,84,122,0.15)] relative"
        >
          {/* iOS Status Bar Mock */}
          <div className="absolute top-0 left-0 w-full h-12 bg-transparent z-20 flex justify-between items-center px-6 pt-2">
            <span className="text-[0.65rem] font-medium text-white/80">9:41</span>
            <div className="w-[100px] h-6 bg-black rounded-full shadow-[inset_0_0_4px_rgba(255,255,255,0.1)] absolute left-1/2 -translate-x-1/2 top-2" />
            <div className="flex gap-1.5 items-center">
              <span className="w-4 h-2.5 border border-white/40 rounded-[2px] relative"><span className="absolute top-[1px] left-[1px] bottom-[1px] right-[2px] bg-white/80 rounded-[1px]" /><span className="absolute -right-[2px] top-1/2 -translate-y-1/2 w-[1px] h-1 bg-white/40" /></span>
            </div>
          </div>

          <div className="pt-12 p-4 md:p-5 bg-gradient-to-r from-[#f4a0b5]/10 to-transparent border-b border-white/5 flex items-center gap-4">
            <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-gradient-to-br from-[#f4a0b5] to-[#7c5cbf] shadow-[0_0_15px_rgba(244,160,181,0.5)] flex items-center justify-center text-sm md:text-lg">🌸</div>
            <div>
              <p className="text-[0.95rem] md:text-[1rem] font-medium text-white/95">Maanuuu 💖</p>
              <p className="text-[0.65rem] md:text-[0.7rem] tracking-wider text-[#f4a0b5]/60 mt-0.5">Always online in my heart</p>
            </div>
          </div>
          <div className="p-4 md:p-6 flex flex-col gap-3 md:gap-4 bg-[#140d1e]/50 pb-8">
            <div className="text-[0.65rem] md:text-[0.7rem] text-white/25 text-center tracking-widest mb-2 md:mb-3 font-light mt-1">Today · Always</div>
            {[
              { type: "recv", text: '"Maanu…"' },
              { type: "sent", text: '"Tane khabar chhe tu mara mate ketli important chhe? Like actually khabar chhe?"' },
              { type: "recv", text: '"Gobari 😄 — a taru naam chhe kem ke tu aatli adorably tu j chhe."' },
              { type: "sent", text: '"Tari ek vaat thi maro divas bani jaay chhe. Seriously."' },
              { type: "recv", text: '"Tu khali koi aevi chokri nathi jene hu like karu chhu, Maanuuu. Tu e chhe jeno vichar mane sunsets vakhte aave chhe."' },
              { type: "sent", text: '"Ane tara mate je feel thay chhe — enu naam mane nathi khabar, but it\'s everything."' },
              { type: "recv", text: '"So yeah. Aa taru chhe. Badhuj. 💖"' }
            ].map((msg, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 15, scale: 0.95 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.35, type: "spring" }}
                className={cn(
                  "max-w-[82%] px-3.5 md:px-4 py-2.5 md:py-3 rounded-[18px] text-[0.85rem] md:text-[0.95rem] leading-snug shadow-sm",
                  msg.type === "sent" 
                    ? "bg-gradient-to-br from-[#c2547a]/50 to-[#7c5cbf]/40 border border-[#f4a0b5]/25 self-end rounded-br-[4px] text-white/95" 
                    : "bg-[#251e33]/80 border border-white/5 self-start rounded-bl-[4px] text-white/90 backdrop-blur-md"
                )}
              >
                {msg.text}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 9. INTERACTION - Optimized button hit area for mobile */}
      <section id="interaction" className="relative py-32 md:py-40 flex flex-col items-center justify-center px-5 bg-gradient-to-b from-[#100c1a] to-[var(--color-bg-2)] text-center">
        <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="font-serif italic text-[1.5rem] md:text-[2.5rem] text-white/80 mb-2 md:mb-3 drop-shadow-md">"Okay, ek question, Maanu…"</motion.p>
        <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="font-serif italic text-[0.95rem] md:text-[1.3rem] text-white/50 mb-10 md:mb-14 font-light">(Gobari, sachu keje 😳)</motion.p>
        
        <motion.button 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
          onClick={handleTap}
          className="relative inline-flex items-center gap-2 md:gap-3 px-10 md:px-14 py-4 md:py-6 rounded-full bg-gradient-to-br from-[#c2547a]/25 to-[#7c5cbf]/25 border border-[#f4a0b5]/50 text-[#f4a0b5] text-[0.95rem] md:text-[1.1rem] font-medium transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-[0_15px_40px_rgba(194,84,122,0.35)] overflow-hidden"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 active:opacity-100 transition-opacity" />
          <span className="relative z-10">Tap if you love me</span>
          <span className="text-xl md:text-3xl relative z-10">😳</span>
        </motion.button>
        
        <div className={cn("mt-10 md:mt-12 overflow-hidden transition-all duration-700 ease-out", tapCount > 0 ? "max-h-60 opacity-100 scale-100" : "max-h-0 opacity-0 scale-95")}>
          <p className="font-serif italic text-[1.1rem] md:text-[1.8rem] text-[#f4a0b5] drop-shadow-[0_0_12px_rgba(244,160,181,0.5)] bg-white/5 px-6 md:px-8 py-4 rounded-[20px] border border-[#f4a0b5]/25 backdrop-blur-md max-w-[300px] md:max-w-none leading-relaxed">{tapResponse}</p>
        </div>
      </section>

      {/* 10. FUTURE - Refined Typo for Mobile */}
      <section id="future" className="relative py-32 md:py-40 flex flex-col items-center justify-center px-6 bg-[var(--color-bg-1)] text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150vw] md:w-[800px] h-[300px] bg-[radial-gradient(ellipse_at_top,rgba(244,160,181,0.08),transparent_70%)]" />
        
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="w-16 md:w-24 h-[1px] bg-gradient-to-r from-transparent via-[#f4a0b5]/60 to-transparent mx-auto mb-8 md:mb-10 opacity-50" />
        <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-[0.65rem] md:text-[0.75rem] tracking-[0.3em] md:tracking-[0.4em] uppercase text-[#f4a0b5]/60 mb-12 md:mb-16 font-light">Looking Ahead</motion.p>
        
        <div className="space-y-12 md:space-y-16">
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="relative z-10 max-w-[320px] md:max-w-[500px] font-serif italic font-light text-[1.35rem] md:text-[2.2rem] text-white/90 leading-relaxed md:leading-relaxed drop-shadow-md mx-auto">
            "Maanu, taro saath hoy to <em className="text-[#f4a0b5] not-italic drop-shadow-[0_0_10px_rgba(244,160,181,0.6)]">darek rasto</em> sacho lage chhe."
          </motion.p>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="relative z-10 max-w-[320px] md:max-w-[540px] font-serif italic font-light text-[1.35rem] md:text-[2.2rem] text-white/90 leading-relaxed md:leading-relaxed drop-shadow-md mx-auto">
            "Mane tane hamesha hasti jovi chhe. I want to be your 3 AM, your <em className="text-[#f4a0b5] not-italic drop-shadow-[0_0_10px_rgba(244,160,181,0.6)]">good morning</em>, your safe place."
          </motion.p>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="relative z-10 max-w-[320px] md:max-w-[460px] font-serif italic font-light text-[1.15rem] md:text-[1.6rem] text-white/70 leading-relaxed mx-auto">
            "Aa khali message nathi. Aa ek <em className="text-[#f4a0b5] not-italic font-medium drop-shadow-[0_0_5px_rgba(244,160,181,0.3)]">promise</em> chhe."
          </motion.p>
        </div>
        
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="w-16 md:w-24 h-[1px] bg-gradient-to-r from-transparent via-[#f4a0b5]/60 to-transparent mx-auto mt-12 md:mt-16 opacity-50" />
      </section>

      {/* 11. FINAL - High Impact Ending */}
      <section id="final" className="relative py-32 min-h-[100svh] flex flex-col items-center justify-center px-5 md:px-6 bg-[radial-gradient(ellipse_at_bottom,#1e0a20,var(--color-bg-1))] text-center">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[150vw] md:w-full h-[300px] md:h-[500px] bg-[radial-gradient(ellipse_at_bottom,rgba(194,84,122,0.2),transparent_70%)] pointer-events-none" />
        
        <motion.span 
          animate={{ scale: [1, 1.15, 1], filter: ["drop-shadow(0 0 10px rgba(244,160,181,0.6))", "drop-shadow(0 0 35px rgba(244,160,181,0.9))", "drop-shadow(0 0 10px rgba(244,160,181,0.6))"] }} 
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} 
          className="text-6xl md:text-8xl block mb-6 md:mb-8 relative z-10"
        >
          💞
        </motion.span>
        
        <motion.h2 
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 0.2 }}
          className="font-serif font-light text-[3.2rem] sm:text-[4rem] md:text-[6.5rem] text-gradient leading-[1.05] mb-5 md:mb-6 drop-shadow-[0_0_25px_rgba(244,160,181,0.4)] relative z-10"
        >
          I love you,<br/>Maanuuu.
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 0.5 }}
          className="font-serif italic text-[1rem] md:text-[1.5rem] text-[#f4a0b5]/70 mb-12 md:mb-14 relative z-10"
        >
          — Always, unconditionally, completely.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 0.8 }}
          className="flex flex-col items-center px-8 md:px-12 py-5 md:py-8 bg-white/[0.04] border border-[#f4a0b5]/25 rounded-[28px] md:rounded-[36px] backdrop-blur-2xl mb-12 md:mb-14 shadow-[0_25px_60px_rgba(0,0,0,0.6)] relative z-10"
        >
          <span className="font-serif font-light text-[4.5rem] md:text-[7.5rem] text-gradient drop-shadow-lg leading-none mb-1 md:mb-2">{daysCount > 0 ? daysCount : "∞"}</span>
          <span className="text-[0.6rem] md:text-[0.75rem] tracking-[0.2em] md:tracking-[0.25em] text-[#f4a0b5]/60 uppercase mt-2 font-medium">Days of feeling lucky to know you</span>
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 1.2 }}
          className="font-serif italic text-[0.95rem] md:text-[1.3rem] text-white/60 max-w-[300px] md:max-w-[400px] leading-relaxed mb-12 md:mb-16 relative z-10 drop-shadow-md"
        >
          "Aa page, aa feelings, aa badhuj —<br/>khali taru chhe, Gobari. 💖<br/><br/>
          <em className="text-[#e8c47a]/80 not-italic font-medium drop-shadow-[0_0_8px_rgba(232,196,122,0.4)]">Tari lidhe badhuj different chhe.</em>"
        </motion.p>
        
        <motion.p 
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 1.5 }}
          className="text-[0.55rem] md:text-[0.65rem] tracking-[0.25em] md:tracking-[0.3em] uppercase text-[#f4a0b5]/30 relative z-10 font-light"
        >
          Made with love · Only for Maanuuu
        </motion.p>
      </section>
    </main>
  );
}
