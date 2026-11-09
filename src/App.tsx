import Home from './pages/Home';
import DecisionPage from './pages/DecisionPage';

const App = () => {
    return window.location.pathname === '/decision' ? <DecisionPage /> : <Home />;
};

export default App;
