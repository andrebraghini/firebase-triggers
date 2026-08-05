export type MockFn = ((...args: any[]) => any) & {
  mock: { calls: any[][] };
  mockClear(): void;
  mockReturnValue(value: unknown): MockFn;
  mockImplementation(impl: (...args: any[]) => any): MockFn;
};

export function fn(implementation?: (...args: any[]) => any): MockFn {
  let impl = implementation;
  const calls: any[][] = [];

  const mockFn = ((...args: any[]) => {
    calls.push(args);
    return impl?.(...args);
  }) as MockFn;

  mockFn.mock = { calls };
  mockFn.mockClear = () => {
    calls.length = 0;
  };
  mockFn.mockReturnValue = (value: unknown) => {
    impl = () => value;
    return mockFn;
  };
  mockFn.mockImplementation = (next: (...args: any[]) => any) => {
    impl = next;
    return mockFn;
  };

  return mockFn;
}
