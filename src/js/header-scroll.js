export function initHeaderScroll() {
    const elements = document.querySelectorAll(".header-text, .header-text-int, .top-blur, .nav");
  
    function toggleScrolledClass() {
      if (window.scrollY > 0) {
        elements.forEach(el => el.classList.add("scrolled"));
      } else {
        elements.forEach(el => el.classList.remove("scrolled"));
      }
    }
  
    toggleScrolledClass();
    window.addEventListener("scroll", toggleScrolledClass);
  }
  
