interface TemplateCardProps {
    icon: string;
    title: string;
    description: string;
    criteriaCount: number;
}

const TemplateCard = ({
    icon,
    title,
    description,
    criteriaCount,
}: TemplateCardProps) => {
    return (
        <article className="template-card">

            <div className="template-card-top">
                <span className="template-card-icon">
                    {icon}
                </span>

                <span className="template-card-arrow">
                    ↗
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

            </article>
    );
};

export default TemplateCard;