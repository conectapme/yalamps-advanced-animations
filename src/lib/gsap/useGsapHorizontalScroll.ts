import { useEffect, useRef, RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export interface UseGsapHorizontalScrollOptions {
  containerRef: RefObject<HTMLElement>;
  scrollableRef: RefObject<HTMLElement>;
  start?: string;
  end?: string;
  scrub?: number | boolean;
  pin?: boolean;
  anticipatePin?: number;
}

export function useGsapHorizontalScroll(
  options: UseGsapHorizontalScrollOptions
) {
  const contextRef = useRef<gsap.Context>();

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !options.containerRef.current ||
      !options.scrollableRef.current
    )
      return;

    gsap.registerPlugin(ScrollTrigger);

    contextRef.current = gsap.context(() => {
      const {
        containerRef,
        scrollableRef,
        start = "top top",
        end = "+=300%",
        scrub = 1,
        pin = true,
        anticipatePin = 1,
      } = options;

      const scrollableWidth = scrollableRef.current!.scrollWidth;
      const containerWidth = containerRef.current!.offsetWidth;
      const scrollDistance = scrollableWidth - containerWidth;

      gsap.to(scrollableRef.current, {
        x: -scrollDistance,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          pin: pin,
          scrub: scrub,
          start: start,
          end: end,
          anticipatePin: anticipatePin,
          invalidateOnRefresh: true,
        },
      });
    });

    return () => {
      contextRef.current?.revert();
    };
  }, [options]);

  return contextRef.current;
}
