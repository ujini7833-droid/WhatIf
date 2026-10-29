
interface DecisionCardProps {
    title: string;
    description: string;
    date: string;
    status: 'completed' | 'in-progress';
}

const DecisionCard = ({
    title,
    description,
    date,
    status,
}: DecisionCardProps) => {
    return (
        <article className="decision-card">
            <div className="decision-card-top">
                <span className={`decision-card-status decision-card-status-${status}`}>
                    {status === 'completed' ? '완료' : '진행 중'}
                </span>

                <span className="decision-card-date">
                    {date}
                </span>
            </div>

            <div className="decision-card-content">
                <h3 className="decision-card-title">
                    {title}
                </h3>

                <p className="decision-card-description">
                    {description}
                </p>
            </div>

            <div className="decision-card-footer">
                <span className="decision-card-action">
                    {status === 'completed' ? '결과 보기' : '이어서 결정하기'}
                </span>

                <span className="decision-card-arrow" aria-hidden="true">
                    →
                </span>
            </div>
        </article>
    );
};

export default DecisionCard;
