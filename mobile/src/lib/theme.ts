export const colors = {
  ink: "#0F1B2D",
  inkSoft: "#1A2440",
  inkMuted: "#4A5468",
  inkFaint: "#8590A6",
  paper: "#FFFFFF",
  paperSoft: "#F4F6FB",
  stroke: "#E2E5EE",
  blue: "#2F66F4",
  blueDark: "#1E4FD8",
  blueSoft: "#E6EEFF",
  green: "#22c55e",
  red: "#ef4444",
} as const;

export const fonts = {
  body: "Geist",
  display: "Fraunces",
  script: "Caveat",
} as const;

export const animation = {
  doodleDraw: { duration: 600 },
  doodleFadeIn: { duration: 400 },
  doodleWiggle: { duration: 3000 },
  doodleFloat: { duration: 4000 },
  doodleBounce: { duration: 2500 },
  doodleSpinSlow: { duration: 12000 },
  doodlePulse: { duration: 2000 },
  revealDuration: 350,
  staggerDelay: 60,
  playfulEase: [0.2, 0.9, 0.3, 1.05] as const,
} as const;

export function formatCurrency(amount: number): string {
  return `Rp${amount.toLocaleString("id-ID")}`;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}
