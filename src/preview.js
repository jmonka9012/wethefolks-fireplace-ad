class FireplacePreview {
  constructor() {
    this.frames = [...document.querySelectorAll('iframe')];
    this.reloadButton = document.querySelector('#reload');
    this.motionCheckbox = document.querySelector('#reduced-motion');
    this.motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.readyFrames = new Set();
  }

  init() {
    this.motionCheckbox.checked = this.motionPreference.matches;

    window.addEventListener('message', (event) => this.handleMessage(event));
    this.reloadButton.addEventListener('click', () => this.reload());
    this.motionCheckbox.addEventListener('change', () => this.reload());
    this.motionPreference.addEventListener('change', () => {
      this.motionCheckbox.checked = this.motionPreference.matches;
      this.reload();
    });

    // A cached iframe may have reported readiness before this script loaded.
    for (const frame of this.frames) {
      frame.contentWindow.postMessage({ type: 'fireplace:check-ready' }, window.location.origin);
    }
  }

  handleMessage(event) {
    if (event.origin !== window.location.origin || event.data?.type !== 'fireplace:ready') return;

    const knownFrame = this.frames.some((frame) => frame.contentWindow === event.source);

    if (!knownFrame || this.readyFrames.has(event.source)) return;

    this.readyFrames.add(event.source);

    if (this.readyFrames.size === this.frames.length) {
      this.start();
    }
  }

  start() {
    const message = {
      type: 'fireplace:start',
      startAt: Date.now() + 100,
    };

    for (const frame of this.frames) {
      frame.contentWindow.postMessage(message, window.location.origin);
    }
  }

  reload() {
    this.readyFrames.clear();

    for (const frame of this.frames) {
      const url = new URL(frame.src);

      url.searchParams.set('reduced-motion', this.motionCheckbox.checked ? '1' : '0');
      frame.src = url.href;
    }
  }
}

const preview = new FireplacePreview();

preview.init();
