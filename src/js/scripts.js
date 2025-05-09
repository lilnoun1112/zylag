import { initHeaderScroll } from './header-scroll.js';
import { initHeaderScrollGSAP } from './header-scroll-gsap.js';
import { initNavActivate } from './nav-activate.js';
import { initScrollDrag } from './scroll-drag.js';
import { initTabs } from './tabs.js';
import { initFilter } from './filter.js';
import { initHoverAnim } from './hoveranim.js';
import { destroyHeaderScrollGSAP } from './header-scroll-gsap.js';
import { destroyHeaderScroll } from './header-scroll.js';

console.log('✅ scripts.js loaded');

// Shared scripts used across all pages
function initSharedScripts() {
  console.log('📦 initAll (shared scripts)');
  initNavActivate();
  initScrollDrag();
  initTabs();
  initFilter();
  initHoverAnim();
}

// Dispatch custom event on first load
document.addEventListener('DOMContentLoaded', () => {
  console.log('📦 DOMContentLoaded → barbapage:ready');
  document.dispatchEvent(new CustomEvent('barbapage:ready'));
});

// Initialize shared scripts on event or after transition
document.addEventListener('barbapage:ready', initSharedScripts);
barba.hooks.afterEnter(initSharedScripts);

barba.hooks.before(() => {
  console.log('🌀 Barba transition started');
});

barba.init({
  views: [
    {
      namespace: 'home',
      afterEnter() {
        console.log('🏠 Home loaded');
        initHeaderScrollGSAP();
        initHeaderScroll();

        requestAnimationFrame(() => {
          setTimeout(() => {
            window.__headerScrollGSAPHandler?.();
          }, 100);
        });
      }
    },
    {
      namespace: 'article',
      afterEnter() {
        console.log('📄 Article loaded');
      }
    }
  ],
  transitions: [
    {
      name: 'home-to-article',
      from: { namespace: ['home'] },
      to: { namespace: ['article'] },

      async leave({ current }) {
        const done = this.async();
        const el = (sel) => document.querySelector(sel);

        destroyHeaderScrollGSAP();
        destroyHeaderScroll();

        const columnMains = current.container.querySelectorAll('.column-main');
        const fadingElements = Array.from(columnMains).flatMap(col => [...col.children]);
        const topBlur = el('.top-blur');
        const content = el('.content');
        const nav = el('.nav');

        if (nav) nav.style.transition = 'none';

        await gsap.to([...fadingElements, topBlur, content, nav], {
          opacity: 0,
          duration: 0.4,
        });

        if (nav) nav.style.transition = '';

        nav?.classList.add('scrolled', 'articlepage');
        topBlur?.classList.add('scrolled');
        content?.classList.add('articlepage');
        el('.header')?.classList.add('scrolled', 'articlepage');
        el('.column-header-logo')?.classList.add('scrolled');
        el('.logo')?.classList.add('scrolled');
        el('.column-header')?.classList.add('scrolled');
        el('.column-header .line-header')?.classList.add('articlepage');

        // ✅ Add articlepage and animate static width
        columnMains.forEach(el => {
          el.classList.add('articlepage');
          if (el.classList.contains('static')) {
            gsap.to(el, {
              width: '880px',
              duration: 0.4,
              ease: 'power2.out'
            });
          }
        });

        const section = el('.section#works');
        section?.classList.add('articlepage');
        section?.removeAttribute('id');

        await new Promise(resolve => setTimeout(resolve, 500));
        done();
      },

      async enter({ next }) {
        window.scrollTo(0, 0);

        const columnMain = next.container.querySelector('.column-main');
        const fadingElements = [...columnMain.children];
        const topBlur = document.querySelector('.top-blur');
        const content = document.querySelector('.content');
        const nav = document.querySelector('.nav');

        if (nav) nav.style.transition = 'none';

        gsap.fromTo([...fadingElements, topBlur, content, nav], {
          opacity: 0
        }, {
          opacity: 1,
          duration: 0.4,
          onComplete: () => {
            if (nav) nav.style.transition = '';
          }
        });
      }
    },
    {
      name: 'article-to-home',
      from: { namespace: ['article'] },
      to: { namespace: ['home'] },

      async leave({ current }) {
        const done = this.async();
        const el = (sel) => document.querySelector(sel);
        const columnMains = current.container.querySelectorAll('.column-main');
        const fadingElements = Array.from(columnMains).flatMap(col => [...col.children]);
        const topBlur = el('.top-blur');
        const content = el('.content');
        const nav = el('.nav');

        if (nav) nav.style.transition = 'none';

        await gsap.to([...fadingElements, topBlur, content, nav], {
          opacity: 0,
          duration: 0.4,
        });

        if (nav) nav.style.transition = '';

        nav?.classList.remove('scrolled', 'articlepage');
        topBlur?.classList.remove('scrolled');
        content?.classList.remove('articlepage');
        el('.header')?.classList.remove('scrolled', 'articlepage');
        el('.column-header-logo')?.classList.remove('scrolled');
        el('.logo')?.classList.remove('scrolled');
        el('.column-header')?.classList.remove('scrolled');
        el('.column-header .line-header')?.classList.remove('articlepage');

        document.querySelectorAll('.column-main').forEach(el => el.classList.remove('articlepage'));

        const section = el('.section.articlepage');
        section?.classList.remove('articlepage');
        section?.setAttribute('id', 'works');

        await new Promise(resolve => setTimeout(resolve, 500));
        done();
      },

      async enter({ next }) {
        window.scrollTo(0, 0);
        initHeaderScrollGSAP();
        initHeaderScroll();

        const columnMain = next.container.querySelector('.column-main');
        const fadingElements = [...columnMain.children];
        const topBlur = document.querySelector('.top-blur');
        const content = document.querySelector('.content');
        const nav = document.querySelector('.nav');

        if (nav) nav.style.transition = 'none';

        gsap.fromTo([...fadingElements, topBlur, content, nav], {
          opacity: 0
        }, {
          opacity: 1,
          duration: 0.4,
          onComplete: () => {
            if (nav) nav.style.transition = '';
          }
        });
      }
    }
  ]
});

// Reset scroll to top after every page transition
barba.hooks.afterEnter(() => {
  const target = sessionStorage.getItem('scroll-smooth-on-load');
  if (target) {
    const anchor = target.split('#')[1];
    const el = document.getElementById(anchor) || document.querySelector(`#${anchor}`);
    if (el) {
      document.documentElement.style.scrollBehavior = 'smooth';
      el.scrollIntoView();
      setTimeout(() => {
        document.documentElement.style.scrollBehavior = '';
      }, 1000);
    }
    sessionStorage.removeItem('scroll-smooth-on-load');
  }
});

document.querySelectorAll('.nav a.nav-item').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      document.documentElement.style.scrollBehavior = 'smooth';
      document.querySelector(href)?.scrollIntoView();
      setTimeout(() => {
        document.documentElement.style.scrollBehavior = '';
      }, 1000);
    }
    if (href && href.startsWith('/#')) {
      sessionStorage.setItem('scroll-smooth-on-load', href);
    }
  });
});
