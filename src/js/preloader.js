window.hoverFrameCache = {};
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  const videos = document.querySelectorAll('.highlight-video');
  let processedCount = 0;

  if (videos.length === 0) return finishPreloading();

  videos.forEach((video, idx) => {
    const container = video.closest('.article-highlight') || video.closest('.article-card');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth || 300;
    canvas.height = video.videoHeight || 150;

    let frameCache = [];

    function finishVideo() {
      window.hoverFrameCache[idx] = frameCache;
      processedCount++;
      if (processedCount === videos.length) finishPreloading();
    }

    function captureFrames() {
      video.currentTime = 0;
      video.play();

      let frameCaptureId;
      function capture() {
        if (video.ended || frameCache.length >= 45) {
          video.pause();
          cancelAnimationFrame(frameCaptureId);
          finishVideo();
          return;
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        frameCache.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        frameCaptureId = requestAnimationFrame(capture);
      }

      // Ensure the first frame is visible immediately
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      capture();
    }

    video.addEventListener('loadeddata', () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw one initial frame to guarantee visibility
      video.currentTime = 0;
      video.play();
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      captureFrames();
    });

    // Fallback if video never loads
    setTimeout(() => {
      if (frameCache.length === 0) {
        console.warn(`Timeout: could not preload video ${idx}`);
        finishVideo();
      }
    }, 5000);
  });

  function finishPreloading() {
    setTimeout(() => {
      preloader.classList.add('hidden');
      window.dispatchEvent(new Event("siteReady"));
    }, 400);
  }
});
