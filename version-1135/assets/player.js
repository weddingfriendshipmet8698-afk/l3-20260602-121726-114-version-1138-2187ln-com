(function () {
  var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

  function attachVideo(video) {
    if (video.dataset.ready === '1') {
      return;
    }

    var src = video.getAttribute('data-src');

    if (!src) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
    } else if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      video.hlsPlayer = hls;
    } else {
      video.src = src;
    }

    video.dataset.ready = '1';
  }

  function startVideo(shell) {
    var video = shell.querySelector('video');
    var cover = shell.querySelector('.player-cover');

    if (!video) {
      return;
    }

    attachVideo(video);

    if (cover) {
      cover.classList.add('is-hidden');
    }

    video.controls = true;
    var playResult = video.play();

    if (playResult && playResult.catch) {
      playResult.catch(function () {
        video.controls = true;
      });
    }
  }

  players.forEach(function (shell) {
    var video = shell.querySelector('video');
    var cover = shell.querySelector('.player-cover');
    var button = shell.querySelector('.player-button');

    if (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        startVideo(shell);
      });
    }

    if (cover) {
      cover.addEventListener('click', function () {
        startVideo(shell);
      });
    }

    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          startVideo(shell);
        }
      });
    }
  });
})();
