/**
 * Sakura Album Store — tracks collected photos from conversations
 */
const STORAGE_KEY = 'sg_broker_sakura_album';

export class SakuraAlbumStore {
  static load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  static save(photos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
  }

  static addPhoto({ src, alt, caption, conversationId, timestamp }) {
    const photos = this.load();
    // Don't add duplicates
    if (photos.some(p => p.src === src && p.conversationId === conversationId)) return;
    photos.push({
      src,
      alt: alt || '',
      caption: caption || '',
      conversationId,
      timestamp: timestamp || new Date().toISOString(),
    });
    this.save(photos);
  }

  static getCount() {
    return this.load().length;
  }
}
