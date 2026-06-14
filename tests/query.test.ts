import { describe, expect, test, beforeEach } from 'bun:test';
import { ParamManager } from '../src/query';

describe('ParamManager (array params version)', () => {
  beforeEach(() => {
    // reset static state between tests (important!)
    ParamManager.add(null as any);
  });

  describe('add()', () => {
    test('sets params and returns class for chaining', () => {
      expect(ParamManager.add([{ page: 1 }])).toBe(ParamManager);
    });

    test('accepts null params', () => {
      const keys: unknown[] = [];

      ParamManager.add(null).into(keys);

      expect(keys).toEqual([null]);
    });

    test('accepts empty array', () => {
      const keys: unknown[] = [];

      ParamManager.add([]).into(keys);

      expect(keys).toEqual([[]]);
    });

    test('accepts array of objects', () => {
      const keys: unknown[] = [];

      ParamManager.add([{ page: 1 }, { limit: 10 }]).into(keys);

      expect(keys).toEqual([[{ page: 1 }, { limit: 10 }]]);
    });
  });

  describe('into()', () => {
    test('throws if keys is not array', () => {
      expect(() => ParamManager.add([{ page: 1 }]).into('invalid' as any)).toThrow(
        'Query Keys object must be an array',
      );
    });

    test('adds params array to empty keys', () => {
      const keys: unknown[] = [];

      ParamManager.add([{ page: 1 }]).into(keys);

      expect(keys).toEqual([[{ page: 1 }]]);
    });

    test('does not add duplicate array (deep equal)', () => {
      const keys: unknown[] = [[{ page: 1 }]];

      ParamManager.add([{ page: 1 }]).into(keys);

      expect(keys).toEqual([[{ page: 1 }]]);
    });

    test('adds different arrays', () => {
      const keys: unknown[] = [[{ page: 1 }]];

      ParamManager.add([{ page: 2 }]).into(keys);

      expect(keys).toEqual([[{ page: 1 }], [{ page: 2 }]]);
    });

    test('does not confuse order-insensitive object equality', () => {
      const keys: unknown[] = [[{ a: 1, b: 2 }]];

      ParamManager.add([{ b: 2, a: 1 }]).into(keys);

      expect(keys).toEqual([[{ a: 1, b: 2 }]]);
    });

    test('handles multiple objects in params array', () => {
      const keys: unknown[] = [];

      ParamManager.add([{ page: 1 }, { limit: 10 }]).into(keys);

      expect(keys).toEqual([[{ page: 1 }, { limit: 10 }]]);
    });

    test('treats null params correctly', () => {
      const keys: unknown[] = [];

      ParamManager.add(null).into(keys);

      expect(keys).toEqual([null]);
    });

    test('does not duplicate null params', () => {
      const keys: unknown[] = [null];

      ParamManager.add(null).into(keys);

      expect(keys).toEqual([null]);
    });

    test('adds null and array separately', () => {
      const keys: unknown[] = [null];

      ParamManager.add([{ page: 1 }]).into(keys);

      expect(keys).toEqual([null, [{ page: 1 }]]);
    });

    test('resets internal state after into()', () => {
      const keys: unknown[] = [];

      ParamManager.add([{ page: 1 }]).into(keys);

      ParamManager.into(keys);

      expect(keys).toEqual([[{ page: 1 }], null]);
    });

    test('multiple sequential adds work correctly', () => {
      const keys: unknown[] = [];

      ParamManager.add([{ page: 1 }]).into(keys);
      ParamManager.add([{ page: 2 }]).into(keys);
      ParamManager.add([{ page: 3 }]).into(keys);

      expect(keys).toEqual([[{ page: 1 }], [{ page: 2 }], [{ page: 3 }]]);
    });

    test('does not mutate params reference unexpectedly', () => {
      const params = [{ page: 1 }];
      const keys: unknown[] = [];

      ParamManager.add(params).into(keys);

      params.push({ page: 2 });

      // stored value should not change if Compare deep compare worked correctly at insert time
      expect(keys).toEqual([[{ page: 1 }]]);
    });

    test('allows different param arrays with same length but different values', () => {
      const keys: unknown[] = [];

      ParamManager.add([{ page: 1 }]).into(keys);
      ParamManager.add([{ page: 2 }]).into(keys);

      expect(keys).toEqual([[{ page: 1 }], [{ page: 2 }]]);
    });

    test('allows primitives in params array', () => {
      const keys: unknown[] = [[1, 'test', false]];

      ParamManager.add([1, 'test', true]).into(keys);

      expect(keys).toEqual([
        [1, 'test', false],
        [1, 'test', true],
      ]);
    });
  });
});
