import { useState } from 'react';
import Link from '../ui/Link';

const utilityLinks = [
  { name: 'Redacție', href: '#/redactie' },
  { name: 'Contact', href: '#/contact' },
  { name: 'Termeni și condiții', href: '#/terms' },
  { name: 'Politica de confidențialitate', href: '#/privacy' },
];

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  return (
    <footer className="bg-white border-t border-gray-200 mt-section">
      <div className="container-revista py-12 md:py-16">
        <div className="md:hidden mb-8 text-center">
          <a href="#/" className="inline-block mb-4">
            <img
              src="/revista_lor_logo.png"
              alt="Revista LOR"
              className="h-10 w-auto object-contain"
            />
          </a>
          <p className="text-sm text-gray-600 leading-relaxed px-4">
            Platformă editorială pentru noua generație. Actualitate, cultură, lifestyle & beyond.
          </p>
        </div>

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
