import type { LucideIcon } from 'lucide-react';
import './FeatureItem.css';

interface FeatureItemProps {
    icon: LucideIcon;
    title: string;
    description: string;
}

const FeatureItem = ({
    icon,
    title,
    description,
}: FeatureItemProps) => {
    const Icon = icon;

    return (
        <article className="feature-item">
            <div className="feature-item-icon">
                <Icon aria-hidden="true" strokeWidth={1.5} />
            </div>

            <div className="feature-item-content">
                <h3 className="feature-item-title">{title}</h3>
                <p className="feature-item-description">{description}</p>
            </div>
        </article>
    );
};

export default FeatureItem;
