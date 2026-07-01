import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Coins, 
  Lock, 
  Unlock, 
  RotateCcw, 
  HelpCircle,
  Settings
} from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from './firebase.js';
import { LogoSvg } from './LogoSvg.jsx';
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

const DEFAULT_COUNTRIES = [
  { id: 'uzbekistan', name: "O'zbekiston brendlari", code: 'uz', region: "O'RTA OSIYO" },
  { id: 'kazakhstan', name: "Qozog'iston brendlari", code: 'kz', region: "O'RTA OSIYO" },
  { id: 'kyrgyzstan', name: "Qirg'iziston brendlari", code: 'kg', region: "O'RTA OSIYO" },
  { id: 'tajikistan', name: "Tojikiston brendlari", code: 'tj', region: "O'RTA OSIYO" },
  { id: 'france', name: "Fransiya brendlari", code: 'fr', region: "EVROPA" },
  { id: 'germany', name: "Germaniya brendlari", code: 'de', region: "EVROPA" },
  { id: 'poland', name: "Polsha brendlari", code: 'pl', region: "EVROPA" },
  { id: 'turkey', name: "Turkiya brendlari", code: 'tr', region: "EVROPA" },
  { id: 'usa', name: "Amerika", code: 'us', region: "SHIMOLIY VA JANUBIY AMERIKA" },
  { id: 'canada', name: "Canada", code: 'ca', region: "SHIMOLIY VA JANUBIY AMERIKA" },
  { id: 'mexico', name: "Meksika", code: 'mx', region: "SHIMOLIY VA JANUBIY AMERIKA" },
  { id: 'argentina', name: "Argentina", code: 'ar', region: "SHIMOLIY VA JANUBIY AMERIKA" }
];

function App() {
  const [screen, setScreen] = useState('category');
  const [selectedCountry, setSelectedCountry] = useState('uzbekistan');
  
  const [customCountries, setCustomCountries] = useState([]);
  const [customLevels, setCustomLevels] = useState([]);
  const [isDbLoading, setIsDbLoading] = useState(true);

  // Firestore real-time listeners
  useEffect(() => {
    let levelsReady = false;
    let countriesReady = false;
    const checkDone = () => {
      if (levelsReady && countriesReady) setIsDbLoading(false);
    };

    const unsubLevels = onSnapshot(collection(db, 'levels'), (snap) => {
      const levels = snap.docs
        .map(d => d.data())
        .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
      setCustomLevels(levels);
      levelsReady = true;
      checkDone();
    });

    const unsubCountries = onSnapshot(collection(db, 'countries'), (snap) => {
      setCustomCountries(snap.docs.map(d => d.data()));
      countriesReady = true;
      checkDone();
    });

    return () => { unsubLevels(); unsubCountries(); };
  }, []);

  const allCountries = [...DEFAULT_COUNTRIES, ...customCountries];

  const countryNames = allCountries.reduce((acc, c) => ({ ...acc, [c.id]: c.name }), {});

  const unfilteredLevels = customLevels;
  const allLevels = unfilteredLevels.filter(lvl => (lvl.country || 'uzbekistan') === selectedCountry);

  const getCountryProgress = (countryId) => {
    const countryLevels = unfilteredLevels.filter(lvl => (lvl.country || 'uzbekistan') === countryId);
    if (countryLevels.length === 0) return { solved: 0, total: 0 };
    const solvedCount = countryLevels.filter(lvl => solvedLevels.includes(lvl.id)).length;
    return { solved: solvedCount, total: countryLevels.length };
  };
  
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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
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

  // Sync changes from other tabs (solved levels and coins only)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'logo_quiz_solved') {
        setSolvedLevels(e.newValue ? JSON.parse(e.newValue) : []);
      }
      if (e.key === 'logo_quiz_coins') {
        setCoins(e.newValue ? parseInt(e.newValue, 10) : 50);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
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
      } else if (screen === 'grid') {
        tg.BackButton.show();
        const handleBack = () => {
          synth.playTap();
          tgHaptic.impact('light');
          setScreen('category');
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
    const level = allLevels[index];
    if (!level) return;
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
    const isUnlocked = idx === 0 || solvedLevels.includes(allLevels[idx - 1].id);
    
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
    if (filledSlotsCount === allLevels[currentLevelIdx].answer.length) {
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
    const correct = allLevels[currentLevelIdx].answer.toUpperCase();

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
      if (!solvedLevels.includes(allLevels[currentLevelIdx].id)) {
        nextSolvedLevels = [...solvedLevels, allLevels[currentLevelIdx].id];
        setSolvedLevels(nextSolvedLevels);
        setCoins(prev => prev + 10);
      }

      // Automatically advance to the next level after 1.2 seconds
      setTimeout(() => {
        const nextIdx = currentLevelIdx + 1;
        if (nextIdx < allLevels.length) {
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

    const answer = allLevels[currentLevelIdx].answer.toUpperCase();
    
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

    const answer = allLevels[currentLevelIdx].answer.toUpperCase();
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

  const handleResetGame = () => {
    if (window.confirm("Haqiqatan ham o'yinni yangi holatda boshlamoqchimisiz? Barcha yutuqlaringiz va tangalaringiz o'chib ketadi!")) {
      setSolvedLevels([]);
      setCoins(50);
      setCurrentLevelIdx(0);
      localStorage.setItem('logo_quiz_solved', JSON.stringify([]));
      localStorage.setItem('logo_quiz_coins', '50');
      setIsSettingsOpen(false);
      synth.playTap();
      tgHaptic.impact('medium');
    }
  };

  if (isDbLoading) {
    return (
      <div className="game-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100dvh', background: 'var(--bg-primary)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏆</div>
          <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }}></div>
          <p style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '14px' }}>O'yin yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="game-container">


      {/* Screen 0: Country Category Screen */}
      {screen === 'category' && (
        <div className="category-screen pop-in">
          <div className="category-header-new">
            <h1 className="logo-text">Logoni-top</h1>
            <button className="settings-btn" onClick={() => { synth.playTap(); tgHaptic.impact('light'); setIsSettingsOpen(true); }}>
              <Settings size={22} />
            </button>
          </div>

          <div className="regions-list">
            {Object.entries(
              allCountries.reduce((acc, country) => {
                if (!acc[country.region]) {
                  acc[country.region] = [];
                }
                acc[country.region].push(country);
                return acc;
              }, {})
            ).map(([regionName, countries]) => (
              <div className="region-section" key={regionName}>
                <h3 className="region-title">{regionName}</h3>
                <div className="countries-list">
                  {countries.map((country) => {
                    const { solved, total } = getCountryProgress(country.id);
                    return (
                      <div 
                        key={country.id} 
                        className="country-item"
                        onClick={() => {
                          synth.playTap();
                          tgHaptic.impact('light');
                          setSelectedCountry(country.id);
                          setScreen('grid');
                        }}
                      >
                        <div className="country-info">
                          <div className="country-flag-box">
                            <img 
                              src={`https://flagcdn.com/w40/${country.code}.png`} 
                              alt={country.name} 
                              className="country-flag-img"
                            />
                          </div>
                          <span className="country-name">{country.name}</span>
                        </div>
                        <div className="country-stats">
                          {solved} / {total}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Screen 1: Levels Grid Screen */}
      {screen === 'grid' && (
        <div className="levels-screen pop-in">
          <div className="levels-header-bar">
            <h2 className="levels-title">{countryNames[selectedCountry] || "Brendlar"}</h2>
            <div className="levels-progress">
              {allLevels.filter(lvl => solvedLevels.includes(lvl.id)).length} / {allLevels.length}
            </div>
          </div>

          <div className="levels-grid">
            {allLevels.map((lvl, index) => {
              const isSolved = solvedLevels.includes(lvl.id);
              const isActive = index === 0 || solvedLevels.includes(allLevels[index - 1].id);
              const isLocked = !isSolved && !isActive;

              return (
                <div 
                  key={lvl.id}
                  className={`level-card ${isSolved ? 'solved' : ''} ${isActive && !isSolved ? 'active-unsolved' : ''} ${isLocked ? 'locked' : ''}`}
                  onClick={() => handleSelectLevel(index)}
                >
                  <div className="level-card-icon-container">
                    {isSolved ? (
                      lvl.isCustom ? (
                        <img 
                          src={lvl.imageFull} 
                          alt={lvl.name} 
                          className="custom-logo-grid-img" 
                        />
                      ) : (
                        <LogoSvg brandId={lvl.id} isSolved={true} />
                      )
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
                {currentLevelIdx + 1} / {allLevels.length}
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
                style={{ width: `${((currentLevelIdx + 1) / allLevels.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Logo Card */}
          <div className="logo-card-wrapper">
            <div className="logo-card">
              {allLevels[currentLevelIdx]?.isCustom ? (
                <img 
                  src={isSolved ? allLevels[currentLevelIdx].imageFull : allLevels[currentLevelIdx].imagePartial} 
                  alt={allLevels[currentLevelIdx].name} 
                  className="custom-logo-img"
                />
              ) : (
                <LogoSvg brandId={allLevels[currentLevelIdx]?.id} isSolved={isSolved} />
              )}
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
      {/* Settings Sheet Modal */}
      {isSettingsOpen && (
        <div className="modal-overlay" onClick={() => setIsSettingsOpen(false)}>
          <div className="modal-content pop-in" onClick={(e) => e.stopPropagation()}>
            <div className="header-bar" style={{ marginBottom: '20px', padding: 0 }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#111827' }}>SOZLAMALAR</h3>
            </div>

            <div className="hints-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {/* Option 1: Turn off/on sound */}
              <div 
                className="hint-option-card"
                onClick={toggleMute}
                style={{ cursor: 'pointer' }}
              >
                <div className="hint-option-info">
                  <div className="hint-option-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
                    {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </div>
                  <div className="hint-option-text-container">
                    <span className="hint-option-title">Ovozlar</span>
                    <span className="hint-option-desc">{muted ? "Hozir ovozlar o'chirilgan" : "Hozir ovozlar yoqilgan"}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: muted ? '#94a3b8' : '#10b981', background: muted ? '#f1f5f9' : '#ecfdf5', padding: '4px 10px', borderRadius: '20px' }}>
                    {muted ? "O'CHIK" : "YONIQ"}
                  </span>
                </div>
              </div>

              {/* Option 2: Reset game progress */}
              <div 
                className="hint-option-card"
                onClick={handleResetGame}
                style={{ cursor: 'pointer', border: '1px solid rgba(239, 68, 68, 0.2)' }}
              >
                <div className="hint-option-info">
                  <div className="hint-option-icon" style={{ background: '#fef2f2', color: '#ef4444' }}>
                    <RotateCcw size={18} />
                  </div>
                  <div className="hint-option-text-container">
                    <span className="hint-option-title" style={{ color: '#ef4444' }}>O'yinni yangilash</span>
                    <span className="hint-option-desc">Barcha natijalar va tangalarni 0 qiladi</span>
                  </div>
                </div>
              </div>
            </div>

            <button className="btn-secondary" onClick={() => setIsSettingsOpen(false)}>
              Yopish
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
