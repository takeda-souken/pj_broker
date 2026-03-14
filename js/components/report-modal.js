/**
 * Report modal — lets users flag question issues (wrong answer, translation error, etc.)
 */
import { el } from '../utils/dom-helpers.js';
import { showModal } from './modal.js';
import { showToast } from './toast.js';
import { sendFeedback } from '../utils/gas-client.js';
import { tr } from '../utils/i18n.js';

const ISSUE_TYPES = [
  { value: 'wrong_answer', label: 'Wrong answer / explanation' },
  { value: 'translation', label: 'Translation error' },
  { value: 'unclear', label: 'Unclear / ambiguous question' },
  { value: 'other', label: 'Other' },
];

/**
 * Show a modal for reporting a question issue.
 * @param {{ module: string, questionId: string, question: string }} ctx
 */
export function showReportModal({ module, questionId, question }) {
  const body = el('div', { className: 'modal__body' });

  // Question preview
  const preview = question.length > 80 ? question.slice(0, 80) + '...' : question;
  body.appendChild(el('div', { className: 'text-sm text-secondary', style: 'margin-bottom:8px;' },
    `${questionId}: ${preview}`));

  // Issue type selector
  const select = el('select', { className: 'report-select' });
  for (const t of ISSUE_TYPES) {
    select.appendChild(el('option', { value: t.value }, t.label));
  }
  body.appendChild(select);

  // Message textarea
  const textarea = el('textarea', {
    className: 'report-textarea',
    placeholder: tr('report.placeholder', 'Describe the issue...'),
    rows: '3',
  });
  body.appendChild(textarea);

  showModal({
    title: tr('report.title', 'Report Issue'),
    body,
    actions: [
      {
        label: tr('report.send', 'Send'),
        cls: 'btn btn--primary',
        handler: () => {
          const msg = `[${select.value}] ${textarea.value}`.trim();
          sendFeedback({ type: 'correction', module, questionId, message: msg });
          showToast(tr('report.sent', 'Report sent — thank you!'), 'success');
        },
      },
      {
        label: tr('report.cancel', 'Cancel'),
        cls: 'btn btn--outline',
      },
    ],
  });
}
