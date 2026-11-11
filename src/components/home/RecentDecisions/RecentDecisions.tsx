
import { useState } from 'react';
import type { DecisionRecord, InProgressDecision } from '../../../types/decision';
import './RecentDecisions.css';
import DecisionCard from './DecisionCard';
import { useDecisionStore } from '../../../store/decisionStore';
import { ClipboardList, Plus } from 'lucide-react';

interface RecentDecision {
    id: string;
    title: string;
    description: string;
    date: string;
    status: 'completed' | 'in-progress';
    modifiedTimestamp: number;
}

const formatDate = (date?: string) => {
    if (!date) return new Date().toLocaleDateString('sv-SE').replaceAll('-', '.');
    return date.slice(0, 10).replaceAll('-', '.');
};

const getModifiedTimestamp = (updatedAt?: string, fallbackDate?: string) => {
    const timestamp = Date.parse(updatedAt ?? fallbackDate?.replaceAll('.', '-') ?? '');
    return Number.isNaN(timestamp) ? 0 : timestamp;
};

const getRecentDecisions = (inProgress: InProgressDecision[], completed: DecisionRecord[]): RecentDecision[] => {
    const completedIds = new Set(completed.map((decision) => decision.id));
    const activeCards: RecentDecision[] = inProgress
        .filter((decision) => !completedIds.has(decision.id))
        .map((decision) => ({
            id: decision.id,
            title: decision.title.trim() || '제목 없는 결정',
            description: decision.description.trim() || '작성 중인 결정',
            date: formatDate(decision.updatedAt),
            status: 'in-progress',
            modifiedTimestamp: getModifiedTimestamp(decision.updatedAt),
        }));
    const completedCards: RecentDecision[] = completed
        .filter((decision) => decision.draft)
        .map((decision) => ({
            id: decision.id,
            title: decision.title,
            description: decision.description,
            date: formatDate(decision.date),
            status: 'completed',
            modifiedTimestamp: getModifiedTimestamp(decision.updatedAt, decision.date),
        }));

    return [...activeCards, ...completedCards]
        .sort((first, second) => second.modifiedTimestamp - first.modifiedTimestamp)
        .slice(0, 4);
};

const RecentDecisions = () => {
    const removeDecision = useDecisionStore((state) => state.removeDecision);
    const [removingIds, setRemovingIds] = useState<string[]>([]);
    const inProgress = useDecisionStore((state) => state.inProgressDecisions);
    const completed = useDecisionStore((state) => state.completedDecisions);
    const recentDecisions = getRecentDecisions(inProgress, completed);

    const handleDeleteDecision = (id: string) => {
        setRemovingIds((current) => [...current, id]);
        const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 260;

        window.setTimeout(() => {
            removeDecision(id);
            setRemovingIds((current) => current.filter((removingId) => removingId !== id));
        }, delay);
    };

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

                <a
                    href="/dashboard"
                    className="recent-decisions-more"
                >
                    전체 보기 →
                </a>
            </div>

            <div className="recent-decisions-list">
                {recentDecisions.length > 0 ? (
                    recentDecisions.map((decision) => (
                        <DecisionCard
                            key={decision.id}
                            id={decision.id}
                            title={decision.title}
                            description={decision.description}
                            date={decision.date}
                            status={decision.status}
                            isRemoving={removingIds.includes(decision.id)}
                            onDelete={handleDeleteDecision}
                        />
                    ))
                ) : (
                    <div className="recent-decisions-empty">
                        <div className="recent-decisions-empty-icon">
                            <ClipboardList size={28} strokeWidth={1.5} />
                        </div>

                        <p className="recent-decisions-empty-title">
                            아직 생성된 결정이 없어요.
                        </p>

                        <p className="recent-decisions-empty-description">
                            고민하고 있는 선택이 있다면,
                            <br />
                            지금 바로 새로운 결정을 만들어보세요.
                        </p>

                        <a
                            className="recent-decisions-empty-button"
                            href="/decision"
                        >
                            <Plus size={16} strokeWidth={3} />
                            새 결정 만들기
                        </a>
                    </div>
                )}
            </div>
        </section>
    );
};

export default RecentDecisions;
