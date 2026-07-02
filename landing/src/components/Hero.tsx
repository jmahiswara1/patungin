import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { CloudDoodle, WavyUnderline, SquiggleLoopDoodle, CurlyArrowDoodle } from './doodles';

const playfulEase: [number, number, number, number] = [0.2, 0.9, 0.3, 1.05];

export function Hero() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  
  // Parallax tiers
  const yClouds = useTransform(scrollY, [0, 1000], [0, reduce ? 0 : -80]);
  const yDoodles = useTransform(scrollY, [0, 1000], [0, reduce ? 0 : 50]);
  const yMockup = useTransform(scrollY, [0, 1000], [0, reduce ? 0 : -30]);

  return (
    <section className="relative h-[100dvh] pt-24 pb-12 overflow-hidden flex items-center">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 w-full relative z-10 h-full flex flex-col justify-center">
        
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-8 items-center h-full">
          
          {/* Left: Content (Left aligned) */}
          <div className="relative z-20 flex flex-col items-start text-left max-w-[600px] mx-auto lg:mx-0">
            <div className="relative">
              <motion.div
                style={{ y: yClouds }}
                className="absolute -top-12 -left-16 pointer-events-none hidden sm:block"
                aria-hidden="true"
              >
                <CloudDoodle className={`w-32 h-16 text-ink/5 ${!reduce ? 'cloud-float' : ''}`} animate={!reduce} />
              </motion.div>

              <motion.h1
                initial={reduce ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.1, ease: playfulEase }}
                className="relative text-[clamp(2.75rem,7vw,5rem)] font-display font-medium leading-[1.1] text-ink tracking-[-0.02em]"
                style={{ fontVariationSettings: '"opsz" 144' }}
              >
                Split bill{' '}
                <span className="relative inline-block text-blue-dark">
                  gampang,
                  <WavyUnderline
                    className="absolute -bottom-1 left-0 w-full h-4 text-blue/40"
                    animate={!reduce}
                  />
                </span>
                <br />
                tanpa ribet.
              </motion.h1>
            </div>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.25, ease: playfulEase }}
              className="relative mt-6 mb-10 max-w-[480px]"
            >
              <p className="text-lg sm:text-xl text-ink-muted leading-relaxed">
                Scan struk, hitung otomatis, selesai. Patungin bikin patungan
                jadi mudah untuk makan bareng atau belanja bareng.
              </p>
              
              <motion.div style={{ y: yDoodles }} className="absolute -right-8 -top-4 hidden sm:block">
                <SquiggleLoopDoodle
                  className={`w-10 h-6 text-blue/30 ${!reduce ? 'doodle-wiggle' : ''}`}
                  animate={!reduce}
                />
              </motion.div>
            </motion.div>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.35, ease: playfulEase }}
              className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto"
            >
              <motion.a
                href="#download"
                whileTap={reduce ? undefined : { scale: 0.97 }}
                className="btn-tactile w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-blue text-paper font-bold text-base hover:bg-blue-dark transition-colors"
              >
                Download Gratis
                <ArrowRight size={18} />
              </motion.a>
              <motion.a
                href="#cara-kerja"
                whileTap={reduce ? undefined : { scale: 0.97 }}
                className="btn-tactile w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full bg-transparent text-ink font-bold text-base border-2 border-ink/15 hover:border-ink/40 transition-colors"
              >
                Lihat Cara Kerja
              </motion.a>
            </motion.div>
          </div>

          {/* Right: Dynamic App Mockup */}
          <motion.div
            style={{ y: yMockup }}
            initial={reduce ? false : { opacity: 0, x: 40, rotate: 0 }}
            animate={{ opacity: 1, x: 0, rotate: 2 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[500px] mx-auto lg:mx-0 lg:ml-auto h-[400px] sm:h-[500px] flex items-center justify-center"
          >
            {/* Background blob for depth */}
            <div className="absolute inset-0 bg-blue-soft/50 rounded-full blur-3xl transform -scale-y-100 opacity-60"></div>
            
            <motion.div style={{ y: yClouds }} className="absolute top-10 right-0 pointer-events-none hidden sm:block">
              <CloudDoodle className={`w-24 h-12 text-ink/5 ${!reduce ? 'cloud-float-slow' : ''}`} animate={!reduce} />
            </motion.div>
            
            {/* The Floating UI Cards */}
            <div className="relative w-full max-w-[420px] h-[400px]">
              
              {/* Back Card: Receipt Scan */}
              <div className="absolute top-4 left-0 w-[85%] h-[280px] bg-paper rounded-[2rem] border border-ink/10 shadow-sm p-6 transform -rotate-6 origin-bottom-left flex flex-col opacity-80 backdrop-blur-sm">
                <div className="w-2/5 h-3 bg-ink/10 rounded-full mb-6"></div>
                <div className="flex-1 border-2 border-dashed border-ink/15 rounded-xl flex items-center justify-center relative overflow-hidden bg-ink/[0.02]">
                   <div className="w-12 h-12 rounded-full border border-ink/10 flex items-center justify-center bg-paper shadow-sm">
                     <div className="w-4 h-4 bg-ink/10 rounded-full"></div>
                   </div>
                </div>
              </div>

              {/* Middle Card: Main Bill */}
              <div className="absolute top-16 right-0 w-[90%] h-[300px] bg-paper rounded-[2rem] border border-ink/10 shadow-2xl p-6 md:p-8 transform rotate-3 origin-bottom-right flex flex-col z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded-full bg-ink/5 border border-ink/5 flex items-center justify-center text-ink/40 font-bold font-script text-xl">
                    M
                  </div>
                  <div className="w-24 h-3 bg-ink/10 rounded-full"></div>
                </div>
                
                <h3 className="font-script text-3xl md:text-4xl font-bold text-ink mb-1">Makan Bakso</h3>
                <p className="font-sans text-sm md:text-base text-ink-muted mb-6 font-medium">3 orang · Rp 120.000</p>
                
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-ink/5 flex items-center justify-center text-ink/40 font-bold font-script text-lg md:text-xl">{i}</div>
                        <div className="w-24 md:w-32 h-2.5 bg-ink/10 rounded-full"></div>
                      </div>
                      <div className="w-16 md:w-20 h-2.5 bg-ink/15 rounded-full"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Front Card: Notification/Status */}
              <motion.div 
                initial={reduce ? false : { opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9, type: 'spring', stiffness: 200, damping: 20 }}
                className="absolute -bottom-6 -left-4 sm:left-4 right-4 sm:right-auto sm:w-[360px] bg-ink rounded-[1.5rem] shadow-2xl p-4 sm:p-5 flex items-center gap-4 z-20 border border-ink-soft"
              >
                <div className="w-12 h-12 rounded-full bg-paper/10 flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                  <div className="absolute inset-0 border-2 border-[#4ade80] rounded-full scale-[0.85]"></div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <div className="flex-1 pt-0.5">
                  <p className="text-paper font-bold text-sm sm:text-base mb-1">Semua lunas!</p>
                  <p className="text-paper/60 text-xs sm:text-sm">Uang sudah masuk ke rekening</p>
                </div>
                
                <CurlyArrowDoodle className="absolute -top-10 -right-4 w-12 h-12 text-ink/20 rotate-[140deg]" animate={false} />
              </motion.div>
              
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}