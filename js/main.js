// Photo fields: src, altHe, altEn.
const ISRAEL_PHOTOS = [];

// Testimonial fields: text, name, route. Each field is an object with he and en keys.
const TESTIMONIALS = [];

(function () {
  var copy = {
    he: {
      title: "ישראל סדובסקי | הסעות פרטיות לכל הארץ",
      description: "הסעות פרטיות עם ישראל סדובסקי מרכסים. נסיעה אחת, נהג אחד, רכב אחד, ממקום למקום בכל הארץ, בלי החלפות. לא עובד בשבת. 052-702-79-27",
      nav: "ניווט"
    },
    en: {
      title: "Israel Sadovsky | Private rides across Israel",
      description: "Private rides with Israel Sadovsky, based in Rekhasim. One ride, one driver, one vehicle, from place to place across Israel, with no transfer. Does not work on Shabbat. 052-702-79-27",
      nav: "Navigation"
    }
  };

  function applyLang(lang) {
    if (lang !== "en") lang = "he";
    var pack = copy[lang];
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "en" ? "ltr" : "rtl";
    document.title = pack.title;
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", pack.description);
    var locale = document.querySelector('meta[property="og:locale"]');
    if (locale) locale.setAttribute("content", lang === "en" ? "en_US" : "he_IL");
    var nav = document.querySelector("[data-nav]");
    if (nav) nav.setAttribute("aria-label", pack.nav);
    document.querySelectorAll("[data-set-lang]").forEach(function (button) {
      var on = button.getAttribute("data-set-lang") === lang;
      button.classList.toggle("is-active", on);
      button.setAttribute("aria-pressed", on ? "true" : "false");
    });
    document.querySelectorAll("[data-alt-he]").forEach(function (img) {
      img.alt = lang === "en" ? img.getAttribute("data-alt-en") : img.getAttribute("data-alt-he");
    });
    document.querySelectorAll("[data-label-he]").forEach(function (node) {
      node.setAttribute("aria-label", lang === "en" ? node.getAttribute("data-label-en") : node.getAttribute("data-label-he"));
    });
    try {
      localStorage.setItem("lang", lang);
    } catch (e) {}
  }

  function appendBilingual(parent, text) {
    ["he", "en"].forEach(function (lang) {
      var span = document.createElement("span");
      span.className = "lang-" + lang;
      span.textContent = text[lang];
      parent.appendChild(span);
    });
  }

  var gallery = document.querySelector("[data-israel-photos]");
  if (gallery && ISRAEL_PHOTOS.length) {
    var placeholder = gallery.querySelector("[data-israel-placeholder]");
    if (placeholder) placeholder.remove();
    ISRAEL_PHOTOS.forEach(function (photo) {
      var img = document.createElement("img");
      img.loading = "lazy";
      img.dataset.altHe = photo.altHe;
      img.dataset.altEn = photo.altEn;
      img.alt = document.documentElement.lang === "en" ? photo.altEn : photo.altHe;
      img.src = photo.src;
      gallery.appendChild(img);
    });
  }

  var testimonials = document.querySelector("[data-testimonials]");
  var cards = document.querySelector("[data-testimonial-cards]");
  if (testimonials && cards && TESTIMONIALS.length) {
    TESTIMONIALS.forEach(function (testimonial) {
      var card = document.createElement("figure");
      card.className = "testimonial-card";

      var quote = document.createElement("blockquote");
      appendBilingual(quote, testimonial.text);

      var credit = document.createElement("figcaption");
      credit.className = "testimonial-credit";
      appendBilingual(credit, {
        he: testimonial.name.he + " · " + testimonial.route.he,
        en: testimonial.name.en + " · " + testimonial.route.en
      });

      card.append(quote, credit);
      cards.appendChild(card);
    });
    testimonials.hidden = false;
  }

  applyLang(document.documentElement.lang);

  document.querySelectorAll("[data-set-lang]").forEach(function (button) {
    button.addEventListener("click", function () {
      applyLang(button.getAttribute("data-set-lang"));
    });
  });

  var header = document.querySelector("[data-header]");
  var toggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-nav]");
  var callbar = document.querySelector("[data-callbar]");
  var hero = document.querySelector(".hero");

  function setStuck() {
    if (!header) return;
    header.classList.toggle("is-stuck", window.scrollY > 8);
  }

  function setCallbar(heroOnScreen) {
    if (!callbar) return;
    callbar.classList.toggle("is-hidden", heroOnScreen);
    if (heroOnScreen) callbar.setAttribute("inert", "");
    else callbar.removeAttribute("inert");
  }

  if (callbar && hero && "IntersectionObserver" in window) {
    var watch = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        setCallbar(entry.isIntersecting);
      });
    });
    watch.observe(hero);
  } else {
    setCallbar(false);
  }

  setStuck();

  if (!toggle || !nav) {
    window.addEventListener("scroll", setStuck, { passive: true });
    return;
  }

  function closeNav() {
    nav.classList.remove("is-open");
    toggle.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  toggle.addEventListener("click", function () {
    var open = !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", open);
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  nav.addEventListener("click", function (event) {
    if (event.target.closest("a")) closeNav();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeNav();
  });

  var lastY = window.scrollY;
  window.addEventListener("scroll", function () {
    setStuck();
    if (nav.classList.contains("is-open") && Math.abs(window.scrollY - lastY) > 12) closeNav();
    lastY = window.scrollY;
  }, { passive: true });
})();
