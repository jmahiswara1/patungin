import { Link } from "react-router-dom";
import { DividerDoodle } from "./doodles";
import { useReducedMotion } from "motion/react";

export function Footer() {
  const reduce = useReducedMotion();

  return (
    <footer className="bg-ink">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <h3 className="text-2xl font-display font-bold text-paper mb-3">
              patungin
            </h3>
            <p className="text-sm text-paper/50 leading-relaxed">
              Split bill gampang, tanpa ribet. Untuk mahasiswa, anak kos, dan
              siapa saja yang sering patungan.
            </p>
          </div>

          <div>
            <h4 className="text-[11px] font-bold text-paper/40 uppercase tracking-widest mb-4">
              Produk
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Fitur", href: "/#fitur" },
                { label: "Harga", href: "/#harga" },
                { label: "Cara Kerja", href: "/#cara-kerja" },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-sm text-paper/50 hover:text-paper transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-bold text-paper/40 uppercase tracking-widest mb-4">
              Perusahaan
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  to="/tentang-kami"
                  className="text-sm text-paper/50 hover:text-paper transition-colors"
                >
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link
                  to="/kebijakan-privasi"
                  className="text-sm text-paper/50 hover:text-paper transition-colors"
                >
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link
                  to="/syarat-ketentuan"
                  className="text-sm text-paper/50 hover:text-paper transition-colors"
                >
                  Syarat & Ketentuan
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-bold text-paper/40 uppercase tracking-widest mb-4">
              Hubungi
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="mailto:admin@patungin.app"
                  className="text-sm text-paper/50 hover:text-paper transition-colors"
                >
                  admin@patungin.app
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-paper/50 hover:text-paper transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-paper/50 hover:text-paper transition-colors"
                >
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>

        <DividerDoodle
          className={`mb-6 text-paper/15 ${!reduce ? "doodle-wave" : ""}`}
          color="rgba(255,255,255,0.15)"
          animate={!reduce}
        />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[13px] text-paper/30">
            &copy; {new Date().getFullYear()} Patungin. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
