import { type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}

const playfulEase: [number, number, number, number] = [0.2, 0.9, 0.3, 1.05];

export function Reveal({ children, delay = 0, className = '', y = 24 }: RevealProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.35,
        delay,
        ease: playfulEase,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
}

export function Stagger({ children, className = '', stagger = 0.06 }: StaggerProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : 'hidden'}
      whileInView={reduce ? undefined : 'visible'}
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.35, ease: playfulEase },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
