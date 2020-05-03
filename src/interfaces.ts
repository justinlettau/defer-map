/**
 * Configuration options.
 */
export interface Configuration {
  /**
   * Number of milliseconds before items will expire.
   */
  expiry?: number;
}

/**
 * Map item.
 */
export interface MapItem<T> {
  /**
   * Item result.
   */
  result: Promise<T>;

  /**
   * Resolve function from promise.
   */
  done?: (value: T) => void;

  /**
   * Date, in milliseconds, the item will be considered expired.
   */
  expiry: number;
}
