import { useState } from 'react';
import Header from '../components/common/Header/Header';
import DecisionInfoStep from '../components/decision/DecisionInfoStep';
import DecisionProgress from '../components/decision/DecisionProgress';
import './DecisionPage.css';

const stepPrompts = [
  {
    title: '어떤 결정을 앞두고 있나요?',
    description: '비교하고 싶은 선택 상황을 간단히 적어주세요.',
    placeholder: '예: 올가을에 이사할 동네를 정하고 싶어요.',
  },
  {
    title: '어떤 선택지가 있나요?',
    description: '비교할 선택지를 정리해보세요.',
    placeholder: '예: 성수, 합정, 연남동',
  },
  {
    title: '무엇을 기준으로 비교할까요?',
    description: '결정에 중요하게 생각하는 기준을 적어주세요.',
    placeholder: '예: 출퇴근 시간, 월세, 주변 환경',
  },
  {
    title: '각 기준은 얼마나 중요한가요?',
    description: '우선순위를 정하고 이유를 적어보세요.',
    placeholder: '가장 중요한 기준과 그 이유를 적어주세요.',
  },
  {
    title: '선택지별 점수를 입력해보세요.',
    description: '정한 기준에 따라 각 선택지를 평가해보세요.',
    placeholder: '평가 내용을 적어주세요.',
  },
];

const DecisionPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<string[]>(Array(stepPrompts.length).fill(''));
  const [decisionDescription, setDecisionDescription] = useState('');
  const [showTitleError, setShowTitleError] = useState(false);
  const prompt = stepPrompts[currentStep - 1];

  const updateAnswer = (value: string) => {
    if (value.trim()) {
      setShowTitleError(false);
    }

    setAnswers((currentAnswers) =>
      currentAnswers.map((answer, index) =>
        index === currentStep - 1 ? value : answer,
      ),
    );
  };

  const goToNextStep = () => {
    if (currentStep === 1 && !answers[0].trim()) {
      setShowTitleError(true);
      return;
    }

    setShowTitleError(false);
    setCurrentStep((step) => Math.min(stepPrompts.length, step + 1));
  };

  return (
    <>
      <Header />
      <main className="decision-page">
        <DecisionProgress currentStep={currentStep} />

        <section className="decision-form-card">
          {currentStep === 1 ? (
            <DecisionInfoStep
              title={answers[0]}
              description={decisionDescription}
              showTitleError={showTitleError}
              onTitleChange={updateAnswer}
              onDescriptionChange={setDecisionDescription}
            />
          ) : (
            <>
              <p className="decision-form-eyebrow">새로운 결정</p>
              <h1>{prompt.title}</h1>
              <p className="decision-form-description">{prompt.description}</p>

              <label className="decision-form-label" htmlFor="decision-answer">
                내 생각
              </label>
              <textarea
                id="decision-answer"
                value={answers[currentStep - 1]}
                className="decision-form-textarea"
                onChange={(event) => updateAnswer(event.target.value)}
                placeholder={prompt.placeholder}
                rows={4}
              />
            </>
          )}

          <div className="decision-form-actions">
            <button
              className="decision-back-button"
              type="button"
              onClick={() => setCurrentStep((step) => Math.max(1, step - 1))}
              disabled={currentStep === 1}
            >
              이전
            </button>
            <button
              className="decision-next-button"
              type="button"
              onClick={goToNextStep}
              disabled={currentStep === stepPrompts.length}
            >
              다음 <span aria-hidden="true">→</span>
            </button>
          </div>
        </section>
      </main>
    </>
  );
};

export default DecisionPage;
