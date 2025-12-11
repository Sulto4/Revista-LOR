import { useState, FormEvent } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';

export default function NewsletterBox() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  return (
    <section className="section-spacing bg-revista-ivory">
      <div className="container-revista">
        <div className="max-w-2xl mx-auto text-center py-16 md:py-20">
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-revista-black mb-6">
            Newsletter
          </h2>

          <p className="text-lg text-revista-text/80 mb-8 leading-relaxed">
            Abonează-te la newsletter-ul nostru și primește cele mai noi articole,
            tendințe și povești inspiraționale direct în inbox.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="email"
                placeholder="Adresa ta de email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <Button type="submit" variant="secondary">
              Abonează-te
            </Button>
          </form>

          <p className="text-sm text-revista-text/60 mt-4">
            Ne respectăm cititorii. Poți anula abonamentul oricând.
          </p>
        </div>
      </div>
    </section>
  );
}
