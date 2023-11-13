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

export function assert(value: unknown, message?: string): asserts value {
  if (!value) {
    throw new Error(`unreachable${message ? `: ${message}` : ''}`);
  }
}
