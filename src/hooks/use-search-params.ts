"use client";

import { useCallback, useEffect, useState } from "react";

function parseParams<K extends string>(): Partial<Record<K, string>> {
  const searchParams = new URLSearchParams(window.location.search);
  const returnObject: Partial<Record<K, string>> = {};
  searchParams.forEach((value, key) => {
    returnObject[key as K] = value;
  });
  return returnObject;
}

export type SearchParamsSetter<K extends string> = (
  updater:
    | Partial<Record<K, string | null>>
    | ((prev: Partial<Record<K, string>>) => Partial<Record<K, string | null>>)
    | null,
  options?: { replace?: boolean }
) => void;

export function useSearchParams<K extends string>() {
  const [params, setParamsState] = useState<Partial<Record<K, string>>>(() =>
    parseParams<K>()
  );

  useEffect(() => {
    const handler = () => setParamsState(parseParams<K>());
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  const setParams = useCallback<SearchParamsSetter<K>>(
    (updater, options = {}) => {
      if (updater === null) {
        const newUrl = window.location.pathname + window.location.hash;
        options.replace
          ? window.history.replaceState({}, "", newUrl)
          : window.history.pushState({}, "", newUrl);
        setParamsState({});
        return;
      }

      const prev = parseParams<K>();
      const updates = typeof updater === "function" ? updater(prev) : updater;

      const next = { ...prev, ...updates } as Record<string, string | null>;
      const urlParams = new URLSearchParams();

      Object.entries(next).forEach(([key, value]) => {
        if (value) {
          urlParams.set(key, value);
        } else {
          delete next[key];
        }
      });

      const newUrl =
        window.location.pathname +
        (urlParams.toString() ? `?${urlParams}` : "") +
        window.location.hash;

      if (options.replace) {
        window.history.replaceState({}, "", newUrl);
      } else {
        window.history.pushState({}, "", newUrl);
      }

      setParamsState(next as Partial<Record<K, string>>);
    },
    []
  );

  return [params, setParams] as const;
}
