document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector('.article-highlight');
    const video = container.querySelector('.highlight-video');
    const canvas = container.querySelector('.highlight-canvas');
    const ctx = canvas.getContext('2d');
  
    const MAX_FRAMES = 90;        // Limit total cached frames
    const REVERSE_SKIP = 2;       // Skip 2 frames = ~1.5x speed
  
    let frameCache = [];
    let capturing = false;
    let reversing = false;
    let reverseFrame;
    let captureFrameRequest;
  
    function drawFrame() {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }
  
    function captureFrame() {
      if (video.paused || video.ended || !capturing) return;
  
      drawFrame();
      const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
  
      if (frameCache.length < MAX_FRAMES) {
        frameCache.push(frame);
      }
  
      captureFrameRequest = requestAnimationFrame(captureFrame);
    }
  
    function playReverse(index) {
      if (!reversing || index < 0) return;
  
      ctx.putImageData(frameCache[index], 0, 0);
  
      reverseFrame = requestAnimationFrame(() => {
        playReverse(index - REVERSE_SKIP);
      });
    }
  
    container.addEventListener('mouseenter', () => {
      cancelAnimationFrame(reverseFrame);
      reversing = false;
  
      frameCache = [];
      capturing = true;
  
      video.currentTime = 0;
      video.play();
  
      drawFrame();
      captureFrame();
    });
  
    container.addEventListener('mouseleave', () => {
      video.pause();
      capturing = false;
      cancelAnimationFrame(captureFrameRequest);
  
      reversing = true;
      playReverse(frameCache.length - 1);
    });
  
    video.addEventListener('loadeddata', () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      video.currentTime = 0;
      video.pause();
      drawFrame();
    });
  });
  
  
  

