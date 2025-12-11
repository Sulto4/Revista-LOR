import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Link from '../ui/Link';

const navigationItems = [
  { name: 'Home', href: '#/' },
  { name: 'Știri', href: '#/stiri' },
  { name: 'Lifestyle', href: '#/lifestyle' },
  { name: 'Cultură', href: '#/cultura' },
  { name: 'Fashion', href: '#/fashion' },
  { name: 'Beauty', href: '#/beauty' },
  { name: 'Tech', href: '#/tech' },
  { name: 'Sănătate', href: '#/sanatate' },
  { name: 'Sport', href: '#/sport' },
  { name: 'Horoscop', href: '#/horoscop' },
  { name: 'Contact', href: '#/contact' },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNavHidden, setIsNavHidden] = useState(false);

  useEffect(() => {
    const hideThreshold = 600;
    const showThreshold = 550;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY >= hideThreshold) {
        setIsNavHidden(true);
      } else if (currentScrollY <= showThreshold) {
        setIsNavHidden(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="bg-revista-white border-b border-revista-separator lg:border-b-0 sticky top-0 z-50">
      <div className="container-revista">
        <div className="flex items-center h-14 md:h-16 lg:justify-center">
          <a href="#/" className="inline-block">
            <img
              src="/revista_lor_logo.png"
              alt="Revista LOR"
              className="h-7 md:h-8 w-auto object-contain"
            />
          </a>

          <button
            className="lg:hidden text-revista-black ml-auto"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div className="hidden lg:block border-b border-revista-separator" />

      <div className="hidden lg:block overflow-hidden">
        <div
          className="transition-all duration-300 ease-out"
          style={{
            transform: isNavHidden ? 'translateY(-100%)' : 'translateY(0)',
            marginTop: isNavHidden ? '-48px' : '0'
          }}
        >
          <nav className="flex items-center justify-center gap-5 py-2.5">
            <div className="container-revista flex items-center justify-center gap-5">
              {navigationItems.map((item) => (
                <Link key={item.name} variant="nav" href={item.href}>
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
          <div className="border-b border-revista-separator" />
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden fixed top-14 md:top-16 left-0 right-0 bottom-0 z-[100]">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          />
          <div className="absolute top-0 right-0 h-full w-[80%] bg-revista-white shadow-2xl overflow-y-auto">
            <nav className="py-8 flex flex-col">
              {navigationItems.map((item, index) => (
                <div key={item.name}>
                  <Link
                    variant="nav"
                    href={item.href}
                    className="block text-xl py-4 px-8 hover:bg-revista-gold/5 transition-all"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {index < navigationItems.length - 1 && (
                    <div className="border-b border-revista-separator/30 mx-6" />
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
