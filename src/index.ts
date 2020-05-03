import { Configuration, MapItem } from './interfaces';

export class DeferMap<K, V> {
  constructor(config?: Configuration) {
    if (config) {
      this.config = config;
    }
  }

  /**
   * Configuration.
   */
  private config: Configuration = {};

  /**
   * Map reference
   */
  private ref = new Map<K, MapItem<V>>();

  /**
   * Map size.
   */
  get size() {
    return this.ref.size;
  }

  /**
   * Set deferred item.
   *
   * @param key Item key.
   */
  defer(key: K) {
    let done: (value: V) => void;
    const result = new Promise<V>((resolve) => {
      done = resolve;
    });

    this.ref.set(key, {
      result,
      done,
      expiry: this.getExpiry(),
    });

    return this;
  }

  /**
   * Set item.
   *
   * @param key Item key.
   * @param value Item value.
   */
  set(key: K, value: V) {
    this.ref.set(key, {
      result: Promise.resolve(value),
      expiry: this.getExpiry(),
    });

    return this;
  }

  /**
   * Get item.
   *
   * @param key Item key.
   */
  get(key: K) {
    const item = this.ref.get(key);

    if (!item) {
      return;
    }

    if (this.isExpired(item)) {
      // expired
      this.ref.delete(key);
      return;
    }

    return item;
  }

  /**
   * Delete item.
   *
   * @param key Item key.
   */
  delete(key: K) {
    return this.ref.delete(key);
  }

  /**
   * Clear all items.
   */
  clear() {
    this.ref.clear();
  }

  /**
   * Remove all expired items.
   */
  cleanup() {
    for (const [key, item] of this.ref) {
      if (this.isExpired(item)) {
        this.delete(key);
      }
    }
  }

  /**
   * Get expiry.
   */
  private getExpiry() {
    if (!this.config.expiry) {
      return null;
    }

    const now = new Date().getTime();
    return now + this.config.expiry;
  }

  /**
   * Check if an item is expired.
   *
   * @param item Item object.
   */
  private isExpired(item: MapItem<V>) {
    if (!item.expiry) {
      return false;
    }

    const now = new Date().getTime();
    return item.expiry < now;
  }
}
