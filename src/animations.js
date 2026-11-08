class CreativeAnimations {
  constructor(creative) {
    this.creative = creative;
    this.motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  }

  init() {
    this.updateMotionPreference();

    this.motionPreference.addEventListener('change', () => {
      this.updateMotionPreference();
    });
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
