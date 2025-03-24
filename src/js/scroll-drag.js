document.addEventListener("DOMContentLoaded", function () {
    const slider = document.querySelector('.header-buttons');
    let isDown = false;
    let startX;
    let scrollLeft;

    // When mouse button is pressed
    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.classList.add('active'); // Optional: visual cue while dragging
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });

    // When mouse leaves the container
    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.classList.remove('active');
    });

    // When mouse button is released
    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.classList.remove('active');
    });

    // While mouse is moving
    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return; // Stop if mouse is not down
        e.preventDefault(); // Prevent selecting text/images while dragging
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 1.5; // Multiply for scrolling speed
        slider.scrollLeft = scrollLeft - walk;
    });
});
