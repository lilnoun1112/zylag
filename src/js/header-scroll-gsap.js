export function initHeaderScrollGSAP() {
  const buttons = document.querySelectorAll('.button-secondary');
  const buttonContainer = document.querySelector('.header-buttons-wrap');
  const headerButtons = document.querySelector('.header-buttons');

  if (!buttons.length || !buttonContainer || !headerButtons) return;

  let isScrolled = false;

  function getResponsiveHeight(scrolled) {
    const width = window.innerWidth;
    const isMobile = width <= 780;
    const isTablet = width <= 1180;

    if (scrolled) {
      return isTablet ? "80px" : "114px"; // Tablet and mobile share this
    } else {
      if (isMobile) return "600px";
      if (isTablet) return "355px";
      return "305px";
    }
  }

  function trackAndAnimate() {
    const shouldBeScrolled = window.scrollY > 0;

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
          gsap.to(btn, { x: 0, y: 0, duration: 0.8, ease: "power3.out" });
        });

        gsap.to([header, headerInt, columnHeader, columnHeaderLogo], {
          height: getResponsiveHeight(shouldBeScrolled),
          duration: 0.8,
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

  // Attach the scroll handler
  window.removeEventListener("scroll", window.__headerScrollGSAPHandler);
  window.__headerScrollGSAPHandler = trackAndAnimate;
  window.addEventListener("scroll", window.__headerScrollGSAPHandler);
}

export function destroyHeaderScrollGSAP() {
  window.removeEventListener('scroll', window.__headerScrollGSAPHandler);
}




  