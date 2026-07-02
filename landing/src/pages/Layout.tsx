import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { SmoothScroll } from '../components/SmoothScroll';
import { Outlet } from 'react-router-dom';

export default function PageLayout() {
  return (
    <SmoothScroll>
      <div className="noise min-h-screen flex flex-col">
        <Navbar transparent={false} />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}
