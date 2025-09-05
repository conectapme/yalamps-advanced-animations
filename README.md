# 🚀 YaLamps Advanced Animations

> **Advanced web animation techniques showcase featuring GSAP, Three.js, and custom physics**

This project demonstrates cutting-edge web animation techniques including smooth scroll with custom physics, SVG morphing synchronized with scroll, Three.js particle systems with physics simulation, sequential storytelling animations, and GSAP advanced timeline orchestration.

## ✨ Features

- **9 Custom React Hooks** for advanced animations
- **Smooth Scroll Physics** with custom easing and momentum
- **SVG Morphing** synchronized with scroll progress
- **3D Particle Systems** with realistic physics simulation
- **Sequential Storytelling** animations with precise timing
- **GSAP Timeline Orchestration** for complex animation sequences
- **TypeScript** for type safety and better developer experience
- **Responsive Design** optimized for all device sizes

## 🎯 Animation Hooks Implemented

### Basic GSAP Hooks
1. **`useGsapParallax`** - Smooth parallax effects with configurable speed
2. **`useGsapReveal`** - Element reveal animations with intersection observer
3. **`useGsapPin`** - Scroll-triggered pinning and unpinning of elements
4. **`useGsapHorizontalScroll`** - Horizontal scrolling sections with scroll trigger

### Advanced Animation Hooks
5. **`useSmoothScroll`** - Custom physics-based smooth scrolling with momentum
6. **`useScrollMorph`** - SVG path morphing synchronized with scroll position
7. **`useThreeScene`** - Three.js scene management with optimized rendering
8. **`useParticleSystem`** - Advanced particle systems with physics simulation
9. **`useSequentialReveal`** - Orchestrated sequential animations for storytelling

## 🛠 Technologies Used

- **[Next.js](https://nextjs.org/) v15.3.2** - React framework with App Router
- **[GSAP](https://greensock.com/gsap/) v3.13.0** - Professional animation library
- **[Three.js](https://threejs.org/) v0.180.0** - 3D graphics and WebGL
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Bun](https://bun.sh/)** - Fast JavaScript runtime and package manager

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun runtime
- Modern browser with WebGL support

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/conectapme/yalamps-advanced-animations.git
   cd yalamps-advanced-animations
   ```

2. **Install dependencies**
   ```bash
   bun install
   # or
   npm install
   ```

3. **Run the development server**
   ```bash
   bun dev
   # or
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Main demo page
│   ├── globals.css              # Global styles
│   └── ClientBody.tsx           # Client-side body wrapper
├── lib/
│   ├── gsap/                    # Basic GSAP animation hooks
│   │   ├── useGsapParallax.ts   # Parallax effects
│   │   ├── useGsapReveal.ts     # Reveal animations
│   │   ├── useGsapPin.ts        # Scroll pinning
│   │   ├── useGsapHorizontalScroll.ts # Horizontal scroll
│   │   └── index.ts             # GSAP exports
│   ├── advanced-animations/     # Advanced animation systems
│   │   ├── scroll/              # Scroll-based animations
│   │   │   ├── useSmoothScroll.ts    # Custom smooth scroll
│   │   │   └── useScrollMorph.ts     # SVG morphing
│   │   ├── three/               # Three.js integrations
│   │   │   ├── useThreeScene.ts      # Scene management
│   │   │   └── useParticleSystem.ts  # Particle physics
│   │   ├── storytelling/        # Narrative animations
│   │   │   └── useSequentialReveal.ts # Sequential reveals
│   │   └── index.ts             # Advanced exports
│   └── utils.ts                 # Utility functions
docs/                            # Comprehensive documentation
├── animacoes-gsap.md           # GSAP animation guide
├── guia-completo-animacoes.md  # Complete animation guide
└── tecnicas-avancadas-yalamps.md # Advanced techniques
```

## 📚 Documentation

Comprehensive documentation is available in the `docs/` folder:

- **[GSAP Animations Guide](docs/animacoes-gsap.md)** - Detailed guide to GSAP implementation
- **[Complete Animation Guide](docs/guia-completo-animacoes.md)** - Full animation techniques reference
- **[Advanced YaLamps Techniques](docs/tecnicas-avancadas-yalamps.md)** - Advanced animation patterns

## 🎨 Key Animation Techniques

### Smooth Scroll Physics
Custom implementation with:
- Momentum-based easing
- Configurable friction and acceleration
- Optimized RAF (RequestAnimationFrame) updates
- Memory leak prevention

### SVG Morphing System
Advanced path interpolation:
- Bezier curve morphing
- Synchronized scroll triggers
- Optimized path calculations
- Cross-browser compatibility

### Three.js Integration
Professional 3D graphics:
- WebGL renderer optimization
- Particle system physics
- Memory management
- Mobile performance optimization

### Sequential Storytelling
Orchestrated animations:
- Timeline-based coordination
- Intersection observer triggers
- Dynamic timing adjustments
- Accessibility considerations

## 🚀 Deployment

This project is optimized for modern hosting platforms:

### Vercel (Recommended)
```bash
bun run build
# Deploy via Vercel CLI or GitHub integration
```

### Netlify
```bash
bun run build
# Configure build command: bun run build
# Publish directory: .next
```

### Self-hosted
```bash
bun run build
bun start
```

## 🔧 Development

### Available Scripts

- `bun dev` - Start development server
- `bun build` - Build for production
- `bun start` - Start production server
- `bun lint` - Run TypeScript and ESLint checks
- `bun format` - Format code with Biome

### Performance Optimization

- **Tree Shaking** - Only import used GSAP modules
- **Code Splitting** - Lazy load heavy Three.js components
- **Animation Cleanup** - Proper disposal of animation instances
- **Memory Management** - Optimized particle system lifecycle

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-animation`
3. Commit changes: `git commit -m 'Add amazing animation'`
4. Push to branch: `git push origin feature/amazing-animation`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **GreenSock (GSAP)** for the powerful animation library
- **Three.js** team for the amazing 3D graphics framework
- **Vercel** for the excellent Next.js framework
- **YaLamps** for animation inspiration and techniques

---

**Built with ❤️ using cutting-edge web animation techniques**

🔗 **[Live Demo](https://yalamps-advanced-animations.vercel.app/)** | 📖 **[Documentation](docs/)** | 🐛 **[Issues](https://github.com/conectapme/yalamps-advanced-animations/issues)**
