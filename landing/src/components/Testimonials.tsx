import { Reveal } from './Motion';
import { useReducedMotion } from 'motion/react';
import { QuoteDoodle, StarburstDoodle, ScribbleDoodle, UnderlineDoodle } from './doodles';

const featured = {
  name: 'Rina Mahardika',
  role: 'Mahasiswi UI',
  text: 'Akhirnya nggak perlu ribet hitung manual lagi. Makan bareng temen kos tinggal foto struk, split bill langsung jadi.',
};

const testimonials = [
  {
    name: 'Budi Santoso',
    role: 'Karyawan Startup',
    text: 'Tim gw sering banget makan bareng, males hitung split bill. Patungin solve masalah itu dalam 2 menit.',
  },
  {
    name: 'Sari Dewi',
    role: 'Anak Kos',
    text: 'Fitur scan screenshot Shopee game changer. Tinggal upload, langsung keluar semua itemnya.',
  },
  {
    name: 'Dimas Prayoga',
    role: 'Mahasiswa ITB',
    text: 'Paling suka fitur track pembayaran. Kirim link ke temen, mereka langsung lihat dan konfirmasi.',
  },
  {
    name: 'Kevin L',
    role: 'Ketua BEM',
    text: 'Sangat ngebantu untuk acara kepanitiaan kalau beli logistik bareng. Gak ada lagi cerita nombokin.',
  },
  {
    name: 'Amanda',
    role: 'Event Organizer',
    text: 'Semua struk langsung ke-scan dengan benar. UI-nya juga clean banget, nggak bingung pakenya.',
  },
];

export function Testimonials() {
  const reduce = useReducedMotion();

  // Duplicate for seamless marquee
  const marqueeItems = [...testimonials, ...testimonials];

  return (
    <section className="relative py-24 sm:py-32 bg-paper-soft overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        
        <Reveal className="mb-8 sm:mb-10">
          <div className="relative">
            <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-display font-bold text-ink leading-[0.95] max-w-[500px]">
              Dipakai mahasiswa &{' '}
              <span className="relative inline-block text-blue-dark">
                anak kos
                <UnderlineDoodle className="absolute -bottom-1 left-0 w-full h-3 text-blue/40" />
              </span>
            </h2>
            <div className="absolute -top-4 -right-4 sm:-right-8">
              <ScribbleDoodle className={`w-16 h-6 sm:w-20 sm:h-8 text-ink/10 ${!reduce ? 'doodle-wiggle' : ''}`} animate={!reduce} />
            </div>
          </div>
        </Reveal>

        {/* Featured Testimonial (Giant Card) */}
        <Reveal>
          <div className="group relative p-10 sm:p-14 md:p-20 rounded-[2.5rem] bg-ink text-paper flex flex-col justify-between border-2 border-ink/10 overflow-hidden mb-8 sm:mb-12">
            
            <div className="relative z-10 max-w-[720px]">
               <QuoteDoodle className={`w-16 h-12 text-blue-dark mb-8 ${!reduce ? 'doodle-float' : ''}`} animate={!reduce} color="#1E4FD8" />
               <p className="text-[clamp(1.75rem,4vw,2.5rem)] font-display font-bold leading-tight mb-8">
                 &ldquo;{featured.text}&rdquo;
               </p>
               
               <div className="flex items-center gap-4">
                 <div className="w-14 h-14 rounded-full border-2 border-paper/20 bg-paper/5 flex items-center justify-center text-paper text-xl font-bold font-script">
                   {featured.name[0]}
                 </div>
                 <div>
                   <p className="font-bold text-paper text-lg">{featured.name}</p>
                   <p className="text-paper/60 text-sm">{featured.role}</p>
                 </div>
               </div>
            </div>
            
            <StarburstDoodle className={`absolute -bottom-12 -right-12 w-64 h-64 text-paper/5 ${!reduce ? 'doodle-spin-slow' : ''}`} animate={!reduce} color="currentColor" />
          </div>
        </Reveal>
      </div>

      {/* Horizontal Marquee for smaller testimonials */}
      <div className="w-full overflow-hidden mt-6 flex relative">
         {/* Fade edges */}
         <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-paper-soft to-transparent z-10 pointer-events-none"></div>
         <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-paper-soft to-transparent z-10 pointer-events-none"></div>
         
         <div className={`marquee-track gap-4 sm:gap-6 px-4 ${reduce ? 'animation-none overflow-x-auto snap-x' : ''}`}>
            {marqueeItems.map((t, i) => (
              <div 
                key={`${t.name}-${i}`} 
                className="w-[320px] sm:w-[380px] p-8 rounded-3xl bg-paper border-2 border-ink/5 hover:border-ink/15 transition-colors flex-shrink-0 flex flex-col justify-between"
              >
                <QuoteDoodle className="w-8 h-6 text-ink/10 mb-4" animate={false} />
                <p className="text-ink-muted text-base leading-relaxed mb-8 flex-1">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3 mt-auto">
                  <div className="w-10 h-10 rounded-full border border-ink/10 bg-surface flex items-center justify-center text-ink text-sm font-bold font-script">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-ink text-sm">{t.name}</p>
                    <p className="text-ink-faint text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
         </div>
      </div>
    </section>
  );
}