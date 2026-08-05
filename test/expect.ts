import assert from 'node:assert/strict';

type Matcher = {
  toBe(expected: unknown): void;
  toEqual(expected: unknown): void;
  toMatchObject(expected: Record<string, unknown> | unknown[]): void;
  toBeDefined(): void;
  toBeUndefined(): void;
  toThrow(expected?: unknown): void;
  toHaveBeenCalled(): void;
  toHaveBeenCalledTimes(times: number): void;
  toHaveBeenCalledWith(...args: unknown[]): void;
  toBeCalled(): void;
  toBeCalledWith(...args: unknown[]): void;
  not: {
    toHaveBeenCalled(): void;
    toBeCalled(): void;
  };
};

function assertMatchObject(actual: unknown, expected: Record<string, unknown> | unknown[]) {
  if (Array.isArray(expected)) {
    assert.deepEqual(actual, expected);
    return;
  }
  assert.equal(typeof actual, 'object');
  assert.notEqual(actual, null);
  for (const [key, value] of Object.entries(expected)) {
    assert.deepEqual((actual as Record<string, unknown>)[key], value);
  }
}

function getCalls(actual: unknown): unknown[][] {
  return (actual as { mock?: { calls: unknown[][] } })?.mock?.calls ?? [];
}

export function expect(actual: unknown): Matcher {
  return {
    toBe(expected: unknown) {
      assert.equal(actual, expected);
    },
    toEqual(expected: unknown) {
      assert.deepEqual(actual, expected);
    },
    toMatchObject(expected: Record<string, unknown> | unknown[]) {
      assertMatchObject(actual, expected);
    },
    toBeDefined() {
      assert.notEqual(actual, undefined);
    },
    toBeUndefined() {
      assert.equal(actual, undefined);
    },
    toThrow(expected?: unknown) {
      assert.equal(typeof actual, 'function');
      assert.throws(actual as () => unknown, expected as assert.AssertPredicate);
    },
    toHaveBeenCalled() {
      assert.ok(getCalls(actual).length > 0, 'expected mock to have been called');
    },
    toHaveBeenCalledTimes(times: number) {
      assert.equal(getCalls(actual).length, times);
    },
    toHaveBeenCalledWith(...args: unknown[]) {
      assert.ok(
        getCalls(actual).some((call) => {
          try {
            assert.deepEqual(call, args);
            return true;
          } catch {
            return false;
          }
        }),
        `expected mock to have been called with ${JSON.stringify(args)}`,
      );
    },
    toBeCalled() {
      assert.ok(getCalls(actual).length > 0, 'expected mock to have been called');
    },
    toBeCalledWith(...args: unknown[]) {
      this.toHaveBeenCalledWith(...args);
    },
    not: {
      toHaveBeenCalled() {
        assert.equal(getCalls(actual).length, 0);
      },
      toBeCalled() {
        assert.equal(getCalls(actual).length, 0);
      },
    },
  };
}

export function fail(message?: string): never {
  assert.fail(message);
}
