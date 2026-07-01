import React from 'react';

// SVG Brands Component (15 Brands)
export const LogoSvg = ({ brandId, isSolved }) => {
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
