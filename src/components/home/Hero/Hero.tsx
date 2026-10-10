import './Hero.css';
// import DecisionPreview from './DecisionPreview';

const Hero = () => {
    return (
        <section className="hero">
            <div className="hero_background">
                <div className="hero_glow hero_glow--purple" />
                <div className="hero_glow hero_glow--blue" />
            </div>

            <div className="hero_content">
                <p className="hero_eyebrow">
                    MAKE A BETTER DECISION
                </p>

                <h1 className="hero_title">
                    WHAT IF
                    <br />
                    you chose{' '}
                    <span>differently?</span>
                </h1>

                <p className="hero_description">
                    복잡한 선택을
                    <br />
                    나만의 기준으로 비교해보세요
                </p>

                <button className="hero_button">
                    <span>+</span>
                    새로운 선택 만들기
                    <span className="hero_arrow">→</span>
                </button>
            </div>

            <div className="hero_visual">
                {/* <DecisionPreview /> */}
            </div>
        </section>
    );
};

export default Hero;
