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

      {categories.map((category) => (
        <CategoryCarousel key={category.name} category={category.name} title={category.title} />
      ))}

      <NewsletterBox />
    </>
  );
}
