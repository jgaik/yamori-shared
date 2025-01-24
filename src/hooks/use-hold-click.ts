import { HTMLAttributes, useMemo, useRef } from "react";

export function useHoldClick(
  delay = 200
): Pick<
  HTMLAttributes<HTMLElement>,
  "onPointerDown" | "onPointerLeave" | "onPointerUp"
> {
  const timerId = useRef<ReturnType<typeof setInterval>>(null);

  return useMemo(() => {
    const clearTimer = () => {
      if (!timerId.current) return;

      clearInterval(timerId.current);
      timerId.current = null;
    };

    return {
      onPointerDown: (e) => {
        const element = e.currentTarget;
        timerId.current = setInterval(() => {
          element.click();
        }, delay);
      },
      onPointerUp: clearTimer,
      onPointerLeave: clearTimer,
    };
  }, [delay]);
}
