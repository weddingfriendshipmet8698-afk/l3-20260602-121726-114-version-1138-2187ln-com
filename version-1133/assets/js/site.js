(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function setupMobileMenu() {
    var button = document.querySelector('[data-menu-button]');
    var menu = document.querySelector('[data-mobile-menu]');

    if (!button || !menu) {
      return;
    }

    button.addEventListener('click', function () {
      menu.classList.toggle('is-open');
      button.textContent = menu.classList.contains('is-open') ? '×' : '☰';
    });
  }

  function setupImageFallbacks() {
    var images = document.querySelectorAll('.poster-frame img, .horizontal-poster img, .rank-thumb img, .category-cover img, .hero-bg img');

    images.forEach(function (image) {
      image.addEventListener('error', function () {
        image.classList.add('is-missing');
        image.removeAttribute('src');
      });
    });
  }

  function setupFilters() {
    var toolbar = document.querySelector('.catalog-toolbar');
    var items = Array.prototype.slice.call(document.querySelectorAll('.searchable-item'));

    if (!toolbar || items.length === 0) {
      return;
    }

    var searchInput = toolbar.querySelector('.filter-search');
    var typeSelect = toolbar.querySelector('.filter-type');
    var yearSelect = toolbar.querySelector('.filter-year');
    var categorySelect = toolbar.querySelector('.filter-category');
    var resetButton = toolbar.querySelector('.filter-reset');
    var count = toolbar.querySelector('[data-filter-count]');
    var params = new URLSearchParams(window.location.search);
    var queryFromUrl = params.get('q');

    if (queryFromUrl && searchInput) {
      searchInput.value = queryFromUrl;
    }

    function itemMatches(item) {
      var query = normalize(searchInput && searchInput.value);
      var type = normalize(typeSelect && typeSelect.value);
      var year = normalize(yearSelect && yearSelect.value);
      var category = normalize(categorySelect && categorySelect.value);
      var haystack = normalize(item.getAttribute('data-search'));
      var itemType = normalize(item.getAttribute('data-type'));
      var itemYear = Number(item.getAttribute('data-year') || 0);
      var itemCategory = normalize(item.getAttribute('data-category'));
      var queryOk = !query || haystack.indexOf(query) !== -1;
      var typeOk = !type || itemType.indexOf(type) !== -1;
      var categoryOk = !category || itemCategory.indexOf(category) !== -1;
      var yearOk = true;

      if (year) {
        if (year === '2021') {
          yearOk = itemYear <= 2021;
        } else {
          yearOk = String(itemYear) === year;
        }
      }

      return queryOk && typeOk && categoryOk && yearOk;
    }

    function applyFilters() {
      var visible = 0;

      items.forEach(function (item) {
        if (itemMatches(item)) {
          item.classList.remove('is-hidden-by-filter');
          visible += 1;
        } else {
          item.classList.add('is-hidden-by-filter');
        }
      });

      if (count) {
        count.textContent = '显示 ' + visible + ' / ' + items.length + ' 条';
      }
    }

    [searchInput, typeSelect, yearSelect, categorySelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilters);
        control.addEventListener('change', applyFilters);
      }
    });

    if (resetButton) {
      resetButton.addEventListener('click', function () {
        if (searchInput) {
          searchInput.value = '';
        }
        if (typeSelect) {
          typeSelect.value = '';
        }
        if (yearSelect) {
          yearSelect.value = '';
        }
        if (categorySelect) {
          categorySelect.value = '';
        }
        applyFilters();
      });
    }

    applyFilters();
  }

  function setupPlayers() {
    var players = document.querySelectorAll('[data-player]');

    players.forEach(function (player) {
      var video = player.querySelector('video');
      var overlay = player.querySelector('.player-overlay');
      var message = player.querySelector('[data-player-message]');
      var src = player.getAttribute('data-src');
      var hlsInstance = null;
      var prepared = false;

      function setMessage(text) {
        if (message) {
          message.textContent = text || '';
        }
      }

      function prepareVideo() {
        if (prepared || !video || !src) {
          return;
        }

        prepared = true;
        setMessage('正在初始化播放源...');

        if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90
          });

          hlsInstance.loadSource(src);
          hlsInstance.attachMedia(video);
          hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
            setMessage('');
          });
          hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
            if (!data || !data.fatal) {
              return;
            }

            if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
              setMessage('网络加载失败，正在重试播放源。');
              hlsInstance.startLoad();
            } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
              setMessage('媒体解码异常，正在恢复。');
              hlsInstance.recoverMediaError();
            } else {
              setMessage('当前播放源暂时无法播放。');
              hlsInstance.destroy();
            }
          });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = src;
          video.addEventListener('loadedmetadata', function () {
            setMessage('');
          });
        } else {
          setMessage('当前浏览器需要 HLS 支持才能播放 m3u8。');
        }
      }

      function startPlayback() {
        prepareVideo();

        if (!video) {
          return;
        }

        var playResult = video.play();

        if (playResult && typeof playResult.catch === 'function') {
          playResult.catch(function () {
            setMessage('浏览器阻止了自动播放，请再次点击播放器。');
          });
        }
      }

      if (overlay) {
        overlay.addEventListener('click', startPlayback);
      }

      if (video) {
        video.addEventListener('click', function () {
          if (video.paused) {
            startPlayback();
          } else {
            video.pause();
          }
        });

        video.addEventListener('play', function () {
          player.classList.add('is-playing');
        });

        video.addEventListener('pause', function () {
          player.classList.remove('is-playing');
        });

        video.addEventListener('error', function () {
          setMessage('视频加载失败，请检查播放源或网络。');
        });
      }

      window.addEventListener('beforeunload', function () {
        if (hlsInstance) {
          hlsInstance.destroy();
        }
      });
    });
  }

  ready(function () {
    setupMobileMenu();
    setupImageFallbacks();
    setupFilters();
    setupPlayers();
  });
})();
