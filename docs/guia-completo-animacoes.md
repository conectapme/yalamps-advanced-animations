# Guia Completo - Animações Avançadas Yalamps

## 🚀 **OVERVIEW**

Este projeto implementa **técnicas avançadas de animação web** inspiradas no site yalamps.com, incluindo:

- **Smooth Scroll** com física customizada
- **SVG Morphing** sincronizado com scroll
- **Three.js** integration com sistema de partículas
- **Sequential Storytelling** através de animações
- **Performance optimization** e monitoring

---

## 📁 **ESTRUTURA DOS HOOKS**

```
src/lib/
├── gsap/                      # Hooks básicos GSAP
│   ├── useGsapParallax.ts     # Parallax multi-layer
│   ├── useGsapReveal.ts       # Reveal animations
│   ├── useGsapPin.ts          # Pin elements
│   └── useGsapHorizontalScroll.ts # Scroll horizontal
└── advanced-animations/       # Hooks avançados
    ├── scroll/
    │   ├── useSmoothScroll.ts      # Smooth scroll engine
    │   └── useScrollMorph.ts       # SVG morphing
    ├── three/
    │   ├── useThreeScene.ts        # Scene setup
    │   └── useParticleSystem.ts    # Particle physics
    └── storytelling/
        └── useSequentialReveal.ts  # Storytelling sequences
```

---

## 🎭 **1. SMOOTH SCROLL AVANÇADO**

### **Implementação**

```tsx
import { useSmoothScroll } from "@/lib/advanced-animations";

const { scrollTo, scrollToElement, progress } = useSmoothScroll({
  ease: 0.08,        // Suavidade (0.05-0.2)
  speed: 1.2,        // Velocidade (0.8-1.5)
  direction: "vertical",
  skew: true,        // Efeito skew durante scroll
  onScroll: (progress, direction) => {
    console.log(`${(progress * 100).toFixed(1)}% - ${direction}`);
  }
});
```

### **Características**
- **Inércia física** customizada
- **Skew effect** durante movimento
- **Touch support** para mobile
- **Scroll programático** suave
- **Progress tracking** em tempo real

---

## 🌊 **2. SVG MORPHING**

### **Implementação**

```tsx
import { useScrollMorph, createMorphSteps } from "@/lib/advanced-animations";

const morphSteps = [
  { progress: 0, path: "M0,50 Q25,0 50,50 T100,50" },
  { progress: 0.5, path: "M0,25 Q25,25 50,0 T100,25" },
  { progress: 1, path: "M0,0 Q25,50 50,0 T100,0" }
];

const { morphTo, morphToStep } = useScrollMorph(pathRef, {
  steps: morphSteps,
  trigger: triggerRef,
  scrub: true
});
```

### **Features**
- **Path interpolation** automática
- **Timeline integration** com scroll
- **Custom easing** por step
- **Programmatic control** das morphs

---

## 🌐 **3. THREE.JS INTEGRATION**

### **Scene Setup**

```tsx
import { useThreeScene, useParticleSystem } from "@/lib/advanced-animations";

const threeScene = useThreeScene(containerRef, {
  antialias: true,
  alpha: true,
  camera: { fov: 75, position: [0, 0, 10] },
  responsive: true
});

const particles = useParticleSystem(threeScene, {
  count: 1000,
  color: 0x4ade80,
  windForce: 0.05,
  gravity: -0.008,
  bounds: { x: [-15, 15], y: [-10, 10], z: [-15, 15] }
});
```

### **Particle System Features**
- **Physics simulation** (wind, gravity, bounce)
- **Organic movement** patterns
- **Interactive effects** (burst, color change)
- **Performance optimized** para 60fps

---

## 🎬 **4. SEQUENTIAL STORYTELLING**

### **Implementação**

```tsx
import { useSequentialReveal, REVEAL_PRESETS } from "@/lib/advanced-animations";

useSequentialReveal([
  { ref: title1Ref, ...REVEAL_PRESETS.fadeUp, delay: 0 },
  { ref: text1Ref, ...REVEAL_PRESETS.fadeLeft, delay: 0.2 },
  { ref: title2Ref, ...REVEAL_PRESETS.scaleIn, delay: 0.4 }
], {
  trigger: sectionRef,
  start: "top 70%",
  stagger: 0.1,
  onSequenceComplete: () => console.log("Story complete!")
});
```

### **Presets Disponíveis**
- `fadeUp` / `fadeDown` / `fadeLeft` / `fadeRight`
- `scaleIn` / `rotateIn` / `slideUp`
- `typewriter` (efeito máquina de escrever)

---

## 🎯 **EXEMPLO COMPLETO DE INTEGRAÇÃO**

```tsx
"use client";

import { useRef } from "react";
import {
  useSmoothScroll,
  useScrollMorph,
  useThreeScene,
  useParticleSystem,
  useSequentialReveal,
  REVEAL_PRESETS
} from "@/lib/advanced-animations";

export default function AdvancedAnimationPage() {
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const threeSceneRef = useRef<HTMLDivElement>(null);
  const morphSvgRef = useRef<SVGPathElement>(null);
  const storyRefs = {
    title: useRef<HTMLHeadingElement>(null),
    subtitle: useRef<HTMLHeadingElement>(null),
    text: useRef<HTMLParagraphElement>(null)
  };

  // 1. Smooth Scroll Setup
  const { scrollTo } = useSmoothScroll({
    ease: 0.08,
    speed: 1.2,
    skew: true
  });

  // 2. Three.js Scene
  const threeScene = useThreeScene(threeSceneRef, {
    antialias: true,
    alpha: true,
    camera: { position: [0, 0, 10] }
  });

  // 3. Particle System
  const particles = useParticleSystem(threeScene, {
    count: 800,
    color: 0x4ade80,
    windForce: 0.05
  });

  // 4. SVG Morphing
  useScrollMorph(morphSvgRef, {
    steps: [
      { progress: 0, path: "M0,50 Q50,0 100,50" },
      { progress: 1, path: "M0,0 Q50,50 100,0" }
    ],
    scrub: true
  });

  // 5. Sequential Storytelling
  useSequentialReveal([
    { ref: storyRefs.title, ...REVEAL_PRESETS.fadeUp },
    { ref: storyRefs.subtitle, ...REVEAL_PRESETS.scaleIn, delay: 0.2 },
    { ref: storyRefs.text, ...REVEAL_PRESETS.fadeLeft, delay: 0.4 }
  ], {
    stagger: 0.15
  });

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Three.js Background */}
      <div
        ref={threeSceneRef}
        className="fixed inset-0 z-0"
      />

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 ref={storyRefs.title} className="text-8xl font-bold">
              Advanced Animations
            </h1>

            {/* Morphing SVG */}
            <svg className="mt-8" width="300" height="100" viewBox="0 0 100 50">
              <path
                ref={morphSvgRef}
                stroke="rgb(74, 222, 128)"
                strokeWidth="2"
                fill="none"
              />
            </svg>

            <h2 ref={storyRefs.subtitle} className="text-2xl mt-8 text-green-400">
              GSAP + Three.js + Physics
            </h2>
          </div>
        </section>

        {/* Content Section */}
        <section className="min-h-screen px-8 py-32">
          <div className="max-w-4xl mx-auto">
            <p ref={storyRefs.text} className="text-xl leading-relaxed">
              This demonstrates the integration of multiple advanced animation
              techniques including smooth scroll physics, SVG morphing,
              Three.js particle systems, and sequential storytelling reveals.
            </p>

            <button
              onClick={() => particles?.burst({ x: 0, y: 0, z: 0 } as any, 15)}
              className="mt-8 px-8 py-4 bg-green-500 rounded-lg hover:bg-green-400 transition-colors"
            >
              Trigger Particle Burst
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
```

---

## ⚡ **PERFORMANCE GUIDELINES**

### **Otimizações Implementadas**

1. **Three.js**
   - Geometry reuse
   - Material pooling
   - Automatic disposal
   - Frame rate monitoring

2. **GSAP**
   - Context cleanup automático
   - Timeline optimization
   - RAF management
   - Memory leak prevention

3. **Smooth Scroll**
   - Throttled event listeners
   - GPU acceleration
   - Efficient interpolation

### **Monitoring**

```tsx
// Performance tracking
const performanceData = {
  fps: 0,
  particleCount: particles?.particleCount || 0,
  scrollProgress: progress(),
  memoryUsage: performance.memory?.usedJSHeapSize
};
```

---

## 🛠️ **TROUBLESHOOTING**

### **Problemas Comuns**

1. **Three.js não renderiza**
   - Verificar se container tem dimensões
   - Confirmar se WebGL está disponível

2. **Smooth scroll travando**
   - Reduzir `ease` value (ex: 0.05)
   - Desabilitar `skew` em devices lentos

3. **SVG morphing irregular**
   - Verificar compatibilidade dos paths
   - Usar paths com mesmo número de pontos

4. **Performance ruim**
   - Reduzir `particleCount`
   - Usar `will-change: transform` no CSS
   - Implementar culling de partículas

---

## 📚 **RECURSOS ADICIONAIS**

- **GSAP Documentation**: https://greensock.com/docs/
- **Three.js Manual**: https://threejs.org/docs/
- **SVG Path Reference**: https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths
- **Performance Best Practices**: https://web.dev/animations/

---

## 🎉 **CONCLUSÃO**

Este sistema de animações avançadas oferece:

✅ **Modularidade** - Hooks reutilizáveis e configuráveis
✅ **Performance** - Otimizações automáticas integradas
✅ **Flexibilidade** - APIs extensíveis e customizáveis
✅ **Documentação** - Guias completos e exemplos práticos
✅ **TypeScript** - Type safety em todas as interfaces

**Next Steps:** Implementar responsividade avançada, Web Workers para physics, e integração com outras bibliotecas 3D.
