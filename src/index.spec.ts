import { DeferMap } from '.';

describe('DeferMap', () => {
  describe('defer method', () => {
    it('should add item', () => {
      const map = new DeferMap();
      map.defer('1');
      map.defer('2');
      map.defer('3');

      expect(map.size).toBe(3);
    });

    it('should override existing item', async () => {
      const map = new DeferMap();
      map.defer('1');
      map.defer('1');

      expect(map.size).toBe(1);
    });

    it('should return object', async () => {
      const map = new DeferMap();

      expect(map.defer('1')).toBeDefined();
    });
  });

  describe('set method', () => {
    it('should add item', () => {
      const map = new DeferMap();
      map.set('1', 'a');
      map.set('2', 'b');
      map.set('3', 'c');

      expect(map.size).toBe(3);
    });

    it('should override existing item', async () => {
      const map = new DeferMap();
      map.set('1', 'a');
      map.set('1', 'b');

      expect(map.size).toBe(1);
      expect(await map.get('1').result).toBe('b');
    });

    it('should return instance', async () => {
      const map = new DeferMap();

      expect(map.set('1', 'a')).toBe(map);
    });
  });

  describe('get method', () => {
    it('should return value', async () => {
      const map = new DeferMap();
      map.set('1', 'a');

      expect(await map.get('1').result).toBe('a');
    });

    it('should return undefined when item not exists', () => {
      const map = new DeferMap();

      expect(map.get('not_exists')).toBeUndefined();
    });

    it('should return undefined when item is expired', () => {
      const map = new DeferMap({ expiry: -1 });
      map.set('1', 'a');

      expect(map.get('1')).toBeUndefined();
    });
  });

  describe('delete method', () => {
    it('should remove item by key', async () => {
      const map = new DeferMap();
      map.set('1', 'a');
      map.set('2', 'b');
      map.set('3', 'c');
      map.delete('2');

      expect(map.size).toBe(2);
      expect(map.get('2')).toBeUndefined();
      expect(await map.get('1').result).toBe('a');
      expect(await map.get('3').result).toBe('c');
    });
  });

  describe('clear method', () => {
    it('should remove all items', () => {
      const map = new DeferMap();
      map.set('1', 'a');
      map.set('2', 'b');
      map.set('3', 'c');
      map.clear();

      expect(map.size).toBe(0);
    });
  });

  describe('cleanup method', () => {
    it('should delete expired items', () => {
      const map = new DeferMap({ expiry: -1 });
      map.set('1', 'a');
      map.cleanup();

      expect(map.size).toBe(0);
    });

    it('should not delete unexpired items', () => {
      const map = new DeferMap({ expiry: 3000 });
      map.set('1', 'a');
      map.cleanup();

      expect(map.size).toBe(1);
    });
  });
});
