(function () {
  var toggle = document.querySelector("[data-mobile-nav-toggle]");
  var panel = document.querySelector("[data-mobile-nav-panel]");

  if (toggle && panel) {
    toggle.addEventListener("click", function () {
      panel.classList.toggle("is-open");
    });
  }

  var hero = document.querySelector("[data-hero]");
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var index = 0;

    function showSlide(nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        showSlide(dotIndex);
      });
    });

    showSlide(0);

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(index + 1);
      }, 5200);
    }
  }

  var filterInputs = Array.prototype.slice.call(document.querySelectorAll("[data-filter-input]"));

  filterInputs.forEach(function (input) {
    var targetSelector = input.getAttribute("data-filter-target") || "[data-search-item]";
    var items = Array.prototype.slice.call(document.querySelectorAll(targetSelector));

    input.addEventListener("input", function () {
      var query = input.value.trim().toLowerCase();

      items.forEach(function (item) {
        var text = (item.getAttribute("data-search-text") || item.textContent || "").toLowerCase();
        item.classList.toggle("hide-by-filter", query && text.indexOf(query) === -1);
      });
    });
  });
})();
