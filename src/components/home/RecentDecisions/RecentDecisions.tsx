
import './RecentDecisions.css';
import DecisionCard from './DecisionCard';

interface RecentDecision {
    id: string;
    title: string;
    description: string;
    date: string;
    status: 'completed' | 'in-progress';
}

interface StoredDecision {
    id: string;
    title?: string;
    description?: string;
    date?: string;
    updatedAt?: string;
    draft?: unknown;
    status?: 'completed';
}

const formatDate = (date?: string) => {
    if (!date) return new Date().toLocaleDateString('sv-SE').replaceAll('-', '.');
    return date.slice(0, 10).replaceAll('-', '.');
};

const getRecentDecisions = (): RecentDecision[] => {
    try {
        const inProgress = JSON.parse(
            localStorage.getItem('whatif-in-progress-decisions') ?? '[]',
        ) as StoredDecision[];
        const completed = JSON.parse(
            localStorage.getItem('whatif-decisions') ?? '[]',
        ) as StoredDecision[];
        const activeCards: RecentDecision[] = inProgress.map((decision) => ({
            id: decision.id,
            title: decision.title?.trim() || '제목 없는 결정',
            description: decision.description?.trim() || '작성 중인 결정',
            date: formatDate(decision.updatedAt),
            status: 'in-progress',
        }));
        const completedCards: RecentDecision[] = completed
            .filter((decision) => decision.draft)
            .map((decision) => ({
                id: decision.id,
                title: decision.title ?? '제목 없는 결정',
                description: decision.description ?? '',
                date: formatDate(decision.date),
                status: 'completed',
            }));
        return [...activeCards, ...completedCards].slice(0, 4);
    } catch {
        return [];
    }
};

const RecentDecisions = () => {
    const recentDecisions = getRecentDecisions();

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
                    />
                ))}
            </div>
        </section>
    );
};

export default RecentDecisions;
