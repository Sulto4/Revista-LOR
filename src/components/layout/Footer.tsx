import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Link from '../ui/Link';

const utilityLinks = [
  { name: 'Redacție', href: '#/redactie' },
  { name: 'Contact', href: '#/contact' },
  { name: 'Termeni și condiții', href: '#/terms' },
  { name: 'Politica de confidențialitate', href: '#/privacy' },
];

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

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  return (
    <footer className="bg-white border-t border-gray-200 mt-section">
      <div className="container-revista py-12 md:py-16">
        <div className="md:hidden mb-8">
          <div className="grid grid-cols-3 items-center mb-4">
            <div />
            <a href="#/" className="flex justify-center">
              <img
                src="/revista_lor_logo.png"
                alt="Revista LOR"
                className="h-8 w-auto object-contain"
              />
            </a>
            <div className="flex justify-end">
              <button
                className="text-revista-black p-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-600 text-center leading-relaxed px-4">
            Platformă editorială pentru noua generație. Actualitate, cultură, lifestyle & beyond.
          </p>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-[100]">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            />
            <div className="absolute top-0 right-0 h-full w-[80%] bg-revista-white shadow-2xl overflow-y-auto">
              <div className="flex justify-end p-4">
                <button
                  className="text-revista-black p-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>
              <nav className="py-4 flex flex-col">
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          <div className="hidden md:block">
            <a href="#/" className="inline-block mb-4">
              <img
                src="/revista_lor_logo.png"
                alt="Revista LOR"
                className="h-16 w-auto object-contain"
              />
            </a>
          </div>

          <div className="text-center md:text-left">
            <h4 className="font-headline text-sm font-normal uppercase tracking-wide text-[#F4A623] mb-4">
              UTILE
            </h4>
            <ul className="space-y-1">
              {utilityLinks.map((link) => (
                <li key={link.name}>
                  <Link variant="footer" href={link.href} className="text-sm text-gray-700 hover:text-[#F4A623] transition-colors inline-flex items-center justify-center md:justify-start min-h-[44px]">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h4 className="font-headline text-sm font-normal uppercase tracking-wide text-[#F4A623] mb-4">
              PROGRAM
            </h4>
            <div className="text-sm text-gray-700 space-y-1">
              <p>Luni – Vineri</p>
              <p>09:00 am – 09:00 pm</p>
            </div>
          </div>

          <div className="text-center md:text-left">
            <h4 className="font-headline text-sm font-normal uppercase tracking-wide text-[#F4A623] mb-4">
              NEWSLETTER
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              Rămâi la curent cu ultimele noastre noutăți, primește oferte exclusive și multe altele.
            </p>
            <form onSubmit={handleSubmit} className="space-y-3 max-w-sm mx-auto md:mx-0 md:max-w-none">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Adresa ta de email"
                className="w-full px-4 py-3 text-sm border border-gray-300 rounded focus:outline-none focus:border-[#F4A623] transition-colors min-h-[48px]"
                required
              />
              <button
                type="submit"
                className="w-full bg-[#F4A623] hover:bg-[#E09613] text-white font-medium py-3 px-6 rounded transition-colors text-sm min-h-[48px]"
              >
                Abonează-te
              </button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
}
