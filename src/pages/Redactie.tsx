export default function Redactie() {
  return (
    <div className="container-revista py-section">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-5xl md:text-6xl font-bold text-revista-black mb-6">
          Redacția Noastră
        </h1>
        <p className="text-lg text-revista-text/80 leading-relaxed mb-16">
          Suntem o echipă pasionată de jurnaliști, editori și creatori de conținut
          dedicați să aducă cele mai relevante și inspiraționale povești din lumea
          lifestyle-ului, culturii și tendințelor moderne.
        </p>

        <div className="space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-48 h-48 mx-auto mb-4 bg-revista-ivory" />
              <h3 className="font-serif text-2xl font-semibold text-revista-black mb-2">
                Ana Popescu
              </h3>
              <p className="text-metadata text-revista-gold uppercase tracking-wider mb-3">
                Editor Șef
              </p>
              <p className="text-base text-revista-text/80">
                Pasionată de fashion și storytelling cu peste 10 ani de experiență
                în jurnalism.
              </p>
            </div>

            <div className="text-center">
              <div className="w-48 h-48 mx-auto mb-4 bg-revista-ivory" />
              <h3 className="font-serif text-2xl font-semibold text-revista-black mb-2">
                Mihai Dumitrescu
              </h3>
              <p className="text-metadata text-revista-gold uppercase tracking-wider mb-3">
                Editor Cultură
              </p>
              <p className="text-base text-revista-text/80">
                Critic de artă și curator, specialist în cultura contemporană și artă
                vizuală.
              </p>
            </div>

            <div className="text-center">
              <div className="w-48 h-48 mx-auto mb-4 bg-revista-ivory" />
              <h3 className="font-serif text-2xl font-semibold text-revista-black mb-2">
                Elena Popa
              </h3>
              <p className="text-metadata text-revista-gold uppercase tracking-wider mb-3">
                Editor Lifestyle
              </p>
              <p className="text-base text-revista-text/80">
                Expert în wellness și dezvoltare personală, promovând un stil de viață
                echilibrat.
              </p>
            </div>
          </div>

          <div className="bg-revista-ivory p-8 md:p-12">
            <h2 className="font-serif text-3xl font-semibold text-revista-black mb-6">
              Misiunea Noastră
            </h2>
            <p className="text-lg text-revista-text/80 leading-relaxed">
              La Revista LOR, credem în puterea poveștilor autentice și a conținutului
              de calitate. Ne dedicăm să oferim cititorilor noștri perspective fresh
              asupra tendințelor moderne, să explorăm cultura contemporană și să
              inspirăm un stil de viață conștient și creativ.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
