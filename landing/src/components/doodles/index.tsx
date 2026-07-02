interface DoodleProps {
  className?: string;
  color?: string;
  animate?: boolean;
}

export function UnderlineDoodle({ className = '', color = '#0F1B2D', animate = true }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 200 12"
      fill="none"
      className={`inline-block ${className}`}
      aria-hidden="true"
    >
      <path
        d="M2 8 C20 4, 40 10, 60 6 C80 2, 100 9, 120 5 C140 1, 160 8, 198 4"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animate ? 'doodle-draw' : ''}
      />
    </svg>
  );
}

export function WavyUnderline({ className = '', color = '#2F66F4', animate = true }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 300 14"
      fill="none"
      className={`inline-block ${className}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M4 8 C40 2, 80 12, 120 6 C160 0, 200 12, 240 6 C270 2, 290 8, 296 5"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animate ? 'doodle-draw' : ''}
      />
    </svg>
  );
}

export function CircleDoodle({ className = '', color = '#0F1B2D', animate = true }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      className={`absolute ${className}`}
      aria-hidden="true"
    >
      <path
        d="M60 8 C85 6, 110 25, 112 55 C114 85, 90 112, 60 114 C30 116, 6 90, 4 60 C2 30, 25 10, 60 8"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animate ? 'doodle-draw' : ''}
      />
    </svg>
  );
}

export function ArrowDoodle({ className = '', color = '#0F1B2D', animate = true }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 60 80"
      fill="none"
      className={`inline-block ${className}`}
      aria-hidden="true"
    >
      <path
        d="M30 4 C30 4, 28 30, 30 50 C32 70, 30 75, 30 75"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animate ? 'doodle-draw' : ''}
      />
      <path
        d="M18 62 C18 62, 30 76, 42 62"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animate ? 'doodle-draw' : ''}
      />
    </svg>
  );
}

export function CurlyArrowDoodle({ className = '', color = '#0F1B2D', animate = true }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 120 60"
      fill="none"
      className={`inline-block ${className}`}
      aria-hidden="true"
    >
      <path
        d="M8 40 C24 16, 44 56, 64 30 C74 16, 82 24, 86 30"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animate ? 'doodle-draw' : ''}
      />
      <path
        d="M74 22 L88 30 L78 38"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animate ? 'doodle-draw' : ''}
      />
    </svg>
  );
}

export function StarburstDoodle({ className = '', color = '#0F1B2D', animate = true }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 60 60"
      fill="none"
      className={`inline-block ${className}`}
      aria-hidden="true"
    >
      <path
        d="M30 2 L33 18 L48 8 L38 22 L55 25 L40 30 L52 42 L36 35 L38 55 L30 40 L22 55 L24 35 L8 42 L20 30 L5 25 L22 22 L12 8 L27 18 Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animate ? 'doodle-draw' : ''}
      />
    </svg>
  );
}

export function SparkDoodle({ className = '', color = '#2F66F4', animate = true }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={`inline-block ${className}`}
      aria-hidden="true"
    >
      <path
        d="M24 4 C25 14, 27 17, 32 19 C27 21, 25 24, 24 34 C23 24, 21 21, 16 19 C21 17, 23 14, 24 4"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animate ? 'doodle-draw' : ''}
      />
      <path
        d="M38 30 C39 34, 40 35, 42 36 C40 37, 39 38, 38 42 C37 38, 36 37, 34 36 C36 35, 37 34, 38 30"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animate ? 'doodle-draw' : ''}
      />
    </svg>
  );
}

export function CloudDoodle({ className = '', color = '#0F1B2D', animate = true }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 120 70"
      fill="none"
      className={`inline-block ${className}`}
      aria-hidden="true"
    >
      <path
        d="M20 58 C8 58, 6 44, 16 40 C10 30, 22 22, 32 28 C36 16, 56 14, 60 26 C68 14, 86 18, 84 30 C96 30, 98 44, 92 50 C96 58, 84 62, 76 58 L20 58"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animate ? 'doodle-draw' : ''}
      />
    </svg>
  );
}

export function SquiggleLoopDoodle({ className = '', color = '#0F1B2D', animate = true }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 80 40"
      fill="none"
      className={`inline-block ${className}`}
      aria-hidden="true"
    >
      <path
        d="M6 28 C18 28, 18 12, 28 20 C38 28, 30 8, 44 16 C56 22, 54 8, 72 12"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animate ? 'doodle-draw' : ''}
      />
    </svg>
  );
}

export function DividerDoodle({ className = '', color = '#E2E5EE', animate = true }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 800 20"
      fill="none"
      className={`w-full ${className}`}
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <path
        d="M0 10 C50 6, 100 14, 150 10 C200 6, 250 14, 300 10 C350 6, 400 14, 450 10 C500 6, 550 14, 600 10 C650 6, 700 14, 750 10 C775 8, 790 10, 800 10"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animate ? 'doodle-draw' : ''}
      />
    </svg>
  );
}

export function ScribbleDoodle({ className = '', color = '#0F1B2D', animate = true }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 80 30"
      fill="none"
      className={`inline-block ${className}`}
      aria-hidden="true"
    >
      <path
        d="M5 15 L15 10 L25 18 L35 8 L45 20 L55 12 L65 22 L75 15"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animate ? 'doodle-draw' : ''}
      />
      <path
        d="M8 18 L18 13 L28 21 L38 11 L48 23 L58 15 L68 25 L72 18"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animate ? 'doodle-draw' : ''}
      />
    </svg>
  );
}

export function CheckmarkDoodle({ className = '', color = '#0F1B2D', animate = true }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      className={`inline-block ${className}`}
      aria-hidden="true"
    >
      <path
        d="M8 20 L16 28 L32 10"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animate ? 'doodle-draw' : ''}
      />
    </svg>
  );
}

export function DottedLineDoodle({ className = '', color = '#0F1B2D', animate = true }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 100 4"
      fill="none"
      className={`inline-block ${className}`}
      aria-hidden="true"
    >
      <circle cx="5" cy="2" r="2" fill={color} opacity={animate ? '0' : '1'} className={animate ? 'doodle-fade-in' : ''} />
      <circle cx="20" cy="2" r="2" fill={color} opacity={animate ? '0' : '1'} className={animate ? 'doodle-fade-in' : ''} style={{ animationDelay: '0.1s' }} />
      <circle cx="35" cy="2" r="2" fill={color} opacity={animate ? '0' : '1'} className={animate ? 'doodle-fade-in' : ''} style={{ animationDelay: '0.2s' }} />
      <circle cx="50" cy="2" r="2" fill={color} opacity={animate ? '0' : '1'} className={animate ? 'doodle-fade-in' : ''} style={{ animationDelay: '0.3s' }} />
      <circle cx="65" cy="2" r="2" fill={color} opacity={animate ? '0' : '1'} className={animate ? 'doodle-fade-in' : ''} style={{ animationDelay: '0.4s' }} />
      <circle cx="80" cy="2" r="2" fill={color} opacity={animate ? '0' : '1'} className={animate ? 'doodle-fade-in' : ''} style={{ animationDelay: '0.5s' }} />
      <circle cx="95" cy="2" r="2" fill={color} opacity={animate ? '0' : '1'} className={animate ? 'doodle-fade-in' : ''} style={{ animationDelay: '0.6s' }} />
    </svg>
  );
}

export function FrameDoodle({ className = '', color = '#0F1B2D', animate = true }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 200 150"
      fill="none"
      className={`inline-block ${className}`}
      aria-hidden="true"
    >
      <path
        d="M4 4 C4 2, 6 2, 8 4 L192 4 C194 2, 196 2, 196 4 L196 146 C198 146, 198 148, 196 148 L8 148 C6 148, 4 148, 4 146 Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animate ? 'doodle-draw' : ''}
      />
    </svg>
  );
}

export function QuoteDoodle({ className = '', color = '#0F1B2D', animate = true }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 60 45"
      fill="none"
      className={`inline-block ${className}`}
      aria-hidden="true"
    >
      <path
        d="M8 12 C8 8, 10 4, 15 4 C18 4, 20 6, 20 10 C20 14, 18 18, 14 22 L8 28"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animate ? 'doodle-draw' : ''}
      />
      <path
        d="M33 12 C33 8, 35 4, 40 4 C43 4, 45 6, 45 10 C45 14, 43 18, 39 22 L33 28"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animate ? 'doodle-draw' : ''}
      />
    </svg>
  );
}

export function WavyArrowDoodle({ className = '', color = '#0F1B2D', animate = true }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 120 60"
      fill="none"
      className={`inline-block ${className}`}
      aria-hidden="true"
    >
      <path
        d="M10 30 C30 20, 50 40, 70 28 C80 22, 90 30, 100 30"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animate ? 'doodle-draw' : ''}
      />
      <path
        d="M88 22 L100 30 L92 38"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animate ? 'doodle-draw' : ''}
      />
    </svg>
  );
}

export function AppPreviewTablet({ className = '', color = '#0F1B2D', animate = true }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 560 400"
      fill="none"
      className={`inline-block ${className}`}
      aria-hidden="true"
      role="img"
      aria-label="Preview aplikasi Patungin di tablet"
    >
      {/* Tablet frame */}
      <path
        d="M20 4 C22 2, 26 1, 30 1 L530 1 C534 1, 538 2, 540 4 L540 396 C540 398, 538 399, 536 399 L24 399 C22 399, 20 398, 20 396 Z"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animate ? 'doodle-draw' : ''}
      />
      {/* Camera dot */}
      <circle cx="280" cy="8" r="3" stroke={color} strokeWidth="1.5" className={animate ? 'doodle-draw' : ''} />
      {/* Home indicator bar */}
      <path d="M230 392 L330 392" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.4" className={animate ? 'doodle-draw' : ''} />

      {/* ── Screen content ── */}

      {/* Status bar */}
      <text x="38" y="32" fontSize="10" fontFamily="Caveat, cursive" fill={color} opacity="0.45" className={animate ? 'doodle-fade-in' : ''}>14:30</text>
      <path d="M510 28 L515 23 L520 28 L515 28 L515 23" stroke={color} strokeWidth="1.3" strokeLinecap="round" opacity="0.4" className={animate ? 'doodle-draw' : ''} />
      <rect x="524" y="23" width="8" height="5" rx="1" stroke={color} strokeWidth="1.3" opacity="0.4" className={animate ? 'doodle-draw' : ''} />

      {/* Header */}
      <text x="280" y="56" textAnchor="middle" fontSize="15" fontFamily="Caveat, cursive" fontWeight="600" fill={color} className={animate ? 'doodle-fade-in' : ''}>Detail Tagihan</text>
      <path d="M36 52 L48 52" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.45" className={animate ? 'doodle-draw' : ''} />
      <path d="M36 52 L42 47" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.45" className={animate ? 'doodle-draw' : ''} />
      <path d="M36 52 L42 57" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.45" className={animate ? 'doodle-draw' : ''} />
      <path d="M512 50 L522 50" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.35" className={animate ? 'doodle-draw' : ''} />
      <path d="M515 47 L519 50 L515 53" stroke={color} strokeWidth="1.8" strokeLinecap="round" opacity="0.35" className={animate ? 'doodle-draw' : ''} />
      <path d="M44 65 L516 65" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.15" className={animate ? 'doodle-draw' : ''} />

      {/* Receipt scan card */}
      <path
        d="M44 75 C44 73, 46 72, 48 72 L512 72 C514 72, 516 73, 516 75 L516 138 C516 140, 514 141, 512 141 L48 141 C46 141, 44 140, 44 138 Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="6 4"
        opacity="0.4"
        className={animate ? 'doodle-draw' : ''}
      />
      {/* Camera icon */}
      <path d="M265 96 C265 93, 267 91, 270 91 L290 91 C293 91, 295 93, 295 96 L295 112 C295 115, 293 117, 290 117 L270 117 C267 117, 265 115, 265 112 Z" stroke={color} strokeWidth="1.8" strokeLinecap="round" opacity="0.45" className={animate ? 'doodle-draw' : ''} />
      <circle cx="280" cy="104" r="6" stroke={color} strokeWidth="1.8" opacity="0.45" className={animate ? 'doodle-draw' : ''} />
      <path d="M272 91 L275 87 L285 87 L288 91" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.35" className={animate ? 'doodle-draw' : ''} />
      <text x="280" y="133" textAnchor="middle" fontSize="11" fontFamily="Caveat, cursive" fill={color} opacity="0.4" className={animate ? 'doodle-fade-in' : ''}>Foto Struk untuk Scan</text>

      {/* Group title */}
      <text x="44" y="164" fontSize="13" fontFamily="Caveat, cursive" fontWeight="600" fill={color} opacity="0.85" className={animate ? 'doodle-fade-in' : ''}>Makan Bakso Pak Jenggot</text>
      <text x="44" y="178" fontSize="10" fontFamily="Caveat, cursive" fill={color} opacity="0.4" className={animate ? 'doodle-fade-in' : ''}>4 orang · 12 item · 28 Jun 2026</text>

      {/* Column headers */}
      <text x="68" y="200" fontSize="9" fontFamily="Caveat, cursive" fill={color} opacity="0.35" className={animate ? 'doodle-fade-in' : ''}>Anggota</text>
      <text x="430" y="200" fontSize="9" fontFamily="Caveat, cursive" fill={color} opacity="0.35" textAnchor="end" className={animate ? 'doodle-fade-in' : ''}>Tagihan</text>
      <text x="516" y="200" fontSize="9" fontFamily="Caveat, cursive" fill={color} opacity="0.35" textAnchor="end" className={animate ? 'doodle-fade-in' : ''}>Status</text>
      <path d="M44 206 L516 206" stroke={color} strokeWidth="0.8" strokeLinecap="round" opacity="0.15" className={animate ? 'doodle-draw' : ''} />

      {/* ── Member rows ── */}
      {/* Rina */}
      <circle cx="56" cy="224" r="10" stroke={color} strokeWidth="1.6" opacity="0.5" className={animate ? 'doodle-draw' : ''} />
      <text x="56" y="228" textAnchor="middle" fontSize="11" fontFamily="Caveat, cursive" fontWeight="600" fill={color} opacity="0.6">R</text>
      <text x="74" y="222" fontSize="11.5" fontFamily="Caveat, cursive" fontWeight="600" fill={color} opacity="0.75" className={animate ? 'doodle-fade-in' : ''}>Rina Mahardika</text>
      <text x="74" y="235" fontSize="9.5" fontFamily="Caveat, cursive" fill={color} opacity="0.38" className={animate ? 'doodle-fade-in' : ''}>3 item</text>
      <text x="468" y="229" textAnchor="end" fontSize="12" fontFamily="Caveat, cursive" fontWeight="600" fill={color} opacity="0.8" className={animate ? 'doodle-fade-in' : ''}>Rp 42.500</text>
      {/* Paid checkmark */}
      <path d="M500 220 L505 225 L514 216" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={animate ? 'doodle-draw' : ''} />
      <path d="M44 243 L516 243" stroke={color} strokeWidth="0.6" strokeLinecap="round" opacity="0.1" className={animate ? 'doodle-draw' : ''} />

      {/* Budi */}
      <circle cx="56" cy="261" r="10" stroke={color} strokeWidth="1.6" opacity="0.5" className={animate ? 'doodle-draw' : ''} />
      <text x="56" y="265" textAnchor="middle" fontSize="11" fontFamily="Caveat, cursive" fontWeight="600" fill={color} opacity="0.6">B</text>
      <text x="74" y="259" fontSize="11.5" fontFamily="Caveat, cursive" fontWeight="600" fill={color} opacity="0.75" className={animate ? 'doodle-fade-in' : ''}>Budi Santoso</text>
      <text x="74" y="272" fontSize="9.5" fontFamily="Caveat, cursive" fill={color} opacity="0.38" className={animate ? 'doodle-fade-in' : ''}>4 item</text>
      <text x="468" y="266" textAnchor="end" fontSize="12" fontFamily="Caveat, cursive" fontWeight="600" fill={color} opacity="0.8" className={animate ? 'doodle-fade-in' : ''}>Rp 38.750</text>
      {/* Unpaid dash */}
      <path d="M505 257 L511 257" stroke="#ef4444" strokeWidth="2.2" strokeLinecap="round" className={animate ? 'doodle-draw' : ''} />
      <path d="M44 280 L516 280" stroke={color} strokeWidth="0.6" strokeLinecap="round" opacity="0.1" className={animate ? 'doodle-draw' : ''} />

      {/* Sari */}
      <circle cx="56" cy="298" r="10" stroke={color} strokeWidth="1.6" opacity="0.5" className={animate ? 'doodle-draw' : ''} />
      <text x="56" y="302" textAnchor="middle" fontSize="11" fontFamily="Caveat, cursive" fontWeight="600" fill={color} opacity="0.6">S</text>
      <text x="74" y="296" fontSize="11.5" fontFamily="Caveat, cursive" fontWeight="600" fill={color} opacity="0.75" className={animate ? 'doodle-fade-in' : ''}>Sari Dewi</text>
      <text x="74" y="309" fontSize="9.5" fontFamily="Caveat, cursive" fill={color} opacity="0.38" className={animate ? 'doodle-fade-in' : ''}>2 item</text>
      <text x="468" y="303" textAnchor="end" fontSize="12" fontFamily="Caveat, cursive" fontWeight="600" fill={color} opacity="0.8" className={animate ? 'doodle-fade-in' : ''}>Rp 31.250</text>
      {/* Paid checkmark */}
      <path d="M500 294 L505 299 L514 290" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={animate ? 'doodle-draw' : ''} />
      <path d="M44 317 L516 317" stroke={color} strokeWidth="0.6" strokeLinecap="round" opacity="0.1" className={animate ? 'doodle-draw' : ''} />

      {/* Dimas */}
      <circle cx="56" cy="335" r="10" stroke={color} strokeWidth="1.6" opacity="0.5" className={animate ? 'doodle-draw' : ''} />
      <text x="56" y="339" textAnchor="middle" fontSize="11" fontFamily="Caveat, cursive" fontWeight="600" fill={color} opacity="0.6">D</text>
      <text x="74" y="333" fontSize="11.5" fontFamily="Caveat, cursive" fontWeight="600" fill={color} opacity="0.75" className={animate ? 'doodle-fade-in' : ''}>Dimas Prayoga</text>
      <text x="74" y="346" fontSize="9.5" fontFamily="Caveat, cursive" fill={color} opacity="0.38" className={animate ? 'doodle-fade-in' : ''}>3 item</text>
      <text x="468" y="340" textAnchor="end" fontSize="12" fontFamily="Caveat, cursive" fontWeight="600" fill={color} opacity="0.8" className={animate ? 'doodle-fade-in' : ''}>Rp 37.500</text>
      {/* Unpaid dash */}
      <path d="M505 331 L511 331" stroke="#ef4444" strokeWidth="2.2" strokeLinecap="round" className={animate ? 'doodle-draw' : ''} />

      {/* Total divider */}
      <path d="M44 358 L516 358" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.2" className={animate ? 'doodle-draw' : ''} />

      {/* Total row */}
      <text x="44" y="376" fontSize="11" fontFamily="Caveat, cursive" fill={color} opacity="0.5" className={animate ? 'doodle-fade-in' : ''}>Total</text>
      <text x="468" y="376" textAnchor="end" fontSize="14" fontFamily="Caveat, cursive" fontWeight="700" fill="#2F66F4" className={animate ? 'doodle-fade-in' : ''}>Rp 150.000</text>

      {/* CTA button */}
      <path
        d="M160 384 C160 382, 162 381, 164 381 L396 381 C398 381, 400 382, 400 384 L400 395 C400 397, 398 398, 396 398 L164 398 C162 398, 160 397, 160 395 Z"
        fill="#2F66F4"
        opacity="0.85"
        className={animate ? 'doodle-fade-in' : ''}
      />
      <text x="280" y="393" textAnchor="middle" fontSize="10.5" fontFamily="Caveat, cursive" fontWeight="600" fill="#FFFFFF" className={animate ? 'doodle-fade-in' : ''}>Kirim Tagihan via Link</text>
    </svg>
  );
}
