import './FeatureItem.css';

interface FeatureItemProps {
    icon: string;
    title: string;
    description: string;
}

const FeatureItem = ({
    icon,
    title,
    description,
}: FeatureItemProps) => {
    return (
        <article className="feature-item">
            <div className="feature-item-icon">
                {icon}
            </div>

            <div className="feature-item-content">
                <h3 className="feature-item-title">{title}</h3>
                <p className="feature-item-description">{description}</p>
            </div>
        </article>
    );
};

export default FeatureItem;