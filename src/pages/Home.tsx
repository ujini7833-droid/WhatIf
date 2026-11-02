import Header from '../components/common/Header/Header';
import Hero from '../components/home/Hero/Hero';
import RecentDecisions from '../components/home/RecentDecisions/RecentDecisions';
import TemplateSection from '../components/home/Templates/TemplateSection';

const Home = () => {
    return (
        <>
            <Header />
            <main>
                <Hero />
                <RecentDecisions />
                <TemplateSection />
            </main>
        </>
    );
};

export default Home;