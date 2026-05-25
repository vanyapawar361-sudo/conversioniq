interface ConversionIQOptions {
  trackingId: string;
  endpoint: string;
  batchInterval?: number;
}

interface TrackingEvent {
  type: string;
  url: string;
  timestamp: number;
  x?: number;
  y?: number;
  normalizedX?: number;
  normalizedY?: number;
  targetSelector?: string;
  targetText?: string;
  metadata?: any;
}

class ConversionIQ {
  private trackingId: string;
  private endpoint: string;
  private sessionId: string;
  private visitorId: string;
  private eventBatch: TrackingEvent[] = [];
  private batchInterval: number;
  private lastClick: { t: number, x: number, y: number } | null = null;
  private clickCount = 0;

  constructor(options: ConversionIQOptions) {
    this.trackingId = options.trackingId;
    this.endpoint = options.endpoint;
    this.batchInterval = options.batchInterval || 5000;
    this.sessionId = this.getOrCreateId('ci_session_id');
    this.visitorId = this.getOrCreateId('ci_visitor_id');

    this.init();
  }

  private init() {
    this.trackPageView();
    this.attachEventListeners();
    this.startBatchTimer();
  }

  private getOrCreateId(key: string): string {
    let id = localStorage.getItem(key);
    if (!id) {
      id = Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem(key, id);
    }
    return id;
  }

  private attachEventListeners() {
    window.addEventListener('click', (e) => this.handleClick(e));
    window.addEventListener('scroll', () => this.handleScroll());
    // Mouse movement could be very noisy, maybe sample it or only for session replay
    // For now, let's keep it simple
  }

  private handleClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    const event: TrackingEvent = {
      type: 'click',
      url: window.location.href,
      timestamp: Date.now(),
      x: e.pageX,
      y: e.pageY,
      normalizedX: e.pageX / document.documentElement.scrollWidth,
      normalizedY: e.pageY / document.documentElement.scrollHeight,
      targetSelector: this.getSelector(target),
      targetText: target.innerText?.substring(0, 50)
    };

    this.detectRageClick(e);
    this.pushEvent(event);
  }

  private detectRageClick(e: MouseEvent) {
    const now = Date.now();
    if (this.lastClick && now - this.lastClick.t < 500 && Math.abs(e.pageX - this.lastClick.x) < 10) {
      this.clickCount++;
      if (this.clickCount > 3) {
        this.pushEvent({
          type: 'rage_click',
          url: window.location.href,
          timestamp: now,
          x: e.pageX,
          y: e.pageY
        });
        this.clickCount = 0;
      }
    } else {
      this.clickCount = 1;
    }
    this.lastClick = { t: now, x: e.pageX, y: e.pageY };
  }

  private handleScroll() {
    // Only track scroll occasionally or sample
  }

  private trackPageView() {
    this.pushEvent({
      type: 'page_view',
      url: window.location.href,
      timestamp: Date.now(),
      metadata: {
        title: document.title,
        referrer: document.referrer,
        userAgent: navigator.userAgent
      }
    });
  }

  private getSelector(el: HTMLElement): string {
    if (el.id) return `#${el.id}`;
    if (el.className) return `.${el.className.split(' ').join('.')}`;
    return el.tagName.toLowerCase();
  }

  private pushEvent(event: TrackingEvent) {
    this.eventBatch.push(event);
  }

  private startBatchTimer() {
    setInterval(() => this.flush(), this.batchInterval);
  }

  private async flush() {
    if (this.eventBatch.length === 0) return;

    const payload = {
      trackingId: this.trackingId,
      sessionId: this.sessionId,
      visitorId: this.visitorId,
      events: this.eventBatch
    };

    this.eventBatch = [];

    try {
      await fetch(`${this.endpoint}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        mode: 'cors'
      });
    } catch (error) {
      console.error('CI SDK Error:', error);
    }
  }
}

// Auto-initialize if config is present
if ((window as any).ConversionIQConfig) {
  new ConversionIQ((window as any).ConversionIQConfig);
}

export default ConversionIQ;
