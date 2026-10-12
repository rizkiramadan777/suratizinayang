import React from 'react';

export default function Emblem({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
      >
        <defs>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>
          <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#B91C1C" />
          </linearGradient>
          <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF3C7" />
            <stop offset="100%" stopColor="#FDE68A" />
          </linearGradient>
        </defs>

        {/* Outer Circular Halo */}
        <circle cx="80" cy="80" r="74" stroke="url(#goldGrad)" strokeWidth="3" strokeDasharray="4 2" opacity="0.8" />
        <circle cx="80" cy="80" r="69" stroke="#92400E" strokeWidth="1" opacity="0.5" />

        {/* Wings - Left & Right */}
        <g fill="url(#goldGrad)">
          {/* Left Wing Feathers */}
          <path d="M78 50 C50 35, 20 45, 12 75 C18 73, 26 73, 34 76 C20 83, 16 95, 22 105 C30 100, 42 98, 52 102 C42 108, 40 118, 48 122 C58 116, 68 108, 76 96 Z" />
          {/* Right Wing Feathers */}
          <path d="M82 50 C110 35, 140 45, 148 75 C142 73, 134 73, 126 76 C140 83, 144 95, 138 105 C130 100, 118 98, 108 102 C118 108, 120 118, 112 122 C102 116, 92 108, 84 96 Z" />
        </g>

        {/* Central Shield */}
        <path
          d="M80 32 L106 48 C106 82, 94 108, 80 120 C66 108, 54 82, 54 48 Z"
          fill="#FFFBEB"
          stroke="url(#goldGrad)"
          strokeWidth="3.5"
        />

        {/* Shield Internal Border */}
        <path
          d="M80 38 L101 52 C101 80, 91 102, 80 113 C69 102, 59 80, 59 52 Z"
          fill="none"
          stroke="#F59E0B"
          strokeWidth="1.2"
        />

        {/* Glowing Heart inside Shield */}
        <path
          d="M80 62 C74 52, 63 54, 63 65 C63 76, 73 85, 80 92 C87 85, 97 76, 97 65 C97 54, 86 52, 80 62 Z"
          fill="url(#heartGrad)"
        />

        {/* Little Star at the Crown */}
        <polygon
          points="80,18 83,26 91,26 84,31 87,39 80,34 73,39 76,31 69,26 77,26"
          fill="url(#goldGrad)"
        />

        {/* Bottom Banner Ribbon */}
        <path
          d="M26 132 L50 126 L80 130 L110 126 L134 132 L128 142 L110 138 L80 142 L50 138 L32 142 Z"
          fill="url(#ribbonGrad)"
          stroke="#B45309"
          strokeWidth="1.5"
        />

        <text
          x="80"
          y="136"
          textAnchor="middle"
          fontSize="6.5"
          fontWeight="900"
          letterSpacing="0.8"
          fill="#92400E"
          fontFamily="serif"
        >
          KASIH SAYANG & SEPATU FUTSAL
        </text>
      </svg>
    </div>
  );
}
