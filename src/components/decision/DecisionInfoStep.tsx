import './DecisionInfoStep.css';

interface DecisionInfoStepProps {
    title: string;
    description: string;
    showTitleError: boolean;
    onTitleChange: (value: string) => void;
    onDescriptionChange: (value: string) => void;
}

const DecisionInfoStep = ({
    title,
    description,
    showTitleError,
    onTitleChange,
    onDescriptionChange,
}: DecisionInfoStepProps) => {
    return (
        <section className="decision-info-step">
            <div className="decision-info-step-header">
                <span className="decision-info-eyebrow">
                    STEP 01 · DECISION INFO
                </span>

                <p className="decision-info-description">
                    고민하고 있는 내용을 자유롭게 작성해보세요.
                </p>
            </div>

            <div className='decision-info-form'>
                <div className="decision-info-field">
                    <label
                        htmlFor="decision-title"
                        className="decision-info-label"
                    >
                        결정 상황
                        <span className="decision-info-required">*</span>
                    </label>

                    <input
                    id="decision-title"
                    type="text"
                    className="decision-info-input"
                    value={title}
                    onChange={(e) => onTitleChange(e.target.value)}
                    placeholder="예: 11월 여행은 어디로?"
                    maxLength={100}
                    aria-invalid={showTitleError}
                    aria-describedby={showTitleError ? 'decision-title-error' : 'decision-title-hint'}
                    />

                    <span
                        id={showTitleError ? 'decision-title-error' : 'decision-title-hint'}
                        className={`decision-info-hint ${showTitleError ? 'error' : ''}`}
                    >
                        {showTitleError
                            ? '결정 상황을 입력해주세요.'
                            : '어떤 선택을 비교할지 간단하게 적어주세요.'}
                    </span>
                </div>

                <div className="decision-info-field">
                    <label
                        htmlFor="decision-description"
                        className="decision-info-label"
                    >
                        결정 상황 설명
                    </label>

                    <textarea
                    id="decision-description"
                    className="decision-info-textarea"
                    value={description}
                    onChange={(e) => onDescriptionChange(e.target.value)}
                    placeholder="예: 11월에 여행을 가려고 하는데, 제주도와 강릉 중 어디로 갈지 고민이에요."
                    maxLength={500}
                    rows={5}
                    />

                    <span className="decision-info-character-count">
                        {description.length} / 500
                    </span>
                </div>
            </div>
        </section>
    );
};

export default DecisionInfoStep;
