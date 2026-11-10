
import type { DecisionRecord, InProgressDecision } from '../../../types/decision';
import './RecentDecisions.css';
import DecisionCard from './DecisionCard';
import { useDecisionStore } from '../../../store/decisionStore';

interface RecentDecision {
    id: string;
    title: string;
    description: string;
    date: string;
    status: 'completed' | 'in-progress';
}

const formatDate = (date?: string) => {
    if (!date) return new Date().toLocaleDateString('sv-SE').replaceAll('-', '.');
    return date.slice(0, 10).replaceAll('-', '.');
};

const getRecentDecisions = (inProgress: InProgressDecision[], completed: DecisionRecord[]): RecentDecision[] => {
    const activeCards: RecentDecision[] = inProgress.map((decision) => ({
        id: decision.id,
        title: decision.title.trim() || '제목 없는 결정',
        description: decision.description.trim() || '작성 중인 결정',
        date: formatDate(decision.updatedAt),
        status: 'in-progress',
    }));
    const completedCards: RecentDecision[] = completed
        .filter((decision) => decision.draft)
        .map((decision) => ({
            id: decision.id,
            title: decision.title,
            description: decision.description,
            date: formatDate(decision.date),
            status: 'completed',
        }));
    return [...activeCards, ...completedCards].slice(0, 4);
};

const RecentDecisions = () => {
    const removeDecision = useDecisionStore((state) => state.removeDecision);
    const handleDeleteDecision = (id: string) => removeDecision(id);
    const inProgress = useDecisionStore((state) => state.inProgressDecisions);
    const completed = useDecisionStore((state) => state.completedDecisions);
    const recentDecisions = getRecentDecisions(inProgress, completed);

    return (
        <section className="recent-decisions" id="decisions">
            <div className="recent-decisions-header">
                <div>
                    <p className="recent-decisions-eyebrow">
                        YOUR WORKSPACE
                    </p>

                    <h2 className="recent-decisions-title">
                        Recent Decisions
                    </h2>

                    <p className="recent-decisions-description">
                        최근에 고민했던 선택들을 이어서 살펴보세요.
                    </p>
                </div>

                <button
                    type="button"
                    className="recent-decisions-more"
                >
                    전체 보기 →
                </button>
            </div>

            <div className="recent-decisions-list">
                {recentDecisions.map((decision) => (
                     <DecisionCard
                        key={decision.id}
                        id={decision.id}
                        title={decision.title}
                        description={decision.description}
                        date={decision.date}
                        status={decision.status}
                        onDelete={handleDeleteDecision}
                    />
                ))}
            </div>
        </section>
    );
};

export default RecentDecisions;
