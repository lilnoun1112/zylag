export function initHoverAnim() {
  const canvasConfigs = [
    { canvasClass: 'highlight-canvas', parentClass: 'article-highlight' },
    { canvasClass: 'article-canvas', parentClass: 'article-card' }
  ];

  const frameCount = 14;
  const frameWidth = 1280;
  const frameHeight = 720;
  const duration = 500; // ms

  const spritePromises = [];

  canvasConfigs.forEach(({ canvasClass, parentClass }) => {
    const canvasElements = document.querySelectorAll(`.${canvasClass}:not(.initialized)`);

    canvasElements.forEach(canvas => {
      canvas.classList.add('initialized');
      const ctx = canvas.getContext('2d');
      const sprite = new Image();
      const spriteUrl = canvas.dataset.sprite;
      sprite.src = spriteUrl;

      canvas.width = frameWidth;
      canvas.height = frameHeight;

      let currentFrame = 0;
      let intervalId = null;
      let currentDirection = 0;
      let isLoaded = false;

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

      // Track this sprite's load
      const spritePromise = new Promise(resolve => {
        sprite.onload = () => {
          isLoaded = true;
          drawFrame(0);
          resolve();
        };
        sprite.onerror = resolve; // fail-safe
      });

      spritePromises.push(spritePromise);

      const parent = canvas.closest(`.${parentClass}`);
      if (!parent) return;

      parent.addEventListener('mouseenter', () => {
        if (isLoaded) startAnimation(1);
      });

      parent.addEventListener('mouseleave', () => {
        if (isLoaded) startAnimation(-1);
      });
    });
  });

  // Emit event when all canvas sprites are loaded
  Promise.all(spritePromises).then(() => {
    document.dispatchEvent(new CustomEvent('hoveranim:ready'));
  });
}
