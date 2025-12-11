import HeroSection from '../components/sections/HeroSection';
import CategoryCarousel from '../components/sections/CategoryCarousel';
import NewsletterBox from '../components/sections/NewsletterBox';

const categories = [
  { name: 'Știri', title: 'ȘTIRI' },
  { name: 'Fashion', title: 'FASHION' },
  { name: 'Beauty', title: 'BEAUTY' },
  { name: 'Lifestyle', title: 'LIFESTYLE' },
  { name: 'Cultură', title: 'CULTURĂ' },
  { name: 'Tech', title: 'TECH' },
  { name: 'Sănătate', title: 'SĂNĂTATE' },
  { name: 'Sport', title: 'SPORT' },
  { name: 'Horoscop', title: 'HOROSCOP' },
];

export default function Home() {
  return (
    <>
      <HeroSection />

      <div className="border-t border-revista-separator" />

      {categories.map((category, index) => (
        <div key={category.name}>
          <CategoryCarousel category={category.name} title={category.title} />
          {index < categories.length - 1 && (
            <div className="border-t border-revista-separator" />
          )}
        </div>
      ))}

      <NewsletterBox />
    </>
  );
}
