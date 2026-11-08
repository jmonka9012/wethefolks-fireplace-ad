const backgroundZoom = {
  startScale: 2.5,
  duration: 5000,
  easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
};

const logoEntrance = {
  leftDelay: 1200,
  rightDelay: 1500,
  duration: 1300,
  startScale: 0.5,
  easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
};

const panelEntrance = {
  delayAfterLogoStart: 400,
  duration: 700,
};

const copyEntrance = {
  delayAfterPanel: 200,
  duration: 1400,
  easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
};

const ctaEntrance = {
  duration: 900,
  overshootScale: 1.4,
};

class CreativeAnimations {
  constructor(creative) {
    this.creative = creative;
    this.background = creative.querySelector('.creative__background');
    this.logo = creative.querySelector('.creative__logo');
    this.panel = creative.querySelector('.creative__panel');
    this.copy = creative.querySelector('.creative__copy');
    this.cta = creative.querySelector('.creative__cta');
    this.motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.params = new URLSearchParams(window.location.search);
    this.syncedPreview = window.parent !== window
      && this.params.get('sync') === '1';
    this.ready = false;
    this.animations = [];
  }

  init() {
    this.updateMotionPreference();
    this.prepareBackgroundZoom();
    this.prepareLogoEntrance();
    this.preparePanelEntrance();
    this.prepareCopyEntrance();
    this.prepareCtaEntrance();

    this.motionPreference.addEventListener('change', () => {
      this.updateMotionPreference();
    });

    if (this.syncedPreview) {
      window.addEventListener('message', (event) => this.handleMessage(event));
    }

    if (document.readyState === 'complete') {
      this.markReady();
    } else {
      // Wait for the background and other images before starting the intro.
      window.addEventListener('load', () => this.markReady(), { once: true });
    }
  }

  get reducedMotion() {
    // Only the managed preview can override the actual system preference.
    if (this.syncedPreview && this.params.has('reduced-motion')) {
      return this.params.get('reduced-motion') === '1';
    }

    return this.motionPreference.matches;
  }

  get logoDelay() {
    return this.creative.classList.contains('creative--right')
      ? logoEntrance.rightDelay
      : logoEntrance.leftDelay;
  }

  get panelDelay() {
    const lastLogoStart = Math.max(logoEntrance.leftDelay, logoEntrance.rightDelay);

    return lastLogoStart + panelEntrance.delayAfterLogoStart;
  }

  get copyDelay() {
    return this.panelDelay + copyEntrance.delayAfterPanel;
  }

  prepareBackgroundZoom() {
    if (this.reducedMotion) return;

    const animation = this.background.animate([
      { transform: `scale(${backgroundZoom.startScale})` },
      { transform: 'scale(1)' },
    ], {
      duration: backgroundZoom.duration,
      easing: backgroundZoom.easing,
      fill: 'backwards',
    });

    animation.pause();
    this.animations.push(animation);
  }

  prepareLogoEntrance() {
    if (this.reducedMotion || !this.logo) return;

    const isRight = this.creative.classList.contains('creative--right');
    const offset = isRight ? '100%' : '-100%';

    const animation = this.logo.animate([
      { transform: `translateX(${offset}) scale(${logoEntrance.startScale})` },
      { transform: 'translateX(0) scale(1)' },
    ], {
      delay: this.logoDelay,
      duration: logoEntrance.duration,
      easing: logoEntrance.easing,
      fill: 'backwards',
    });

    animation.pause();
    this.animations.push(animation);
  }

  preparePanelEntrance() {
    if (this.reducedMotion || !this.panel) return;

    const finalOpacity = Number(getComputedStyle(this.panel).opacity);

    const animation = this.panel.animate([
      { opacity: 0 },
      { opacity: finalOpacity },
    ], {
      delay: this.panelDelay,
      duration: panelEntrance.duration,
      easing: 'ease-out',
      fill: 'backwards',
    });

    animation.pause();
    this.animations.push(animation);
  }

  prepareCopyEntrance() {
    if (this.reducedMotion || !this.copy) return;

    // Opacity comes from the panel wrapper, so its background and copy fade together.
    const animation = this.copy.animate([
      { transform: 'translateX(100%)' },
      { transform: 'translateX(0)' },
    ], {
      delay: this.copyDelay,
      duration: copyEntrance.duration,
      easing: copyEntrance.easing,
      fill: 'backwards',
    });

    animation.pause();
    this.animations.push(animation);
  }

  prepareCtaEntrance() {
    if (this.reducedMotion || !this.cta) return;

    const animation = this.cta.animate([
      { transform: 'scale(0)', easing: 'ease-out' },
      { transform: `scale(${ctaEntrance.overshootScale})`, offset: 0.65, easing: 'ease-out' },
      { transform: 'scale(1)' },
    ], {
      delay: this.copyDelay + copyEntrance.duration,
      duration: ctaEntrance.duration,
      fill: 'backwards',
    });

    animation.pause();
    this.animations.push(animation);
  }

  markReady() {
    this.ready = true;

    if (this.syncedPreview) {
      this.notifyReady();
    } else {
      this.start();
    }
  }

  notifyReady() {
    window.parent.postMessage({ type: 'fireplace:ready' }, window.location.origin);
  }

  handleMessage(event) {
    if (event.source !== window.parent || event.origin !== window.location.origin) return;

    if (event.data?.type === 'fireplace:check-ready' && this.ready) {
      this.notifyReady();
    }

    if (event.data?.type === 'fireplace:start' && Number.isFinite(event.data.startAt)) {
      this.start(event.data.startAt);
    }
  }

  start(startAt = Date.now()) {
    if (!this.ready || this.reducedMotion) return;

    // Translate the shared wall-clock time into this document's animation timeline.
    const startTime = startAt - performance.timeOrigin;

    for (const animation of this.animations) {
      animation.play();
      animation.startTime = startTime;
    }
  }

  updateMotionPreference() {
    const reducedMotion = this.reducedMotion;

    this.creative.dataset.reducedMotion = String(reducedMotion);

    if (reducedMotion) {
      // The unanimated HTML/CSS remains the final, visible state.
      for (const animation of this.creative.getAnimations({ subtree: true })) {
        animation.cancel();
      }
    }
  }
}

const creative = document.querySelector('.creative');
const creativeAnimations = new CreativeAnimations(creative);

creativeAnimations.init();
