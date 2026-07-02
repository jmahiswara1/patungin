import { Reveal } from "../components/Motion";
import { UnderlineDoodle } from "../components/doodles";

const sections = [
  {
    title: "Penerimaan Syarat",
    content:
      "Dengan mengakses dan menggunakan aplikasi Patungin, Anda menyetujui syarat dan ketentuan yang tercantum dalam dokumen ini. Jika Anda tidak setuju, mohon untuk tidak menggunakan layanan kami.",
  },
  {
    title: "Deskripsi Layanan",
    content:
      "Patungin adalah aplikasi split bill yang memungkinkan pengguna untuk membuat grup patungan, memindai struk dengan AI, membagi tagihan secara otomatis, dan melacak status pembayaran antar anggota grup.",
  },
  {
    title: "Akun Pengguna",
    content:
      "Anda dapat menggunakan Patungin sebagai guest atau dengan login Google. Anda bertanggung jawab atas keamanan akun Anda dan semua aktivitas yang terjadi di bawah akun tersebut.",
  },
  {
    title: "Penggunaan yang Diizinkan",
    content:
      "Anda setuju untuk menggunakan Patungin hanya untuk tujuan yang sah, yaitu membagi tagihan dengan teman, keluarga, atau rekan. Anda tidak boleh menggunakan layanan untuk aktivitas ilegal, penipuan, atau yang melanggar hak pihak lain.",
  },
  {
    title: "Konten Pengguna",
    content:
      "Foto struk dan data transaksi yang Anda masukkan ke dalam aplikasi adalah milik Anda. Dengan meng-upload konten, Anda memberikan Patungin izin untuk memproses data tersebut demi menyediakan layanan split bill.",
  },
  {
    title: "Akurasi Scan AI",
    content:
      "Fitur scan struk menggunakan teknologi AI yang mungkin tidak 100% akurat. Anda bertanggung jawab untuk memverifikasi hasil scan sebelum membagikan tagihan kepada anggota grup.",
  },
  {
    title: "Pembatasan Tanggung Jawab",
    content:
      'Patungin disediakan "seadanya" tanpa jaminan apa pun. Kami tidak bertanggung jawab atas kerugian yang timbul dari penggunaan aplikasi, termasuk kesalahan perhitungan split bill atau sengketa antar pengguna.',
  },
  {
    title: "Perubahan Layanan",
    content:
      "Kami berhak untuk memodifikasi, menangguhkan, atau menghentikan layanan (atau bagian dari layanan) kapan saja, dengan atau tanpa pemberitahuan terlebih dahulu.",
  },
  {
    title: "Perubahan Syarat",
    content:
      "Kami dapat memperbarui syarat dan ketentuan ini dari waktu ke waktu. Penggunaan berkelanjutan setelah perubahan dianggap sebagai penerimaan terhadap syarat yang baru.",
  },
  {
    title: "Hubungi Kami",
    content:
      "Jika Anda memiliki pertanyaan tentang syarat dan ketentuan ini, silakan hubungi kami di admin@patungin.app.",
  },
];

export default function SyaratKetentuan() {
  return (
    <div className="pt-28 pb-20 sm:pt-36 sm:pb-28">
      <div className="max-w-[800px] mx-auto px-5 sm:px-8">
        <Reveal>
          <p className="text-[13px] text-ink-muted mb-3">
            Terakhir diperbarui: 1 Juli 2026
          </p>
          <h1 className="text-[clamp(2rem,4vw,3.5rem)] font-display font-bold text-ink leading-[0.95] mb-3">
            Syarat &{" "}
            <span className="relative inline-block text-blue-dark">
              Ketentuan
              <UnderlineDoodle className="absolute -bottom-1 left-0 w-full h-3 text-blue/40" />
            </span>
          </h1>
          <p className="text-ink-muted text-lg max-w-[500px]">
            Mohon baca syarat dan ketentuan berikut sebelum menggunakan layanan
            Patungin.
          </p>
        </Reveal>

        <div className="mt-12 sm:mt-16 space-y-10">
          {sections.map((s, i) => (
            <Reveal key={i} delay={0.05 + i * 0.03}>
              <div>
                <h2 className="text-lg font-display font-bold text-ink mb-2">
                  {s.title}
                </h2>
                <p className="text-ink-muted text-[15px] leading-relaxed">
                  {s.content}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
