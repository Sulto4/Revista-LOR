import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function Contact() {
  return (
    <div className="container-revista py-section">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-serif text-5xl md:text-6xl font-bold text-revista-black mb-6">
          Contact
        </h1>
        <p className="text-lg text-revista-text/80 leading-relaxed mb-12">
          Avem plăcerea să auzim de la tine. Completează formularul de mai jos și
          echipa noastră îți va răspunde în cel mai scurt timp posibil.
        </p>

        <form className="space-y-6 md:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Nume" type="text" placeholder="Numele tău" required className="min-h-[48px]" />
            <Input label="Email" type="email" placeholder="email@exemplu.ro" required className="min-h-[48px]" />
          </div>

          <Input label="Subiect" type="text" placeholder="Despre ce vrei să discuți?" required className="min-h-[48px]" />

          <div>
            <label className="block text-metadata font-medium mb-2 text-revista-text">
              Mesaj
            </label>
            <textarea
              className="w-full px-4 py-4 border border-revista-separator bg-revista-white text-revista-text font-sans text-base focus:outline-none focus:border-revista-gold transition-colors h-48 md:h-40 resize-none"
              placeholder="Scrie mesajul tău aici..."
              required
            />
          </div>

          <Button type="submit" variant="secondary" className="w-full md:w-auto min-h-[48px]">
            Trimite Mesajul
          </Button>
        </form>

        <div className="mt-16 pt-16 border-t border-revista-separator">
          <h2 className="font-serif text-3xl font-semibold text-revista-black mb-8">
            Informații de Contact
          </h2>
          <div className="space-y-4 text-revista-text">
            <p>
              <strong>Email:</strong> redactie@revistalor.ro
            </p>
            <p>
              <strong>Colaborări:</strong> colaborari@revistalor.ro
            </p>
            <p>
              <strong>Program:</strong> Luni - Vineri, 09:00 - 18:00
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
