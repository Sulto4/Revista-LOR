import Button from '../ui/Button';
import ArticleCardSmall, { Article } from '../articles/ArticleCardSmall';

interface CategorySectionProps {
  title: string;
  articles: Article[];
  columns?: 3 | 6;
  showViewAll?: boolean;
  viewAllHref?: string;
}

export default function CategorySection({
  title,
  articles,
  columns = 3,
  showViewAll = true,
  viewAllHref = '#',
}: CategorySectionProps) {
  const gridCols = columns === 6 ? 'lg:grid-cols-6' : 'lg:grid-cols-3';

  return (
    <section className="section-spacing">
      <div className="container-revista">
        <div className="flex items-center justify-between mb-12">
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-revista-black">
            {title}
          </h2>
          {showViewAll && (
            <Button variant="primary" onClick={() => (window.location.hash = viewAllHref)}>
              Vezi toate
            </Button>
          )}
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 ${gridCols} gap-card`}>
          {articles.map((article) => (
            <ArticleCardSmall key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
