import { useEffect, useRef, RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export interface RevealElement {
  ref: RefObject<HTMLElement>;
  delay?: number;
  duration?: number;
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  ease?: string;
  onStart?: () => void;
  onComplete?: () => void;
}

export interface SequentialRevealOptions {
  trigger?: RefObject<HTMLElement>;
  start?: string;
  end?: string;
  stagger?: number;
  globalDelay?: number;
  onSequenceStart?: () => void;
  onSequenceComplete?: () => void;
  markers?: boolean;
}

export function useSequentialReveal(
  elements: RevealElement[],
  options: SequentialRevealOptions = {}
) {
  const contextRef = useRef<gsap.Context>();
  const timelineRef = useRef<gsap.core.Timeline>();
  const isPlayingRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || elements.length === 0) return;

    gsap.registerPlugin(ScrollTrigger);

    contextRef.current = gsap.context(() => {
      const timeline = gsap.timeline({
        paused: true,
        onStart: () => {
          isPlayingRef.current = true;
          options.onSequenceStart?.();
        },
        onComplete: () => {
          isPlayingRef.current = false;
          options.onSequenceComplete?.();
        }
      });

      // Set initial states for all elements
      elements.forEach(({ ref, from }) => {
        if (ref.current) {
          gsap.set(ref.current, {
            autoAlpha: 0,
            y: 30,
            scale: 0.9,
            ...from
          });
        }
      });

      // Create staggered animations
      elements.forEach((element, index) => {
        const { ref, delay = 0, duration = 0.8, from = {}, to = {}, ease = "power2.out", onStart, onComplete } = element;

        if (!ref.current) return;

        const baseDelay = (options.globalDelay || 0) + (options.stagger || 0.1) * index + delay;

        const defaultTo = {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          ...to
        };

        timeline.fromTo(
          ref.current,
          { autoAlpha: 0, y: 30, scale: 0.9, ...from },
          {
            ...defaultTo,
            duration,
            ease,
            onStart,
            onComplete
          },
          baseDelay
        );
      });

      // Create scroll trigger
      ScrollTrigger.create({
        trigger: options.trigger?.current || elements[0]?.ref.current,
        start: options.start || "top 80%",
        end: options.end || "bottom 20%",
        markers: options.markers || false,
        onEnter: () => {
          if (!isPlayingRef.current) {
            timeline.restart();
          }
        },
        onLeave: () => {
          // Optional: reverse on leave
          // timeline.reverse();
        },
        onEnterBack: () => {
          if (!isPlayingRef.current) {
            timeline.restart();
          }
        },
        onLeaveBack: () => {
          // timeline.reverse();
        }
      });

      timelineRef.current = timeline;
    });

    return () => {
      contextRef.current?.revert();
    };
  }, [elements, options]);

  const playSequence = () => {
    if (timelineRef.current && !isPlayingRef.current) {
      timelineRef.current.restart();
    }
  };

  const pauseSequence = () => {
    if (timelineRef.current) {
      timelineRef.current.pause();
      isPlayingRef.current = false;
    }
  };

  const reverseSequence = () => {
    if (timelineRef.current) {
      timelineRef.current.reverse();
    }
  };

  const skipToEnd = () => {
    if (timelineRef.current) {
      timelineRef.current.progress(1);
    }
  };

  const resetSequence = () => {
    if (timelineRef.current) {
      timelineRef.current.progress(0).pause();
      isPlayingRef.current = false;
    }
  };

  const playElement = (index: number) => {
    const element = elements[index];
    if (!element?.ref.current) return;

    const { duration = 0.8, to = {}, ease = "power2.out", onStart, onComplete } = element;

    const defaultTo = {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      ...to
    };

    gsap.to(element.ref.current, {
      ...defaultTo,
      duration,
      ease,
      onStart,
      onComplete
    });
  };

  return {
    timeline: timelineRef.current,
    playSequence,
    pauseSequence,
    reverseSequence,
    skipToEnd,
    resetSequence,
    playElement,
    isPlaying: isPlayingRef.current
  };
}

// Helper hook for creating reveal elements from DOM queries
export function useRevealElements(
  selectors: string[],
  containerRef?: RefObject<HTMLElement>
): RefObject<HTMLElement>[] {
  const elementsRef = useRef<RefObject<HTMLElement>[]>([]);

  useEffect(() => {
    const container = containerRef?.current || document;

    elementsRef.current = selectors.map(() => {
      return { current: null };
    });

    selectors.forEach((selector, index) => {
      const element = container.querySelector(selector) as HTMLElement;
      if (element && elementsRef.current[index]) {
        (elementsRef.current[index] as { current: HTMLElement | null }).current = element;
      }
    });
  }, [selectors, containerRef]);

  return elementsRef.current;
}

// Predefined animation presets
export const REVEAL_PRESETS = {
  fadeUp: {
    from: { autoAlpha: 0, y: 50 },
    to: { autoAlpha: 1, y: 0 },
    ease: "power2.out"
  },
  fadeDown: {
    from: { autoAlpha: 0, y: -50 },
    to: { autoAlpha: 1, y: 0 },
    ease: "power2.out"
  },
  fadeLeft: {
    from: { autoAlpha: 0, x: 50 },
    to: { autoAlpha: 1, x: 0 },
    ease: "power2.out"
  },
  fadeRight: {
    from: { autoAlpha: 0, x: -50 },
    to: { autoAlpha: 1, x: 0 },
    ease: "power2.out"
  },
  scaleIn: {
    from: { autoAlpha: 0, scale: 0 },
    to: { autoAlpha: 1, scale: 1 },
    ease: "back.out(1.7)"
  },
  rotateIn: {
    from: { autoAlpha: 0, rotation: 180, scale: 0.5 },
    to: { autoAlpha: 1, rotation: 0, scale: 1 },
    ease: "back.out(1.7)"
  },
  slideUp: {
    from: { autoAlpha: 0, y: "100%" },
    to: { autoAlpha: 1, y: "0%" },
    ease: "power3.out"
  },
  typewriter: {
    from: { autoAlpha: 0, width: 0 },
    to: { autoAlpha: 1, width: "auto" },
    ease: "none"
  }
};
