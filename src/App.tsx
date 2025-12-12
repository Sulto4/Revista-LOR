import { useState, useEffect, lazy, Suspense } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';

const Stiri = lazy(() => import('./pages/Stiri'));
const Lifestyle = lazy(() => import('./pages/Lifestyle'));
const Cultura = lazy(() => import('./pages/Cultura'));
const Fashion = lazy(() => import('./pages/Fashion'));
const Beauty = lazy(() => import('./pages/Beauty'));
const Tech = lazy(() => import('./pages/Tech'));
const Sanatate = lazy(() => import('./pages/Sanatate'));
const Sport = lazy(() => import('./pages/Sport'));
const Horoscop = lazy(() => import('./pages/Horoscop'));
const Contact = lazy(() => import('./pages/Contact'));
const Redactie = lazy(() => import('./pages/Redactie'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const ArticlePage = lazy(() => import('./pages/ArticlePage'));

function PageLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-revista-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

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
      return (
        <Suspense fallback={<PageLoader />}>
          <ArticlePage slug={slug} />
        </Suspense>
      );
    }

    switch (currentPath) {
      case '/':
        return <Home />;
      case '/stiri':
        return (
          <Suspense fallback={<PageLoader />}>
            <Stiri />
          </Suspense>
        );
      case '/lifestyle':
        return (
          <Suspense fallback={<PageLoader />}>
            <Lifestyle />
          </Suspense>
        );
      case '/cultura':
        return (
          <Suspense fallback={<PageLoader />}>
            <Cultura />
          </Suspense>
        );
      case '/fashion':
        return (
          <Suspense fallback={<PageLoader />}>
            <Fashion />
          </Suspense>
        );
      case '/beauty':
        return (
          <Suspense fallback={<PageLoader />}>
            <Beauty />
          </Suspense>
        );
      case '/tech':
        return (
          <Suspense fallback={<PageLoader />}>
            <Tech />
          </Suspense>
        );
      case '/sanatate':
        return (
          <Suspense fallback={<PageLoader />}>
            <Sanatate />
          </Suspense>
        );
      case '/sport':
        return (
          <Suspense fallback={<PageLoader />}>
            <Sport />
          </Suspense>
        );
      case '/horoscop':
        return (
          <Suspense fallback={<PageLoader />}>
            <Horoscop />
          </Suspense>
        );
      case '/contact':
        return (
          <Suspense fallback={<PageLoader />}>
            <Contact />
          </Suspense>
        );
      case '/redactie':
        return (
          <Suspense fallback={<PageLoader />}>
            <Redactie />
          </Suspense>
        );
      case '/terms':
        return (
          <Suspense fallback={<PageLoader />}>
            <Terms />
          </Suspense>
        );
      case '/privacy':
        return (
          <Suspense fallback={<PageLoader />}>
            <Privacy />
          </Suspense>
        );
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
