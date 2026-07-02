import { Reveal } from './Motion';
import { useReducedMotion } from 'motion/react';
import { Zap } from 'lucide-react';
import { StarburstDoodle, CheckmarkDoodle, ScribbleDoodle, UnderlineDoodle, CloudDoodle } from './doodles';

const plans = [
  {
    name: 'Gratis',
    price: 'Rp 0',
    period: 'selamanya',
    desc: 'Semua fitur inti untuk penggunaan sehari-hari.',
    features: [
      '3 grup patungan per bulan',
      '5 scan struk otomatis per bulan',
      'Input tagihan manual unlimited',
      'Share link tagihan ke teman',
      'Track status pembayaran',
    ],
    cta: 'Download Gratis',
    highlight: false,
  },
  {
    name: 'Premium',
    price: 'Rp 15.000',
    period: '/bulan',
    desc: 'Untuk kamu yang sering patungan tiap minggu.',
    features: [
      'Grup patungan unlimited',
      'Scan struk AI unlimited',
      'Statistik detail pengeluaran',
      'Multi-device sinkronisasi realtime',
      'Prioritas dukungan bantuan',
    ],
    cta: 'Upgrade ke Premium',
    highlight: true,
  },
];

export function Pricing() {
  const reduce = useReducedMotion();

  return (
    <section id="harga" className="relative py-24 sm:py-32 bg-paper-soft overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        
        <Reveal className="mb-10 sm:mb-14 flex flex-col items-center text-center">
          <div className="relative inline-block text-left">
            <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-display font-bold text-ink leading-[0.95] max-w-[500px]">
              <span className="relative inline-block text-blue-dark">
                Gratis
                <UnderlineDoodle className="absolute -bottom-1 left-0 w-full h-3 text-blue/40" />
              </span>{' '}
              untuk mulai
            </h2>
            <div className="absolute -top-4 -right-4 sm:-right-8">
              <ScribbleDoodle className={`w-16 h-6 sm:w-20 sm:h-8 text-ink/10 ${!reduce ? 'doodle-wiggle' : ''}`} animate={!reduce} />
            </div>
            <div className="absolute -bottom-6 -left-12 opacity-50 hidden sm:block">
              <CloudDoodle className={`w-20 h-10 text-ink/10 ${!reduce ? 'cloud-float' : ''}`} animate={!reduce} />
            </div>
          </div>
          <p className="mt-4 text-lg text-ink-muted max-w-[400px]">
            Langsung pakai fitur intinya tanpa harus langganan. Upgrade kapan aja kalau butuh.
          </p>
        </Reveal>

        {/* Equal-width pricing layout */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 max-w-[1000px] mx-auto items-stretch">
          
          {/* Free Plan */}
          <Reveal delay={0.1}>
            <div className="relative p-8 sm:p-12 rounded-[2.5rem] bg-paper border-2 border-ink/10 hover:border-ink/20 transition-all h-full flex flex-col">
              <div className="flex-1">
                <h3 className="text-xl font-display font-bold text-ink mb-2">{plans[0].name}</h3>
                <div className="mb-4">
                  <span className="text-[3.5rem] font-extrabold tracking-tight text-ink leading-none">{plans[0].price}</span>
                  <span className="text-base text-ink-muted ml-2">{plans[0].period}</span>
                </div>
                <p className="text-base text-ink-muted mb-6 max-w-[280px]">{plans[0].desc}</p>

                <ul className="space-y-3 mb-8">
                  {plans[0].features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-base text-ink">
                      <div className="mt-0.5">
                        <CheckmarkDoodle className="w-5 h-5 text-ink/40" animate={false} />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href="#download"
                className="btn-tactile w-full inline-flex justify-center py-4 rounded-full font-bold text-base bg-ink/5 text-ink hover:bg-ink/10 transition-colors border-2 border-transparent"
              >
                {plans[0].cta}
              </a>
            </div>
          </Reveal>

          {/* Premium Plan */}
          <Reveal delay={0.2}>
            <div className="relative p-8 sm:p-12 rounded-[2.5rem] bg-ink border-2 border-ink text-paper h-full flex flex-col overflow-hidden shadow-2xl">
              
              {/* Popular badge */}
              <div className="absolute top-8 right-8 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue text-paper text-[11px] font-bold tracking-wide">
                <Zap size={12} className="fill-paper" />
                POPULER
              </div>
              
              {/* Decorative doodle */}
              <StarburstDoodle className={`absolute -bottom-8 -right-8 w-40 h-40 text-blue/20 ${!reduce ? 'doodle-spin-slow' : ''}`} animate={!reduce} color="#1E4FD8" />

              <div className="flex-1 relative z-10">
                <h3 className="text-xl font-display font-bold text-paper mb-2">{plans[1].name}</h3>
                <div className="mb-4">
                  <span className="text-[3.5rem] font-extrabold tracking-tight text-paper leading-none">{plans[1].price}</span>
                  <span className="text-base text-paper/50 ml-2">{plans[1].period}</span>
                </div>
                <p className="text-base text-paper/60 mb-6 max-w-[280px]">{plans[1].desc}</p>

                <ul className="space-y-3 mb-8">
                  {plans[1].features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-base text-paper/90">
                      <div className="mt-0.5">
                        <CheckmarkDoodle className="w-5 h-5 text-blue" animate={false} color="#2F66F4" />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href="#download"
                className="btn-tactile btn-blue relative z-10 w-full inline-flex justify-center py-4 rounded-full font-bold text-base bg-blue text-paper hover:bg-blue-dark transition-colors"
              >
                {plans[1].cta}
              </a>
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
}