import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export interface UseGsapRevealOptions {
  selector?: string;
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  scrollTrigger?: ScrollTrigger.Vars;
}

export function useGsapReveal(options: UseGsapRevealOptions = {}) {
  const contextRef = useRef<gsap.Context>();

  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    contextRef.current = gsap.context(() => {
      const {
        selector = "[data-reveal]",
        from = { autoAlpha: 0, y: 30 },
        to = {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        scrollTrigger = {
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      } = options;

      gsap.utils.toArray<HTMLElement>(selector).forEach((element) => {
        gsap.fromTo(element, from, {
          ...to,
          scrollTrigger: {
            trigger: element,
            ...scrollTrigger,
          },
        });
      });
    });

    return () => {
      contextRef.current?.revert();
    };
  }, [options]);

  return contextRef.current;
}
