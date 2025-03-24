console.log("Header scroll with full animation loaded!");

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOMContentLoaded fired!");

    // Buttons and their container
    const buttons = document.querySelectorAll('.button-secondary');
    const buttonContainer = document.querySelector('.header-buttons-wrap');
    const headerButtons = document.querySelector('.header-buttons');

    // Other header elements
    const header = document.querySelector('.header');
    const headerInt = document.querySelector('.header-int');
    const columnHeader = document.querySelector('.column-header');
    const columnHeaderLogo = document.querySelector('.column-header-logo');
    const logo = document.querySelector('.logo');

    let isScrolled = false;

    function trackAndAnimate() {
        const shouldBeScrolled = window.scrollY > 0;

        if (shouldBeScrolled !== isScrolled) {
            console.log(`Scroll state is changing: ${shouldBeScrolled ? 'Adding' : 'Removing'} .scrolled`);


            // ✅ 1. Capture old positions of buttons
            const oldPositions = Array.from(buttons).map(btn => btn.getBoundingClientRect());

            // ✅ 2. Toggle .scrolled class to trigger layout shift
            buttonContainer.classList.toggle('scrolled', shouldBeScrolled);
            headerButtons.classList.toggle('scrolled', shouldBeScrolled);

            // ✅ 3. Wait for layout to recalculate
            requestAnimationFrame(() => {
                // ✅ 4. Capture new positions
                const newPositions = Array.from(buttons).map(btn => btn.getBoundingClientRect());

                // ✅ 5. Calculate deltas and animate buttons
                buttons.forEach((btn, i) => {
                    const dx = oldPositions[i].left - newPositions[i].left;
                    const dy = oldPositions[i].top - newPositions[i].top;

                    // Set back to old place visually
                    gsap.set(btn, { x: dx, y: dy });

                    // Animate to new place
                    gsap.to(btn, {
                        x: 0,
                        y: 0,
                        duration: 0.6,
                        ease: "power3.out"
                    });
                });

                // ✅ 6. Animate other elements smoothly

                // Header height change
                gsap.to(header, {
                    height: shouldBeScrolled ? "146px" : "305px",
                    duration: 0.6,
                    ease: "power3.out"
                });

                // Header-int height
                gsap.to(headerInt, {
                    height: shouldBeScrolled ? "130px" : "304px",
                    duration: 0.6,
                    ease: "power3.out"
                });


                // Column-header height/padding
                gsap.to(columnHeader, {
                    height: shouldBeScrolled ? "130px" : "305px",
                    duration: 0.6,
                    ease: "power3.out"
                });

                // Column-header-logo height/padding
                gsap.to(columnHeaderLogo, {
                    height: shouldBeScrolled ? "130px" : "305px",
                    paddingTop: shouldBeScrolled ? "16px" : "16px", // adjust if needed
                    duration: 0.6,
                    ease: "power3.out"
                });

                // Logo opacity
                gsap.to(logo, {
                    opacity: shouldBeScrolled ? 1 : 0,
                    duration: 0.4,
                    ease: "power3.out"
                });



                // ✅ 7. Update internal state
                isScrolled = shouldBeScrolled;
            });
        }
    }

    // Initial check on page load
    trackAndAnimate();

    // Scroll listener
    window.addEventListener("scroll", trackAndAnimate);
});
