import { Scale, ChartNoAxesCombined, SlidersHorizontal } from 'lucide-react';
import FeatureItem from './FeatureItem';
import './FeatureSection.css';

const features = [
    {
        id: 1,
        icon: Scale,
        title: '나만의 기준으로 비교',
        description:
            '중요하게 생각하는 기준을 직접 설정하고 여러 선택지를 객관적으로 비교해보세요.',
    },
    {
        id: 2,
        icon: ChartNoAxesCombined,
        title: '한눈에 보는 분석 결과',
        description:
            '가중치와 점수를 기반으로 계산된 결과를 차트와 순위로 확인할 수 있어요.',
    },
    {
        id: 3,
        icon: SlidersHorizontal,
        title: 'What-if 시뮬레이션',
        description:
            '기준의 중요도를 바꿔보세요. 가중치 변화에 따라 결과가 어떻게 달라지는지 확인할 수 있어요.',
    },
];

const FeatureSection = () => {
    return (
        <section className="feature-section">
            <div className="feature-section-header">

                <p className="feature-section-title">
                    Why WhatIf
                </p>
            </div>

            <div className="feature-section-list">
                {features.map((feature) => (
                    <FeatureItem
                        key={feature.id}
                        icon={feature.icon}
                        title={feature.title}
                        description={feature.description}
                    />
                ))}
            </div>
        </section>
    );
};

export default FeatureSection;
