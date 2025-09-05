import { useEffect, useRef, RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export interface MorphStep {
  progress: number; // 0-1
  path: string; // SVG path data
  ease?: string;
}

export interface UseScrollMorphOptions {
  steps: MorphStep[];
  trigger?: RefObject<HTMLElement>;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  onUpdate?: (progress: number, currentStep: number) => void;
}

export function useScrollMorph(
  pathRef: RefObject<SVGPathElement>,
  options: UseScrollMorphOptions
) {
  const contextRef = useRef<gsap.Context>();
  const timelineRef = useRef<gsap.core.Timeline>();

  useEffect(() => {
    if (typeof window === "undefined" || !pathRef.current || options.steps.length < 2) return;

    gsap.registerPlugin(ScrollTrigger);

    contextRef.current = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: options.trigger?.current || pathRef.current,
          start: options.start || "top center",
          end: options.end || "bottom center",
          scrub: options.scrub ?? true,
          onUpdate: (self) => {
            const progress = self.progress;
            const totalSteps = options.steps.length - 1;
            const currentStepIndex = Math.floor(progress * totalSteps);
            const currentStep = Math.min(currentStepIndex, totalSteps - 1);

            options.onUpdate?.(progress, currentStep);
          }
        }
      });

      // Create morphing sequence
      options.steps.forEach((step, index) => {
        if (index === 0) {
          // Set initial path
          gsap.set(pathRef.current, { attr: { d: step.path } });
        } else {
          const previousStep = options.steps[index - 1];
          const duration = step.progress - previousStep.progress;

          timeline.to(pathRef.current, {
            attr: { d: step.path },
            duration: duration,
            ease: step.ease || "power2.inOut"
          }, previousStep.progress);
        }
      });

      timelineRef.current = timeline;
    });

    return () => {
      contextRef.current?.revert();
    };
  }, [pathRef, options]);

  const morphTo = (pathData: string, duration: number = 1, ease: string = "power2.inOut") => {
    if (!pathRef.current) return;

    gsap.to(pathRef.current, {
      attr: { d: pathData },
      duration,
      ease
    });
  };

  const morphToStep = (stepIndex: number, duration: number = 1) => {
    if (!options.steps[stepIndex] || !pathRef.current) return;

    morphTo(options.steps[stepIndex].path, duration);
  };

  return {
    morphTo,
    morphToStep,
    timeline: timelineRef.current
  };
}

// Helper function to create smooth path interpolations
export function createMorphSteps(
  startPath: string,
  endPath: string,
  steps: number = 5
): MorphStep[] {
  const morphSteps: MorphStep[] = [];

  for (let i = 0; i <= steps; i++) {
    const progress = i / steps;
    morphSteps.push({
      progress,
      path: interpolatePaths(startPath, endPath, progress),
      ease: "power2.inOut"
    });
  }

  return morphSteps;
}

// Simple path interpolation (for basic shapes)
function interpolatePaths(startPath: string, endPath: string, progress: number): string {
  // This is a simplified interpolation
  // For complex shapes, consider using libraries like flubber

  const startCommands = parsePath(startPath);
  const endCommands = parsePath(endPath);

  if (startCommands.length !== endCommands.length) {
    // Fallback: use discrete steps for incompatible paths
    return progress < 0.5 ? startPath : endPath;
  }

  const interpolatedCommands = startCommands.map((startCmd, index) => {
    const endCmd = endCommands[index];

    if (startCmd.type !== endCmd.type) {
      return progress < 0.5 ? startCmd : endCmd;
    }

    const interpolatedValues = startCmd.values.map((startVal, valIndex) => {
      const endVal = endCmd.values[valIndex];
      return startVal + (endVal - startVal) * progress;
    });

    return {
      type: startCmd.type,
      values: interpolatedValues
    };
  });

  return commandsToPath(interpolatedCommands);
}

interface PathCommand {
  type: string;
  values: number[];
}

function parsePath(pathData: string): PathCommand[] {
  const commands: PathCommand[] = [];
  const regex = /([MmLlHhVvCcSsQqTtAaZz])([\d\s,.-]*)/g;
  let match;

  while ((match = regex.exec(pathData)) !== null) {
    const type = match[1];
    const values = match[2]
      .split(/[\s,]+/)
      .filter(v => v)
      .map(Number)
      .filter(n => !isNaN(n));

    commands.push({ type, values });
  }

  return commands;
}

function commandsToPath(commands: PathCommand[]): string {
  return commands
    .map(cmd => `${cmd.type}${cmd.values.join(' ')}`)
    .join(' ');
}
