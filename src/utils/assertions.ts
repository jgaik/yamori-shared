import { Nullable } from "@/types";

export function isNil<T>(value: Nullable<T>): value is null | undefined {
  return value === null || value === undefined;
}

export function nilFilter<T>(value: Nullable<T>): value is T {
  return !isNil(value);
}

export function assertNonNullable<T>(
  value: Nullable<T>,
  name: string
): asserts value is T {
  if (isNil(value)) throw new Error(`[Assertion Error] ${name} is ${value}.`);
}

export function getNonNullable<T>(value: Nullable<T>, name: string): T {
  assertNonNullable(value, name);

  return value;
}
