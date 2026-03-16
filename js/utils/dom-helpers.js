/**
 * DOM helper utilities
 */
export function el(tag, attrs = {}, ...children) {
  const elem = document.createElement(tag);
  for (const [key, val] of Object.entries(attrs)) {
    if (key === 'className') elem.className = val;
    else if (key === 'dataset') Object.assign(elem.dataset, val);
    else if (key.startsWith('on')) elem.addEventListener(key.slice(2).toLowerCase(), val);
    else elem.setAttribute(key, val);
  }
  for (const child of children) {
    if (child == null) continue;
    if (typeof child === 'string' || typeof child === 'number') {
      elem.appendChild(document.createTextNode(child));
    } else {
      elem.appendChild(child);
    }
  }
  return elem;
}

const MODULE_LABELS = { bcp: 'BCP', comgi: 'ComGI', pgi: 'PGI', hi: 'HI' };
export function moduleLabel(mod) {
  return MODULE_LABELS[mod] || mod.toUpperCase();
}

export function clearChildren(parent) {
  while (parent.firstChild) parent.removeChild(parent.firstChild);
}
