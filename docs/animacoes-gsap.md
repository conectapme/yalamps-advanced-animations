# Documentação dos Hooks de Animação GSAP

Este documento explica como usar os hooks reutilizáveis de animação GSAP implementados no projeto Yalamps Clone.

## Hooks Disponíveis

### 1. `useGsapParallax`

Hook para criar efeitos de parallax com múltiplos elementos em velocidades diferentes.

#### Uso Básico

```tsx
import { useGsapParallax } from "@/lib/gsap";

const ParallaxSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const element1Ref = useRef<HTMLImageElement>(null);
  const element2Ref = useRef<HTMLImageElement>(null);

  useGsapParallax([
    { ref: element1Ref, speed: -20 },
    { ref: element2Ref, speed: -35 },
  ], {
    trigger: containerRef,
    start: "top top",
    end: "bottom top",
    scrub: 1.2
  });

  return (
    <div ref={containerRef}>
      <img ref={element1Ref} src="background.jpg" />
      <img ref={element2Ref} src="foreground.jpg" />
    </div>
  );
};
```

#### Parâmetros

- **elements**: Array de objetos `ParallaxElement`
  - `ref`: RefObject do elemento HTML
  - `speed`: Velocidade do parallax (negativo = mais lento, positivo = mais rápido)
  - `ease`: Tipo de easing (opcional, padrão: "none")

- **options**: Objeto `UseGsapParallaxOptions` (opcional)
  - `trigger`: Elemento que dispara a animação
  - `start`: Ponto de início da animação
  - `end`: Ponto de fim da animação
  - `scrub`: Sincronização com scroll (boolean ou número)

### 2. `useGsapReveal`

Hook para revelar elementos durante o scroll com animações fade-in e slide-up.

#### Uso Básico

```tsx
import { useGsapReveal } from "@/lib/gsap";

const RevealSection = () => {
  useGsapReveal();

  return (
    <div>
      <h2 data-reveal>Título que aparece</h2>
      <p data-reveal>Parágrafo que aparece</p>
    </div>
  );
};
```

#### Uso Avançado

```tsx
useGsapReveal({
  selector: ".custom-reveal",
  from: { autoAlpha: 0, y: 50, scale: 0.8 },
  to: {
    autoAlpha: 1,
    y: 0,
    scale: 1,
    duration: 1.2,
    ease: "back.out(1.7)"
  },
  scrollTrigger: {
    start: "top 90%",
    toggleActions: "play none none reverse"
  }
});
```

#### Parâmetros

- **options**: Objeto `UseGsapRevealOptions` (opcional)
  - `selector`: Seletor CSS dos elementos (padrão: "[data-reveal]")
  - `from`: Estado inicial da animação
  - `to`: Estado final da animação
  - `scrollTrigger`: Configurações do ScrollTrigger

### 3. `useGsapPin`

Hook para fixar (pin) elementos na tela durante o scroll.

#### Uso Básico

```tsx
import { useGsapPin } from "@/lib/gsap";

const PinnedSection = () => {
  const pinnedRef = useRef<HTMLDivElement>(null);

  useGsapPin(pinnedRef, {
    start: "top top",
    end: "+=100%",
    onPin: () => console.log("Elemento fixado"),
    onUnpin: () => console.log("Elemento liberado")
  });

  return (
    <div ref={pinnedRef}>
      <h2>Seção fixada durante o scroll</h2>
    </div>
  );
};
```

#### Parâmetros

- **elementRef**: RefObject do elemento a ser fixado
- **options**: Objeto `UseGsapPinOptions` (opcional)
  - `pinSpacing`: Se deve manter espaçamento (padrão: true)
  - `start`: Ponto de início do pin
  - `end`: Ponto de fim do pin
  - `anticipatePin`: Antecipação do pin
  - `refreshPriority`: Prioridade de refresh
  - `onPin`: Callback quando elemento é fixado
  - `onUnpin`: Callback quando elemento é liberado

### 4. `useGsapHorizontalScroll`

Hook para criar scroll horizontal sincronizado com scroll vertical.

#### Uso Básico

```tsx
import { useGsapHorizontalScroll } from "@/lib/gsap";

const HorizontalScrollSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollableRef = useRef<HTMLDivElement>(null);

  useGsapHorizontalScroll({
    containerRef,
    scrollableRef,
    start: "top top",
    end: "+=300%",
    scrub: 1
  });

  return (
    <div ref={containerRef} className="overflow-hidden">
      <div ref={scrollableRef} className="flex w-[400%]">
        <div className="w-full">Painel 1</div>
        <div className="w-full">Painel 2</div>
        <div className="w-full">Painel 3</div>
        <div className="w-full">Painel 4</div>
      </div>
    </div>
  );
};
```

#### Parâmetros

- **options**: Objeto `UseGsapHorizontalScrollOptions`
  - `containerRef`: RefObject do container externo
  - `scrollableRef`: RefObject do elemento que será movido horizontalmente
  - `start`: Ponto de início da animação
  - `end`: Ponto de fim da animação
  - `scrub`: Sincronização com scroll
  - `pin`: Se deve fixar o container (padrão: true)
  - `anticipatePin`: Antecipação do pin

## Melhores Práticas

### 1. Gerenciamento de Contexto

Todos os hooks usam `gsap.context()` para garantir limpeza automática das animações quando o componente é desmontado.

### 2. SSR (Server-Side Rendering)

Os hooks verificam `typeof window === "undefined"` para evitar erros durante renderização no servidor.

### 3. Refs e Dependências

```tsx
// ✅ Correto - usar refs tipados
const elementRef = useRef<HTMLDivElement>(null);

// ✅ Correto - verificar se ref existe antes de usar
useEffect(() => {
  if (!elementRef.current) return;
  // usar elementRef.current
}, []);
```

### 4. Performance

```tsx
// ✅ Memoizar opções complexas para evitar re-renders
const parallaxOptions = useMemo(() => ({
  trigger: containerRef,
  start: "top top",
  end: "bottom top",
  scrub: 1.2
}), []);

useGsapParallax(elements, parallaxOptions);
```

### 5. Responsividade

```tsx
// ✅ Usar ScrollTrigger.matchMedia para animações responsivas
useEffect(() => {
  const mm = gsap.matchMedia();

  mm.add("(min-width: 768px)", () => {
    // Animações para desktop
  });

  mm.add("(max-width: 767px)", () => {
    // Animações para mobile
  });

  return () => mm.revert();
}, []);
```

## Exemplo Completo

```tsx
import React, { useRef } from "react";
import {
  useGsapParallax,
  useGsapReveal,
  useGsapPin,
  useGsapHorizontalScroll
} from "@/lib/gsap";

const CompleteAnimationExample = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const bg1Ref = useRef<HTMLImageElement>(null);
  const bg2Ref = useRef<HTMLImageElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);
  const horizontalContainerRef = useRef<HTMLDivElement>(null);
  const horizontalScrollableRef = useRef<HTMLDivElement>(null);

  // Parallax no hero
  useGsapParallax([
    { ref: bg1Ref, speed: -20 },
    { ref: bg2Ref, speed: -35 }
  ], {
    trigger: heroRef,
    start: "top top",
    end: "bottom top"
  });

  // Reveal para elementos com data-reveal
  useGsapReveal();

  // Pin para seção especial
  useGsapPin(pinnedRef, {
    start: "top top",
    end: "+=100%"
  });

  // Scroll horizontal
  useGsapHorizontalScroll({
    containerRef: horizontalContainerRef,
    scrollableRef: horizontalScrollableRef,
    start: "top top",
    end: "+=300%"
  });

  return (
    <div>
      {/* Hero com Parallax */}
      <section ref={heroRef} className="relative h-screen">
        <img ref={bg1Ref} src="bg1.jpg" className="absolute inset-0" />
        <img ref={bg2Ref} src="bg2.jpg" className="absolute inset-0" />
        <h1 data-reveal>Título Hero</h1>
      </section>

      {/* Seção com Reveal */}
      <section className="py-20">
        <h2 data-reveal>Título que aparece</h2>
        <p data-reveal>Parágrafo que aparece</p>
      </section>

      {/* Seção Fixada */}
      <section ref={pinnedRef} className="h-screen bg-blue-500">
        <h2>Seção fixada durante scroll</h2>
      </section>

      {/* Scroll Horizontal */}
      <section ref={horizontalContainerRef} className="h-screen overflow-hidden">
        <div ref={horizontalScrollableRef} className="flex h-full w-[400%]">
          <div className="w-full bg-red-500">Painel 1</div>
          <div className="w-full bg-green-500">Painel 2</div>
          <div className="w-full bg-blue-500">Painel 3</div>
          <div className="w-full bg-yellow-500">Painel 4</div>
        </div>
      </section>
    </div>
  );
};
```

## Troubleshooting

### Problema: Animações não funcionam

1. Verifique se o GSAP está instalado: `bun add gsap`
2. Verifique se os refs estão sendo passados corretamente
3. Confirme que os elementos existem no DOM antes da animação

### Problema: Animações não são limpas

- Os hooks já fazem limpeza automática com `gsap.context()`, mas se necessário, você pode acessar o contexto:

```tsx
const context = useGsapParallax(elements);

useEffect(() => {
  return () => {
    context?.revert();
  };
}, []);
```

### Problema: Performance ruim

1. Use `will-change: transform` no CSS para elementos animados
2. Evite animar propriedades que causam reflow (width, height, position)
3. Prefira animar `transform` e `opacity`
4. Use `scrub` com valores baixos para animações mais suaves

---

Para mais informações sobre GSAP, consulte a [documentação oficial](https://greensock.com/docs/).
