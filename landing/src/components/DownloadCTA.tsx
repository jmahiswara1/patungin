import { useRef, useEffect } from 'react';
import { Reveal } from './Motion';
import { useReducedMotion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { CircleDoodle, ArrowDoodle, StarburstDoodle, ScribbleDoodle, WavyArrowDoodle, UnderlineDoodle } from './doodles';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function DownloadCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !ref.current) return;
    
    const ctx = gsap.context(() => {
      // Find all doodles inside this section that have SVG paths
      const paths = gsap.utils.toArray<SVGPathElement>('.cta-doodle path');
      
      paths.forEach(path => {
         const length = path.getTotalLength();
         // Set initial state
         gsap.set(path, { 
            strokeDasharray: length, 
            strokeDashoffset: length,
            opacity: 1 
         });
         
         // Trigger animation on scroll
         ScrollTrigger.create({
            trigger: ref.current,
            start: "top 60%", // Start drawing when section is 60% in view
            onEnter: () => {
               gsap.to(path, {
                  strokeDashoffset: 0,
                  duration: 1.5,
                  ease: "power2.out",
                  stagger: 0.2
               });
            }
         });
      });
      
    }, ref);

    return () => ctx.revert();
  }, [reduce]);

  return (
    <section id="download" ref={ref} className="relative py-32 sm:py-40 bg-ink overflow-hidden border-t border-white/5">
      
      {/* Background decoration lines */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>
      
      <div className="relative max-w-[1000px] mx-auto px-5 sm:px-8 flex flex-col items-center text-center z-10">
        <Reveal>
          <div className="relative inline-block">
            <h2 className="text-[clamp(3rem,6vw,5.5rem)] font-display font-bold text-paper leading-[0.95] mb-3">
              Siap split bill{' '}
              <span className="relative inline-block text-blue">
                tanpa ribet?
                <div className="cta-doodle absolute -bottom-1 left-0 w-full h-4">
                  <UnderlineDoodle className="w-full h-full text-blue/60" animate={false} color="currentColor" />
                </div>
              </span>
            </h2>

            <div className="cta-doodle absolute -top-8 -left-8 sm:-left-16">
              <StarburstDoodle className={`w-14 h-14 sm:w-20 sm:h-20 text-paper/15 ${!reduce ? 'doodle-spin-slow' : ''}`} animate={false} color="currentColor" />
            </div>

            <div className="cta-doodle absolute -bottom-4 -right-6 sm:-right-12">
              <ScribbleDoodle className={`w-20 h-8 sm:w-24 sm:h-10 text-paper/10 ${!reduce ? 'doodle-wiggle' : ''}`} animate={false} color="currentColor" />
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="text-xl sm:text-2xl text-paper/60 leading-relaxed mb-8 max-w-[600px] font-script">
            Download Patungin sekarang. Gratis, nggak ada iklan aneh-aneh. Langsung pakai.
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <a
              href="#"
              className="btn-tactile inline-flex items-center justify-center gap-2 px-10 py-5 rounded-full bg-blue text-paper font-bold text-lg hover:bg-blue-dark transition-colors"
            >
              Download untuk iOS
              <ArrowRight size={20} />
            </a>
            <a
              href="#"
              className="btn-tactile inline-flex items-center justify-center gap-2 px-10 py-5 rounded-full bg-white/[0.05] text-paper font-bold text-lg border-2 border-paper/10 hover:bg-white/[0.1] transition-colors"
            >
              Download untuk Android
              <ArrowRight size={20} />
            </a>
          </div>
        </Reveal>

        {/* Ambient floating doodles around the edges */}
        <div className="cta-doodle absolute top-20 left-10 hidden lg:block">
          <CircleDoodle className={`w-24 h-24 text-paper/5 ${!reduce ? 'doodle-pulse' : ''}`} animate={false} color="currentColor" />
        </div>

        <div className="cta-doodle absolute bottom-20 right-10 hidden lg:block">
          <ArrowDoodle className={`w-12 h-16 text-paper/10 rotate-45 ${!reduce ? 'doodle-bounce' : ''}`} animate={false} color="currentColor" />
        </div>

        <div className="cta-doodle absolute top-1/2 -left-4 hidden lg:block">
          <WavyArrowDoodle className={`w-20 h-10 text-paper/5 ${!reduce ? 'doodle-float' : ''}`} animate={false} color="currentColor" />
        </div>
      </div>
    </section>
  );
}