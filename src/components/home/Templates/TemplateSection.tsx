import TemplateCard from './TemplateCard';
import { decisionTemplates } from '../../../data/decisionTemplates';
import './TemplateSection.css';

const TemplateSection = () => {
    return (
        <section className="template-section" id="templates">
            <div className="template-section-header">
                <div>
                    <h2 className="template-section-title">
                        Templates
                    </h2>

                    <p className="template-section-description">
                        미리 준비된 템플릿으로 쉽게 결정을 시작해보세요.
                    </p>
                </div>

                {/*<button
                    type="button"
                    className="template-section-more"
                >
                    모든 템플릿 보기 →
                </button>
                */}
            </div>

            <div className="template-section-list">
                {decisionTemplates.map((template) => (
                    <TemplateCard
                        key={template.id}
                        id={template.id}
                        icon={template.icon}
                        title={template.title}
                        description={template.description}
                        criteriaCount={template.criteria.length}
                    />
                ))}
            </div>
        </section>
    );
};

export default TemplateSection;