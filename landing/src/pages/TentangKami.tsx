import { Reveal } from '../components/Motion';
import { UnderlineDoodle } from '../components/doodles';

export default function TentangKami() {
  return (
    <div className="pt-28 pb-20 sm:pt-36 sm:pb-28">
      <div className="max-w-[800px] mx-auto px-5 sm:px-8">
        
        <Reveal>
          <h1 className="text-[clamp(2rem,4vw,3.5rem)] font-display font-bold text-ink leading-[0.95] mb-3">
            Tentang{' '}
            <span className="relative inline-block text-blue-dark">
              Patungin
              <UnderlineDoodle className="absolute -bottom-1 left-0 w-full h-3 text-blue/40" />
            </span>
          </h1>
          <p className="text-ink-muted text-lg max-w-[500px]">
            Split bill gampang, tanpa ribet.
          </p>
        </Reveal>

        <div className="mt-12 sm:mt-16 space-y-10">
          <Reveal delay={0.1}>
            <div>
              <h2 className="text-xl font-display font-bold text-ink mb-3">Cerita Kami</h2>
              <p className="text-ink-muted text-[15px] leading-relaxed">
                Patungin lahir dari pengalaman pribadi — makan bareng teman-teman, tapi malas hitung siapa bayar berapa. Kalkulator di HP, chat yang panjang, dan akhirnya ada yang nombok. Kami pikir, harusnya ada cara yang lebih gampang.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div>
              <h2 className="text-xl font-display font-bold text-ink mb-3">Misi Kami</h2>
              <p className="text-ink-muted text-[15px] leading-relaxed">
                Membuat split bill sesederhana foto struk. Nggak perlu hitung manual, nggak perlu debat siapa pesan apa. Cukup foto, bagi, selesai. Kami ingin setiap patungan jadi pengalaman yang adil dan tanpa drama.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div>
              <h2 className="text-xl font-display font-bold text-ink mb-3">Bagaimana Cara Kerjanya</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <span className="font-script text-2xl text-blue/40 w-6 shrink-0">01</span>
                  <div>
                    <h3 className="text-[15px] font-semibold text-ink mb-1">Buat Grup</h3>
                    <p className="text-[14px] text-ink-muted leading-relaxed">Bikin grup untuk acara makan atau nongkrong, lalu invite teman-teman via link atau input nama manual.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="font-script text-2xl text-blue/40 w-6 shrink-0">02</span>
                  <div>
                    <h3 className="text-[15px] font-semibold text-ink mb-1">Scan Struk</h3>
                    <p className="text-[14px] text-ink-muted leading-relaxed">Foto struk restoran atau screenshot order online. AI otomatis deteksi semua item dan harganya.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="font-script text-2xl text-blue/40 w-6 shrink-0">03</span>
                  <div>
                    <h3 className="text-[15px] font-semibold text-ink mb-1">Share Link</h3>
                    <p className="text-[14px] text-ink-muted leading-relaxed">Kirim link tagihan ke teman. Mereka bisa lihat rincian pesanan dan langsung konfirmasi bayar.</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.25}>
            <div>
              <h2 className="text-xl font-display font-bold text-ink mb-3">Untuk Siapa?</h2>
              <p className="text-ink-muted text-[15px] leading-relaxed">
                Untuk mahasiswa yang sering makan bareng, anak kos yang patungan beli groceries, tim kantor yang lunch bareng, atau siapa saja yang sering split bill. Patungin dibuat supaya nggak ada lagi yang nombok atau malu nagih.
              </p>
            </div>
          </Reveal>
        </div>

      </div>
    </div>
  );
}
