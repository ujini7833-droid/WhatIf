import './DecisionProgress.css';

interface DecisionProgressProps {
  currentStep: number;
}

const steps = ['결정 상황', '선택지', '평가 기준', '가중치', '점수 입력'];

const DecisionProgress = ({ currentStep }: DecisionProgressProps) => (
  <div className="decision-progress">
    <div className="decision-progress-header">
      <span className="decision-progress-label">CREATE DECISION</span>
      <span className="decision-progress-count">
        STEP {currentStep} / {steps.length}
      </span>
    </div>

    <div className="decision-progress-track">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;

        return (
          <div className="decision-progress-item" key={step}>
            <div className="decision-progress-step">
              <div
                className={`decision-progress-circle ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
              >
                {isCompleted ? '✓' : stepNumber}
              </div>
              <span
                className={`decision-progress-name ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
              >
                {step}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div
                className={`decision-progress-line ${isCompleted ? 'completed' : ''}`}
              />
            )}
          </div>
        );
      })}
    </div>
  </div>
);

export default DecisionProgress;
