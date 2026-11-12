import Home from './pages/Home';
import DashboardPage from './pages/DashboardPage';
import DecisionPage from './pages/DecisionPage';
import ResultPage from './pages/ResultPage';

const App = () => {
    const pathname = window.location.pathname;

    if (pathname === '/dashboard') return <DashboardPage />;
    if (pathname === '/decision') return <DecisionPage />;
    if (['/result', '/what-if', '/complete'].includes(pathname)) {
        return <ResultPage />;
    }

    return <Home />;
};

export default App;