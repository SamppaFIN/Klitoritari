# 📱 Mobile & Performance
*The Sacred Blueprint for Revolutionary Anti-Censorship Discussion Platform*

## 📋 Document Information
**Version**: 1.0.0  
**Date**: 2025-09-30  
**Doc-ID**: SC-MOBILE-PERFORMANCE  
**Status**: Canonical

## 📝 ChangeLog
- 1.0.0 Initial codex import from chat (author: Infinite IRL)

---

## 📱 Mobile Optimization

### **Responsive Design**
```css
/* Mobile-first responsive design */
@media (max-width: 768px) {
  .reaction-ribbon {
    flex-direction: column;
    gap: 8px;
  }
  
  .reaction-button {
    min-width: 44px; /* Touch target size */
    min-height: 44px;
  }
  
  .moon-calendar {
    font-size: 14px;
    padding: 8px;
  }
  
  .profile-header {
    flex-direction: column;
    text-align: center;
  }
  
  .aura-ring {
    width: 80px;
    height: 80px;
  }
}

@media (max-width: 480px) {
  .reaction-ribbon {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.9);
    padding: 12px;
    z-index: 1000;
  }
  
  .moon-calendar {
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 1000;
  }
}
```

### **Touch Optimization**
```typescript
interface TouchOptimization {
  touchTargetSize: number; // minimum 44px
  touchFeedback: boolean;
  swipeGestures: boolean;
  hapticFeedback: boolean;
}

class TouchOptimizer {
  private touchTargetSize = 44; // iOS/Android minimum
  
  optimizeTouchTargets() {
    const touchElements = document.querySelectorAll('.touch-target');
    
    touchElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      
      if (rect.width < this.touchTargetSize || rect.height < this.touchTargetSize) {
        element.style.minWidth = `${this.touchTargetSize}px`;
        element.style.minHeight = `${this.touchTargetSize}px`;
      }
    });
  }
  
  addTouchFeedback() {
    const touchElements = document.querySelectorAll('.touch-target');
    
    touchElements.forEach(element => {
      element.addEventListener('touchstart', () => {
        element.style.transform = 'scale(0.95)';
        element.style.opacity = '0.8';
      });
      
      element.addEventListener('touchend', () => {
        element.style.transform = 'scale(1)';
        element.style.opacity = '1';
      });
    });
  }
}
```

### **Mobile-Specific Components**
```typescript
interface MobileReactionRibbonProps {
  reactions: ReactionType[];
  onReaction: (reaction: ReactionType) => void;
  isVisible: boolean;
}

const MobileReactionRibbon: SvelteComponent = {
  props: ['reactions', 'onReaction', 'isVisible'],
  template: `
    <div class="mobile-reaction-ribbon" class:visible={isVisible}>
      <div class="ribbon-header">
        <h3>React</h3>
        <button on:click={() => isVisible = false}>×</button>
      </div>
      
      <div class="reaction-grid">
        {#each reactions as reaction}
          <button 
            class="reaction-button mobile"
            on:click={() => onReaction(reaction)}
            on:touchstart={() => addHapticFeedback()}
          >
            <span class="reaction-emoji">{reaction.emoji}</span>
            <span class="reaction-name">{reaction.name}</span>
          </button>
        {/each}
      </div>
    </div>
  `
};

interface MobileMoonCalendarProps {
  moonPhase: MoonPhase;
  onToggle: () => void;
  isExpanded: boolean;
}

const MobileMoonCalendar: SvelteComponent = {
  props: ['moonPhase', 'onToggle', 'isExpanded'],
  template: `
    <div class="mobile-moon-calendar" class:expanded={isExpanded}>
      <button class="moon-toggle" on:click={onToggle}>
        <span class="moon-icon">{moonPhase.icon}</span>
        <span class="moon-phase">{moonPhase.name}</span>
      </button>
      
      {#if isExpanded}
        <div class="moon-details">
          <div class="moon-info">
            <p>Phase: {moonPhase.name}</p>
            <p>Illumination: {moonPhase.illumination}%</p>
            <p>Next: {moonPhase.nextPhase}</p>
          </div>
          
          <div class="moon-actions">
            <button on:click={() => openFullCalendar()}>Full Calendar</button>
            <button on:click={() => openTarot()}>Tarot</button>
          </div>
        </div>
      {/if}
    </div>
  `
};
```

---

## ⚡ Performance Optimization

### **Performance Budget**
```typescript
interface PerformanceBudget {
  firstContentfulPaint: number; // <1.5s
  largestContentfulPaint: number; // <2.5s
  firstInputDelay: number; // <100ms
  cumulativeLayoutShift: number; // <0.1
  timeToInteractive: number; // <3.5s
}

const performanceBudget: PerformanceBudget = {
  firstContentfulPaint: 1500,
  largestContentfulPaint: 2500,
  firstInputDelay: 100,
  cumulativeLayoutShift: 0.1,
  timeToInteractive: 3500
};
```

### **Lazy Loading**
```typescript
class LazyLoader {
  private observer: IntersectionObserver;
  
  constructor() {
    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      { rootMargin: '50px' }
    );
  }
  
  observe(element: HTMLElement) {
    this.observer.observe(element);
  }
  
  private handleIntersection(entries: IntersectionObserverEntry[]) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.loadContent(entry.target);
        this.observer.unobserve(entry.target);
      }
    });
  }
  
  private loadContent(element: HTMLElement) {
    // Load content based on data attributes
    const src = element.getAttribute('data-src');
    const component = element.getAttribute('data-component');
    
    if (src) {
      element.setAttribute('src', src);
    }
    
    if (component) {
      this.loadComponent(element, component);
    }
  }
  
  private async loadComponent(element: HTMLElement, componentName: string) {
    try {
      const component = await import(`./components/${componentName}.svelte`);
      // Render component
    } catch (error) {
      console.error(`Failed to load component: ${componentName}`, error);
    }
  }
}
```

### **Virtual Scrolling**
```typescript
interface VirtualScrollProps {
  items: any[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: any, index: number) => HTMLElement;
}

class VirtualScroller {
  private container: HTMLElement;
  private items: any[];
  private itemHeight: number;
  private containerHeight: number;
  private scrollTop: number = 0;
  private visibleStart: number = 0;
  private visibleEnd: number = 0;
  
  constructor(props: VirtualScrollProps) {
    this.items = props.items;
    this.itemHeight = props.itemHeight;
    this.containerHeight = props.containerHeight;
    this.renderItem = props.renderItem;
    
    this.calculateVisibleRange();
  }
  
  private calculateVisibleRange() {
    this.visibleStart = Math.floor(this.scrollTop / this.itemHeight);
    this.visibleEnd = Math.min(
      this.visibleStart + Math.ceil(this.containerHeight / this.itemHeight),
      this.items.length
    );
  }
  
  render() {
    const visibleItems = this.items.slice(this.visibleStart, this.visibleEnd);
    const offsetY = this.visibleStart * this.itemHeight;
    
    this.container.style.transform = `translateY(${offsetY}px)`;
    
    visibleItems.forEach((item, index) => {
      const element = this.renderItem(item, this.visibleStart + index);
      this.container.appendChild(element);
    });
  }
  
  onScroll(scrollTop: number) {
    this.scrollTop = scrollTop;
    this.calculateVisibleRange();
    this.render();
  }
}
```

### **Performance Monitoring**
```typescript
class PerformanceMonitor {
  private metrics: Map<string, number> = new Map();
  
  startTiming(name: string) {
    performance.mark(`${name}-start`);
  }
  
  endTiming(name: string) {
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    
    const measure = performance.getEntriesByName(name)[0];
    this.metrics.set(name, measure.duration);
    
    // Check against performance budget
    this.checkPerformanceBudget(name, measure.duration);
  }
  
  private checkPerformanceBudget(name: string, duration: number) {
    const budget = performanceBudget[name];
    if (budget && duration > budget) {
      console.warn(`Performance budget exceeded for ${name}: ${duration}ms > ${budget}ms`);
      
      // Trigger performance optimization
      this.triggerOptimization(name);
    }
  }
  
  private triggerOptimization(metric: string) {
    switch (metric) {
      case 'firstContentfulPaint':
        this.optimizeCriticalPath();
        break;
      case 'largestContentfulPaint':
        this.optimizeImages();
        break;
      case 'firstInputDelay':
        this.optimizeJavaScript();
        break;
      case 'cumulativeLayoutShift':
        this.optimizeLayout();
        break;
    }
  }
  
  private optimizeCriticalPath() {
    // Optimize critical rendering path
    this.preloadCriticalResources();
    this.inlineCriticalCSS();
  }
  
  private optimizeImages() {
    // Optimize images
    this.convertToWebP();
    this.lazyLoadImages();
  }
  
  private optimizeJavaScript() {
    // Optimize JavaScript
    this.codeSplit();
    this.deferNonCriticalJS();
  }
  
  private optimizeLayout() {
    // Optimize layout
    this.preventLayoutShift();
    this.optimizeFonts();
  }
}
```

---

## 🔧 Performance Tools

### **Bundle Analysis**
```typescript
// webpack-bundle-analyzer configuration
const bundleAnalyzer = {
  analyzerMode: 'static',
  openAnalyzer: false,
  reportFilename: 'bundle-report.html',
  generateStatsFile: true,
  statsFilename: 'bundle-stats.json'
};

// Performance budget configuration
const performanceBudget = {
  maxAssetSize: 250000, // 250KB
  maxEntrypointSize: 250000, // 250KB
  hints: 'warning'
};
```

### **Performance Testing**
```typescript
// Performance test suite
describe('Performance Tests', () => {
  it('should load within performance budget', async () => {
    const startTime = performance.now();
    
    // Load page
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = performance.now() - startTime;
    expect(loadTime).toBeLessThan(3500); // 3.5s budget
  });
  
  it('should have good Core Web Vitals', async () => {
    const metrics = await page.evaluate(() => {
      return new Promise(resolve => {
        new PerformanceObserver(list => {
          const entries = list.getEntries();
          resolve(entries);
        }).observe({ entryTypes: ['largest-contentful-paint'] });
      });
    });
    
    expect(metrics[0].startTime).toBeLessThan(2500); // LCP < 2.5s
  });
  
  it('should handle large comment lists efficiently', async () => {
    // Test virtual scrolling performance
    const startTime = performance.now();
    
    await page.goto('/comments?limit=1000');
    await page.waitForSelector('.comment-list');
    
    const renderTime = performance.now() - startTime;
    expect(renderTime).toBeLessThan(1000); // < 1s for 1000 comments
  });
});
```

---

## 📱 Mobile-Specific Features

### **Progressive Web App**
```typescript
// PWA configuration
const pwaConfig = {
  name: 'ShadowComments',
  short_name: 'ShadowComments',
  description: 'Revolutionary anti-censorship discussion platform',
  start_url: '/',
  display: 'standalone',
  background_color: '#000000',
  theme_color: '#8b5cf6',
  icons: [
    {
      src: '/icons/icon-192x192.png',
      sizes: '192x192',
      type: 'image/png'
    },
    {
      src: '/icons/icon-512x512.png',
      sizes: '512x512',
      type: 'image/png'
    }
  ]
};

// Service worker for offline functionality
const serviceWorker = `
  const CACHE_NAME = 'shadowcomments-v1';
  const urlsToCache = [
    '/',
    '/static/css/main.css',
    '/static/js/main.js',
    '/icons/icon-192x192.png'
  ];
  
  self.addEventListener('install', event => {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(cache => cache.addAll(urlsToCache))
    );
  });
  
  self.addEventListener('fetch', event => {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            return response;
          }
          return fetch(event.request);
        })
    );
  });
`;
```

### **Mobile Gestures**
```typescript
class GestureHandler {
  private touchStartX: number = 0;
  private touchStartY: number = 0;
  private touchEndX: number = 0;
  private touchEndY: number = 0;
  
  handleTouchStart(event: TouchEvent) {
    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;
  }
  
  handleTouchEnd(event: TouchEvent) {
    this.touchEndX = event.changedTouches[0].clientX;
    this.touchEndY = event.changedTouches[0].clientY;
    
    this.handleSwipe();
  }
  
  private handleSwipe() {
    const deltaX = this.touchEndX - this.touchStartX;
    const deltaY = this.touchEndY - this.touchStartY;
    
    const minSwipeDistance = 50;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) {
          this.onSwipeRight();
        } else {
          this.onSwipeLeft();
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > minSwipeDistance) {
        if (deltaY > 0) {
          this.onSwipeDown();
        } else {
          this.onSwipeUp();
        }
      }
    }
  }
  
  private onSwipeLeft() {
    // Open reaction ribbon
    this.openReactionRibbon();
  }
  
  private onSwipeRight() {
    // Close reaction ribbon
    this.closeReactionRibbon();
  }
  
  private onSwipeUp() {
    // Show moon calendar
    this.showMoonCalendar();
  }
  
  private onSwipeDown() {
    // Hide moon calendar
    this.hideMoonCalendar();
  }
}
```

---

## 🎯 Mobile Success Criteria

### **Performance Requirements**
- **<3.5s**: Time to interactive on mobile
- **<2.5s**: Largest contentful paint
- **<100ms**: First input delay
- **<0.1**: Cumulative layout shift
- **60fps**: Smooth scrolling and animations

### **Mobile Experience**
- **Touch targets**: Minimum 44px touch targets
- **Responsive design**: Works on all screen sizes
- **Offline support**: Basic offline functionality
- **PWA features**: Installable, app-like experience

### **Accessibility**
- **Screen reader**: Full screen reader support
- **Keyboard navigation**: Complete keyboard navigation
- **High contrast**: High contrast mode support
- **Reduced motion**: Respects reduced motion preferences

This mobile and performance optimization ensures the platform works seamlessly across all devices while maintaining the sacred, immersive experience.
