export function initHoverAnim() {
  const canvasConfigs = [
    { canvasClass: 'highlight-canvas', parentClass: 'article-highlight' },
    { canvasClass: 'article-canvas', parentClass: 'article-card' }
  ];

  const frameCount = 14;
  const frameWidth = 1280;
  const frameHeight = 720;
  const duration = 500; // ms

  // Load sprites only when a card is near the viewport (or on first hover),
  // instead of eagerly downloading every multi-MB spritesheet on page load.
  const supportsIO = 'IntersectionObserver' in window;
  const observer = supportsIO
    ? new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target._loadSprite?.();
            obs.unobserve(entry.target);
          }
        });
      }, { rootMargin: '300px' })
    : null;

  canvasConfigs.forEach(({ canvasClass, parentClass }) => {
    const canvasElements = document.querySelectorAll(`.${canvasClass}:not(.initialized)`);

    canvasElements.forEach(canvas => {
      canvas.classList.add('initialized');
      const ctx = canvas.getContext('2d');
      const sprite = new Image();
      const spriteUrl = canvas.dataset.sprite;

      canvas.width = frameWidth;
      canvas.height = frameHeight;

      let currentFrame = 0;
      let intervalId = null;
      let currentDirection = 0;
      let isLoaded = false;
      let loadStarted = false;
      let isHovering = false;

      function drawFrame(frame) {
        ctx.clearRect(0, 0, frameWidth, frameHeight);
        ctx.drawImage(
          sprite,
          0, frame * frameHeight,
          frameWidth, frameHeight,
          0, 0,
          frameWidth, frameHeight
        );
      }

      function startAnimation(direction) {
        if (currentDirection === direction) return;
        if (intervalId) clearInterval(intervalId);

        currentDirection = direction;

        intervalId = setInterval(() => {
          drawFrame(currentFrame);
          currentFrame += direction;

          const outOfBounds = direction === 1
            ? currentFrame >= frameCount
            : currentFrame < 0;

          if (outOfBounds) {
            clearInterval(intervalId);
            intervalId = null;
            currentDirection = 0;
            currentFrame = direction === 1 ? frameCount - 1 : 0;
            drawFrame(currentFrame);
          }
        }, duration / frameCount);
      }

      sprite.onload = () => {
        isLoaded = true;
        drawFrame(0); // paint the poster frame once decoded
        if (isHovering) startAnimation(1); // user hovered before it finished loading
      };
      sprite.onerror = () => {}; // fail-safe

      // Deferred loader — sets src the first time it's actually needed.
      function loadSprite() {
        if (loadStarted || !spriteUrl) return;
        loadStarted = true;
        sprite.src = spriteUrl;
      }
      canvas._loadSprite = loadSprite;

      const parent = canvas.closest(`.${parentClass}`);
      if (!parent) return;

      // Observe the card so the sprite preloads just before it scrolls into view.
      if (observer) {
        observer.observe(canvas);
      } else {
        loadSprite(); // no IntersectionObserver support: fall back to immediate load
      }

      parent.addEventListener('mouseenter', () => {
        isHovering = true;
        loadSprite(); // guarantee it's loading if the observer hasn't fired yet
        if (isLoaded) startAnimation(1);
      });

      parent.addEventListener('mouseleave', () => {
        isHovering = false;
        if (isLoaded) startAnimation(-1);
      });
    });
  });

  // Nothing currently depends on all sprites being decoded; signal that
  // hover animation wiring is ready so listeners (if any) can proceed.
  document.dispatchEvent(new CustomEvent('hoveranim:ready'));
}
