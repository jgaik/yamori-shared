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
      const rect = source.getBoundingClientRect();

      target.style.width = `${rect.width}px`;
      target.style.height = `${rect.height}px`;

      if (target instanceof HTMLCanvasElement) {
        const dpr = window.devicePixelRatio || 1;

        target.width = Math.round(rect.width * dpr);
        target.height = Math.round(rect.height * dpr);

        const ctx = target.getContext("2d");
        ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    };

    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(source);

    return () => observer.disconnect();
  }, [sourceRef, targetRef]);
}
