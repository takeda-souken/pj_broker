/**
 * Modal component
 */
import { el } from '../utils/dom-helpers.js';

export function showModal({ title, body, actions = [] }) {
  const overlay = el('div', { className: 'modal-overlay' });
  const modal = el('div', { className: 'modal' });

  if (title) modal.appendChild(el('div', { className: 'modal__title' }, title));

  if (typeof body === 'string') {
    modal.appendChild(el('div', { className: 'modal__body' }, body));
  } else if (body) {
    modal.appendChild(body);
  }

  if (actions.length) {
    const actionsEl = el('div', { className: 'modal__actions' });
    for (const { label, cls = 'btn', handler } of actions) {
      actionsEl.appendChild(el('button', { className: cls, onClick: () => { dismiss(); handler?.(); } }, label));
    }
    modal.appendChild(actionsEl);
  }

  overlay.appendChild(modal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) dismiss(); });
  document.body.appendChild(overlay);

  function dismiss() { overlay.remove(); }
  return dismiss;
}
