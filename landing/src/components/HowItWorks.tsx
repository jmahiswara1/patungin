import { UserPlus, Scan, Send } from 'lucide-react';
import { UnderlineDoodle } from './doodles';
import { Reveal } from './Motion';

const steps = [
  {
    icon: UserPlus,
    title: 'Buat Grup',
    desc: 'Invite temen via link atau input nama manual.',
  },
  {
    icon: Scan,
    title: 'Scan Struk',
    desc: 'Foto struk atau screenshot order online.',
  },
  {
    icon: Send,
    title: 'Share Link',
    desc: 'Temen langsung lihat rincian dan konfirmasi bayar.',
  },
];

export function HowItWorks() {
  return (
    <section id="cara-kerja" className="relative bg-ink overflow-hidden border-t border-white/5">
      
      <div className="relative py-16 sm:py-20 px-5 sm:px-8 max-w-[800px] mx-auto">
        
        {/* Title */}
        <Reveal className="text-center mb-10 sm:mb-14">
          <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-display font-bold text-paper leading-[0.95] inline-block relative">
            <span className="relative inline-block text-blue">
              3 langkah
              <UnderlineDoodle className="absolute -bottom-1 left-0 w-full h-3 text-blue/60" animate={false} color="currentColor" />
            </span>
            , 2 menit selesai.
          </h2>
          <p className="mt-2 text-paper/40 text-base">
            Nggak perlu install, nggak perlu ribet.
          </p>
        </Reveal>

        {/* Horizontal steps */}
        <Reveal delay={0.15}>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-0">
            {steps.map((step, i) => (
              <div key={i} className="flex flex-col sm:flex-row items-center flex-1">
                
                {/* Step */}
                <div className="flex flex-col items-center text-center w-full sm:w-auto">
                  {/* Circle with icon */}
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full border-2 border-paper/15 flex items-center justify-center">
                      <step.icon size={22} className="text-paper/70" />
                    </div>
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-blue text-[10px] font-bold text-paper flex items-center justify-center">
                      {i + 1}
                    </span>
                  </div>
                  
                  <h3 className="text-sm font-semibold text-paper mt-3 mb-1">
                    {step.title}
                  </h3>
                  <p className="text-[12px] text-paper/35 leading-relaxed max-w-[160px]">
                    {step.desc}
                  </p>
                </div>

                {/* Arrow between steps */}
                {i < steps.length - 1 && (
                  <div className="hidden sm:flex items-center justify-center flex-1 pt-0 px-2" style={{ marginTop: '1.75rem' }}>
                    <div className="w-full h-[1px] bg-paper/10 relative">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-paper/20" />
                    </div>
                  </div>
                )}

                {/* Mobile connector */}
                {i < steps.length - 1 && (
                  <div className="sm:hidden flex justify-center py-4">
                    <div className="w-[1px] h-6 bg-paper/10" />
                  </div>
                )}

              </div>
            ))}
          </div>
        </Reveal>

      </div>
      
    </section>
  );
}
