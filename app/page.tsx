'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import type { Transition } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import {
  TrendingUp, Shield, Zap, Users, Trophy, ArrowRight, Star,
  Globe, Lock, ChevronDown, Play, BarChart3, Coins, CreditCard,
  ArrowUpRight, Phone, MapPin, Search, X,
} from 'lucide-react';
import PublicLayout from './(public)/layout';
import CTASection from '@/components/public/CTASection';
import NewsGrid from '@/components/public/NewsGrid';

/* ─────────────────────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────────────────────── */

const STATS = [
  { v: '$4.2B+', l: 'Trading Volume',  s: 'Monthly' },
  { v: '180K+',  l: 'Active Traders',  s: 'Worldwide' },
  { v: '350+',   l: 'Trading Pairs',   s: 'Live Markets' },
  { v: '150+',   l: 'Countries',       s: 'Supported' },
];

const RANK_LEVELS = [
  { level:1, badge:'🥉', name:'Coordinator',        salary:'$50',    team:'0',     color:'#94A3B8', bg:'rgba(148,163,184,0.08)',  border:'rgba(148,163,184,0.15)' },
  { level:2, badge:'🥈', name:'Regional Ambassador', salary:'$120',   team:'5+',    color:'#22C55E', bg:'rgba(34,197,94,0.08)',    border:'rgba(34,197,94,0.15)'   },
  { level:3, badge:'🥇', name:'Visionary Elite',     salary:'$280',   team:'20+',   color:'#8B5CF6', bg:'rgba(139,92,246,0.08)',   border:'rgba(139,92,246,0.15)'  },
  { level:4, badge:'💎', name:'Legacy Executive',    salary:'$600',   team:'50+',   color:'#F59E0B', bg:'rgba(245,158,11,0.08)',   border:'rgba(245,158,11,0.15)'  },
  { level:5, badge:'👑', name:'National Elite',      salary:'$1,200', team:'150+',  color:'#EF4444', bg:'rgba(239,68,68,0.08)',    border:'rgba(239,68,68,0.15)'   },
  { level:6, badge:'🌟', name:'Legacy Ambassador',   salary:'$2,400', team:'500+',  color:'#3B82F6', bg:'rgba(59,130,246,0.08)',   border:'rgba(59,130,246,0.15)'  },
  { level:7, badge:'🔥', name:'Freedom Icon',        salary:'$4,800', team:'1500+', color:'#EC4899', bg:'rgba(236,72,153,0.08)',   border:'rgba(236,72,153,0.15)'  },
  { level:8, badge:'⚡', name:'Infinity Legend',     salary:'$9,600', team:'5000+', color:'#F97316', bg:'rgba(249,115,22,0.08)',   border:'rgba(249,115,22,0.15)'  },
];

const CHART_PATTERNS = [
  { img:'https://res.cloudinary.com/dgdlyrgda/image/upload/v1779841041/img1_rm3tue.jpg', title:'Double Top Pattern',   desc:'Learn to identify resistance zones and reversal signals for optimal sell entries.' },
  { img:'https://res.cloudinary.com/dgdlyrgda/image/upload/v1779841385/img2_slpy70.png',  title:'Bear Trap Strategy',   desc:'Spot bear traps at support levels before the explosive bounce move upward.' },
  { img:'https://res.cloudinary.com/dgdlyrgda/image/upload/v1779841545/img3_tontza.png',    title:'Support & Resistance', desc:'Master horizontal support zones for high-probability trading setups.' },
];

const FEATURES = [
  { icon: TrendingUp, title:'Spot & Futures', desc:'Trade 350+ pairs with up to 100x leverage. Real-time order book, advanced charts.',    color:'#3182F6' },
  { icon: Users,      title:'P2P Trading',    desc:'Trade peer-to-peer with escrow protection, live chat, and dispute resolution.',          color:'#1FE080' },
  { icon: Coins,      title:'Staking',        desc:'Earn daily passive income up to 1.8%/day. Lock periods from 7 to 360 days.',             color:'#F5B731' },
  { icon: CreditCard, title:'Loans',          desc:'Business, trading, and personal loans. Up to 100% of balance for eligible users.',       color:'#8B5CF6' },
  { icon: Trophy,     title:'Rank System',    desc:'8-tier rank with monthly salary $50–$9,600. Build your team, earn more.',                color:'#F97316' },
  { icon: Shield,     title:'Bank Security',  desc:'95% cold storage, AES-256 encryption, 2FA, KYC verification.',                          color:'#EC4899' },
];

const REGIONS = ['All', 'Asia', 'Europe', 'Americas', 'Africa', 'Oceania'] as const;
type Region = typeof REGIONS[number];

const RANK_BADGE: Record<string, { bg: string; color: string; emoji: string }> = {
  'Infinity Legend':     { bg:'rgba(249,115,22,0.15)',  color:'#F97316', emoji:'⚡' },
  'Freedom Icon':        { bg:'rgba(236,72,153,0.15)',  color:'#EC4899', emoji:'🔥' },
  'Legacy Ambassador':   { bg:'rgba(59,130,246,0.15)',  color:'#3B82F6', emoji:'🌟' },
  'National Elite':      { bg:'rgba(239,68,68,0.15)',   color:'#EF4444', emoji:'👑' },
  'Legacy Executive':    { bg:'rgba(245,158,11,0.15)',  color:'#F59E0B', emoji:'💎' },
  'Visionary Elite':     { bg:'rgba(139,92,246,0.15)',  color:'#8B5CF6', emoji:'🥇' },
  'Regional Ambassador': { bg:'rgba(34,197,94,0.15)',   color:'#22C55E', emoji:'🥈' },
  'Coordinator':         { bg:'rgba(148,163,184,0.15)', color:'#94A3B8', emoji:'🥉' },
};

interface Director {
  name: string;
  country: string;
  flag: string;
  region: Region;
  num: string;
  rank: string;
  accentColor: string;
}

const DIRECTORS: Director[] = [
  { name:'James Carter',    country:'United States', flag:'🇺🇸', region:'Americas', num:'+1 4567****890',   rank:'Legacy Ambassador',   accentColor:'#3B82F6' },
  { name:'Maria Gonzalez',  country:'Mexico',        flag:'🇲🇽', region:'Americas', num:'+52 5555****321',  rank:'National Elite',      accentColor:'#EF4444' },
  { name:'Lucas Silva',     country:'Brazil',        flag:'🇧🇷', region:'Americas', num:'+55 1199****456',  rank:'Legacy Ambassador',   accentColor:'#3B82F6' },
  { name:'Sofia Martínez',  country:'Argentina',     flag:'🇦🇷', region:'Americas', num:'+54 9114****789',  rank:'Visionary Elite',     accentColor:'#8B5CF6' },
  { name:'Carlos Reyes',    country:'Colombia',      flag:'🇨🇴', region:'Americas', num:'+57 3101****234',  rank:'Regional Ambassador', accentColor:'#22C55E' },
  { name:'Chloe Bernard',   country:'Canada',        flag:'🇨🇦', region:'Americas', num:'+1 6041****901',   rank:'Legacy Executive',    accentColor:'#F59E0B' },
  { name:'Nicolás Torres',  country:'Chile',         flag:'🇨🇱', region:'Americas', num:'+56 9921****567',  rank:'Visionary Elite',     accentColor:'#8B5CF6' },
  { name:'Amara Diallo',    country:'Nigeria',       flag:'🇳🇬', region:'Africa',   num:'+234 802****567',  rank:'Legacy Ambassador',   accentColor:'#3B82F6' },
  { name:'Kwame Asante',    country:'Ghana',         flag:'🇬🇭', region:'Africa',   num:'+233 244****890',  rank:'National Elite',      accentColor:'#EF4444' },
  { name:'Fatima Hassan',   country:'Egypt',         flag:'🇪🇬', region:'Africa',   num:'+20 1001****123',  rank:'Visionary Elite',     accentColor:'#8B5CF6' },
  { name:'Tendai Moyo',     country:'South Africa',  flag:'🇿🇦', region:'Africa',   num:'+27 821****456',   rank:'Freedom Icon',        accentColor:'#EC4899' },
  { name:'Aissatou Balde',  country:'Senegal',       flag:'🇸🇳', region:'Africa',   num:'+221 771****789',  rank:'Regional Ambassador', accentColor:'#22C55E' },
  { name:'Emeka Okonkwo',   country:'Kenya',         flag:'🇰🇪', region:'Africa',   num:'+254 712****234',  rank:'Regional Ambassador', accentColor:'#22C55E' },
  { name:'Liam Murphy',     country:'United Kingdom',flag:'🇬🇧', region:'Europe',   num:'+44 7771****234',  rank:'Legacy Ambassador',   accentColor:'#3B82F6' },
  { name:'Hannah Müller',   country:'Germany',       flag:'🇩🇪', region:'Europe',   num:'+49 1571****567',  rank:'Freedom Icon',        accentColor:'#EC4899' },
  { name:'Pierre Dubois',   country:'France',        flag:'🇫🇷', region:'Europe',   num:'+33 6801****890',  rank:'National Elite',      accentColor:'#EF4444' },
  { name:'Giulia Romano',   country:'Italy',         flag:'🇮🇹', region:'Europe',   num:'+39 3401****123',  rank:'Visionary Elite',     accentColor:'#8B5CF6' },
  { name:'Andrei Popescu',  country:'Romania',       flag:'🇷🇴', region:'Europe',   num:'+40 7231****456',  rank:'Legacy Executive',    accentColor:'#F59E0B' },
  { name:'Elena Petrov',    country:'Russia',        flag:'🇷🇺', region:'Europe',   num:'+7 9161****678',   rank:'Freedom Icon',        accentColor:'#EC4899' },
  { name:'Musa Ibrahim',    country:'Turkey',        flag:'🇹🇷', region:'Europe',   num:'+90 5321****123',  rank:'Legacy Executive',    accentColor:'#F59E0B' },
  { name:'Anna Kowalski',   country:'Poland',        flag:'🇵🇱', region:'Europe',   num:'+48 6011****456',  rank:'National Elite',      accentColor:'#EF4444' },
  { name:'Priya Sharma',    country:'India',         flag:'🇮🇳', region:'Asia',     num:'+91 9876****789',  rank:'Freedom Icon',        accentColor:'#EC4899' },
  { name:'Wei Zhang',       country:'China',         flag:'🇨🇳', region:'Asia',     num:'+86 1381****012',  rank:'Infinity Legend',     accentColor:'#F97316' },
  { name:'Yuki Tanaka',     country:'Japan',         flag:'🇯🇵', region:'Asia',     num:'+81 9001****345',  rank:'Legacy Ambassador',   accentColor:'#3B82F6' },
  { name:'Min-jun Lee',     country:'South Korea',   flag:'🇰🇷', region:'Asia',     num:'+82 1012****678',  rank:'National Elite',      accentColor:'#EF4444' },
  { name:'Ali Rahman',      country:'Bangladesh',    flag:'🇧🇩', region:'Asia',     num:'+880 1711****901', rank:'Visionary Elite',     accentColor:'#8B5CF6' },
  { name:'Ahmad Khalid',    country:'Pakistan',      flag:'🇵🇰', region:'Asia',     num:'+92 3001****234',  rank:'Regional Ambassador', accentColor:'#22C55E' },
  { name:'Sara Al-Farsi',   country:'UAE',           flag:'🇦🇪', region:'Asia',     num:'+971 501****567',  rank:'Freedom Icon',        accentColor:'#EC4899' },
  { name:'Nour Al-Rashid',  country:'Saudi Arabia',  flag:'🇸🇦', region:'Asia',     num:'+966 551****890',  rank:'Legacy Executive',    accentColor:'#F59E0B' },
  { name:'Reza Ahmadi',     country:'Iran',          flag:'🇮🇷', region:'Asia',     num:'+98 9121****123',  rank:'National Elite',      accentColor:'#EF4444' },
  { name:'Thanh Nguyen',    country:'Vietnam',       flag:'🇻🇳', region:'Asia',     num:'+84 9011****456',  rank:'Visionary Elite',     accentColor:'#8B5CF6' },
  { name:'Siti Rahma',      country:'Indonesia',     flag:'🇮🇩', region:'Asia',     num:'+62 8121****789',  rank:'Legacy Ambassador',   accentColor:'#3B82F6' },
  { name:'Arjun Mehta',     country:'Sri Lanka',     flag:'🇱🇰', region:'Asia',     num:'+94 7711****890',  rank:'Coordinator',         accentColor:'#94A3B8' },
  { name:'Oliver Brown',    country:'Australia',     flag:'🇦🇺', region:'Oceania',  num:'+61 4101****012',  rank:'National Elite',      accentColor:'#EF4444' },
  { name:'Aroha Ngata',     country:'New Zealand',   flag:'🇳🇿', region:'Oceania',  num:'+64 2101****345',  rank:'Visionary Elite',     accentColor:'#8B5CF6' },
];

/* ─────────────────────────────────────────────────────────────────────────────
   CUBIC BEZIER TYPE — fix for TS "number[] is not assignable to Easing"
───────────────────────────────────────────────────────────────────────────── */
type CubicBezier = [number, number, number, number];
const EASE_OUT: CubicBezier = [0.22, 1, 0.36, 1];

/* ─────────────────────────────────────────────────────────────────────────────
   ANIMATION VARIANTS
   - All `ease` values cast to CubicBezier so TS accepts them in spreads
   - `margin` cast to string so TS doesn't widen to `string | undefined`
───────────────────────────────────────────────────────────────────────────── */
const fadeUp = (d = 0, y = 28) => ({
  initial:     { opacity: 0, y },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true, margin: '-60px' as const },
  transition:  { duration: 0.65, delay: d, ease: EASE_OUT } satisfies Transition,
});

const fadeIn = (d = 0) => ({
  initial:     { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport:    { once: true },
  transition:  { duration: 0.5, delay: d } satisfies Transition,
});

const scaleIn = (d = 0) => ({
  initial:     { opacity: 0, scale: 0.92 },
  whileInView: { opacity: 1, scale: 1 },
  viewport:    { once: true },
  transition:  { duration: 0.6, delay: d, ease: EASE_OUT } satisfies Transition,
});

/* ─────────────────────────────────────────────────────────────────────────────
   ANIMATED COUNTER
───────────────────────────────────────────────────────────────────────────── */
function AnimatedCounter({ value, duration = 2 }: { value: string; duration?: number }) {
  const [displayed, setDisplayed] = useState('0');
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true;
        const numMatch = value.match(/[\d,.]+/);
        if (!numMatch) { setDisplayed(value); return; }
        const raw = numMatch[0].replace(/,/g, '');
        const end = parseFloat(raw);
        const prefix = value.slice(0, value.indexOf(numMatch[0]));
        const suffix = value.slice(value.indexOf(numMatch[0]) + numMatch[0].length);
        const startTime = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - startTime) / (duration * 1000), 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = end * eased;
          const formatted = raw.includes('.') ? current.toFixed(1) : Math.floor(current).toLocaleString();
          setDisplayed(`${prefix}${formatted}${suffix}`);
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, duration]);

  return <span ref={ref}>{displayed || value}</span>;
}

/* ─────────────────────────────────────────────────────────────────────────────
   PARTICLE BACKGROUND
───────────────────────────────────────────────────────────────────────────── */
function ParticleField() {
  const particles = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * -20,
    color: i % 3 === 0 ? '#3182F6' : i % 3 === 1 ? '#1FE080' : '#F97316',
  }));

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {particles.map(p => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: p.color,
            opacity: 0.25,
          }}
          animate={{
            y: [0, -60, 0],
            x: [0, Math.sin(p.id) * 30, 0],
            opacity: [0.15, 0.4, 0.15],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   GLOWING ORB
───────────────────────────────────────────────────────────────────────────── */
function GlowOrb({ color, size, top, left, blur, opacity }: {
  color: string; size: number; top?: string; left?: string; blur?: number; opacity?: number;
}) {
  return (
    <motion.div
      animate={{ scale: [1, 1.15, 1], opacity: [(opacity ?? 0.06), (opacity ?? 0.06) * 1.6, (opacity ?? 0.06)] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        position: 'absolute',
        top: top ?? '50%',
        left: left ?? '50%',
        transform: 'translate(-50%, -50%)',
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        filter: `blur(${blur ?? 120}px)`,
        opacity: opacity ?? 0.06,
        pointerEvents: 'none',
      }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   TICKER COMPONENT
───────────────────────────────────────────────────────────────────────────── */
function DirectorTicker() {
  const items = [...DIRECTORS, ...DIRECTORS, ...DIRECTORS];
  return (
    <div style={{ overflow: 'hidden', background: 'linear-gradient(90deg,#080C14,#0B1018,#080C14)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '9px 0', position: 'relative' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 80, background: 'linear-gradient(90deg,#080C14,transparent)', zIndex: 2, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 80, background: 'linear-gradient(-90deg,#080C14,transparent)', zIndex: 2, pointerEvents: 'none' }} />
      <motion.div
        animate={{ x: ['0%', '-33.33%'] }}
        transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
        style={{ display: 'flex', gap: '40px', whiteSpace: 'nowrap', willChange: 'transform' }}
      >
        {items.map((d, i) => {
          const badge = RANK_BADGE[d.rank] ?? RANK_BADGE['Coordinator'];
          return (
            <span key={i} style={{ fontSize: 11, color: '#4A5468', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
              <span style={{ fontSize: 14 }}>{d.flag}</span>
              <span style={{ color: '#7A859A', fontWeight: 700 }}>{d.name}</span>
              <span style={{ color: badge.color, fontSize: 9, fontWeight: 800, padding: '2px 6px', borderRadius: 4, background: badge.bg }}>{badge.emoji} {d.rank}</span>
              <span style={{ color: '#2A3048' }}>·</span>
              <span style={{ color: '#4A5468' }}>{d.country}</span>
            </span>
          );
        })}
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   DIRECTOR CARD
───────────────────────────────────────────────────────────────────────────── */
function DirectorCard({ dir, index }: { dir: Director; index: number }) {
  const badge = RANK_BADGE[dir.rank] ?? RANK_BADGE['Coordinator'];
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.035, 0.5), ease: EASE_OUT } satisfies Transition}
      whileHover={{ y: -6, scale: 1.025 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        background: hovered ? `linear-gradient(145deg,#0F1520,${dir.accentColor}08)` : '#0B1018',
        border: `1px solid ${hovered ? dir.accentColor + '35' : 'rgba(255,255,255,0.06)'}`,
        borderRadius: 18,
        padding: '18px 16px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: 9,
        cursor: 'pointer',
        transition: 'background 0.3s, border-color 0.25s',
        boxShadow: hovered ? `0 12px 40px ${dir.accentColor}15, 0 0 0 1px ${dir.accentColor}20` : 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {hovered && (
        <motion.div
          initial={{ opacity: 0, x: '-100%' }}
          animate={{ opacity: 0.04, x: '200%' }}
          transition={{ duration: 0.6 }}
          style={{ position: 'absolute', top: 0, left: 0, width: '50%', height: '100%', background: `linear-gradient(90deg,transparent,${dir.accentColor},transparent)`, pointerEvents: 'none' }}
        />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <motion.span
          animate={hovered ? { scale: 1.12 } : { scale: 1 }}
          transition={{ duration: 0.25 }}
          style={{ fontSize: 34, lineHeight: 1, display: 'block' }}
        >
          {dir.flag}
        </motion.span>
        <span style={{ fontSize: 9, fontWeight: 800, padding: '3px 7px', borderRadius: 6, background: badge.bg, color: badge.color, whiteSpace: 'nowrap', letterSpacing: '.02em' }}>
          {badge.emoji} {dir.rank}
        </span>
      </div>

      <div>
        <p style={{ fontSize: 13, fontWeight: 800, color: hovered ? '#F0F4FC' : '#D8DDE8', margin: '0 0 2px', transition: 'color 0.2s' }}>{dir.name}</p>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#6B7590', margin: 0 }}>{dir.country}</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingTop: 9, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <Phone style={{ width: 11, height: 11, color: dir.accentColor, flexShrink: 0 }} />
        <span style={{ fontSize: 10.5, fontFamily: '"JetBrains Mono",monospace', color: '#6B7590', letterSpacing: '.03em' }}>{dir.num}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <MapPin style={{ width: 10, height: 10, color: '#3A4058', flexShrink: 0 }} />
        <span style={{ fontSize: 9.5, color: '#3A4058', fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase' }}>{dir.region}</span>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   COUNTRY DIRECTORS SECTION
───────────────────────────────────────────────────────────────────────────── */
function CountryDirectorsSection() {
  const [activeRegion, setActiveRegion] = useState<Region>('All');
  const [query, setQuery] = useState('');

  const filtered = DIRECTORS.filter(d => {
    const regionOk = activeRegion === 'All' || d.region === activeRegion;
    const q = query.toLowerCase();
    const searchOk = !q || d.name.toLowerCase().includes(q) || d.country.toLowerCase().includes(q);
    return regionOk && searchOk;
  });

  const stats = [
    { v: filtered.length,                                                                         l: 'Directors'  },
    { v: new Set(filtered.map(d => d.region)).size,                                              l: 'Regions'    },
    { v: filtered.filter(d => ['Infinity Legend','Freedom Icon'].includes(d.rank)).length,       l: 'Elite Ranks' },
    { v: new Set(filtered.map(d => d.country)).size,                                             l: 'Countries'  },
  ];

  return (
    <section style={{ padding: '100px 24px', background: 'linear-gradient(180deg,#080C14 0%,#0A0F1A 100%)', position: 'relative', overflow: 'hidden' }}>
      <GlowOrb color="#3182F6" size={700} top="50%" left="50%" blur={160} opacity={0.035} />
      <GlowOrb color="#1FE080" size={400} top="20%" left="80%" blur={120} opacity={0.025} />

      <div style={{ maxWidth: 1300, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: 52 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(49,130,246,0.07)', border: '1px solid rgba(49,130,246,0.18)', borderRadius: 24, padding: '5px 16px', marginBottom: 18 }}
          >
            <motion.span
              animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 1.6, repeat: Infinity }}
              style={{ width: 7, height: 7, borderRadius: '50%', background: '#1FE080', display: 'inline-block', boxShadow: '0 0 8px #1FE080' }}
            />
            <span style={{ fontSize: 11, fontWeight: 800, color: '#3182F6', letterSpacing: '.1em' }}>GLOBAL NETWORK · {DIRECTORS.length}+ DIRECTORS</span>
          </motion.div>
          <h2 style={{ fontSize: 'clamp(2rem,4vw,3.2rem)', fontWeight: 900, letterSpacing: '-.04em', margin: '0 0 12px', lineHeight: 1.05 }}>
            Country Directors{' '}
            <span style={{ background: 'linear-gradient(135deg,#3182F6 30%,#1FE080 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Worldwide
            </span>
          </h2>
          <p style={{ fontSize: 14, color: '#6B7590', margin: 0 }}>Official representatives spanning 6 continents and 30+ nations</p>
        </motion.div>

        <motion.div {...scaleIn(0.1)} style={{ marginBottom: 30, borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.04)' }}>
          <DirectorTicker />
        </motion.div>

        <motion.div {...fadeUp(0.15)} style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 30 }}>
          {stats.map((s) => (
            <motion.div
              key={s.l}
              whileHover={{ scale: 1.04, borderColor: 'rgba(49,130,246,0.3)' }}
              style={{ background: 'linear-gradient(145deg,#0D1420,#0A1018)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '16px 12px', textAlign: 'center', cursor: 'default', transition: 'border-color 0.2s' }}
            >
              <p style={{ fontSize: 26, fontWeight: 900, color: '#E8ECF4', margin: 0, letterSpacing: '-.03em' }}>{s.v}</p>
              <p style={{ fontSize: 10, color: '#3A4058', margin: '5px 0 0', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em' }}>{s.l}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div {...fadeUp(0.2)} style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 30, alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
            <Search style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: '#3A4058' }} />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search country or director…"
              style={{
                width: '100%', boxSizing: 'border-box',
                background: 'linear-gradient(145deg,#0D1420,#0A1018)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 11, color: '#E8ECF4', padding: '10px 36px 10px 36px',
                fontSize: 13, outline: 'none', transition: 'border-color 0.2s',
                fontFamily: 'inherit',
              }}
              onFocus={e => (e.target.style.borderColor = 'rgba(49,130,246,0.4)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
            />
            <AnimatePresence>
              {query && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setQuery('')}
                  style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer', color: '#8B95A8', display: 'flex', alignItems: 'center', borderRadius: 4, padding: 3 }}
                >
                  <X style={{ width: 12, height: 12 }} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {REGIONS.map(r => (
              <motion.button
                key={r}
                onClick={() => setActiveRegion(r)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  padding: '7px 15px', borderRadius: 9, fontSize: 11, fontWeight: 800,
                  cursor: 'pointer', transition: 'all 0.18s', letterSpacing: '.02em',
                  background: activeRegion === r ? 'rgba(49,130,246,0.14)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${activeRegion === r ? 'rgba(49,130,246,0.45)' : 'rgba(255,255,255,0.07)'}`,
                  color: activeRegion === r ? '#5BA3FF' : '#6B7590',
                  boxShadow: activeRegion === r ? '0 0 16px rgba(49,130,246,0.15)' : 'none',
                }}
              >
                {r}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              style={{ textAlign: 'center', padding: '70px 0', color: '#3A4058' }}>
              <motion.p animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 0.5 }} style={{ fontSize: 44, marginBottom: 14 }}>🔍</motion.p>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#6B7590' }}>No directors found</p>
              <p style={{ fontSize: 12, marginTop: 6, color: '#3A4058' }}>Try a different search or region</p>
            </motion.div>
          ) : (
            <motion.div
              key={`${activeRegion}-${query}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(205px,1fr))', gap: 12 }}
            >
              {filtered.map((dir, i) => (
                <DirectorCard key={`${dir.country}-${dir.name}`} dir={dir} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div {...fadeUp(0.3)} style={{ textAlign: 'center', marginTop: 44 }}>
          <p style={{ fontSize: 13, color: '#6B7590', marginBottom: 16 }}>Want to become a country director?</p>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} style={{ display: 'inline-block' }}>
            <Link href="/auth/register"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 30px', borderRadius: 13, fontWeight: 800, fontSize: 13, color: '#fff', background: 'linear-gradient(135deg,#3182F6,#1a6fd4)', textDecoration: 'none', boxShadow: '0 8px 32px rgba(49,130,246,0.3)', letterSpacing: '.01em' }}>
              Apply for Directorship <ArrowRight style={{ width: 15, height: 15 }} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   FEATURE CARD
───────────────────────────────────────────────────────────────────────────── */
function FeatureCard({ feature, index }: { feature: typeof FEATURES[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      {...fadeUp(index * 0.07)}
      whileHover={{ y: -6, scale: 1.02 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        padding: '26px 22px',
        borderRadius: 22,
        background: hovered ? `linear-gradient(145deg,#0D1420,${feature.color}06)` : '#0B1018',
        border: `1px solid ${hovered ? feature.color + '30' : 'rgba(255,255,255,0.06)'}`,
        cursor: 'pointer',
        transition: 'background 0.3s, border-color 0.25s',
        boxShadow: hovered ? `0 16px 48px ${feature.color}10` : 'none',
      }}
    >
      <motion.div
        animate={hovered ? { scale: 1.15, rotate: [0, -5, 5, 0] } : { scale: 1, rotate: 0 }}
        transition={{ duration: 0.4 }}
        style={{ width: 46, height: 46, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18, background: `${feature.color}12`, border: `1px solid ${feature.color}20` }}
      >
        <feature.icon style={{ width: 22, height: 22, color: feature.color }} />
      </motion.div>
      <h3 style={{ fontWeight: 800, fontSize: 14, color: hovered ? '#F0F4FC' : '#C8D0E0', marginBottom: 8, transition: 'color 0.2s' }}>{feature.title}</h3>
      <p style={{ fontSize: 12.5, lineHeight: 1.65, color: '#5A6478' }}>{feature.desc}</p>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   RANK CARD
───────────────────────────────────────────────────────────────────────────── */
function RankCard({ rank, index }: { rank: typeof RANK_LEVELS[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      {...fadeUp(index * 0.06)}
      whileHover={{ y: -8, scale: 1.06 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        borderRadius: 22,
        padding: '20px 14px',
        textAlign: 'center',
        background: hovered ? `linear-gradient(160deg,${rank.bg},${rank.color}10)` : rank.bg,
        border: `1px solid ${hovered ? rank.color + '50' : rank.border}`,
        cursor: 'pointer',
        transition: 'background 0.3s, border-color 0.25s',
        boxShadow: hovered ? `0 16px 44px ${rank.color}20` : 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {hovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 0%,${rank.color}15,transparent 70%)`, pointerEvents: 'none' }}
        />
      )}
      <motion.div
        animate={hovered ? { scale: 1.25, y: -3 } : { scale: 1, y: 0 }}
        transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
        style={{ fontSize: 30, marginBottom: 10, display: 'block' }}
      >
        {rank.badge}
      </motion.div>
      <div style={{ fontSize: 11, fontWeight: 800, marginBottom: 5, lineHeight: 1.35, color: rank.color, letterSpacing: '.01em' }}>{rank.name}</div>
      <div style={{ fontSize: 10, color: '#3A4058', marginBottom: 10, fontWeight: 600 }}>Team: {rank.team}</div>
      <div style={{ borderRadius: 10, padding: '8px 6px', background: 'rgba(0,0,0,0.35)', border: `1px solid ${rank.color}20` }}>
        <p style={{ fontSize: 13, fontWeight: 900, color: rank.color, margin: 0, letterSpacing: '-.01em' }}>{rank.salary}</p>
        <p style={{ fontSize: 9, color: '#3A4058', margin: '2px 0 0', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em' }}>/ month</p>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   FLOATING BADGE
───────────────────────────────────────────────────────────────────────────── */
function FloatingBadge({ children, style, animY = [-5, 5, -5] }: {
  children: React.ReactNode; style?: React.CSSProperties; animY?: number[];
}) {
  return (
    <motion.div
      animate={{ y: animY }}
      transition={{ duration: 3 + Math.random(), repeat: Infinity, ease: 'easeInOut' }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION LABEL
───────────────────────────────────────────────────────────────────────────── */
function SectionLabel({ color = '#3182F6', children }: { color?: string; children: React.ReactNode }) {
  return (
    <motion.span
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      style={{ fontSize: 11, fontWeight: 900, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 16, display: 'block', color }}
    >
      {children}
    </motion.span>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────────────────────── */
export default function LandingPage() {
  const [activePattern, setActivePattern] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div style={{ background: '#080C14', color: '#E8ECF4', fontFamily: '"Inter",system-ui,sans-serif', overflowX: 'hidden' }}>
    <PublicLayout>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-14 overflow-hidden">
        <ParticleField />
        <motion.div style={{ y: heroY }} className="absolute inset-0 pointer-events-none">
          <GlowOrb color="#3182F6" size={700} top="30%" left="25%" blur={130} opacity={0.12} />
          <GlowOrb color="#1FE080" size={500} top="65%" left="70%" blur={110} opacity={0.07} />
          <GlowOrb color="#F97316" size={300} top="20%" left="75%" blur={100} opacity={0.05} />
        </motion.div>

        <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_OUT }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 text-[11px] px-4 py-2 rounded-full mb-7 font-bold"
              style={{ background: 'rgba(49,130,246,0.08)', border: '1px solid rgba(49,130,246,0.2)', color: '#5BA3FF', letterSpacing: '.06em' }}
            >
              <motion.span
                animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.4, repeat: Infinity }}
                className="w-2 h-2 rounded-full"
                style={{ background: '#1FE080', boxShadow: '0 0 8px #1FE080' }}
              />
              LIVE TRADING · 180,000+ TRADERS
            </motion.div>

            <h1 style={{ fontWeight: 900, lineHeight: 1.06, letterSpacing: '-.04em', marginBottom: 24, fontSize: 'clamp(2.6rem,5.5vw,4.2rem)' }}>
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: EASE_OUT }}
                style={{ display: 'block' }}
              >
                Trade Crypto
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.35, ease: EASE_OUT }}
                style={{ display: 'block', background: 'linear-gradient(135deg,#3182F6 0%,#1FE080 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                Like an Expert.
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              style={{ fontSize: 15, marginBottom: 32, lineHeight: 1.75, color: '#6B7590', maxWidth: 480 }}
            >
              Spot, Futures, P2P — all powered by real-time market data. Earn monthly salary through our unique 8-tier rank system. Your $4 welcome bonus is waiting.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 40 }}
            >
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link href="/auth/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 24px', borderRadius: 14, fontWeight: 800, fontSize: 14, color: '#fff', background: 'linear-gradient(135deg,#3182F6,#1a6fd4)', textDecoration: 'none', boxShadow: '0 8px 32px rgba(49,130,246,0.35)', letterSpacing: '.01em' }}>
                  Start Trading Free <ArrowRight style={{ width: 16, height: 16 }} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link href="/markets" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 24px', borderRadius: 14, fontWeight: 700, fontSize: 14, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#C8D0E0', textDecoration: 'none', transition: 'background 0.2s' }}>
                  <Play style={{ width: 14, height: 14 }} /> Live Markets
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65 }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}
            >
              {[['$4.2B+','Monthly Volume'],['1.8%','Max Daily Yield'],['$9,600','Top Rank Salary']].map(([v, l]) => (
                <motion.div
                  key={l}
                  whileHover={{ scale: 1.05, borderColor: 'rgba(49,130,246,0.3)' }}
                  style={{ borderRadius: 14, padding: '14px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', transition: 'border-color 0.2s', cursor: 'default' }}
                >
                  <p style={{ fontWeight: 900, fontSize: 18, color: '#E8ECF4', margin: 0, letterSpacing: '-.02em' }}>{v}</p>
                  <p style={{ fontSize: 10, marginTop: 4, color: '#3A4058', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em' }}>{l}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.3, ease: EASE_OUT }}
            style={{ position: 'relative' }}
          >
            <div style={{ position: 'relative', borderRadius: 24, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 32px 80px rgba(0,0,0,0.5)' }}>
              <Image src="https://res.cloudinary.com/dgdlyrgda/image/upload/v1779842572/herobull_tfpjxm.png" alt="Bitcoin Bull Market" width={600} height={400} style={{ width: '100%', height: 'auto', objectFit: 'cover', filter: 'brightness(0.92)' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(8,12,20,0.85) 0%,transparent 55%)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <motion.div whileHover={{ scale: 1.05 }} style={{ borderRadius: 14, padding: '10px 16px', backdropFilter: 'blur(12px)', background: 'rgba(31,224,128,0.13)', border: '1px solid rgba(31,224,128,0.28)' }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: '#1FE080', margin: 0 }}>BTC/USDT</p>
                  <p style={{ fontWeight: 900, fontSize: 18, color: '#1FE080', margin: 0, letterSpacing: '-.02em' }}>+12.4%</p>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} style={{ borderRadius: 14, padding: '10px 16px', backdropFilter: 'blur(12px)', background: 'rgba(49,130,246,0.13)', border: '1px solid rgba(49,130,246,0.28)' }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: '#3182F6', margin: 0 }}>24h Volume</p>
                  <p style={{ fontWeight: 900, fontSize: 18, color: '#3182F6', margin: 0, letterSpacing: '-.02em' }}>$2.1B</p>
                </motion.div>
              </div>
            </div>

            <FloatingBadge
              animY={[0, -10, 0]}
              style={{ position: 'absolute', top: -16, right: -16, borderRadius: 18, padding: '12px 14px', background: '#0D1420', border: '1px solid rgba(49,130,246,0.28)', boxShadow: '0 12px 40px rgba(49,130,246,0.18)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                  <Image src="https://res.cloudinary.com/dgdlyrgda/image/upload/v1779842999/bulllogodesign_crmt6s.png" alt="Bull" width={36} height={36} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 800, color: '#E8ECF4', margin: 0 }}>Bull Market</p>
                  <p style={{ fontSize: 10, color: '#1FE080', margin: 0, fontWeight: 600 }}>+All Signals Active</p>
                </div>
              </div>
            </FloatingBadge>

            <div style={{ position: 'absolute', inset: -1, borderRadius: 24, background: 'transparent', pointerEvents: 'none', overflow: 'hidden' }}>
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04 }} viewBox="0 0 600 400" preserveAspectRatio="none">
                {[0,1,2,3,4,5].map(i => <line key={i} x1={i*120} y1="0" x2={i*120} y2="400" stroke="#3182F6" strokeWidth="1" />)}
                {[0,1,2,3,4].map(i => <line key={i} x1="0" y1={i*100} x2="600" y2={i*100} stroke="#3182F6" strokeWidth="1" />)}
              </svg>
            </div>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
        >
          <ChevronDown style={{ width: 20, height: 20, color: '#3A4058' }} />
        </motion.div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(90deg,#0A0F1A,#0D1422,#0A0F1A)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '44px 24px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 32 }}>
          {STATS.map((s, i) => (
            <motion.div key={s.l} {...fadeUp(i * 0.1)} style={{ textAlign: 'center' }}>
              <p style={{ fontWeight: 900, fontSize: 32, color: '#E8ECF4', margin: 0, letterSpacing: '-.03em' }}>
                <AnimatedCounter value={s.v} />
              </p>
              <p style={{ fontSize: 12, fontWeight: 700, marginTop: 6, color: '#6B7590' }}>{s.l}</p>
              <p style={{ fontSize: 10, marginTop: 3, color: '#3A4058', fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase' }}>{s.s}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── TRADING HERO ─────────────────────────────────────────────────── */}
      <section style={{ padding: '100px 24px', position: 'relative', overflow: 'hidden' }}>
        <GlowOrb color="#3182F6" size={500} top="50%" left="80%" blur={130} opacity={0.05} />
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 64, alignItems: 'center' }}>
          <motion.div {...fadeUp()}>
            <SectionLabel color="#3182F6">Professional Trading</SectionLabel>
            <h2 style={{ fontWeight: 900, fontSize: 'clamp(1.8rem,3.5vw,3rem)', letterSpacing: '-.04em', marginBottom: 18, lineHeight: 1.1 }}>
              Advanced Charts.<br />
              <span style={{ color: '#1FE080' }}>Real-time Signals.</span>
            </h2>
            <p style={{ fontSize: 14, marginBottom: 30, lineHeight: 1.75, color: '#6B7590', maxWidth: 440 }}>
              Our platform uses live Upbit market data with professional-grade TradingView charts. Get buy/sell signals, support/resistance zones, and pattern recognition in real time.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 30 }}>
              {['Real-time candlestick charts with 7 timeframes','Live order book depth visualization','Stop-loss, take-profit, and trailing stops','Smart-powered support & resistance detection'].map((f, i) => (
                <motion.div
                  key={f}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#6B7590' }}
                >
                  <div style={{ width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'rgba(31,224,128,0.12)', border: '1px solid rgba(31,224,128,0.2)' }}>
                    <span style={{ fontSize: 10, color: '#1FE080', fontWeight: 900 }}>✓</span>
                  </div>
                  {f}
                </motion.div>
              ))}
            </div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} style={{ display: 'inline-block' }}>
              <Link href="/trading" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 22px', borderRadius: 13, fontWeight: 800, fontSize: 13, color: '#fff', background: 'linear-gradient(135deg,#3182F6,#1a6fd4)', textDecoration: 'none', boxShadow: '0 8px 28px rgba(49,130,246,0.28)' }}>
                Open Trading Terminal <ArrowRight style={{ width: 15, height: 15 }} />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div {...scaleIn(0.2)} style={{ position: 'relative' }}>
            <div style={{ borderRadius: 22, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}>
              <Image src="https://res.cloudinary.com/dgdlyrgda/image/upload/v1779841545/img3_tontza.png" alt="Forex Trading Signals" width={600} height={400} style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
            </div>
            <FloatingBadge
              animY={[0, -7, 0]}
              style={{ position: 'absolute', bottom: -14, left: -20, borderRadius: 14, padding: '12px 14px', background: '#0D1420', border: '1px solid rgba(31,224,128,0.2)', boxShadow: '0 12px 32px rgba(31,224,128,0.12)' }}
            >
              <p style={{ fontSize: 10, fontWeight: 800, color: '#6B7590', margin: '0 0 4px' }}>LIVE SIGNAL</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ padding: '3px 8px', borderRadius: 5, fontSize: 10, fontWeight: 900, background: 'rgba(31,224,128,0.14)', color: '#1FE080', letterSpacing: '.05em' }}>BUY</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#E8ECF4' }}>BTC/KRW</span>
              </div>
            </FloatingBadge>
            <FloatingBadge
              animY={[0, 7, 0]}
              style={{ position: 'absolute', top: -14, right: -14, borderRadius: 14, padding: '12px 14px', background: '#0D1420', border: '1px solid rgba(255,75,85,0.2)', boxShadow: '0 12px 32px rgba(255,75,85,0.12)' }}
            >
              <p style={{ fontSize: 10, fontWeight: 800, color: '#6B7590', margin: '0 0 4px' }}>ALERT</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ padding: '3px 8px', borderRadius: 5, fontSize: 10, fontWeight: 900, background: 'rgba(255,75,85,0.14)', color: '#FF4B55', letterSpacing: '.05em' }}>SELL</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#E8ECF4' }}>ETH/KRW</span>
              </div>
            </FloatingBadge>
          </motion.div>
        </div>
      </section>

      {/* ── CHART PATTERNS EDUCATION ─────────────────────────────────────── */}
      <section style={{ padding: '100px 24px', background: 'linear-gradient(180deg,#0A0F1A,#080C14)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: 52 }}>
            <SectionLabel color="#3182F6">Trading Education</SectionLabel>
            <h2 style={{ fontWeight: 900, fontSize: 'clamp(1.8rem,3.5vw,3rem)', letterSpacing: '-.04em', marginBottom: 14 }}>Learn Chart Patterns</h2>
            <p style={{ fontSize: 14, color: '#6B7590', margin: 0 }}>Master the patterns professional traders use every day.</p>
          </motion.div>

          <motion.div {...fadeUp(0.1)} style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 36, flexWrap: 'wrap' }}>
            {CHART_PATTERNS.map((p, i) => (
              <motion.button
                key={i}
                onClick={() => setActivePattern(i)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: '9px 18px', borderRadius: 12, fontSize: 12, fontWeight: 800, cursor: 'pointer',
                  background: activePattern === i ? '#3182F6' : 'rgba(255,255,255,0.04)',
                  color: activePattern === i ? '#fff' : '#6B7590',
                  border: `1px solid ${activePattern === i ? '#3182F6' : 'rgba(255,255,255,0.07)'}`,
                  boxShadow: activePattern === i ? '0 8px 24px rgba(49,130,246,0.28)' : 'none',
                  transition: 'all 0.18s',
                  letterSpacing: '.01em',
                }}
              >
                {p.title}
              </motion.button>
            ))}
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activePattern}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.99 }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 48, alignItems: 'center' }}
            >
              <div style={{ borderRadius: 22, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}>
                <Image src={CHART_PATTERNS[activePattern].img} alt={CHART_PATTERNS[activePattern].title} width={700} height={480} style={{ width: '100%', height: 'auto' }} />
              </div>
              <div>
                <h3 style={{ fontWeight: 900, fontSize: 26, marginBottom: 16, color: '#E8ECF4', letterSpacing: '-.03em' }}>{CHART_PATTERNS[activePattern].title}</h3>
                <p style={{ fontSize: 14, marginBottom: 24, lineHeight: 1.75, color: '#6B7590' }}>{CHART_PATTERNS[activePattern].desc}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {activePattern === 0 && [
                    ['First Top','Price hits resistance zone, first attempt fails','#FF4B55'],
                    ['Second Top','Price retests same level with huge upper wick','#FF4B55'],
                    ['Breakdown','Price breaks support — strong sell signal','#FF4B55'],
                  ].map(([t, d, c], i) => (
                    <motion.div
                      key={t}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      style={{ display: 'flex', gap: 12, padding: '12px 14px', borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,75,85,0.1)' }}
                    >
                      <div style={{ width: 26, height: 26, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12, fontWeight: 900, background: 'rgba(255,75,85,0.1)', color: c }}>↓</div>
                      <div><p style={{ fontSize: 12, fontWeight: 800, color: '#D8DDE8', margin: '0 0 3px' }}>{t}</p><p style={{ fontSize: 11, color: '#5A6478', margin: 0 }}>{d}</p></div>
                    </motion.div>
                  ))}
                  {activePattern === 1 && [
                    ['Support Zone','Strong horizontal support — buyers defend this level','#1FE080'],
                    ['Bear Trap','Price briefly breaks below, trapping short-sellers','#1FE080'],
                    ['Reversal','Sharp recovery above support — explosive buy signal','#1FE080'],
                  ].map(([t, d, c], i) => (
                    <motion.div
                      key={t}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      style={{ display: 'flex', gap: 12, padding: '12px 14px', borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(31,224,128,0.1)' }}
                    >
                      <div style={{ width: 26, height: 26, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12, fontWeight: 900, background: 'rgba(31,224,128,0.1)', color: c }}>↑</div>
                      <div><p style={{ fontSize: 12, fontWeight: 800, color: '#D8DDE8', margin: '0 0 3px' }}>{t}</p><p style={{ fontSize: 11, color: '#5A6478', margin: 0 }}>{d}</p></div>
                    </motion.div>
                  ))}
                  {activePattern === 2 && [
                    ['Support Level','Horizontal zone where buyers consistently step in','#3182F6'],
                    ['Multiple Tests','Price tests support multiple times — stronger level','#3182F6'],
                    ['Buy Signal','Entry on bounce from support with tight stop below','#3182F6'],
                  ].map(([t, d, c], i) => (
                    <motion.div
                      key={t}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      style={{ display: 'flex', gap: 12, padding: '12px 14px', borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(49,130,246,0.1)' }}
                    >
                      <div style={{ width: 26, height: 26, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12, fontWeight: 900, background: 'rgba(49,130,246,0.1)', color: c }}>→</div>
                      <div><p style={{ fontSize: 12, fontWeight: 800, color: '#D8DDE8', margin: '0 0 3px' }}>{t}</p><p style={{ fontSize: 11, color: '#5A6478', margin: 0 }}>{d}</p></div>
                    </motion.div>
                  ))}
                </div>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} style={{ display: 'inline-block', marginTop: 22 }}>
                  <Link href="/trading" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 20px', borderRadius: 12, fontSize: 13, fontWeight: 800, color: '#fff', background: 'linear-gradient(135deg,#3182F6,#1a6fd4)', textDecoration: 'none', boxShadow: '0 8px 24px rgba(49,130,246,0.25)' }}>
                    Practice on Live Chart <ArrowRight style={{ width: 15, height: 15 }} />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── BULL/BEAR MARKET SECTION ─────────────────────────────────────── */}
      <section style={{ padding: '100px 24px', position: 'relative', overflow: 'hidden' }}>
        <GlowOrb color="#3182F6" size={600} top="50%" left="50%" blur={130} opacity={0.04} />
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 64, alignItems: 'center', position: 'relative' }}>
          <motion.div {...scaleIn(0.1)} style={{ position: 'relative', order: 2 }}>
            <div style={{ borderRadius: 22, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}>
              <Image src="https://res.cloudinary.com/dgdlyrgda/image/upload/v1779843376/Bull_BearMarkets_segf5c.png" alt="Bull vs Bear Market" width={600} height={420} style={{ width: '100%', height: 'auto', objectFit: 'cover', background: 'white' }} />
            </div>
            <div style={{ position: 'absolute', bottom: -22, left: 8, right: 8, display: 'flex', justifyContent: 'space-between', gap: 8 }}>
              {[['BTC','$67,420','+4.2%','#1FE080'],['ETH','$3,580','+2.1%','#1FE080'],['SOL','$142','-1.3%','#FF4B55']].map(([sym, p, c, col]) => (
                <motion.div
                  key={sym}
                  whileHover={{ scale: 1.06, y: -3 }}
                  style={{ flex: 1, borderRadius: 14, padding: '10px 8px', textAlign: 'center', background: 'rgba(8,12,20,0.97)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)', boxShadow: '0 8px 24px rgba(0,0,0,0.4)', cursor: 'default' }}
                >
                  <p style={{ fontSize: 10, fontWeight: 800, color: '#3A4058', margin: 0, letterSpacing: '.06em' }}>{sym}</p>
                  <p style={{ fontSize: 11, fontWeight: 900, marginTop: 3, color: '#E8ECF4', margin: '3px 0 2px', letterSpacing: '-.01em' }}>{p}</p>
                  <p style={{ fontSize: 10, fontWeight: 800, color: col, margin: 0 }}>{c}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div {...fadeUp()} style={{ order: 1 }}>
            <SectionLabel color="#3182F6">Market Intelligence</SectionLabel>
            <h2 style={{ fontWeight: 900, fontSize: 'clamp(1.8rem,3.5vw,3rem)', letterSpacing: '-.04em', marginBottom: 18, lineHeight: 1.1 }}>
              Profit in Both<br />
              <span style={{ background: 'linear-gradient(135deg,#1FE080,#3182F6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Bull & Bear Markets.
              </span>
            </h2>
            <p style={{ fontSize: 14, marginBottom: 30, lineHeight: 1.75, color: '#6B7590', maxWidth: 440 }}>
              Trade long in bull markets or short in bear markets. Our platform supports both spot and futures trading — you can profit regardless of market direction.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 30 }}>
              {[
                { label:'Long (Bull)',  desc:'Buy low, sell high',   color:'#1FE080', bg:'rgba(31,224,128,0.07)'  },
                { label:'Short (Bear)', desc:'Sell high, buy back',  color:'#FF4B55', bg:'rgba(255,75,85,0.07)'   },
                { label:'Stop Loss',    desc:'Auto risk management', color:'#F5B731', bg:'rgba(245,183,49,0.07)'  },
                { label:'Take Profit',  desc:'Lock in your gains',   color:'#3182F6', bg:'rgba(49,130,246,0.07)'  },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  whileHover={{ scale: 1.04, y: -2 }}
                  style={{ borderRadius: 14, padding: '14px 16px', background: item.bg, border: `1px solid ${item.color}20`, cursor: 'default' }}
                >
                  <p style={{ fontSize: 12, fontWeight: 900, marginBottom: 4, color: item.color, letterSpacing: '.01em' }}>{item.label}</p>
                  <p style={{ fontSize: 11, color: '#6B7590', margin: 0 }}>{item.desc}</p>
                </motion.div>
              ))}
            </div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} style={{ display: 'inline-block' }}>
              <Link href="/futures" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 22px', borderRadius: 13, fontWeight: 800, fontSize: 13, color: '#fff', background: 'linear-gradient(135deg,#3182F6,#1a6fd4)', textDecoration: 'none', boxShadow: '0 8px 28px rgba(49,130,246,0.28)' }}>
                Start Futures Trading <ArrowRight style={{ width: 15, height: 15 }} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES GRID ────────────────────────────────────────────────── */}
      <section style={{ padding: '100px 24px', background: 'linear-gradient(180deg,#080C14,#0A0F1A)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: 56 }}>
            <SectionLabel color="#3182F6">Full Platform</SectionLabel>
            <h2 style={{ fontWeight: 900, fontSize: 'clamp(1.8rem,3.5vw,3rem)', letterSpacing: '-.04em', marginBottom: 14 }}>Everything in One Place</h2>
            <p style={{ fontSize: 14, color: '#6B7590', margin: 0 }}>All the tools professionals need to trade, earn, and grow.</p>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 14 }}>
            {FEATURES.map((f, i) => <FeatureCard key={f.title} feature={f} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── RANK SYSTEM ──────────────────────────────────────────────────── */}
      <section style={{ padding: '100px 24px', position: 'relative', overflow: 'hidden' }}>
        <GlowOrb color="#F97316" size={600} top="80%" left="50%" blur={140} opacity={0.06} />
        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 64, alignItems: 'start', marginBottom: 60 }}>
            <motion.div {...fadeUp()}>
              <SectionLabel color="#F97316">Rank & Earn System</SectionLabel>
              <h2 style={{ fontWeight: 900, fontSize: 'clamp(1.8rem,3.5vw,3rem)', letterSpacing: '-.04em', marginBottom: 18, lineHeight: 1.1 }}>
                Build Your Team.<br />
                <span style={{ color: '#F97316' }}>Earn Real Salary.</span>
              </h2>
              <p style={{ fontSize: 14, marginBottom: 24, lineHeight: 1.75, color: '#6B7590', maxWidth: 440 }}>
                Oblixar's unique 8-tier rank system rewards you with a monthly salary just for growing your team. Plus earn 6% on every trade your Level 1 referrals make — forever.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                {[['6%','L1 Commission'],['3%','L2 Commission'],['1%','L3 Commission']].map(([v, l]) => (
                  <motion.div
                    key={l}
                    whileHover={{ scale: 1.06 }}
                    style={{ borderRadius: 14, padding: '14px 10px', textAlign: 'center', background: 'rgba(249,115,22,0.07)', border: '1px solid rgba(249,115,22,0.14)', cursor: 'default' }}
                  >
                    <p style={{ fontWeight: 900, fontSize: 22, color: '#F97316', margin: 0, letterSpacing: '-.02em' }}>{v}</p>
                    <p style={{ fontSize: 10, marginTop: 5, color: '#6B7590', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em' }}>{l}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div {...scaleIn(0.15)} style={{ position: 'relative' }}>
              <div style={{ borderRadius: 22, overflow: 'hidden', border: '1px solid rgba(249,115,22,0.2)', boxShadow: '0 24px 64px rgba(249,115,22,0.1)' }}>
                <Image src="https://res.cloudinary.com/dgdlyrgda/image/upload/v1779844031/teambuild_tvafmn.png" alt="Earn with Oblixar" width={500} height={350} style={{ width: '100%', height: 'auto' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(8,12,20,0.88) 0%,transparent 65%)' }} />
                <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
                  <p style={{ fontSize: 11, fontWeight: 900, color: '#F97316', marginBottom: 5, letterSpacing: '.06em' }}>⚡ TOP EARNER THIS MONTH</p>
                  <p style={{ fontSize: 16, fontWeight: 900, color: '#E8ECF4', margin: 0, letterSpacing: '-.02em' }}>Infinity Legend — $9,600 salary</p>
                </div>
              </div>
            </motion.div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(130px,1fr))', gap: 10 }}>
            {RANK_LEVELS.map((rank, i) => <RankCard key={rank.level} rank={rank} index={i} />)}
          </div>

          <motion.div {...fadeUp(0.3)} style={{ textAlign: 'center', marginTop: 40 }}>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} style={{ display: 'inline-block' }}>
              <Link href="/auth/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', borderRadius: 14, fontWeight: 900, fontSize: 14, color: '#fff', background: 'linear-gradient(135deg,#F97316,#e06a0a)', textDecoration: 'none', boxShadow: '0 10px 36px rgba(249,115,22,0.32)' }}>
                Start Climbing the Ranks <Trophy style={{ width: 16, height: 16 }} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── COUNTRY DIRECTORS ────────────────────────────────────────────── */}
      <CountryDirectorsSection />

      {/* ── SECURITY SECTION ─────────────────────────────────────────────── */}
      <section style={{ padding: '100px 24px', background: 'linear-gradient(180deg,#080C14,#0A0F1A)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: 52 }}>
            <SectionLabel color="#1FE080">Security First</SectionLabel>
            <h2 style={{ fontWeight: 900, fontSize: 'clamp(1.8rem,3.5vw,3rem)', letterSpacing: '-.04em', marginBottom: 14 }}>Your Funds Are Safe</h2>
            <p style={{ fontSize: 14, color: '#6B7590', margin: 0 }}>Institutional-grade security protecting every account.</p>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 14 }}>
            {[
              { icon:'🔐', title:'2FA & OTP',    desc:'Every action protected', color:'#1FE080' },
              { icon:'🛡️', title:'KYC Verified', desc:'Identity verification',  color:'#3182F6' },
              { icon:'❄️', title:'Cold Storage', desc:'95% of funds offline',   color:'#8B5CF6' },
              { icon:'🔒', title:'AES-256',      desc:'Wallet encryption',      color:'#F59E0B' },
            ].map((s, i) => (
              <motion.div
                key={s.title}
                {...fadeUp(i * 0.08)}
                whileHover={{ y: -6, scale: 1.03, borderColor: `${s.color}30` }}
                style={{ borderRadius: 22, padding: '28px 20px', textAlign: 'center', background: '#0B1018', border: '1px solid rgba(31,224,128,0.08)', cursor: 'default', transition: 'border-color 0.25s' }}
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.4 }}
                  style={{ fontSize: 40, marginBottom: 14, display: 'block' }}
                >
                  {s.icon}
                </motion.div>
                <p style={{ fontSize: 13, fontWeight: 800, marginBottom: 6, color: '#D8DDE8' }}>{s.title}</p>
                <p style={{ fontSize: 11.5, color: '#5A6478', margin: 0 }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <motion.div
            {...scaleIn()}
            style={{ borderRadius: 32, padding: '60px 40px', position: 'relative', overflow: 'hidden', background: 'linear-gradient(145deg,rgba(49,130,246,0.08),rgba(31,224,128,0.04))', border: '1px solid rgba(49,130,246,0.18)' }}
          >
            <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 200, height: 2, borderRadius: 99, background: 'linear-gradient(90deg,transparent,#3182F6,transparent)' }} />
            <div style={{ position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)', width: 300, height: 300, borderRadius: '50%', background: '#3182F6', filter: 'blur(80px)', opacity: 0.06, pointerEvents: 'none' }} />

            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.3, type: 'spring' }}
              style={{ width: 64, height: 64, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 22, margin: '0 auto 24px', background: 'linear-gradient(135deg,#3182F6,#1a6fd4)', boxShadow: '0 12px 36px rgba(49,130,246,0.36)', cursor: 'default' }}
            >
              OX
            </motion.div>

            <h2 style={{ fontWeight: 900, fontSize: 'clamp(1.6rem,3vw,2.4rem)', marginBottom: 12, letterSpacing: '-.04em' }}>Join 180,000+ Traders</h2>
            <p style={{ fontSize: 14, marginBottom: 36, color: '#6B7590' }}>Start with a $4 welcome bonus. No credit card. No hidden fees.</p>

            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} style={{ display: 'inline-block' }}>
              <Link href="/auth/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 40px', borderRadius: 16, fontWeight: 900, fontSize: 15, color: '#fff', background: 'linear-gradient(135deg,#3182F6,#1a6fd4)', textDecoration: 'none', boxShadow: '0 12px 40px rgba(49,130,246,0.38)', letterSpacing: '.01em' }}>
                Create Free Account <ArrowRight style={{ width: 18, height: 18 }} />
              </Link>
            </motion.div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, marginTop: 28, fontSize: 11, color: '#3A4058', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}><Lock style={{ width: 12, height: 12 }} /> SSL Secured</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}><Shield style={{ width: 12, height: 12 }} /> KYC Protected</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}><Globe style={{ width: 12, height: 12 }} /> 150+ Countries</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <NewsGrid />
      <CTASection />
    </PublicLayout>
    </div>
  );
}