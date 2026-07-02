import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const links = [
  { label: 'Fitur', href: '/#fitur' },
  { label: 'Cara Kerja', href: '/#cara-kerja' },
  { label: 'Harga', href: '/#harga' },
];

interface NavbarProps {
  transparent?: boolean;
}

export function Navbar({ transparent = true }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(!transparent);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!transparent) {
      setScrolled(true);
      return;
    }

    const sentinel = sentinelRef.current;
    if (sentinel) {
      const observer = new IntersectionObserver(
        ([entry]) => setScrolled(!entry.isIntersecting),
        { threshold: 0, rootMargin: '-20px 0px 0px 0px' }
      );
      observer.observe(sentinel);
      
      const ctx = gsap.context(() => {
         gsap.to(progressRef.current, {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
               trigger: document.body,
               start: "top top",
               end: "bottom bottom",
               scrub: 0.3
            }
         });
      });
      
      return () => {
         observer.disconnect();
         ctx.revert();
      };
    }
  }, [transparent]);

  return (
    <>
      {transparent && (
        <div ref={sentinelRef} className="absolute top-0 left-0 right-0 h-px" aria-hidden="true" />
      )}
      
      <div ref={progressRef} className="scroll-progress w-full scale-x-0" />
      
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-paper/85 backdrop-blur-xl'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-between h-[72px]">
            <Link to="/" className="text-3xl font-display font-bold text-ink tracking-tight" style={{ fontVariationSettings: '"opsz" 144' }}>
              patungin
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-[13px] font-medium text-ink-muted hover:text-ink transition-colors rounded-full hover:bg-ink/[0.04]"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-2.5">
              <a
                href="/#download"
                className="btn-tactile btn-blue inline-flex items-center px-5 py-2.5 rounded-full bg-blue text-paper text-[13px] font-semibold hover:bg-blue-dark transition-colors"
              >
                Download Gratis
              </a>
            </div>

            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 text-ink-muted hover:text-ink transition-colors"
              aria-label="Menu"
              aria-expanded={open}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
              className="md:hidden bg-paper border-t border-stroke overflow-hidden shadow-xl"
            >
              <div className="px-5 py-4 space-y-1">
                {links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 text-sm font-medium text-ink-muted hover:text-ink hover:bg-paper-soft rounded-lg transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="flex flex-col gap-2.5 pt-4 mt-2 border-t border-ink/5">
                  <a
                    href="/#download"
                    onClick={() => setOpen(false)}
                    className="w-full text-center px-5 py-3.5 rounded-full bg-blue text-paper text-sm font-semibold"
                  >
                    Download Gratis
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
