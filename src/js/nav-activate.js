document.addEventListener("DOMContentLoaded", function () {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-item");

  function activateNav() {
    let currentSection = null;

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionBottom = rect.bottom;

      // Trigger when top is above 30% of viewport height and bottom is below it
      if (sectionTop <= window.innerHeight * 0.5 && sectionBottom > window.innerHeight * 0.5) {
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
  });
  