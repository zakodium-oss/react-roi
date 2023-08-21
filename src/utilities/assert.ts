export function assertUnreachable(x: never, message?: string): never {
  throw new Error(
    `unreachable: ${
      message
        ? message
        : typeof x === 'string'
        ? x
        : 'reached assertUnreachable'
    }`,
  );
}

export function assertNotNull<T>(
  value: T | null,
): asserts value is Exclude<T, null> {
  if (value === null) {
    throw new Error('unexpected null value');
  }
}

export function assert(value: unknown, message?: string): asserts value {
  if (!value) {
    throw new Error(`unreachable${message ? `: ${message}` : ''}`);
  }
}
