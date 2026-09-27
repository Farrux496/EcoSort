/**
 * CHIQINDI PROJECT — shared navbar behavior
 *
 * Mobile hamburger open/close + navbar shrink-on-scroll. Several pages
 * already had this wired up inline (index.html, stocks.html); this file
 * gives the rest of the pages the same working mobile nav without
 * duplicating markup-specific inline scripts (login/register modal logic
 * stays where it is - this file only touches the nav toggle itself).
 *
 * Every element is looked up defensively so this script is safe to include
 * on any page, whether or not a given nav element exists.
 */
(function () {
  'use strict';

  function init() {
    var navbar = document.querySelector('.navbar');
    var toggleBtn = document.querySelector('.toggle-menu');
    var closeBtn = document.querySelector('.close-menu');
    var navLinks = document.querySelector('.nav-links');

    if (toggleBtn && navLinks) {
      toggleBtn.addEventListener('click', function () {
        navLinks.classList.add('active');
      });
    }

    if (closeBtn && navLinks) {
      closeBtn.addEventListener('click', function () {
        navLinks.classList.remove('active');
      });
    }

    if (navbar) {
      window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
