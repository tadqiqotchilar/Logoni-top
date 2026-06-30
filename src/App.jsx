import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Coins, 
  ArrowLeft, 
  Lock, 
  Unlock, 
  Check, 
  RotateCcw, 
  HelpCircle,
  Play
} from 'lucide-react';
import './App.css';

// Sound effects generator using Web Audio API (Crash-Proof)
const synth = {
  ctx: null,
  muted: false,
  init() {
    if (this.muted) return;
    try {
      if (!this.ctx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          this.ctx = new AudioContextClass();
        } else {
          this.muted = true;
          return;
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    } catch (e) {
      console.warn("AudioContext failed to initialize:", e);
      this.muted = true;
    }
  },
  playTap() {
    if (this.muted) return;
    this.init();
    try {
      if (!this.ctx) return;
      const ctx = this.ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(650, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {
      console.error(e);
    }
  },
  playSuccess() {
    if (this.muted) return;
    this.init();
    try {
      if (!this.ctx) return;
      const ctx = this.ctx;
      const now = ctx.currentTime;
      const playNote = (freq, start, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.1, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + duration - 0.02);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + duration);
      };
      playNote(523.25, now, 0.1);    // C5
      playNote(659.25, now + 0.08, 0.1); // E5
      playNote(783.99, now + 0.16, 0.1); // G5
      playNote(1046.50, now + 0.24, 0.25); // C6
    } catch (e) {
      console.error(e);
    }
  },
  playError() {
    if (this.muted) return;
    this.init();
    try {
      if (!this.ctx) return;
      const ctx = this.ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(70, ctx.currentTime + 0.22);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } catch (e) {
      console.error(e);
    }
  },
  playHint() {
    if (this.muted) return;
    this.init();
    try {
      if (!this.ctx) return;
      const ctx = this.ctx;
      const now = ctx.currentTime;
      for (let i = 0; i < 4; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300 + i * 200, now + i * 0.06);
        gain.gain.setValueAtTime(0.06, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.09);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.09);
      }
    } catch (e) {
      console.error(e);
    }
  }
};

// Telegram Web App API Haptics
const tgHaptic = {
  impact(style = 'medium') {
    try {
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred(style);
      }
    } catch (e) {
      console.warn("Haptic impact failed:", e);
    }
  },
  notification(type = 'success') {
    try {
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred(type);
      }
    } catch (e) {
      console.warn("Haptic notification failed:", e);
    }
  },
  selection() {
    try {
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.selectionChanged();
      }
    } catch (e) {
      console.warn("Haptic selection failed:", e);
    }
  }
};

// SVG Brands Component (15 Brands)
const LogoSvg = ({ brandId, isSolved }) => {
  switch (brandId) {
    case 'evos':
      return (
        <svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="80" rx="10" fill="#1b9d47" />
          <text 
            x="100" 
            y="46" 
            fontFamily="'Outfit', sans-serif" 
            fontWeight="900" 
            fontSize="38" 
            fontStyle="italic"
            fill="#FFFFFF" 
            textAnchor="middle"
            dominantBaseline="middle"
            letterSpacing="6"
          >
            <tspan fill="#FFFFFF">E</tspan>
            <tspan fill="#FFFFFF" opacity={isSolved ? 1 : 0}>V</tspan>
            <tspan fill="#FFFFFF" opacity={isSolved ? 1 : 0}>O</tspan>
            <tspan fill="#FFFFFF" opacity={isSolved ? 1 : 0}>S</tspan>
          </text>
        </svg>
      );
      
    case 'korzinka':
      return (
        <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="40" r="28" fill="#e13027" />
          <path d="M 85 40 L 115 40 L 110 58 L 90 58 Z" fill="#ffffff" />
          <line x1="93" y1="40" x2="95" y2="58" stroke="#e13027" strokeWidth="1.5" />
          <line x1="100" y1="40" x2="100" y2="58" stroke="#e13027" strokeWidth="1.5" />
          <line x1="107" y1="40" x2="105" y2="58" stroke="#e13027" strokeWidth="1.5" />
          <line x1="88" y1="46" x2="112" y2="46" stroke="#e13027" strokeWidth="1" />
          <line x1="89" y1="52" x2="111" y2="52" stroke="#e13027" strokeWidth="1" />
          <path d="M 88 40 C 88 23, 112 23, 112 40" fill="none" stroke="#2ba64d" strokeWidth="4.5" strokeLinecap="round" />
          <circle cx="112" cy="40" r="2.5" fill="#2ba64d" />
          <circle cx="88" cy="40" r="2.5" fill="#2ba64d" />
          <text 
            x="100" 
            y="98" 
            fontFamily="'Outfit', sans-serif" 
            fontWeight="900" 
            fontSize="18" 
            fill="#e13027" 
            textAnchor="middle" 
            opacity={isSolved ? 1 : 0}
          >
            korzinka
          </text>
        </svg>
      );
      
    case 'payme':
      return (
        <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
          <rect x="75" y="10" width="50" height="50" rx="14" fill="#00b5a7" />
          <path d="M 90 34 L 98 42 L 112 24" fill="none" stroke="#ffffff" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
          <text 
            x="100" 
            y="96" 
            fontFamily="'Outfit', sans-serif" 
            fontWeight="900" 
            fontSize="26" 
            fill="#00b5a7" 
            textAnchor="middle"
            letterSpacing="0.5"
            opacity={isSolved ? 1 : 0}
          >
            payme
          </text>
        </svg>
      );
      
    case 'click':
      return (
        <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
          <circle cx="56" cy="60" r="22" fill="#0073ff" />
          <circle cx="56" cy="60" r="12" fill="none" stroke="#ffffff" strokeWidth="2.5" opacity="0.3" />
          <path d="M 56 60 L 65 70 L 60 72 L 64 80 L 61 81 L 57 73 L 52 77 Z" fill="#ffffff" />
          
          <text 
            x="122" 
            y="68" 
            fontFamily="'Outfit', sans-serif" 
            fontWeight="900" 
            fontSize="28" 
            fill="#111827" 
            textAnchor="middle"
            letterSpacing="0.5"
            opacity={isSolved ? 1 : 0}
          >
            click
          </text>
          <circle cx="86" cy="56" r="3" fill="#0073ff" opacity={isSolved ? 1 : 0} />
        </svg>
      );
      
    case 'muradbuildings':
      return (
        <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
          <path d="M 75 70 L 75 25 L 100 58 L 125 25 L 125 70" fill="none" stroke="#10316b" strokeWidth="10" strokeLinecap="square" strokeLinejoin="miter" />
          <path d="M 115 18 L 110 8 L 125 14 L 140 8 L 135 18 Z" fill="#d97706" />
          <circle cx="110" cy="8" r="1.5" fill="#d97706" />
          <circle cx="125" cy="14" r="1.5" fill="#d97706" />
          <circle cx="140" cy="8" r="1.5" fill="#d97706" />
          
          <text 
            x="100" 
            y="98" 
            fontFamily="'Outfit', sans-serif" 
            fontWeight="800" 
            fontSize="12" 
            fill="#10316b" 
            textAnchor="middle"
            letterSpacing="0.2"
            opacity={isSolved ? 1 : 0}
          >
            MURAD BUILDINGS
          </text>
        </svg>
      );
      
    case 'crafers':
      return (
        <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="40" r="25" fill="#581c87" />
          <path d="M 108 30 C 102 25, 90 27, 90 39 C 90 51, 102 53, 108 48 C 105 46, 96 46, 96 39 C 96 33, 104 32, 106 35" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="100" cy="20" r="1.5" fill="#ffffff" opacity="0.8" />
          <circle cx="112" cy="25" r="1.5" fill="#ffffff" opacity="0.8" />
          <circle cx="118" cy="35" r="1.5" fill="#ffffff" opacity="0.8" />
          <circle cx="116" cy="47" r="1.5" fill="#ffffff" opacity="0.8" />
          <circle cx="106" cy="55" r="1.5" fill="#ffffff" opacity="0.8" />
          <circle cx="94" cy="53" r="1.5" fill="#ffffff" opacity="0.8" />
          <circle cx="86" cy="43" r="1.5" fill="#ffffff" opacity="0.8" />
          <circle cx="88" cy="31" r="1.5" fill="#ffffff" opacity="0.8" />
          
          <text 
            x="100" 
            y="98" 
            fontFamily="'Georgia', serif" 
            fontStyle="italic" 
            fontWeight="700" 
            fontSize="22" 
            fill="#581c87" 
            textAnchor="middle" 
            opacity={isSolved ? 1 : 0}
          >
            Crafers
          </text>
        </svg>
      );
      
    case 'xonsaroy':
      return (
        <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
          <g opacity={isSolved ? 1 : 0.8}>
            <rect x="70" y="40" width="6" height="30" fill="#701a75" />
            <rect x="80" y="30" width="6" height="40" fill="#701a75" />
            <rect x="90" y="18" width="6" height="52" fill="#701a75" />
            <rect x="100" y="10" width="6" height="60" fill="#701a75" />
            <rect x="110" y="22" width="6" height="48" fill="#701a75" />
            <rect x="120" y="32" width="6" height="38" fill="#701a75" />
            <rect x="130" y="42" width="6" height="28" fill="#701a75" />
          </g>
          <rect x="60" y="42" width="80" height="15" fill="#ffffff" stroke="#701a75" strokeWidth="1.5" />
          <text 
            x="100" 
            y="53" 
            fontFamily="'Outfit', sans-serif" 
            fontWeight="900" 
            fontSize="8" 
            fill="#701a75" 
            textAnchor="middle" 
            letterSpacing="0.5"
            opacity={isSolved ? 1 : 0}
          >
            XON SAROY
          </text>
          
          <text 
            x="100" 
            y="98" 
            fontFamily="'Outfit', sans-serif" 
            fontWeight="900" 
            fontSize="18" 
            fill="#701a75" 
            textAnchor="middle" 
            letterSpacing="0.5"
            opacity={isSolved ? 1 : 0}
          >
            XON SAROY
          </text>
        </svg>
      );
      
    case 'nmedov':
      return (
        <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
          <path d="M 75 55 C 62 35, 84 18, 98 12 C 84 20, 80 42, 88 55 Z" fill="#f59e0b" />
          <path d="M 100 55 C 87 30, 110 10, 126 6 C 110 16, 104 40, 112 55 Z" fill="#ea580c" />
          <path d="M 125 55 C 112 25, 138 3, 153 0 C 137 10, 130 40, 137 55 Z" fill="#dc2626" />
          
          <text 
            x="100" 
            y="98" 
            fontFamily="'Outfit', sans-serif" 
            fontWeight="900" 
            fontSize="18" 
            fill="#111827" 
            textAnchor="middle" 
            letterSpacing="1"
            opacity={isSolved ? 1 : 0}
          >
            N'MEDOV
          </text>
        </svg>
      );
      
    case 'artel':
      return (
        <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
          <circle cx="56" cy="60" r="22" fill="#00a294" />
          <path d="M 56 44 C 47 44, 43 51, 43 60 C 43 68, 48 74, 56 74 C 60 74, 63 71, 65 68 L 65 73 L 70 73 L 70 52 C 70 45, 65 44, 56 44 Z M 56 52 C 61 52, 63 56, 63 60 C 63 65, 60 67, 56 67 C 51 67, 51 61, 51 60 C 51 55, 54 52, 56 52 Z" fill="#ffffff" />
          <path d="M 70 52 C 75 55, 78 62, 75 68" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          
          <text 
            x="122" 
            y="70" 
            fontFamily="'Outfit', sans-serif" 
            fontWeight="900" 
            fontSize="28" 
            fill="#00a294" 
            textAnchor="middle"
            letterSpacing="0.5"
            opacity={isSolved ? 1 : 0}
          >
            artel
          </text>
        </svg>
      );
      
    case 'uzum':
      return (
        <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
          <circle cx="56" cy="60" r="22" fill="#7f00ff" />
          <circle cx="49" cy="53" r="3.5" fill="#ffffff" />
          <circle cx="56" cy="53" r="3.5" fill="#ffffff" />
          <circle cx="63" cy="53" r="3.5" fill="#ffffff" />
          <circle cx="52" cy="59" r="3.5" fill="#ffffff" />
          <circle cx="60" cy="59" r="3.5" fill="#ffffff" />
          <circle cx="56" cy="65" r="3.5" fill="#ffffff" />
          <path d="M 56 45 C 53 42, 59 42, 56 48" fill="none" stroke="#10b981" strokeWidth="2" />
          
          <text 
            x="122" 
            y="69" 
            fontFamily="'Outfit', sans-serif" 
            fontWeight="900" 
            fontSize="28" 
            fill="#7f00ff" 
            textAnchor="middle"
            letterSpacing="0.5"
            opacity={isSolved ? 1 : 0}
          >
            uzum
          </text>
        </svg>
      );
      
    case 'nbu':
      return (
        <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
          <path d="M 75 70 L 75 35 A 10 10 0 0 1 95 35 L 95 70 Z" fill="#b45309" />
          <path d="M 100 70 L 100 25 A 10 10 0 0 1 120 25 L 120 70 Z" fill="#b45309" />
          <path d="M 125 70 L 125 35 A 10 10 0 0 1 145 35 L 145 70 Z" fill="#b45309" />
          <text x="85" y="55" fontFamily="'Outfit', sans-serif" fontWeight="900" fontSize="10" fill="#ffffff" textAnchor="middle" opacity={isSolved ? 1 : 0}>N</text>
          <text x="110" y="50" fontFamily="'Outfit', sans-serif" fontWeight="900" fontSize="10" fill="#ffffff" textAnchor="middle" opacity={isSolved ? 1 : 0}>B</text>
          <text x="135" y="55" fontFamily="'Outfit', sans-serif" fontWeight="900" fontSize="10" fill="#ffffff" textAnchor="middle" opacity={isSolved ? 1 : 0}>U</text>
          
          <text 
            x="110" 
            y="98" 
            fontFamily="'Outfit', sans-serif" 
            fontWeight="900" 
            fontSize="18" 
            fill="#b45309" 
            textAnchor="middle"
            letterSpacing="0.5"
            opacity={isSolved ? 1 : 0}
          >
            N B U
          </text>
        </svg>
      );
      
    case 'humo':
      return (
        <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
          <polygon points="100,20 92,36 100,60 108,36" fill="none" stroke="#d97706" strokeWidth="2" />
          <path d="M 92 36 L 64 28 L 76 44 L 100 60" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
          <path d="M 108 36 L 136 28 L 124 44 L 100 60" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
          <line x1="100" y1="20" x2="100" y2="60" stroke="#d97706" strokeWidth="1.5" />
          <line x1="76" y1="44" x2="92" y2="36" stroke="#d97706" strokeWidth="1.5" />
          <line x1="124" y1="44" x2="108" y2="36" stroke="#d97706" strokeWidth="1.5" />
          <polygon points="100,60 94,76 100,84 106,76" fill="none" stroke="#d97706" strokeWidth="2" />
          
          <text 
            x="100" 
            y="105" 
            fontFamily="'Outfit', sans-serif" 
            fontWeight="900" 
            fontSize="18" 
            fill="#d97706" 
            textAnchor="middle"
            letterSpacing="2"
            opacity={isSolved ? 1 : 0}
          >
            HUMO
          </text>
        </svg>
      );
      
    case 'tashkentcitymall':
      return (
        <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
          <path d="M 82 70 L 82 30 C 82 25, 92 25, 92 30 L 92 70" fill="none" stroke="#000000" strokeWidth="6" strokeLinecap="round" />
          <path d="M 118 70 L 118 30 C 118 25, 128 25, 128 30 L 128 70" fill="none" stroke="#000000" strokeWidth="6" strokeLinecap="round" />
          <path d="M 92 30 C 100 35, 110 35, 118 30" fill="none" stroke="#000000" strokeWidth="6" strokeLinecap="round" />
          <text 
            x="100" 
            y="94" 
            fontFamily="'Outfit', sans-serif" 
            fontWeight="900" 
            fontSize="9" 
            fill="#000000" 
            textAnchor="middle"
            letterSpacing="0.2"
            opacity={isSolved ? 1 : 0}
          >
            TASHKENT CITY MALL
          </text>
        </svg>
      );
      
    case 'uzbekneftegaz':
      return (
        <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
          <path d="M 100 20 C 84 32, 80 48, 100 64 C 76 52, 80 32, 100 20 Z" fill="#06b6d4" />
          <path d="M 100 20 C 116 32, 120 48, 100 64 C 124 52, 120 32, 100 20 Z" fill="#2563eb" />
          
          <text 
            x="100" 
            y="94" 
            fontFamily="'Outfit', sans-serif" 
            fontWeight="900" 
            fontSize="12" 
            textAnchor="middle"
            letterSpacing="0.2"
            opacity={isSolved ? 1 : 0}
          >
            <tspan fill="#0284c7">UZBEK</tspan>
            <tspan fill="#f97316">NEFTEGAZ</tspan>
          </text>
        </svg>
      );
      
    case 'tashkentcity':
      return (
        <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
          <path d="M 94 70 L 94 30 L 100 16 L 106 30 L 106 70 Z" fill="#0284c7" />
          <line x1="100" y1="16" x2="100" y2="8" stroke="#0284c7" strokeWidth="1.5" />
          <line x1="94" y1="38" x2="106" y2="38" stroke="#ffffff" strokeWidth="0.8" opacity="0.5" />
          <line x1="94" y1="48" x2="106" y2="48" stroke="#ffffff" strokeWidth="0.8" opacity="0.5" />
          <line x1="94" y1="58" x2="106" y2="58" stroke="#ffffff" strokeWidth="0.8" opacity="0.5" />
          
          <text 
            x="100" 
            y="94" 
            fontFamily="'Outfit', sans-serif" 
            fontWeight="900" 
            fontSize="13" 
            fill="#b45309" 
            textAnchor="middle"
            letterSpacing="0.2"
            opacity={isSolved ? 1 : 0}
          >
            Tashkent City
          </text>
        </svg>
      );
      
    default:
      return null;
  }
};

// Canvas Confetti Success Overlay
const ConfettiEffect = ({ active }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);
    
    const colors = ['#2563eb', '#3b82f6', '#10b981', '#f1c40f', '#ef4444', '#7f00ff'];
    const particles = Array.from({ length: 65 }).map(() => ({
      x: width / 2,
      y: height / 2,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8 - 4,
      radius: Math.random() * 4 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      decay: Math.random() * 0.015 + 0.005
    }));
    
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      let alive = false;
      
      particles.forEach((p) => {
        if (p.alpha <= 0) return;
        alive = true;
        
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.12; 
        p.vx *= 0.98; 
        p.rotation += p.rotationSpeed;
        p.alpha -= p.decay;
        
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.radius, -p.radius / 1.5, p.radius * 2, p.radius * 1.3);
        ctx.restore();
      });
      
      if (alive) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [active]);
  
  return active ? <canvas ref={canvasRef} className="confetti-canvas" /> : null;
};

// Data list: 15 Uzbek national brands
const levelsData = [
  {
    id: 'evos',
    name: 'EVOS',
    answer: 'EVOS',
    category: 'Fast food',
    desc: "EVOS — O'zbekistondagi eng yirik tezkor ovqatlanish tarmoqlaridan biri bo'lib, o'zining mazali lavashlari bilan tanilgan."
  },
  {
    id: 'korzinka',
    name: 'Korzinka',
    answer: 'KORZINKA',
    category: 'Supermarket',
    desc: "Korzinka — O'zbekistondagi birinchi va eng yirik supermarketlar tarmoqlaridan biri bo'lib, 1996-yilda tashkil etilgan."
  },
  {
    id: 'payme',
    name: 'Payme',
    answer: 'PAYME',
    category: 'To\'lov tizimi',
    desc: "Payme — millionlab foydalanuvchilarga ega, kommunal to'lovlar, pul o'tkazmalari va boshqa xizmatlar uchun mo'ljallangan yetakchi to'lov tizimi."
  },
  {
    id: 'click',
    name: 'Click',
    answer: 'CLICK',
    category: 'To\'lov tizimi',
    desc: "Click — O'zbekistondagi dastlabki to'lov tashkilotlaridan biri bo'lib, SMS orqali to'lov tizimi bilan boshlangan va hozirda ommabop ilovaga aylangan."
  },
  {
    id: 'muradbuildings',
    name: 'Murad Buildings',
    answer: 'MURADBUILDINGS',
    category: 'Qurilish',
    desc: "Murad Buildings — O'zbekistonda zamonaviy ko'p qavatli uy-joylar va biznes-markazlar barpo etuvchi yetakchi qurilish kompaniyasi."
  },
  {
    id: 'crafers',
    name: 'Crafers',
    answer: 'CRAFERS',
    category: 'Qandolatchilik',
    desc: "Crafers — shokoladlar, pechenyelar va turli shirinliklar ishlab chiqaruvchi O'zbekistondagi zamonaviy qandolat fabrikasi."
  },
  {
    id: 'xonsaroy',
    name: 'Xon Saroy',
    answer: 'XONSAROY',
    category: 'Qurilish',
    desc: "Xon Saroy — noodatiy me'moriy yechimlarga ega, xavfsiz va shinam turar-joy majmualari quruvchi taniqli brend."
  },
  {
    id: 'nmedov',
    name: 'N\'MEDOV',
    answer: 'NMEDOV',
    category: 'Oziq-ovqat',
    desc: "N'MEDOV — asalli tortlar va shirinliklar tayyorlashga ixtisoslashgan, shirin ta'mi bilan tanilgan qandolat brendi."
  },
  {
    id: 'artel',
    name: 'Artel',
    answer: 'ARTEL',
    category: 'Maishiy texnika',
    desc: "Artel — O'zbekistondagi maishiy texnika ishlab chiqaruvchi eng yirik brend bo'lib, mahsulotlarini xorijiy davlatlarga eksport qiladi."
  },
  {
    id: 'uzum',
    name: 'Uzum',
    answer: 'UZUM',
    category: 'Ekotizim',
    desc: "Uzum — O'zbekistondagi ulkan ekotizim (Uzum Market, Uzum Bank, Uzum Tezkor) bo'lib, mamlakatning eng tez rivojlanayotgan brendidir."
  },
  {
    id: 'nbu',
    name: 'NBU',
    answer: 'NBU',
    category: 'Bank',
    desc: "NBU — O'zbekiston Milliy Banki bo'lib, mamlakatning eng yirik va nufuzli moliyaviy muassasalaridan biridir."
  },
  {
    id: 'humo',
    name: 'Humo',
    answer: 'HUMO',
    category: 'To\'lov tizimi',
    desc: "Humo — milliy banklararo to'lov tizimi bo'lib, kontaktsiz to'lovlar va bank xizmatlarini osonlashtirish uchun yaratilgan."
  },
  {
    id: 'tashkentcitymall',
    name: 'Tashkent City Mall',
    answer: 'TASHKENTCITYMALL',
    category: 'Ko\'ngilochar markaz',
    desc: "Tashkent City Mall — poytaxt markazida joylashgan yirik zamonaviy savdo-ko'ngilochar va xaridlar majmuasi."
  },
  {
    id: 'uzbekneftegaz',
    name: 'Uzbekneftegaz',
    answer: 'UZBEKNEFTEGAZ',
    category: 'Energetika',
    desc: "Uzbekneftegaz — mamlakatdagi neft va tabiiy gaz qazib olish, qayta ishlash hamda yoqilg'i sotish bilan shug'ullanadigan milliy energetika xoldingi."
  },
  {
    id: 'tashkentcity',
    name: 'Tashkent City',
    answer: 'TASHKENTCITY',
    category: 'Biznes markaz',
    desc: "Tashkent City — shahar markazidagi xalqaro biznes-tuman bo'lib, ko'plab zamonaviy osmono'par binolarni o'z ichiga oladi."
  }
];

function App() {
  // Screen starts directly on Levels Grid ('grid')
  const [screen, setScreen] = useState('grid');
  
  // States persisted in localStorage
  const [solvedLevels, setSolvedLevels] = useState(() => {
    const saved = localStorage.getItem('logo_quiz_solved');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [coins, setCoins] = useState(() => {
    const saved = localStorage.getItem('logo_quiz_coins');
    return saved ? parseInt(saved, 10) : 50; 
  });

  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  
  // Game states
  const [inputSlots, setInputSlots] = useState([]); // Array of { letter: string, keyId: number, isHintLocked: boolean }
  const [keyboardKeys, setKeyboardKeys] = useState([]); // Array of { id: number, letter: string, isUsed: boolean, isHintRemoved: boolean }
  const [isError, setIsError] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [isHintModalOpen, setIsHintModalOpen] = useState(false);
  const [muted, setMuted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Sync states with localStorage
  useEffect(() => {
    localStorage.setItem('logo_quiz_solved', JSON.stringify(solvedLevels));
  }, [solvedLevels]);

  useEffect(() => {
    localStorage.setItem('logo_quiz_coins', coins.toString());
  }, [coins]);

  // Expand WebApp and set colors
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      if (tg.setHeaderColor) {
        tg.setHeaderColor('#f4f6fa'); // Light Mode color sync
      }
    }
  }, []);

  // Telegram BackButton management
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      if (screen === 'quiz') {
        tg.BackButton.show();
        const handleBack = () => {
          synth.playTap();
          tgHaptic.impact('light');
          setScreen('grid');
        };
        tg.BackButton.onClick(handleBack);
        return () => {
          tg.BackButton.offClick(handleBack);
        };
      } else {
        tg.BackButton.hide();
      }
    }
  }, [screen]);

  // Load level configuration
  const loadLevel = (index) => {
    const level = levelsData[index];
    const answer = level.answer.toUpperCase();
    const isLevelSolved = solvedLevels.includes(level.id);
    
    setCurrentLevelIdx(index);
    setIsSolved(isLevelSolved);
    setIsError(false);
    setIsHintModalOpen(false);
    setShowConfetti(false);
    
    if (isLevelSolved) {
      setInputSlots(answer.split('').map((char) => ({ letter: char, keyId: -1, isHintLocked: true })));
      setKeyboardKeys([]);
    } else {
      setInputSlots(Array(answer.length).fill(null).map(() => null));
      
      const answerLetters = answer.split('');
      const fillerCount = 14 - answerLetters.length;
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const fillerLetters = [];
      
      while (fillerLetters.length < fillerCount) {
        const randomChar = alphabet[Math.floor(Math.random() * alphabet.length)];
        fillerLetters.push(randomChar);
      }
      
      const allLetters = [...answerLetters, ...fillerLetters];
      const scrambled = allLetters
        .map((char, i) => ({
          id: i,
          letter: char,
          isUsed: false,
          isHintRemoved: false
        }))
        .sort(() => Math.random() - 0.5);
        
      setKeyboardKeys(scrambled);
    }
  };

  const handleSelectLevel = (idx) => {
    // Unlocked: level index 0 OR previous level is solved
    const isUnlocked = idx === 0 || solvedLevels.includes(levelsData[idx - 1].id);
    
    if (isUnlocked) {
      synth.playTap();
      tgHaptic.impact('medium');
      loadLevel(idx);
      setScreen('quiz');
    } else {
      synth.playError();
      tgHaptic.notification('error');
    }
  };

  // Reset Progress with Telegram showConfirm check
  const handleResetProgress = () => {
    const message = "Haqiqatan ham o'yinni boshidan boshlamoqchimisiz? Barcha yutuqlaringiz o'chiriladi.";
    const doReset = () => {
      try {
        synth.playTap();
        tgHaptic.notification('warning');
      } catch (e) {
        console.warn("Haptics or audio failed during reset:", e);
      }
      setSolvedLevels([]);
      setCoins(50);
      localStorage.removeItem('logo_quiz_solved');
      localStorage.setItem('logo_quiz_coins', '50');
    };
    
    try {
      if (window.Telegram?.WebApp?.showConfirm) {
        window.Telegram.WebApp.showConfirm(message, (approved) => {
          if (approved) doReset();
        });
      } else {
        if (window.confirm(message)) {
          doReset();
        }
      }
    } catch (e) {
      console.warn("Confirm failed, doing fallback direct reset:", e);
      doReset();
    }
  };

  // Keyboard button click
  const handleKeyTap = (key) => {
    if (isSolved || isError) return;
    synth.playTap();
    tgHaptic.selection();

    // Find first empty slot
    const firstEmptyIdx = inputSlots.findIndex(slot => slot === null);
    if (firstEmptyIdx === -1) return;

    const newInputSlots = [...inputSlots];
    newInputSlots[firstEmptyIdx] = { letter: key.letter, keyId: key.id, isHintLocked: false };
    setInputSlots(newInputSlots);

    // Disable tapped keyboard key
    setKeyboardKeys(prev => prev.map(k => k.id === key.id ? { ...k, isUsed: true } : k));

    // Check if slots are fully filled
    const filledSlotsCount = newInputSlots.filter(s => s !== null).length;
    if (filledSlotsCount === levelsData[currentLevelIdx].answer.length) {
      checkAnswer(newInputSlots);
    }
  };

  // Slot tap (clears character directly from the slot)
  const handleSlotTap = (slot, index) => {
    if (isSolved || isError || !slot || slot.isHintLocked) return;
    synth.playTap();
    tgHaptic.selection();

    const newInputSlots = [...inputSlots];
    newInputSlots[index] = null;
    setInputSlots(newInputSlots);

    // Enable key on the keyboard
    setKeyboardKeys(prev => prev.map(k => k.id === slot.keyId ? { ...k, isUsed: false } : k));
  };

  // Check answer correctness
  const checkAnswer = (slots) => {
    const spelled = slots.map(s => s.letter).join('').toUpperCase();
    const correct = levelsData[currentLevelIdx].answer.toUpperCase();

    if (spelled === correct) {
      // SUCCESS STATE
      setIsSolved(true);
      setShowConfetti(true);
      synth.playSuccess();
      tgHaptic.notification('success');

      // Lock all slots
      setInputSlots(prev => prev.map(s => ({ ...s, isHintLocked: true })));

      // Save to solved levels list
      let nextSolvedLevels = solvedLevels;
      if (!solvedLevels.includes(levelsData[currentLevelIdx].id)) {
        nextSolvedLevels = [...solvedLevels, levelsData[currentLevelIdx].id];
        setSolvedLevels(nextSolvedLevels);
        setCoins(prev => prev + 10);
      }

      // Automatically advance to the next level after 1.2 seconds
      setTimeout(() => {
        const nextIdx = currentLevelIdx + 1;
        if (nextIdx < levelsData.length) {
          loadLevel(nextIdx);
        } else {
          // Finished all 15 levels! Go back to grid
          setScreen('grid');
        }
      }, 1200);
    } else {
      // ERROR STATE
      setIsError(true);
      synth.playError();
      tgHaptic.notification('error');

      // Clear the error state after 1.2 seconds
      setTimeout(() => {
        setIsError(false);
      }, 1200);
    }
  };

  // Hints system
  const handlePurchaseLetterHint = () => {
    if (coins < 20) {
      synth.playError();
      tgHaptic.notification('error');
      return;
    }

    const answer = levelsData[currentLevelIdx].answer.toUpperCase();
    
    // Find first slot that is either empty or incorrect
    let targetIdx = -1;
    for (let i = 0; i < answer.length; i++) {
      const slot = inputSlots[i];
      if (slot === null || (!slot.isHintLocked && slot.letter !== answer[i])) {
        targetIdx = i;
        break;
      }
    }

    if (targetIdx === -1) return;

    synth.playHint();
    tgHaptic.impact('medium');
    setCoins(prev => prev - 20);

    const correctChar = answer[targetIdx];
    const prevSlot = inputSlots[targetIdx];

    // Find correct keyboard key that is not in a correct position
    const correctSlotPositions = [];
    inputSlots.forEach((s, idx) => {
      if (s !== null && s.letter === answer[idx] && idx !== targetIdx) {
        correctSlotPositions.push(s.keyId);
      }
    });

    let foundKey = keyboardKeys.find(
      k => k.letter === correctChar && !k.isUsed && !k.isHintRemoved
    );

    if (!foundKey) {
      foundKey = keyboardKeys.find(
        k => k.letter === correctChar && !correctSlotPositions.includes(k.id) && !k.isHintRemoved
      );
    }

    if (!foundKey) return;

    // Free previously occupied key in target slot
    if (prevSlot && prevSlot.keyId !== -1) {
      setKeyboardKeys(prev => prev.map(k => k.id === prevSlot.keyId ? { ...k, isUsed: false } : k));
    }

    // Free found key if it was used in another incorrect slot
    const slotContainingFoundKey = inputSlots.findIndex(s => s !== null && s.keyId === foundKey.id);
    const newInputSlots = [...inputSlots];
    if (slotContainingFoundKey !== -1) {
      newInputSlots[slotContainingFoundKey] = null;
    }

    // Insert correct letter and lock it
    newInputSlots[targetIdx] = { letter: correctChar, keyId: foundKey.id, isHintLocked: true };
    setInputSlots(newInputSlots);

    // Disable key on keyboard
    setKeyboardKeys(prev => prev.map(k => k.id === foundKey.id ? { ...k, isUsed: true } : k));

    setIsHintModalOpen(false);

    // Check if slots are fully filled
    const filledSlotsCount = newInputSlots.filter(s => s !== null).length;
    if (filledSlotsCount === answer.length) {
      checkAnswer(newInputSlots);
    }
  };

  const handlePurchaseRemoveHint = () => {
    if (coins < 15) {
      synth.playError();
      tgHaptic.notification('error');
      return;
    }

    const answer = levelsData[currentLevelIdx].answer.toUpperCase();
    const answerSet = new Set(answer.split(''));

    // Find filler keys that are not in the answer and not used or removed
    const keysToRemove = keyboardKeys.filter(
      k => !answerSet.has(k.letter) && !k.isUsed && !k.isHintRemoved
    );

    if (keysToRemove.length === 0) return;

    synth.playHint();
    tgHaptic.impact('medium');
    setCoins(prev => prev - 15);

    // Remove up to 3 keys
    const targetKeysIds = keysToRemove.slice(0, 3).map(k => k.id);

    setKeyboardKeys(prev => 
      prev.map(k => targetKeysIds.includes(k.id) ? { ...k, isHintRemoved: true } : k)
    );

    setIsHintModalOpen(false);
  };

  const toggleMute = () => {
    const newState = !muted;
    setMuted(newState);
    synth.muted = newState;
    if (!newState) {
      synth.init();
      synth.playTap();
    }
  };

  return (
    <div className="game-container">


      {/* Screen 1: Levels Grid Screen */}
      {screen === 'grid' && (
        <div className="levels-screen pop-in">
          <div className="levels-header-bar">
            <h2 className="levels-title">Milliy brendlar</h2>
            <div className="levels-progress">
              {solvedLevels.length} / 15
            </div>
          </div>

          <div className="levels-grid">
            {levelsData.map((lvl, index) => {
              const isSolved = solvedLevels.includes(lvl.id);
              const isActive = index === 0 || solvedLevels.includes(levelsData[index - 1].id);
              const isLocked = !isSolved && !isActive;

              return (
                <div 
                  key={lvl.id}
                  className={`level-card ${isSolved ? 'solved' : ''} ${isActive && !isSolved ? 'active-unsolved' : ''} ${isLocked ? 'locked' : ''}`}
                  onClick={() => handleSelectLevel(index)}
                >
                  <div className="level-card-icon-container">
                    {isSolved ? (
                      <LogoSvg brandId={lvl.id} isSolved={true} />
                    ) : isActive ? (
                      <Unlock size={24} className="level-card-lock-icon" style={{ color: 'var(--primary)' }} />
                    ) : (
                      <Lock size={24} className="level-card-lock-icon" />
                    )}
                  </div>

                  <div className="level-card-status-text">
                    {isSolved ? lvl.name : isActive ? 'Boshlash' : 'Qulflangan'}
                  </div>
                </div>
              );
            })}
          </div>

          {solvedLevels.length > 0 && (
            <button 
              className="btn-secondary" 
              onClick={handleResetProgress}
              style={{ 
                marginTop: '10px',
                marginBottom: '10px',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '8px',
                borderStyle: 'dashed',
                borderColor: 'var(--danger)',
                color: 'var(--danger)',
                background: 'rgba(239, 68, 68, 0.03)',
                boxShadow: 'none'
              }}
            >
              O'yinni boshidan boshlash
            </button>
          )}
        </div>
      )}

      {/* Screen 2: Main Quiz Board */}
      {screen === 'quiz' && (
        <div className="quiz-screen">
          {/* Confetti canvas */}
          <ConfettiEffect active={showConfetti} />

          {/* Header Bar */}
          <div>
            <div className="header-bar">
              <div className="quiz-progress-text">
                {currentLevelIdx + 1} / 15
              </div>

              <div className="coins-badge">
                <Coins size={16} className="coin-icon-anim" />
                <span>{coins}</span>
              </div>

              <button className="btn-icon" onClick={toggleMute}>
                {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
            </div>

            {/* Level progress bar - edge to edge */}
            <div className="progress-bar-container">
              <div 
                className="progress-bar-fill"
                style={{ width: `${((currentLevelIdx + 1) / levelsData.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Logo Card */}
          <div className="logo-card-wrapper">
            <div className="logo-card">
              <LogoSvg brandId={levelsData[currentLevelIdx].id} isSolved={isSolved} />
            </div>
          </div>

          <p className="logo-prompt-text">Bu qanday logotip?</p>

          {/* Input letter slots */}
          <div className={`input-slots-container ${isError ? 'shake' : ''}`}>
            {inputSlots.map((slot, index) => {
              let slotClass = "input-slot";
              if (slot) slotClass += " filled";
              if (isError) slotClass += " error";
              if (isSolved) slotClass += " correct";

              return (
                <div 
                  key={index} 
                  className={slotClass}
                  onClick={() => handleSlotTap(slot, index)}
                >
                  {slot ? slot.letter : ''}
                </div>
              );
            })}
          </div>

          {/* Keyboard & Actions Panel */}
          <div className="keyboard-section">
            {!isSolved && (
              <>
                <div className="keyboard-grid">
                  {keyboardKeys.map((key) => (
                    <button
                      key={key.id}
                      className="keyboard-key"
                      disabled={key.isUsed || key.isHintRemoved}
                      onClick={() => handleKeyTap(key)}
                    >
                      {key.isHintRemoved ? '' : key.letter}
                    </button>
                  ))}
                </div>

                <button 
                  className="btn-help-link"
                  onClick={() => { synth.playTap(); tgHaptic.impact('light'); setIsHintModalOpen(true); }}
                >
                  Yordam qo'llash
                </button>
              </>
            )}

            {isSolved && (
              <div style={{ height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: 'var(--success)', fontWeight: '800', fontSize: '18px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Javob to'g'ri!
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hints Sheet Modal */}
      {isHintModalOpen && (
        <div className="modal-overlay" onClick={() => setIsHintModalOpen(false)}>
          <div className="modal-content pop-in" onClick={(e) => e.stopPropagation()}>
            <div className="header-bar" style={{ marginBottom: '16px', padding: 0 }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#111827' }}>YORDAM OLISH</h3>
              <div className="coins-badge">
                <Coins size={16} />
                <span>{coins}</span>
              </div>
            </div>

            <div className="hints-list">
              {/* Option 1: Reveal Letter */}
              <div 
                className={`hint-option-card ${coins < 20 ? 'disabled' : ''}`}
                onClick={handlePurchaseLetterHint}
              >
                <div className="hint-option-info">
                  <div className="hint-option-icon">
                    <HelpCircle size={18} />
                  </div>
                  <div className="hint-option-text-container">
                    <span className="hint-option-title">Harfni ochish</span>
                    <span className="hint-option-desc">To'g'ri harflardan birini joylashtiradi</span>
                  </div>
                </div>
                <div className="hint-option-cost">
                  <Coins size={12} />
                  <span>20</span>
                </div>
              </div>

              {/* Option 2: Remove Wrong Keys */}
              <div 
                className={`hint-option-card ${coins < 15 ? 'disabled' : ''}`}
                onClick={handlePurchaseRemoveHint}
              >
                <div className="hint-option-info">
                  <div className="hint-option-icon">
                    <RotateCcw size={18} />
                  </div>
                  <div className="hint-option-text-container">
                    <span className="hint-option-title">Harflarni o'chirish</span>
                    <span className="hint-option-desc">Klaviaturadan 3 ta ortiqcha harfni o'chiradi</span>
                  </div>
                </div>
                <div className="hint-option-cost">
                  <Coins size={12} />
                  <span>15</span>
                </div>
              </div>
            </div>

            <button className="btn-secondary" onClick={() => setIsHintModalOpen(false)}>
              Yopish
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
