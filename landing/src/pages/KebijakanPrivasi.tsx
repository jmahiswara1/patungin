import { Reveal } from "../components/Motion";
import { UnderlineDoodle } from "../components/doodles";

const sections = [
  {
    title: "Informasi yang Kami Kumpulkan",
    content:
      "Kami mengumpulkan informasi yang Anda berikan langsung, seperti nama, alamat email, dan foto struk saat menggunakan layanan Patungin. Kami juga mengumpulkan data penggunaan secara otomatis, seperti perangkat yang digunakan dan aktivitas di dalam aplikasi.",
  },
  {
    title: "Bagaimana Kami Menggunakan Informasi",
    content:
      "Informasi yang dikumpulkan digunakan untuk menyediakan dan meningkatkan layanan Patungin, memproses scan struk dengan AI, mengelola akun dan grup patungan, serta mengirimkan notifikasi terkait aktivitas split bill Anda.",
  },
  {
    title: "Penyimpanan & Keamanan Data",
    content:
      "Data Anda disimpan di server yang aman dengan enkripsi. Kami menggunakan Supabase sebagai infrastruktur backend yang menerapkan standar keamanan industri. Foto struk yang di-upload diproses dan tidak disimpan secara permanen setelah data item diekstrak.",
  },
  {
    title: "Berbagi Informasi",
    content:
      "Kami tidak menjual atau membagikan data pribadi Anda kepada pihak ketiga untuk tujuan pemasaran. Informasi hanya dibagikan dengan anggota grup patungan Anda, sebatas data split bill yang relevan.",
  },
  {
    title: "Cookie & Pelacakan",
    content:
      "Aplikasi kami dapat menggunakan cookie dan teknologi serupa untuk meningkatkan pengalaman pengguna, mengingat preferensi, dan menganalisis penggunaan layanan.",
  },
  {
    title: "Hak Anda",
    content:
      "Anda memiliki hak untuk mengakses, memperbarui, atau menghapus data pribadi Anda. Anda juga dapat menonaktifkan akun kapan saja melalui pengaturan aplikasi atau dengan menghubungi kami.",
  },
  {
    title: "Privasi Anak",
    content:
      "Layanan Patungin tidak ditujukan untuk pengguna di bawah usia 13 tahun. Kami tidak secara sadar mengumpulkan data pribadi dari anak-anak.",
  },
  {
    title: "Perubahan Kebijakan",
    content:
      "Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu. Perubahan signifikan akan diberitahukan melalui aplikasi atau email.",
  },
  {
    title: "Hubungi Kami",
    content:
      "Jika Anda memiliki pertanyaan tentang kebijakan privasi ini, silakan hubungi kami di admin@patungin.app.",
  },
];

export default function KebijakanPrivasi() {
  return (
    <div className="pt-28 pb-20 sm:pt-36 sm:pb-28">
      <div className="max-w-[800px] mx-auto px-5 sm:px-8">
        <Reveal>
          <p className="text-[13px] text-ink-muted mb-3">
            Terakhir diperbarui: 1 Juli 2026
          </p>
          <h1 className="text-[clamp(2rem,4vw,3.5rem)] font-display font-bold text-ink leading-[0.95] mb-3">
            Kebijakan{" "}
            <span className="relative inline-block text-blue-dark">
              Privasi
              <UnderlineDoodle className="absolute -bottom-1 left-0 w-full h-3 text-blue/40" />
            </span>
          </h1>
          <p className="text-ink-muted text-lg max-w-[500px]">
            Kami menghargai privasi Anda. Berikut adalah kebijakan kami tentang
            data yang dikumpulkan.
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
