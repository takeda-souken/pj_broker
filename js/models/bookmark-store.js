/**
 * Bookmark Store — persists bookmarked terms to localStorage
 * Stores glossary term strings for later review.
 */
const STORAGE_KEY = 'sg_broker_bookmarks';

export class BookmarkStore {
  static getAll() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch { return []; }
  }

  static has(term) {
    return this.getAll().includes(term);
  }

  static add(term) {
    const list = this.getAll();
    if (!list.includes(term)) {
      list.push(term);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }
  }

  static remove(term) {
    const list = this.getAll().filter(t => t !== term);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  static toggle(term) {
    if (this.has(term)) {
      this.remove(term);
      return false;
    } else {
      this.add(term);
      return true;
    }
  }

  static count() {
    return this.getAll().length;
  }
}
