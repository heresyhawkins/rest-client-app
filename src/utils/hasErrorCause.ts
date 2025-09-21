export function hasErrorCauseCode(cause: unknown): cause is {
  code?: string;
  errno?: number;
  syscall?: string;
  hostname?: string;
} {
  return typeof cause === 'object' && cause !== null && 'code' in cause;
}
