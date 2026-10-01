(function () {
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
