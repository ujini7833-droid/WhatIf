import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import './DecisionCard.css';

interface DecisionCardProps {
    id: string;
    title: string;
    description: string;
    date: string;
    status: 'completed' | 'in-progress';
    onDelete: (id: string) => void;
}

const DecisionCard = ({
    id,
    title,
    description,
    date,
    status,
    onDelete,
}: DecisionCardProps) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleDelete = () => {
        onDelete(id);
        setIsDeleteModalOpen(false);
    };

    return (
        <>
            <article className="decision-card">
                <div className="decision-card-top">
                    <span className={`decision-card-status decision-card-status-${status}`}>
                        {status === 'completed' ? '완료' : '진행 중'}
                    </span>

                    <div className="decision-card-top-actions">
                        <span className="decision-card-date">
                            {date}
                        </span>

                        <button
                            type="button"
                            className="decision-card-delete"
                            aria-label="결정 삭제"
                            onClick={() => setIsDeleteModalOpen(true)}
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>

                <div className="decision-card-content">
                    <h3 className="decision-card-title">
                        {title}
                    </h3>

                    <p className="decision-card-description">
                        {description}
                    </p>
                </div>

                <a
                    className="decision-card-footer"
                    href={
                        status === 'completed'
                            ? `/result?id=${encodeURIComponent(id)}`
                            : `/decision?id=${encodeURIComponent(id)}`
                    }
                >
                    <span className="decision-card-action">
                        {status === 'completed'
                            ? '결과 보기'
                            : '이어서 결정하기'}
                    </span>

                    <span className="decision-card-arrow" aria-hidden="true">
                        →
                    </span>
                </a>
            </article>

            {isDeleteModalOpen && (
                <div
                    className="decision-delete-overlay"
                    onClick={() => setIsDeleteModalOpen(false)}
                >
                    <div
                        className="decision-delete-modal"
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="decision-delete-title"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="decision-delete-icon">
                            <Trash2 size={22} />
                        </div>

                        <h2
                            className="decision-delete-title"
                            id="decision-delete-title"
                        >
                            이 결정을 삭제할까요?
                        </h2>

                        <div className="decision-delete-name">
                            <strong>{title}</strong>
                        </div>

                        <p className="decision-delete-message">
                            삭제한 결정은 복구할 수 없어요.
                        </p>

                        <div className="decision-delete-actions">
                            <button
                                type="button"
                                className="decision-delete-cancel"
                                onClick={() => setIsDeleteModalOpen(false)}
                            >
                                취소
                            </button>

                            <button
                                type="button"
                                className="decision-delete-confirm"
                                onClick={handleDelete}
                            >
                                삭제하기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DecisionCard;