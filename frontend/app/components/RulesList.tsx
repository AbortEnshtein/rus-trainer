'use client';

import { Rule } from '../types';

interface RulesListProps {
  rules: Rule[];
  selectedRule: string | null;
  onSelectRule: (rule: string | null) => void;
  onClose: () => void;
}

export default function RulesList({ rules, selectedRule, onSelectRule, onClose }: RulesListProps) {
  const totalWords = rules.reduce((sum, r) => sum + r.word_count, 0);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '42rem' }}>
        <div className="modal-header">
          <h2 className="modal-title">Правила</h2>
          <button onClick={onClose} className="modal-close">×</button>
        </div>

        <div className="modal-body">
          <button
            onClick={() => onSelectRule(null)}
            className={`rule-button ${selectedRule === null ? 'rule-button-active' : ''}`}
            style={{ marginBottom: '0.5rem' }}
          >
            <div className="rule-name">Все слова</div>
            <div className="rule-count">{totalWords} слов</div>
          </button>

          <div style={{ height: '1px', background: 'var(--gray-200)', margin: '0.75rem 0' }} />

          <div className="rules-list">
            {rules.map((rule) => (
              <button
                key={rule.name}
                onClick={() => onSelectRule(rule.name)}
                className={`rule-button ${selectedRule === rule.name ? 'rule-button-active' : ''}`}
              >
                <div className="rule-name">{rule.name}</div>
                <div className="rule-count">{rule.word_count} слов</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}