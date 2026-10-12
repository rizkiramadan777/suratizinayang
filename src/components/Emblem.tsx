import React from 'react';

export default function Emblem({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md select-none"
      >
        <defs>
          {/* Rose Gold Gradient */}
          <linearGradient id="roseGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F472B6" />
            <stop offset="40%" stopColor="#FB7185" />
            <stop offset="70%" stopColor="#E11D48" />
            <stop offset="100%" stopColor="#BE123C" />
          </linearGradient>

          {/* Luxury Gold Accent Gradient */}
          <linearGradient id="goldAccent" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>

          {/* Soft Pink Inner Glow */}
          <radialGradient id="innerHeartGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF1F2" />
            <stop offset="70%" stopColor="#FFE4E6" />
            <stop offset="100%" stopColor="#FECDD3" />
          </radialGradient>

          {/* Ribbon Gradient */}
          <linearGradient id="bannerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFE4E6" />
            <stop offset="50%" stopColor="#FFF1F2" />
            <stop offset="100%" stopColor="#FFE4E6" />
          </linearGradient>
        </defs>

        {/* Outer Circular Laurel / Pearl Ring */}
        <circle cx="100" cy="100" r="92" stroke="url(#roseGoldGrad)" strokeWidth="2.5" strokeDasharray="3 3" opacity="0.6" />
        <circle cx="100" cy="100" r="86" stroke="url(#goldAccent)" strokeWidth="1" opacity="0.4" />

        {/* Laurel Wreath Leaves (Left & Right) */}
        <g fill="url(#goldAccent)" opacity="0.85">
          {/* Left Wreath Leaves */}
          <path d="M40 70 Q32 60 40 50 Q48 60 40 70 Z" />
          <path d="M30 92 Q22 82 30 72 Q38 82 30 92 Z" />
          <path d="M28 116 Q20 106 28 96 Q36 106 28 116 Z" />
          <path d="M36 138 Q30 128 40 120 Q44 130 36 138 Z" />

          {/* Right Wreath Leaves */}
          <path d="M160 70 Q168 60 160 50 Q152 60 160 70 Z" />
          <path d="M170 92 Q178 82 170 72 Q162 82 170 92 Z" />
          <path d="M172 116 Q180 106 172 96 Q164 106 172 116 Z" />
          <path d="M164 138 Q170 128 160 120 Q156 130 164 138 Z" />
        </g>

        {/* Royal Crown / Mahkota Cinta on Top */}
        <g fill="url(#goldAccent)">
          <path d="M78 40 L86 28 L100 36 L114 28 L122 40 L118 43 L82 43 Z" />
          <circle cx="86" cy="26" r="2.5" />
          <circle cx="100" cy="33" r="3" />
          <circle cx="114" cy="26" r="2.5" />
        </g>

        {/* Central Romantic Heart Crest */}
        <path
          d="M100 60 C80 34, 46 50, 46 80 C46 112, 85 138, 100 150 C115 138, 154 112, 154 80 C154 50, 120 34, 100 60 Z"
          fill="url(#innerHeartGlow)"
          stroke="url(#roseGoldGrad)"
          strokeWidth="3.5"
        />

        {/* Inner Heart Dashed Accent */}
        <path
          d="M100 67 C83 45, 54 58, 54 82 C54 108, 88 131, 100 142 C112 131, 146 108, 146 82 C146 58, 117 45, 100 67 Z"
          fill="none"
          stroke="url(#roseGoldGrad)"
          strokeWidth="1.2"
          strokeDasharray="4 2"
          opacity="0.7"
        />

        {/* ================= MONOGRAM "R & L" ================= */}
        {/* Letter 'R' */}
        <text
          x="77"
          y="106"
          textAnchor="middle"
          fontSize="42"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontWeight="bold"
          fontStyle="italic"
          fill="url(#roseGoldGrad)"
        >
          R
        </text>

        {/* Intertwined Heart Ampersand in the middle */}
        <path
          d="M100 87 C96 82, 90 84, 90 89 C90 94, 97 99, 100 102 C103 99, 110 94, 110 89 C110 84, 104 82, 100 87 Z"
          fill="url(#goldAccent)"
        />

        {/* Letter 'L' */}
        <text
          x="122"
          y="106"
          textAnchor="middle"
          fontSize="42"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontWeight="bold"
          fontStyle="italic"
          fill="url(#roseGoldGrad)"
        >
          L
        </text>

        {/* Ribbon Banner at Bottom: "RIZKI & LISA" */}
        <g>
          {/* Ribbon Tail Left & Right */}
          <path d="M38 152 L54 144 L54 162 L38 170 L44 161 Z" fill="#FDA4AF" stroke="#E11D48" strokeWidth="1" />
          <path d="M162 152 L146 144 L146 162 L162 170 L156 161 Z" fill="#FDA4AF" stroke="#E11D48" strokeWidth="1" />

          {/* Main Ribbon Body */}
          <path
            d="M48 146 C75 141, 125 141, 152 146 L148 165 C125 160, 75 160, 52 165 Z"
            fill="url(#bannerGrad)"
            stroke="url(#roseGoldGrad)"
            strokeWidth="1.8"
          />

          {/* Banner Text */}
          <text
            x="100"
            y="158"
            textAnchor="middle"
            fontSize="9.5"
            fontWeight="bold"
            fontFamily="Georgia, serif"
            letterSpacing="2"
            fill="#9F1239"
          >
            RIZKI &amp; LISA
          </text>
        </g>
      </svg>
    </div>
  );
}
