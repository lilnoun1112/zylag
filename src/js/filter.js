export function initFilter() {
  const buttons = document.querySelectorAll('.button-secondary[data-tag]');
  const articles = document.querySelectorAll('.article-card');
  const highlights = document.querySelectorAll('.article-highlight');

  if (!buttons.length || (!articles.length && !highlights.length)) return;

  let activeTag = null;
  const DEFAULT_HIGHLIGHT = "Frontend";

  function activeHighlightTag() {
    return activeTag || DEFAULT_HIGHLIGHT;
  }

  function fadeOutChildren(el) {
    return new Promise(resolve => {
      const children = Array.from(el.children);
      gsap.to(children, {
        opacity: 0,
        duration: 0.25,
        onComplete: resolve
      });
    });
  }

  function fadeInChildren(el) {
    const children = Array.from(el.children);
    gsap.fromTo(children, { opacity: 0 }, { opacity: 1, duration: 0.25 });
  }

  async function filterArticles() {
    const fadeOuts = Array.from(articles).filter(a => a.style.display !== 'none').map(fadeOutChildren);
    await Promise.all(fadeOuts);

    articles.forEach(article => {
      const tagElements = article.querySelectorAll('.label-pill');
      const tags = Array.from(tagElements).map(el => el.textContent.trim());
      const matchesTag = !activeTag || tags.includes(activeTag);

      const highlightValue = article.getAttribute('data-highlight')?.trim() || '';
      const isCurrentHighlight = highlightValue === activeHighlightTag();
      const shouldShow = matchesTag && !isCurrentHighlight;

      article.style.display = shouldShow ? 'flex' : 'none';
    });

    // Fade in newly visible cards
    Array.from(articles)
      .filter(a => a.style.display !== 'none')
      .forEach(fadeInChildren);
  }

  async function filterHighlights() {
    const fadeOuts = Array.from(highlights).filter(h => h.style.display !== 'none').map(fadeOutChildren);
    await Promise.all(fadeOuts);

    highlights.forEach(highlight => {
      const highlightTagsRaw = highlight.getAttribute('data-highlight') || '';
      const highlightTags = highlightTagsRaw.split(',').map(t => t.trim());

      const shouldShow = activeTag
        ? highlightTags.includes(activeTag)
        : highlightTags.includes(DEFAULT_HIGHLIGHT);

      highlight.style.display = shouldShow ? 'flex' : 'none';
    });

    // Fade in new visible highlight
    Array.from(highlights)
      .filter(h => h.style.display !== 'none')
      .forEach(fadeInChildren);
  }

  buttons.forEach(button => {
    button.addEventListener('click', async () => {
      const tag = button.getAttribute('data-tag');

      if (activeTag === tag) {
        activeTag = null;
        button.classList.remove('active');
      } else {
        activeTag = tag;
        buttons.forEach(b => b.classList.remove('active'));
        button.classList.add('active');
      }

      await Promise.all([
        filterArticles(),
        filterHighlights()
      ]);
    });
  });

  // Initial state
  filterArticles();
  filterHighlights();
}
