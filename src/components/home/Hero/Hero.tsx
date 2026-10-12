import './Hero.css';
import DecisionPreview from './DecisionPreview';

const Hero = () => {
    return (
        <section className="hero">
            <div className="hero-background">
                <div className="hero-glow hero-glow-purple" />
                <div className="hero-glow hero-glow-blue" />
            </div>

            <div className="hero-content">
                <p className="hero-eyebrow">
                    MAKE A BETTER DECISION
                </p>

                <h1 className="hero-title">
                    WHAT IF
                    <br />
                    <span className="hero-title-second-line">
                        <span className="hero-title-phrase">you chose</span>{' '}
                        <span className="hero-title-emphasis">differently?</span>
                    </span>
                </h1>

                <p className="hero-description">
                    복잡한 선택을
                    <br />
                    나만의 기준으로 비교해보세요
                </p>

                <button className="hero-button">
                    <span>+</span>
                    새로운 선택 만들기
                    <span className="hero-arrow">→</span>
                </button>
            </div>

            <div className="hero-visual">
                <DecisionPreview />
            </div>
        </section>
    );
};

export default Hero;
