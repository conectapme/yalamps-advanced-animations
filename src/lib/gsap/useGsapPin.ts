import { useEffect, useRef, RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export interface UseGsapPinOptions {
  pinSpacing?: boolean;
  start?: string;
  end?: string;
  anticipatePin?: number;
  refreshPriority?: number;
  onPin?: () => void;
  onUnpin?: () => void;
}

export function useGsapPin(
  elementRef: RefObject<HTMLElement>,
  options: UseGsapPinOptions = {}
) {
  const contextRef = useRef<gsap.Context>();

  useEffect(() => {
    if (typeof window === "undefined" || !elementRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    contextRef.current = gsap.context(() => {
      const {
        pinSpacing = true,
        start = "top top",
        end = "+=100%",
        anticipatePin = 1,
        refreshPriority = 0,
        onPin,
        onUnpin,
      } = options;

      ScrollTrigger.create({
        trigger: elementRef.current,
        pin: true,
        pinSpacing,
        start,
        end,
        anticipatePin,
        refreshPriority,
        onToggle: (self) => {
          if (self.isActive && onPin) {
            onPin();
          } else if (!self.isActive && onUnpin) {
            onUnpin();
          }
        },
      });
    });

    return () => {
      contextRef.current?.revert();
    };
  }, [elementRef, options]);

  return contextRef.current;
}
