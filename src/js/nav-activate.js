export function initNavActivate() {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-item");

  function activateNav() {
    let currentSection = null;
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionBottom = rect.bottom;
      if (sectionTop <= window.innerHeight * 0.7 && sectionBottom > window.innerHeight * 0.) {
        currentSection = section;
      }
    });

    navLinks.forEach(link => link.classList.remove("active"));
    if (currentSection) {
      const id = currentSection.getAttribute("id");
      const activeLink = document.querySelector(`.nav-item[href="#${id}"]`);
      if (activeLink) activeLink.classList.add("active");
    }
  }

  window.addEventListener("scroll", activateNav);
  window.addEventListener("load", activateNav);
}

  