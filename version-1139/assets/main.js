(function() {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
      return;
    }
    document.addEventListener("DOMContentLoaded", fn);
  }

  function normalize(value) {
    return (value || "").toString().trim().toLowerCase();
  }

  ready(function() {
    var toggle = document.querySelector("[data-nav-toggle]");
    var mobileNav = document.querySelector("[data-mobile-nav]");
    if (toggle && mobileNav) {
      toggle.addEventListener("click", function() {
        mobileNav.classList.toggle("is-open");
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    if (slides.length > 1) {
      var current = 0;
      var showSlide = function(next) {
        current = (next + slides.length) % slides.length;
        slides.forEach(function(slide, index) {
          slide.classList.toggle("is-active", index === current);
        });
        dots.forEach(function(dot, index) {
          dot.classList.toggle("is-active", index === current);
        });
      };
      dots.forEach(function(dot, index) {
        dot.addEventListener("click", function() {
          showSlide(index);
        });
      });
      setInterval(function() {
        showSlide(current + 1);
      }, 5600);
    }

    document.querySelectorAll("[data-search-form]").forEach(function(form) {
      form.addEventListener("submit", function(event) {
        event.preventDefault();
        var input = form.querySelector("input[name='q']");
        var query = input ? input.value.trim() : "";
        var target = "./search.html";
        if (query) {
          target += "?q=" + encodeURIComponent(query);
        }
        window.location.href = target;
      });
    });

    var filterPanel = document.querySelector("[data-filter-panel]");
    if (filterPanel) {
      var queryInput = filterPanel.querySelector("[data-filter-query]");
      var yearSelect = filterPanel.querySelector("[data-filter-year]");
      var regionSelect = filterPanel.querySelector("[data-filter-region]");
      var typeSelect = filterPanel.querySelector("[data-filter-type]");
      var cards = Array.prototype.slice.call(document.querySelectorAll("[data-movie-card]"));
      var params = new URLSearchParams(window.location.search);
      var initialQuery = params.get("q");
      if (initialQuery && queryInput) {
        queryInput.value = initialQuery;
      }
      var applyFilter = function() {
        var q = normalize(queryInput && queryInput.value);
        var y = normalize(yearSelect && yearSelect.value);
        var r = normalize(regionSelect && regionSelect.value);
        var t = normalize(typeSelect && typeSelect.value);
        cards.forEach(function(card) {
          var text = normalize([
            card.getAttribute("data-title"),
            card.getAttribute("data-region"),
            card.getAttribute("data-type"),
            card.getAttribute("data-year"),
            card.getAttribute("data-tags")
          ].join(" "));
          var matchQuery = !q || text.indexOf(q) !== -1;
          var matchYear = !y || normalize(card.getAttribute("data-year")) === y;
          var matchRegion = !r || normalize(card.getAttribute("data-region")).indexOf(r) !== -1;
          var matchType = !t || normalize(card.getAttribute("data-type")).indexOf(t) !== -1;
          card.classList.toggle("hide-by-filter", !(matchQuery && matchYear && matchRegion && matchType));
        });
      };
      [queryInput, yearSelect, regionSelect, typeSelect].forEach(function(control) {
        if (control) {
          control.addEventListener("input", applyFilter);
          control.addEventListener("change", applyFilter);
        }
      });
      applyFilter();
    }
  });
})();
