(function() {
    var menuButton = document.querySelector('[data-menu-button]');
    var mobilePanel = document.querySelector('[data-mobile-panel]');
    if (menuButton && mobilePanel) {
        menuButton.addEventListener('click', function() {
            mobilePanel.classList.toggle('open');
        });
    }

    var hero = document.querySelector('[data-hero]');
    if (hero) {
        var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
        var current = 0;
        function showSlide(index) {
            current = index;
            slides.forEach(function(slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === index);
            });
            dots.forEach(function(dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === index);
            });
        }
        dots.forEach(function(dot) {
            dot.addEventListener('click', function() {
                showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
            });
        });
        if (slides.length > 1) {
            window.setInterval(function() {
                showSlide((current + 1) % slides.length);
            }, 5200);
        }
    }

    var searchInputs = Array.prototype.slice.call(document.querySelectorAll('[data-card-search]'));
    searchInputs.forEach(function(input) {
        var scope = input.closest('[data-card-scope]') || document;
        var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));
        input.addEventListener('input', function() {
            var query = input.value.trim().toLowerCase();
            cards.forEach(function(card) {
                var text = [
                    card.getAttribute('data-title') || '',
                    card.getAttribute('data-year') || '',
                    card.getAttribute('data-region') || '',
                    card.getAttribute('data-genre') || '',
                    card.innerText || ''
                ].join(' ').toLowerCase();
                card.classList.toggle('is-hidden', query !== '' && text.indexOf(query) === -1);
            });
        });
    });

    var resetButtons = Array.prototype.slice.call(document.querySelectorAll('[data-card-reset]'));
    resetButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            var wrap = button.closest('.filter-bar');
            var input = wrap ? wrap.querySelector('[data-card-search]') : null;
            if (input) {
                input.value = '';
                input.dispatchEvent(new Event('input'));
                input.focus();
            }
        });
    });
})();
