console.log("Header scroll script loaded!"); // First check

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOMContentLoaded fired!"); // Second check

    const elements = document.querySelectorAll(".header-text, .header-text-int, .column-header");


    function toggleScrolledClass() {

        if (window.scrollY > 0) {
            elements.forEach(el => {
                el.classList.add("scrolled");
            });
        } else {
            elements.forEach(el => {
                el.classList.remove("scrolled");
            });
        }
    }

    // Check on page load
    toggleScrolledClass();

    // Listen for scroll events
    window.addEventListener("scroll", toggleScrolledClass);
});

