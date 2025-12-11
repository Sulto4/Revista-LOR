import { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Stiri from './pages/Stiri';
import Lifestyle from './pages/Lifestyle';
import Cultura from './pages/Cultura';
import Fashion from './pages/Fashion';
import Beauty from './pages/Beauty';
import Tech from './pages/Tech';
import Sanatate from './pages/Sanatate';
import Sport from './pages/Sport';
import Horoscop from './pages/Horoscop';
import Contact from './pages/Contact';
import Redactie from './pages/Redactie';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import ArticlePage from './pages/ArticlePage';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.hash.slice(1) || '/');

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash.slice(1) || '/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderPage = () => {
    if (currentPath.startsWith('/article/')) {
      const slug = currentPath.replace('/article/', '');
      return <ArticlePage slug={slug} />;
    }

    switch (currentPath) {
      case '/':
        return <Home />;
      case '/stiri':
        return <Stiri />;
      case '/lifestyle':
        return <Lifestyle />;
      case '/cultura':
        return <Cultura />;
      case '/fashion':
        return <Fashion />;
      case '/beauty':
        return <Beauty />;
      case '/tech':
        return <Tech />;
      case '/sanatate':
        return <Sanatate />;
      case '/sport':
        return <Sport />;
      case '/horoscop':
        return <Horoscop />;
      case '/contact':
        return <Contact />;
      case '/redactie':
        return <Redactie />;
      case '/terms':
        return <Terms />;
      case '/privacy':
        return <Privacy />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}

export default App;
