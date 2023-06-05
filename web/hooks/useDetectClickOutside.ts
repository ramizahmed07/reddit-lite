import { useEffect, useRef } from "react";

export function useDetectClickOutside(handler: (() => void) | null) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (!ref?.current?.contains(e.target as any) && handler) {
        handler();
      }
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
    };
  }, [handler]);

  return {
    ref,
  };
}
