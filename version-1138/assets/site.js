(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function text(value) {
    return String(value || "");
  }

  function escapeHtml(value) {
    return text(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function initMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var menu = document.querySelector("[data-menu]");
    if (!toggle || !menu) {
      return;
    }
    toggle.addEventListener("click", function () {
      menu.classList.toggle("is-open");
    });
  }

  function initFilters() {
    var inputs = document.querySelectorAll("[data-filter-input]");
    inputs.forEach(function (input) {
      var scope = input.closest("main") || document;
      var items = Array.prototype.slice.call(scope.querySelectorAll("[data-filter-item]"));
      input.addEventListener("input", function () {
        var query = input.value.trim().toLowerCase();
        items.forEach(function (item) {
          var haystack = text(item.getAttribute("data-filter")).toLowerCase();
          item.classList.toggle("is-hidden", query && haystack.indexOf(query) === -1);
        });
      });
    });
  }

  function resultMarkup(movie) {
    return [
      "<a class=\"search-hit\" href=\"" + escapeHtml(movie.url) + "\">",
      "<img src=\"" + escapeHtml(movie.cover) + "\" alt=\"" + escapeHtml(movie.title) + "\" loading=\"lazy\">",
      "<span><strong>" + escapeHtml(movie.title) + "</strong>",
      "<span>" + escapeHtml(movie.region) + " · " + escapeHtml(movie.year) + " · " + escapeHtml(movie.type) + "</span></span>",
      "</a>"
    ].join("");
  }

  function renderResults(form, query) {
    var target = form.parentElement.querySelector("[data-search-results]") || document.querySelector("[data-search-results]");
    if (!target || !window.MOVIE_SEARCH_DATA) {
      return;
    }
    if (!query) {
      target.classList.remove("is-visible");
      target.innerHTML = "";
      return;
    }
    var lower = query.toLowerCase();
    var matches = window.MOVIE_SEARCH_DATA.filter(function (movie) {
      return text(movie.search).toLowerCase().indexOf(lower) !== -1;
    }).slice(0, 24);
    target.innerHTML = matches.length
      ? matches.map(resultMarkup).join("")
      : "<div class=\"search-hit\"><span><strong>没有找到相关影片</strong><span>换一个关键词试试</span></span></div>";
    target.classList.add("is-visible");
  }

  function initGlobalSearch() {
    var forms = document.querySelectorAll("[data-global-search]");
    forms.forEach(function (form) {
      var input = form.querySelector("input[type='search']");
      if (!input) {
        return;
      }
      var params = new URLSearchParams(window.location.search);
      var query = params.get("q") || "";
      if (query) {
        input.value = query;
        renderResults(form, query);
      }
      input.addEventListener("input", function () {
        renderResults(form, input.value.trim());
      });
      form.addEventListener("submit", function (event) {
        if (window.MOVIE_SEARCH_DATA) {
          event.preventDefault();
          renderResults(form, input.value.trim());
        }
      });
    });
  }

  function attachStream(video, stream) {
    if (video.dataset.ready === "true") {
      return;
    }
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = stream;
    } else if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        capLevelToPlayerSize: true,
        startLevel: -1
      });
      hls.loadSource(stream);
      hls.attachMedia(video);
      video._hls = hls;
    } else {
      video.src = stream;
    }
    video.dataset.ready = "true";
  }

  function startPlayer(player) {
    var video = player.querySelector("video");
    var button = player.querySelector("[data-play]");
    if (!video) {
      return;
    }
    var stream = video.getAttribute("data-stream");
    if (!stream) {
      return;
    }
    attachStream(video, stream);
    if (button) {
      button.classList.add("is-hidden");
    }
    video.controls = true;
    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(function () {});
    }
  }

  function initPlayers() {
    var players = document.querySelectorAll("[data-player]");
    players.forEach(function (player) {
      var button = player.querySelector("[data-play]");
      if (button) {
        button.addEventListener("click", function (event) {
          event.preventDefault();
          startPlayer(player);
        });
      }
    });
  }

  ready(function () {
    initMenu();
    initFilters();
    initGlobalSearch();
    initPlayers();
  });
})();
