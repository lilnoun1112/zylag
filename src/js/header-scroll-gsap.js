export function initHeaderScrollGSAP() {
  const buttons = document.querySelectorAll('.button-secondary');
  const buttonContainer = document.querySelector('.header-buttons-wrap');
  const headerButtons = document.querySelector('.header-buttons');

  if (!buttons.length || !buttonContainer || !headerButtons) return;

  let isScrolled = false;

  function getResponsiveHeight(scrolled) {
    const isNarrow = window.innerWidth <= 1180;

    // Adjust base heights based on scroll state
    if (scrolled) {
      return "114px"; // Same for all widths
    } else {
      return isNarrow ? "355px" : "305px";
    }
  }

  function trackAndAnimate() {
    const shouldBeScrolled = window.scrollY > 0;

    // Always re-query DOM to ensure fresh elements after Barba transition
    const header = document.querySelector('.header');
    const headerInt = document.querySelector('.header-int');
    const columnHeader = document.querySelector('.column-header');
    const columnHeaderLogo = document.querySelector('.column-header-logo');
    const logo = document.querySelector('.logo');

    if (!header || !headerInt || !columnHeader || !columnHeaderLogo || !logo) return;

    if (shouldBeScrolled !== isScrolled) {
      const oldPositions = Array.from(buttons).map(btn => btn.getBoundingClientRect());

      buttonContainer.classList.toggle('scrolled', shouldBeScrolled);
      headerButtons.classList.toggle('scrolled', shouldBeScrolled);

      requestAnimationFrame(() => {
        const newPositions = Array.from(buttons).map(btn => btn.getBoundingClientRect());

        buttons.forEach((btn, i) => {
          const dx = oldPositions[i].left - newPositions[i].left;
          const dy = oldPositions[i].top - newPositions[i].top;

          gsap.set(btn, { x: dx, y: dy });
          gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: "power3.out" });
        });

        gsap.to([header, headerInt, columnHeader, columnHeaderLogo], {
          height: getResponsiveHeight(shouldBeScrolled),
          duration: 0.6,
          ease: "power3.out"
        });

        gsap.to(logo, {
          opacity: shouldBeScrolled ? 1 : 0,
          duration: 0.4,
          ease: "power3.out"
        });

        isScrolled = shouldBeScrolled;
      });
    }
  }

  // Initial run and scroll listener setup
  trackAndAnimate();

  window.removeEventListener("scroll", window.__headerScrollGSAPHandler);
  window.__headerScrollGSAPHandler = trackAndAnimate;
  window.addEventListener("scroll", window.__headerScrollGSAPHandler);
}


  