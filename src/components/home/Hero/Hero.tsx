import './Hero.css';
import DecisionPreview from './DecisionPreview';

const Hero = () => (
  <section className="hero">
    <div className="hero-background">
      <div className="hero-glow hero-glow-purple" />
      <div className="hero-glow hero-glow-blue" />
    </div>

    <div className="hero-content">
      <h1 className="hero-title">
        WHAT IF
        <br />
        <span className="hero-title-second-line">
          <span className="hero-title-phrase">you chose differently?</span>
        </span>
      </h1>

      <p className="hero-description">
        복잡한 선택을
        <br />
        나만의 기준으로 비교해보세요
      </p>

      <button
        type="button"
        className="hero-button"
        onClick={() => window.location.assign('/decision')}
      >
        <span aria-hidden="true">+</span>
        새로운 선택 만들기
        <span className="hero-arrow" aria-hidden="true">→</span>
      </button>
    </div>

    <div className="hero-visual">
      <DecisionPreview />
    </div>
  </section>
);

export default Hero;
