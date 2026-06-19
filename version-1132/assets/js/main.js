(function() {
    function ready(fn) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", fn);
        } else {
            fn();
        }
    }

    ready(function() {
        var menuButton = document.querySelector("[data-menu-button]");
        var mobileNav = document.querySelector("[data-mobile-nav]");

        if (menuButton && mobileNav) {
            menuButton.addEventListener("click", function() {
                mobileNav.classList.toggle("is-open");
                document.body.classList.toggle("menu-open", mobileNav.classList.contains("is-open"));
            });
        }

        document.querySelectorAll("img").forEach(function(img) {
            img.addEventListener("error", function() {
                img.classList.add("image-hidden");
            });
        });

        document.querySelectorAll("[data-hero]").forEach(function(hero) {
            var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
            var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
            var prev = hero.querySelector("[data-hero-prev]");
            var next = hero.querySelector("[data-hero-next]");
            var index = 0;
            var timer = null;

            function show(nextIndex) {
                if (!slides.length) {
                    return;
                }
                index = (nextIndex + slides.length) % slides.length;
                slides.forEach(function(slide, i) {
                    slide.classList.toggle("is-active", i === index);
                });
                dots.forEach(function(dot, i) {
                    dot.classList.toggle("is-active", i === index);
                });
            }

            function restart() {
                if (timer) {
                    window.clearInterval(timer);
                }
                if (slides.length > 1) {
                    timer = window.setInterval(function() {
                        show(index + 1);
                    }, 5200);
                }
            }

            dots.forEach(function(dot, i) {
                dot.addEventListener("click", function() {
                    show(i);
                    restart();
                });
            });

            if (prev) {
                prev.addEventListener("click", function() {
                    show(index - 1);
                    restart();
                });
            }

            if (next) {
                next.addEventListener("click", function() {
                    show(index + 1);
                    restart();
                });
            }

            show(0);
            restart();
        });

        document.querySelectorAll("[data-filter-scope]").forEach(function(scope) {
            var input = scope.querySelector("[data-filter-input]");
            var yearSelect = scope.querySelector("[data-year-filter]");
            var genreSelect = scope.querySelector("[data-genre-filter]");
            var categorySelect = scope.querySelector("[data-category-filter]");
            var list = document.querySelector("[data-filter-list]");
            var empty = document.querySelector("[data-empty-state]");

            if (!list) {
                return;
            }

            var cards = Array.prototype.slice.call(list.querySelectorAll("[data-card]"));
            var params = new URLSearchParams(window.location.search);
            var initialQuery = params.get("q") || "";
            var initialYear = params.get("year") || "";

            if (input && initialQuery) {
                input.value = initialQuery;
            }
            if (yearSelect && initialYear) {
                yearSelect.value = initialYear;
            }

            function normalize(value) {
                return String(value || "").trim().toLowerCase();
            }

            function update() {
                var query = normalize(input ? input.value : "");
                var year = normalize(yearSelect ? yearSelect.value : "");
                var genre = normalize(genreSelect ? genreSelect.value : "");
                var category = normalize(categorySelect ? categorySelect.value : "");
                var visible = 0;

                cards.forEach(function(card) {
                    var text = normalize([
                        card.dataset.title,
                        card.dataset.year,
                        card.dataset.genre,
                        card.dataset.region,
                        card.dataset.tags,
                        card.querySelector(".card-category") ? card.querySelector(".card-category").textContent : ""
                    ].join(" "));
                    var ok = true;

                    if (query && text.indexOf(query) === -1) {
                        ok = false;
                    }
                    if (year && normalize(card.dataset.year) !== year) {
                        ok = false;
                    }
                    if (genre && text.indexOf(genre) === -1) {
                        ok = false;
                    }
                    if (category && text.indexOf(category) === -1) {
                        ok = false;
                    }

                    card.hidden = !ok;
                    if (ok) {
                        visible += 1;
                    }
                });

                if (empty) {
                    empty.hidden = visible !== 0;
                }
            }

            [input, yearSelect, genreSelect, categorySelect].forEach(function(control) {
                if (control) {
                    control.addEventListener("input", update);
                    control.addEventListener("change", update);
                }
            });

            update();
        });
    });
})();
