import { Reveal, Stagger, StaggerItem } from './Motion';
import { Scan, Calculator, Link, TrendingUp, CircleDollarSign } from 'lucide-react';
import { UnderlineDoodle } from './doodles';

const features = [
  {
    icon: Scan,
    title: 'Scan Struk AI',
    desc: 'Foto struk atau screenshot order online. AI langsung detect semua item dan harga.',
  },
  {
    icon: Calculator,
    title: 'Hitung Otomatis',
    desc: 'Diskon proporsional, ongkir rata atau per item. Pembulatan otomatis.',
  },
  {
    icon: Link,
    title: 'Share Link',
    desc: 'Kirim link tagihan. Temen bisa buka tanpa install app.',
  },
  {
    icon: TrendingUp,
    title: 'Track Real-time',
    desc: 'Langsung ketahuan siapa yang udah lunas dan siapa yang belum.',
  },
  {
    icon: CircleDollarSign,
    title: 'Multi Platform',
    desc: 'ShopeeFood, GrabFood, GoFood, atau input manual biasa.',
  },
];

export function Features() {
  return (
    <section id="fitur" className="relative py-20 sm:py-28 bg-paper overflow-hidden">
      <div className="max-w-[900px] mx-auto px-5 sm:px-8">
        
        <Reveal className="mb-4 sm:mb-6">
          <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-display font-bold text-ink leading-[0.95] max-w-[400px]">
            Semua yang kamu{' '}
            <span className="relative inline-block text-blue-dark">
              butuhkan
              <UnderlineDoodle className="absolute -bottom-1 left-0 w-full h-3 text-blue/40" />
            </span>
          </h2>
          <p className="mt-2 text-ink-muted text-base max-w-[340px]">
            Nggak perlu kalkulator, nggak perlu debat panjang.
          </p>
        </Reveal>

        <Stagger stagger={0.06}>
          {features.map((f, i) => (
            <StaggerItem key={i}>
              <div className={`group flex items-start gap-5 sm:gap-8 py-6 ${
                i < features.length - 1 ? 'border-b border-ink/8' : ''
              }`}>
                
                {/* Number */}
                <span className="hidden sm:block font-script text-3xl text-ink/20 w-10 shrink-0 pt-1">
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Icon */}
                <div className="shrink-0 w-10 h-10 rounded-lg bg-paper-soft border border-ink/6 flex items-center justify-center group-hover:border-ink/12 transition-colors">
                  <f.icon size={18} className="text-ink/50 group-hover:text-blue transition-colors" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-[15px] font-semibold text-ink mb-1 group-hover:text-blue-dark transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-[13px] text-ink-muted leading-relaxed">
                    {f.desc}
                  </p>
                </div>

              </div>
            </StaggerItem>
          ))}
        </Stagger>

      </div>
    </section>
  );
}
