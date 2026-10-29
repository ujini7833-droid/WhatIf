import Header from '../components/common/Header/Header';
import Hero from '../components/home/Hero/Hero';
import RecentDecisions from '../components/home/RecentDecisions/RecentDecisions';

const Home = () => {
    return (
        <>
            <Header />
            <main>
                <Hero />
                <RecentDecisions />
            </main>
        </>
    );
};

export default Home;