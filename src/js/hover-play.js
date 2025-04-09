document.addEventListener("DOMContentLoaded", function () {
  const MAX_FRAMES = 90;
  const FORWARD_SKIP = 1;
  const REVERSE_SKIP = 1;
  const SCALE = 0.5;
  const FPS = 24;
  const FRAME_INTERVAL = 500 / FPS;

  const pairs = document.querySelectorAll('.highlight-video');

  let activeInstance = null;

  pairs.forEach((video) => {
    const container = video.closest('.article-highlight') || video.closest('.article-card');
    const canvas = container.querySelector('.highlight-canvas, .article-canvas');
    const ctx = canvas.getContext('2d');

    let frameCache = [];
    let capturing = false;
    let reversing = false;
    let reverseFrame;
    let captureFrameRequest;
    let lastCaptureTime = 0;
    let cleanupTimeout = null;
    let forwardFrameCounter = 0;

    function drawFrame() {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }

    function captureFrame(timestamp) {
      if (video.paused || video.ended || !capturing) return;

      if (!lastCaptureTime || timestamp - lastCaptureTime >= FRAME_INTERVAL) {
        if (forwardFrameCounter % FORWARD_SKIP === 0) {
          drawFrame();
          const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);

          if (frameCache.length < MAX_FRAMES) {
            frameCache.push(frame);
          }
        }

        lastCaptureTime = timestamp;
        forwardFrameCounter++;
      }

      captureFrameRequest = requestAnimationFrame(captureFrame);
    }

    function playReverse(index) {
      if (!reversing || index < 0 || !frameCache[index]) {
        cleanupTimeout = setTimeout(() => {
          frameCache = [];
        }, 1000);
        return;
      }

      ctx.putImageData(frameCache[index], 0, 0);

      reverseFrame = requestAnimationFrame(() => {
        playReverse(index - REVERSE_SKIP);
      });
    }

    function stopCurrent() {
      video.pause();
      capturing = false;
      reversing = false;
      cancelAnimationFrame(captureFrameRequest);
      cancelAnimationFrame(reverseFrame);
      if (cleanupTimeout) clearTimeout(cleanupTimeout);
    }

    container.addEventListener('mouseenter', () => {
      if (activeInstance && activeInstance !== stopCurrent) {
        activeInstance();
      }
      activeInstance = stopCurrent;

      cancelAnimationFrame(reverseFrame);
      if (cleanupTimeout) clearTimeout(cleanupTimeout);
      reversing = false;

      frameCache = [];
      capturing = true;
      lastCaptureTime = 0;
      forwardFrameCounter = 0;

      video.currentTime = 0;
      video.play();

      drawFrame();
      captureFrameRequest = requestAnimationFrame(captureFrame);
    });

    container.addEventListener('mouseleave', () => {
      video.pause();
      capturing = false;
      cancelAnimationFrame(captureFrameRequest);

      reversing = true;
      playReverse(frameCache.length - 1);

      if (activeInstance === stopCurrent) {
        activeInstance = null;
      }
    });

    video.addEventListener('loadeddata', () => {
      canvas.width = video.videoWidth * SCALE;
      canvas.height = video.videoHeight * SCALE;
      video.currentTime = 0;
      video.pause();
      drawFrame();
    });
  });
});



