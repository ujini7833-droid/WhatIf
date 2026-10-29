
import './RecentDecisions.css';

// import DecisionCard from './DecisionCard';

const recentDecisions = [
    {
        id: 1,
        title: '11월 여행지는 어디로?',
        description: '혼자 떠나는 가을 여행',
        date: '2026.10.28',
        status: 'completed',
    },
    {
        id: 2,
        title: '새 노트북 고르기',
        description: '개발용 노트북 비교',
        date: '2026.10.25',
        status: 'in-progress',
    },
    {
        id: 3,
        title: '프로젝트 주제 정하기',
        description: '포트폴리오 프로젝트 아이디어',
        date: '2026.10.20',
        status: 'completed',
    },
];

const RecentDecisions = () => {
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
            {/*

            <div className="recent-decisions-list">
                {recentDecisions.map((decision) => (
                     <DecisionCard
                        key={decision.id}
                        title={decision.title}
                        description={decision.description}
                        date={decision.date}
                        status={decision.status}
                    />
                ))}
            </div>
            */}
        </section>
    );
};

export default RecentDecisions;
