import type { Criterion } from '../components/decision/CriteriaEditor';

export interface DecisionTemplate {
  id: string;
  icon: string;
  title: string;
  description: string;
  criteria: Criterion[];
}

export const decisionTemplates: DecisionTemplate[] = [
  {
    id: 'travel',
    icon: '✈️',
    title: '여행지 선택',
    description: '여행 스타일과 예산에 맞는 여행지 비교',
    criteria: [
      { id: 'travel-cost', name: '여행 비용', description: '교통비, 숙박비, 식비', weight: 30 },
      { id: 'travel-time', name: '이동 시간', description: '왕복 이동 소요 시간', weight: 25 },
      { id: 'sights', name: '볼거리', description: '관광지와 즐길 거리', weight: 20 },
      { id: 'atmosphere', name: '분위기', description: '여행 스타일과의 적합성', weight: 15 },
      { id: 'accessibility', name: '접근성', description: '대중교통 및 이동 편의성', weight: 10 },
    ],
  },
  {
    id: 'product',
    icon: '💻',
    title: '제품 비교',
    description: '여러 제품의 가격과 성능 비교',
    criteria: [
      { id: 'price', name: '가격', description: '구매 비용과 가성비', weight: 30 },
      { id: 'performance', name: '성능', description: '제품의 핵심 기능과 성능', weight: 30 },
      { id: 'design', name: '디자인', description: '외관과 사용성', weight: 15 },
      { id: 'durability', name: '내구성', description: '품질과 예상 사용 기간', weight: 15 },
      { id: 'portability', name: '휴대성', description: '크기와 무게, 이동 편의성', weight: 10 },
    ],
  },
  {
    id: 'career',
    icon: '🎯',
    title: '진로 및 목표 선택',
    description: '진로, 직무, 학습 목표 등 장기적인 선택',
    criteria: [
      { id: 'interest', name: '적성 및 흥미', description: '나의 관심사와 성향에 맞는 정도', weight: 30 },
      { id: 'growth', name: '성장 가능성', description: '역량 및 경력 발전 가능성', weight: 25 },
      { id: 'outlook', name: '미래 전망', description: '향후 수요와 시장 전망', weight: 20 },
      { id: 'practicality', name: '현실적 조건', description: '준비 기간, 비용, 진입 장벽', weight: 15 },
      { id: 'satisfaction', name: '만족도', description: '장기적으로 느낄 수 있는 만족감', weight: 10 },
    ],
  },
  {
    id: 'everyday',
    icon: '🏠',
    title: '생활 속 선택',
    description: '일상에서 마주하는 다양한 선택 비교',
    criteria: [
      { id: 'cost', name: '비용', description: '구매 및 유지 비용', weight: 25 },
      { id: 'convenience', name: '편의성', description: '이용하기 편리한 정도', weight: 25 },
      { id: 'time-efficiency', name: '시간 효율', description: '시간 절약 및 소요 시간', weight: 20 },
      { id: 'satisfaction', name: '만족도', description: '개인적인 선호와 만족감', weight: 20 },
      { id: 'sustainability', name: '지속 가능성', description: '장기적으로 유지하기 좋은 정도', weight: 10 },
    ],
  },
];
