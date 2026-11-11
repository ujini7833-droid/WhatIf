import { useMemo, useState } from 'react';
import { Clock3, ListTodo, Target } from 'lucide-react';
import Header from '../components/common/Header/Header';
import DecisionCard from '../components/home/RecentDecisions/DecisionCard';
import { useDecisionStore } from '../store/decisionStore';
import type { DecisionRecord, InProgressDecision } from '../types/decision';
import './DashboardPage.css';

type StatusFilter = 'all' | 'completed' | 'in-progress';
type SortOption = 'latest' | 'oldest' | 'title';

interface DashboardDecision {
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'completed' | 'in-progress';
  sortDate: number;
}

const formatDate = (date?: string) => {
  if (!date) return '';

  const parsedDate = new Date(date.replaceAll('.', '-'));
  if (Number.isNaN(parsedDate.getTime())) return '';

  return parsedDate.toLocaleDateString('ko-KR').replaceAll('.', '-').replaceAll(' ', '');
};

const DashboardPage = () => {
  const inProgress = useDecisionStore((state) => state.inProgressDecisions);
  const completed = useDecisionStore((state) => state.completedDecisions);
  const removeDecision = useDecisionStore((state) => state.removeDecision);

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortOption, setSortOption] = useState<SortOption>('latest');
  const [removingDecisionId, setRemovingDecisionId] = useState<string[]>([]);

  const decisions = useMemo(() => {
    const completedIds = new Set(completed.map((decision) => decision.id));

    const progressItems: DashboardDecision[] = inProgress
      .filter((item: InProgressDecision) => !completedIds.has(item.id))
      .map((item) => ({
        id: item.id,
        title: item.title.trim() || '제목 없음',
        description: item.description.trim() || '작성 중',
        date: formatDate(item.updatedAt),
        status: 'in-progress',
        sortDate: Date.parse(item.updatedAt) || 0,
      }));

    const completedItems: DashboardDecision[] = completed.map((item: DecisionRecord) => ({
      id: item.id,
      title: item.title.trim() || '제목 없음',
      description: item.description.trim() || '작성 중',
      date: formatDate(item.updatedAt ?? item.date),
      status: 'completed',
      sortDate: Date.parse(item.updatedAt ?? item.date.replaceAll('.', '-')) || 0,
    }));

    return [...progressItems, ...completedItems];
  }, [inProgress, completed]);

  const totalCount = decisions.length;
  const completedCount = completed.filter((item) =>
    decisions.some((decision) => (
      decision.id === item.id && decision.status === 'completed'
    )),
  ).length;
  const inProgressCount = totalCount - completedCount;
  const completionRate = totalCount === 0
    ? 0
    : Math.round((completedCount / totalCount) * 100);

  const filteredDecisions = useMemo(() => {
    const filtered = decisions.filter((decision) => (
      statusFilter === 'all' || decision.status === statusFilter
    ));

    return [...filtered].sort((first, second) => {
      if (sortOption === 'latest') return second.sortDate - first.sortDate;
      if (sortOption === 'oldest') return first.sortDate - second.sortDate;
      if (sortOption === 'title') return first.title.localeCompare(second.title);
      return 0;
    });
  }, [decisions, statusFilter, sortOption]);

  const handleDeleteDecision = (id: string) => {
    setRemovingDecisionId((current) => [...current, id]);

    const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 300;

    window.setTimeout(() => {
      removeDecision(id);
      setRemovingDecisionId((current) => current.filter((removingId) => removingId !== id));
    }, delay);
  };

  return (
    <>
      <Header sticky />

      <main className="dashboard-page">
        <section className="dashboard-page-header">
          <div>
            <p className="dashboard-eyebrow">YOUR WORKSPACE</p>
            <p className="dashboard-title">DashBoard</p>
            <p className="dashboard-description">
              지금까지의 고민과 선택을 확인해보세요.
            </p>
          </div>

          <a href="/decisions" className="dashboard-create-button">
            + 새로운 결정
          </a>
        </section>

        <section className="dashboard-stats">
          <article className="dashboard-stat-card">
            <div className="dashboard-stat-card-icon purple">
              <ListTodo size={20} />
            </div>
            <p className="dashboard-stat-label">전체 결정</p>
            <strong className="dashboard-stat-value">{totalCount}</strong>
          </article>

          <article className="dashboard-stat-card">
            <div className="dashboard-stat-card-icon blue">
              <Clock3 size={20} />
            </div>
            <p className="dashboard-stat-label">진행 중</p>
            <strong className="dashboard-stat-value">{inProgressCount}</strong>
          </article>

          <article className="dashboard-stat-card">
            <div className="dashboard-stat-card-icon pink">
              <Target size={20} />
            </div>
            <p className="dashboard-stat-label">완료율</p>
            <strong className="dashboard-stat-value">{completionRate}%</strong>
          </article>
        </section>

        <section className="dashboard-recent-decisions">
          <div className="dashboard-list-heading">
            <div>
              <h3>All Decisions</h3>
              <p>기록한 모든 결정을 확인하세요.</p>
            </div>

            <span className="dashboard-result-count">
              {filteredDecisions.length}개의 결정
            </span>
          </div>

          <div className="dashboard-toolbar">
            <div className="dashboard-filter">
              {([
                ['all', '전체'],
                ['in-progress', '진행 중'],
                ['completed', '완료'],
              ] as const).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={`dashboard-filter-button ${statusFilter === value ? 'active' : ''}`}
                  onClick={() => setStatusFilter(value)}
                >
                  {label}
                </button>
              ))}
            </div>

            <select
              className="dashboard-sort"
              value={sortOption}
              onChange={(event) => setSortOption(event.target.value as SortOption)}
            >
              <option value="latest">최신순</option>
              <option value="oldest">오래된순</option>
              <option value="title">제목순</option>
            </select>
          </div>

          {filteredDecisions.length > 0 ? (
            <div className="dashboard-decision-list">
              {filteredDecisions.map((decision) => (
                <DecisionCard
                  key={decision.id}
                  id={decision.id}
                  title={decision.title}
                  description={decision.description}
                  date={decision.date}
                  status={decision.status}
                  isRemoving={removingDecisionId.includes(decision.id)}
                  onDelete={handleDeleteDecision}
                />
              ))}
            </div>
          ) : (
            <div className="dashboard-empty">
              <ListTodo size={32} strokeWidth={1.5} />
              <h3>
                {statusFilter === 'all'
                  ? '아직 기록된 결정이 없어요.'
                  : statusFilter === 'in-progress'
                    ? '진행 중인 결정이 없어요.'
                    : '완료된 결정이 없어요.'}
              </h3>
              <p>새로운 결정을 기록하고, 진행 상황을 관리해보세요.</p>
              {statusFilter === 'all' && (
                <a href="/decision">첫 번째 결정을 기록해보세요.</a>
              )}
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default DashboardPage;