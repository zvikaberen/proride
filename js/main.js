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

  applyLang(document.documentElement.lang);

  document.querySelectorAll("[data-set-lang]").forEach(function (button) {
    button.addEventListener("click", function () {
      applyLang(button.getAttribute("data-set-lang"));
    });
  });

  var header = document.querySelector("[data-header]");
  var toggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-nav]");

  function setStuck() {
    if (!header) return;
    header.classList.toggle("is-stuck", window.scrollY > 8);
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
