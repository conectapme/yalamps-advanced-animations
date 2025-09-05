import { useEffect, useRef, RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export interface ParallaxElement {
  ref: RefObject<HTMLElement>;
  speed: number; // Negative values move slower, positive values move faster
  ease?: string;
}

export interface UseGsapParallaxOptions {
  trigger?: RefObject<HTMLElement>;
  start?: string;
  end?: string;
  scrub?: number | boolean;
}

export function useGsapParallax(
  elements: ParallaxElement[],
  options: UseGsapParallaxOptions = {}
) {
  const contextRef = useRef<gsap.Context>();

  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    contextRef.current = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: options.trigger?.current || "body",
          start: options.start || "top top",
          end: options.end || "bottom top",
          scrub: options.scrub ?? 1.2,
        },
      });

      elements.forEach(({ ref, speed, ease = "none" }) => {
        if (ref.current) {
          timeline.to(
            ref.current,
            {
              yPercent: speed,
              ease,
            },
            0
          );
        }
      });
    });

    return () => {
      contextRef.current?.revert();
    };
  }, [elements, options]);

  return contextRef.current;
}
