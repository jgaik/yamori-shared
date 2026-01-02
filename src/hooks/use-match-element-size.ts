import { RefObject } from "react";
import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect";

export function useMatchElementSize(
  sourceRef: RefObject<HTMLElement | null>,
  targetRef: RefObject<HTMLElement | null>
) {
  useIsomorphicLayoutEffect(() => {
    const source = sourceRef.current;
    const target = targetRef.current;

    if (!source || !target) return;

    const resize = () => {
      const rect = target.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      source.style.width = `${rect.width}px`;
      source.style.height = `${rect.height}px`;

      if (source instanceof HTMLCanvasElement) {
        source.width = Math.round(rect.width * dpr);
        source.height = Math.round(rect.height * dpr);

        const ctx = source.getContext("2d");
        ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    };

    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(target);

    return () => observer.disconnect();
  }, [sourceRef, targetRef]);
}
