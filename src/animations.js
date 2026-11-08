const backgroundZoom = {
  startScale: 2.5,
  duration: 5000,
  easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
};

class CreativeAnimations {
  constructor(creative) {
    this.creative = creative;
    this.background = creative.querySelector('.creative__background');
    this.motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.syncedPreview = window.parent !== window
      && new URLSearchParams(window.location.search).get('sync') === '1';
    this.ready = false;
    this.zoomAnimation = null;
  }

  init() {
    this.updateMotionPreference();
    this.prepareBackgroundZoom();

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

  prepareBackgroundZoom() {
    if (this.motionPreference.matches) return;

    this.zoomAnimation = this.background.animate([
      { transform: `scale(${backgroundZoom.startScale})` },
      { transform: 'scale(1)' },
    ], {
      duration: backgroundZoom.duration,
      easing: backgroundZoom.easing,
      fill: 'backwards',
    });

    this.zoomAnimation.pause();
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
    if (!this.ready || this.motionPreference.matches || !this.zoomAnimation) return;

    this.zoomAnimation.play();
    // Translate the shared wall-clock time into this document's animation timeline.
    this.zoomAnimation.startTime = startAt - performance.timeOrigin;
  }

  updateMotionPreference() {
    const reducedMotion = this.motionPreference.matches;

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
