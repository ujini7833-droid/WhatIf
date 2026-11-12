import { ArrowUpRight } from 'lucide-react';
import './TemplateCard.css';

interface TemplateCardProps {
    id: string;
    icon: string;
    title: string;
    description: string;
    criteriaCount: number;
}

const TemplateCard = ({
    id,
    icon,
    title,
    description,
    criteriaCount,
}: TemplateCardProps) => {
    return (
        <a className="template-card" href={`/decision?template=${encodeURIComponent(id)}`}>

            <div className="template-card-top">
                <span className="template-card-icon">
                    {icon}
                </span>

                <span className="template-card-arrow" aria-hidden="true">
                    <ArrowUpRight size={18} strokeWidth={2.5} />
                </span>
            </div>

            <div className="template-card-content">
                <h3 className="template-card-title">
                    {title}
                </h3>

                <p className="template-card-description">
                    {description}
                </p>
            </div>

            <div className="template-card-footer">
                <span>
                    {criteriaCount}개의 추천 기준
                </span>
            </div>

        </a>
    );
};

export default TemplateCard;