import TemplateCard from './TemplateCard';
import './TemplateSection.css';

const templates = [
    {
        id: 1,
        icon: '✈️',
        title: '여행지 선택',
        description: '여행 스타일과 예산에 맞는 최적의 여행지를 찾아보세요.',
        criteriaCount: 5,
    },
    {
        id: 2,
        icon: '💻',
        title: '제품 비교',
        description: '가격, 성능, 디자인 등 다양한 기준으로 제품을 비교해보세요.',
        criteriaCount: 4,
    },
    {
        id: 3,
        icon: '🎯',
        title: '진로 및 목표',
        description: '여러 선택지를 나만의 가치와 우선순위에 따라 비교해보세요.',
        criteriaCount: 6,
    },
    {
        id: 4,
        icon: '🏠',
        title: '생활 속 선택',
        description: '일상에서 마주하는 다양한 고민을 체계적으로 정리해보세요.',
        criteriaCount: 4,
    },
];

const TemplateSection = () => {
    return (
        <section className="template-section" id="templates">
            <div className="template-section-header">
                <div>
                    <p className="template-section-eyebrow">
                        START WITH A TEMPLATE
                    </p>

                    <h2 className="template-section-title">
                        Not sure where to start?
                    </h2>

                    <p className="template-section-description">
                        미리 준비된 템플릿으로 쉽게 결정을 시작해보세요.
                    </p>
                </div>

                <button
                    type="button"
                    className="template-section-more"
                >
                    모든 템플릿 보기 →
                </button>
            </div>

            <div className="template-section-list">
                {templates.map((template) => (
                    <TemplateCard
                        key={template.id}
                        icon={template.icon}
                        title={template.title}
                        description={template.description}
                        criteriaCount={template.criteriaCount}
                    />
                ))}
            </div>
        </section>
    );
};

export default TemplateSection;