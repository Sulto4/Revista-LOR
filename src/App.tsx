import { useState, useEffect, lazy } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import SmartSuspense from './components/ui/SmartSuspense';

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
        <SmartSuspense path={currentPath}>
          <ArticlePage slug={slug} />
        </SmartSuspense>
      );
    }

    switch (currentPath) {
      case '/':
        return <Home />;
      case '/stiri':
        return (
          <SmartSuspense path="/stiri">
            <Stiri />
          </SmartSuspense>
        );
      case '/lifestyle':
        return (
          <SmartSuspense path="/lifestyle">
            <Lifestyle />
          </SmartSuspense>
        );
      case '/cultura':
        return (
          <SmartSuspense path="/cultura">
            <Cultura />
          </SmartSuspense>
        );
      case '/fashion':
        return (
          <SmartSuspense path="/fashion">
            <Fashion />
          </SmartSuspense>
        );
      case '/beauty':
        return (
          <SmartSuspense path="/beauty">
            <Beauty />
          </SmartSuspense>
        );
      case '/tech':
        return (
          <SmartSuspense path="/tech">
            <Tech />
          </SmartSuspense>
        );
      case '/sanatate':
        return (
          <SmartSuspense path="/sanatate">
            <Sanatate />
          </SmartSuspense>
        );
      case '/sport':
        return (
          <SmartSuspense path="/sport">
            <Sport />
          </SmartSuspense>
        );
      case '/horoscop':
        return (
          <SmartSuspense path="/horoscop">
            <Horoscop />
          </SmartSuspense>
        );
      case '/contact':
        return (
          <SmartSuspense path="/contact">
            <Contact />
          </SmartSuspense>
        );
      case '/redactie':
        return (
          <SmartSuspense path="/redactie">
            <Redactie />
          </SmartSuspense>
        );
      case '/terms':
        return (
          <SmartSuspense path="/terms">
            <Terms />
          </SmartSuspense>
        );
      case '/privacy':
        return (
          <SmartSuspense path="/privacy">
            <Privacy />
          </SmartSuspense>
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
