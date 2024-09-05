import { Nullable } from '@/types';

export function isNil<T>(value: Nullable<T>): value is null | undefined {
  return value === null || value === undefined;
}

export function nilFilter<T>(value: Nullable<T>): value is T {
  return !isNil(value);
}
