"use client";

import { useCallback, useEffect, useState } from "react";
import { getTypedObjectEntries } from "../utils";

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
    | Partial<Record<K, string>>
    | ((prev: Partial<Record<K, string>>) => Partial<Record<K, string | null>>)
    | null,
  options?: { replace?: boolean; dispatchEvent?: boolean }
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
      const updateHistory = (params?: URLSearchParams) => {
        const newUrl =
          window.location.pathname +
          (params?.toString() ? `?${params}` : "") +
          window.location.hash;

        if (options.replace) {
          window.history.replaceState({}, "", newUrl);
        } else {
          window.history.pushState({}, "", newUrl);
        }
        if (options.dispatchEvent) window.dispatchEvent(new Event("popstate"));
      };

      if (updater === null) {
        updateHistory();
        setParamsState({});
        return;
      }

      const urlParams = new URLSearchParams();
      let next: Partial<Record<string, string | null>>;

      if (typeof updater === "function") {
        const prev = parseParams<K>();
        const updates = updater(prev);
        next = { ...prev, ...updates } as Record<string, string | null>;

        Object.entries(next).forEach(([key, value]) => {
          if (value) {
            urlParams.set(key, value);
          } else {
            delete next[key];
          }
        });
      } else {
        getTypedObjectEntries(updater).forEach(([key, value]) => {
          urlParams.set(key, value ?? "");
        });
        next = updater;
      }

      updateHistory(urlParams);
      setParamsState(next as Partial<Record<K, string>>);
    },
    []
  );

  return [params, setParams] as const;
}
