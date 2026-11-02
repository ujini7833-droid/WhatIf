import Header from '../components/common/Header/Header';
import Hero from '../components/home/Hero/Hero';
import RecentDecisions from '../components/home/RecentDecisions/RecentDecisions';
import TemplateSection from '../components/home/Templates/TemplateSection';
import FeatureSection from '../components/home/Features/FeatureSection';

const Home = () => {
    return (
        <>
            <Header />

            <main>
                <Hero />
                <RecentDecisions />
                <TemplateSection />
                <FeatureSection />
            </main>
        </>
    );
};

export default Home;