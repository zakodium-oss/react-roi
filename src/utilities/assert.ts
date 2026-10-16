export function assertUnreachable(x: never, message?: string): never {
  if (message) {
    throw new Error(`unreachable: ${message}`);
  }
  throw new Error(
    `unreachable: ${typeof x === 'string' ? x : 'reached assertUnreachable'}`,
  );
}

export function assert(value: unknown, message?: string): asserts value {
  if (!value) {
    throw new Error(`unreachable${message ? `: ${message}` : ''}`);
  }
}
