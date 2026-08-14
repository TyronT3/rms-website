/* =========================================================
   RMS Chartered Accountants Inc. — main.js

   Plain ES5-style IIFE, no dependencies, no build step. Handles:
     · light/dark theme toggle (persisted in localStorage)
     · sticky-header shadow on scroll
     · scroll-progress rule + scrollspy on the primary nav
     · mobile nav panel
     · scroll-reveal animations
     · count-up statistics
     · back-to-top button
     · contact form -> mailto: composer (no backend required)
     · footer year
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Theme toggle ---------- */
  var root = document.documentElement;
  var themeToggle = document.getElementById("themeToggle");
  var THEME_KEY = "rms-theme";

  function applyTheme(theme) {
    if (theme === "dark" || theme === "light") {
      root.setAttribute("data-theme", theme);
    } else {
      root.removeAttribute("data-theme");
    }
    if (themeToggle) {
      var isDark = theme === "dark" ||
        (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches);
      themeToggle.setAttribute("aria-pressed", String(isDark));
    }
  }

  var storedTheme = null;
  try { storedTheme = localStorage.getItem(THEME_KEY); } catch (e) { /* storage unavailable */ }
  applyTheme(storedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var current = root.getAttribute("data-theme");
      var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      var effectiveDark = current ? current === "dark" : prefersDark;
      var next = effectiveDark ? "light" : "dark";
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* storage unavailable */ }
    });
  }

  /* Honoured everywhere below: the CSS already neutralises transitions and
     keyframes under this query, and the JS-driven motion follows suit. */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- Sticky header, progress rule, back-to-top ---------- */
  var header = document.getElementById("siteHeader");
  var backToTop = document.getElementById("backToTop");
  var progress = document.getElementById("scrollProgress");

  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle("scrolled", y > 8);
    if (backToTop) backToTop.classList.toggle("visible", y > 500);

    if (progress) {
      // Total scrollable distance; guard against a page shorter than the
      // viewport, where the denominator would be 0.
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var ratio = max > 0 ? Math.min(y / max, 1) : 0;
      progress.style.transform = "scaleX(" + ratio + ")";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Mobile nav ---------- */
  var navToggle = document.getElementById("navToggle");
  var mobileNav = document.getElementById("mobileNav");

  function closeMobileNav() {
    if (!mobileNav || !navToggle) return;
    mobileNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
    document.body.style.overflow = "";
  }

  function openMobileNav() {
    if (!mobileNav || !navToggle) return;
    mobileNav.classList.add("open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close menu");
    document.body.style.overflow = "hidden";
  }

  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", function () {
      if (mobileNav.classList.contains("open")) closeMobileNav();
      else openMobileNav();
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMobileNav);
    });

    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMobileNav();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 980) closeMobileNav();
    });
  }

  /* ---------- Scroll-reveal animations ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    // Stagger is handled in CSS via .stagger > .reveal:nth-child(), because
    // the CSP in _headers disallows inline styles for anything but CSSOM
    // properties we set deliberately.
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Count-up statistics ----------
     Each [data-count] already contains its final value in the markup, so
     with JS off (or the observer unavailable) the strip still reads
     correctly — this only animates the way it gets there. */
  var counters = document.querySelectorAll("[data-count]");

  function runCounter(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    if (isNaN(target)) return;
    if (reduceMotion.matches) {
      el.textContent = String(target);
      return;
    }

    var duration = 1400;
    var start = null;

    function step(now) {
      if (start === null) start = now;
      var t = Math.min((now - start) / duration, 1);
      // Ease-out cubic: fast off the mark, settling into the final figure.
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = String(Math.round(target * eased));
      if (t < 1) window.requestAnimationFrame(step);
      else el.textContent = String(target);
    }

    el.textContent = "0";
    window.requestAnimationFrame(step);
  }

  if ("IntersectionObserver" in window && counters.length) {
    var counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          runCounter(entry.target);
          counterObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (el) { counterObserver.observe(el); });
  }

  /* ---------- Scrollspy ----------
     Highlights the nav link for whichever section currently sits under the
     header. Driven off the existing hrefs, so adding a nav item needs no
     change here. */
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll(".main-nav a[href^='#']")
  );
  var spyTargets = navLinks
    .map(function (link) {
      return { link: link, section: document.querySelector(link.getAttribute("href")) };
    })
    .filter(function (pair) { return pair.section; });

  function updateSpy() {
    if (!spyTargets.length) return;
    var headerH = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue("--header-h"),
      10
    ) || 104;
    var line = window.scrollY + headerH + 40;
    var current = null;

    spyTargets.forEach(function (pair) {
      if (pair.section.offsetTop <= line) current = pair;
    });

    // Past the last section (footer in view) keep the final link lit.
    if (!current && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) {
      current = spyTargets[spyTargets.length - 1];
    }

    navLinks.forEach(function (link) {
      link.classList.toggle("active", !!current && link === current.link);
    });
  }

  if (spyTargets.length) {
    window.addEventListener("scroll", updateSpy, { passive: true });
    window.addEventListener("resize", updateSpy, { passive: true });
    updateSpy();
  }

  /* ---------- Contact form ----------
     There is no server behind this form. On submit we validate the required
     fields ourselves, then hand the browser a mailto: link with the message
     already composed. That keeps the site a pure static deploy with nothing
     to maintain or secure server-side.

     To accept submissions properly later, replace the handler body with a
     fetch() POST to a Cloudflare Pages Function (functions/api/contact.js)
     and widen connect-src in _headers, or point the <form> at a hosted
     service like Formspree and widen form-action instead. */
  var FORM_TO = "admin@rmsauditors.co.za";
  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");

  function setStatus(message) {
    if (status) status.textContent = message;
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = form.elements.name.value.trim();
      var email = form.elements.email.value.trim();
      var phone = form.elements.phone.value.trim();
      var service = form.elements.service.value;
      var message = form.elements.message.value.trim();

      if (!name || !email || !message) {
        setStatus("Please fill in your name, email and message.");
        return;
      }
      // Deliberately loose: just enough to catch a typo, not a full RFC check.
      if (email.indexOf("@") < 1 || email.indexOf(".") < 0) {
        setStatus("That email address does not look right — please check it.");
        return;
      }

      var subject = "Website enquiry" + (service ? " — " + service : "") + " — " + name;
      var lines = [
        "Name: " + name,
        "Email: " + email,
        "Phone: " + (phone || "not supplied"),
        "Enquiry about: " + (service || "not specified"),
        "",
        message
      ];

      window.location.href = "mailto:" + FORM_TO +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(lines.join("\n"));

      setStatus("Opening your email program…");
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

})();
