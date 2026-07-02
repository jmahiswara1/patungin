import { Reveal } from './Motion';
import { useReducedMotion } from 'motion/react';
import { UnderlineDoodle, ScribbleDoodle, StarburstDoodle } from './doodles';

const problems = [
  {
    num: '01',
    title: 'Hitung manual bikin pusing',
    desc: 'Makan bareng 4 orang, ada yang pesan mahal, ada yang cuma minum. Siapa bayar berapa? Hitung pakai kalkulator, sering salah.',
    align: 'justify-start',
  },
  {
    num: '02',
    title: 'Diskon & ongkir bikin bingung',
    desc: 'Ada diskon dari Shopee, ongkir GrabFood, pajak restoran. Dibagi rata? Nggak adil. Dibagi proporsional? Susah hitungnya.',
    align: 'justify-end md:text-right',
  },
  {
    num: '03',
    title: 'Nagih teman itu awkward',
    desc: 'Udah seminggu, belum pada bayar. Malu nagih, tapi butuh duitnya. Akhirnya nggak jadi nagih dan kamu yang rugi.',
    align: 'justify-start',
  },
];

export function ProblemSection() {
  const reduce = useReducedMotion();

  return (
    <section id="masalah" className="relative py-24 sm:py-32 bg-paper-soft overflow-hidden border-t border-ink/5">
      <div className="relative max-w-[1000px] mx-auto px-5 sm:px-8">
        
        <Reveal className="mb-10 sm:mb-14 text-center flex flex-col items-center">
          <div className="relative inline-block text-left">
            <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-display font-bold text-ink leading-[0.95] max-w-[600px] mx-auto text-center">
              Split bill seharusnya{' '}
              <span className="relative inline-block text-blue-dark">
                nggak sesulit ini
                <UnderlineDoodle className="absolute -bottom-1 left-0 w-full h-4 text-blue/40" />
              </span>
            </h2>
            <div className="absolute -top-6 -right-4 sm:-right-8">
              <ScribbleDoodle className={`w-16 h-6 sm:w-20 sm:h-8 text-ink/10 ${!reduce ? 'doodle-wiggle' : ''}`} animate={!reduce} />
            </div>
            <div className="absolute top-1/2 -left-12 sm:-left-20 transform -translate-y-1/2">
              <StarburstDoodle className={`w-12 h-12 text-ink/5 ${!reduce ? 'doodle-spin-slow' : ''}`} animate={!reduce} />
            </div>
          </div>
        </Reveal>

        <div className="space-y-16 sm:space-y-24">
          {problems.map((p, i) => (
            <div
              key={p.num}
              className={`problem-card flex w-full ${p.align} ${!reduce ? 'opacity-0 translate-y-10' : ''}`}
              style={!reduce ? { animation: `problemReveal 0.5s ease-out ${0.1 + i * 0.15}s forwards` } : undefined}
            >
              <div className={`relative max-w-[540px] flex flex-col ${p.align.includes('right') ? 'md:items-end' : p.align.includes('center') ? 'items-center' : 'items-start'}`}>
                
                {/* Giant Background Number — never animated */}
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[14rem] sm:text-[18rem] font-display font-bold leading-none pointer-events-none select-none -z-10"
                  style={{ color: 'rgba(15, 27, 45, 0.04)' }}
                >
                  {p.num}
                </div>
                
                <div className="relative z-10">
                  <h3 className="text-2xl sm:text-3xl font-display font-bold text-ink mb-2">{p.title}</h3>
                  <p className="text-ink-muted text-lg leading-relaxed">{p.desc}</p>
                </div>
                
                {i === 0 && (
                   <div className="absolute -bottom-8 -right-8 opacity-20 hidden sm:block">
                      <svg width="60" height="60" viewBox="0 0 100 100" fill="none">
                         <path d="M20 50 Q 50 10 80 50 T 140 50" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className={!reduce ? 'doodle-draw' : ''}/>
                      </svg>
                   </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
