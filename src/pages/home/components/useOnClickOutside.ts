import { useEffect } from "react";

export function useOnClickOutside(
  ref: React.RefObject<HTMLElement>,
  handler: (event: MouseEvent | null) => void
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent | null) => {
      // Type guard to ensure event is of type MouseEvent
      if (event && "target" in event) {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          handler(event as MouseEvent); // Cast event to MouseEvent
        }
      }
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}
