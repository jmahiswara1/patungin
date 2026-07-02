import { HashRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProblemSection } from './components/ProblemSection';
import { Features } from './components/Features';
import { HowItWorks } from './components/HowItWorks';
import { Testimonials } from './components/Testimonials';
import { Pricing } from './components/Pricing';
import { DownloadCTA } from './components/DownloadCTA';
import { Footer } from './components/Footer';
import { SmoothScroll } from './components/SmoothScroll';
import { ScrollToTop } from './components/ScrollToTop';
import PageLayout from './pages/Layout';
import TentangKami from './pages/TentangKami';
import KebijakanPrivasi from './pages/KebijakanPrivasi';
import SyaratKetentuan from './pages/SyaratKetentuan';

function LandingPage() {
  return (
    <div className="noise min-h-screen">
      <Navbar />
      <Hero />
      <ProblemSection />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <DownloadCTA />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={
            <SmoothScroll>
              <LandingPage />
            </SmoothScroll>
          }
        />
        <Route element={<PageLayout />}>
          <Route path="/tentang-kami" element={<TentangKami />} />
          <Route path="/kebijakan-privasi" element={<KebijakanPrivasi />} />
          <Route path="/syarat-ketentuan" element={<SyaratKetentuan />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
