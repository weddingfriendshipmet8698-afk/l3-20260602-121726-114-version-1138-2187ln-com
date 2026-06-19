(function () {
  function qs(selector, parent) {
    return (parent || document).querySelector(selector);
  }

  function qsa(selector, parent) {
    return Array.prototype.slice.call((parent || document).querySelectorAll(selector));
  }

  document.addEventListener('DOMContentLoaded', function () {
    var toggle = qs('[data-menu-toggle]');
    var panel = qs('[data-mobile-panel]');

    if (toggle && panel) {
      toggle.addEventListener('click', function () {
        panel.classList.toggle('is-open');
      });
    }

    var slides = qsa('[data-hero-slide]');
    var dots = qsa('[data-hero-dot]');
    var active = 0;

    function setSlide(index) {
      if (!slides.length) {
        return;
      }

      active = (index + slides.length) % slides.length;

      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === active);
      });

      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === active);
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        setSlide(i);
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        setSlide(active + 1);
      }, 5200);
    }

    var searchInput = qs('[data-search-input]');
    var yearSelect = qs('[data-year-select]');
    var typeSelect = qs('[data-type-select]');
    var cards = qsa('[data-card]');

    function applyFilters() {
      var keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';
      var year = yearSelect ? yearSelect.value : '';
      var type = typeSelect ? typeSelect.value : '';

      cards.forEach(function (card) {
        var haystack = card.getAttribute('data-title').toLowerCase() + ' ' +
          card.getAttribute('data-region').toLowerCase() + ' ' +
          card.getAttribute('data-genre').toLowerCase() + ' ' +
          card.getAttribute('data-tags').toLowerCase();
        var cardYear = card.getAttribute('data-year');
        var cardType = card.getAttribute('data-type');
        var matched = (!keyword || haystack.indexOf(keyword) !== -1) &&
          (!year || cardYear === year) &&
          (!type || cardType === type);

        card.style.display = matched ? '' : 'none';
      });
    }

    [searchInput, yearSelect, typeSelect].forEach(function (el) {
      if (el) {
        el.addEventListener('input', applyFilters);
        el.addEventListener('change', applyFilters);
      }
    });

    var player = qs('[data-player]');

    if (player) {
      var video = qs('video', player);
      var cover = qs('[data-player-cover]', player);
      var button = qs('[data-play-button]', player);
      var loaded = false;
      var hls = null;

      function startVideo() {
        if (!video) {
          return;
        }

        var url = video.getAttribute('data-play');

        if (!loaded && url) {
          if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = url;
          } else if (window.Hls && window.Hls.isSupported()) {
            hls = new Hls({ enableWorker: true });
            hls.loadSource(url);
            hls.attachMedia(video);
          } else {
            video.src = url;
          }

          loaded = true;
        }

        player.classList.add('is-playing');
        video.controls = true;
        var promise = video.play();

        if (promise && promise.catch) {
          promise.catch(function () {});
        }
      }

      if (button) {
        button.addEventListener('click', startVideo);
      }

      if (cover) {
        cover.addEventListener('click', startVideo);
      }

      if (video) {
        video.addEventListener('click', function () {
          if (!loaded) {
            startVideo();
          }
        });
      }

      window.addEventListener('beforeunload', function () {
        if (hls) {
          hls.destroy();
        }
      });
    }
  });
})();
