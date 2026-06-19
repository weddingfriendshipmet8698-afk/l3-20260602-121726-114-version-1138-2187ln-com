(function() {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
      return;
    }
    document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function() {
    var video = document.getElementById("movie-player");
    if (!video) {
      return;
    }
    var overlay = document.querySelector(".player-overlay");
    var button = document.querySelector(".player-start-button");
    var streamUrl = video.getAttribute("data-stream-url");
    var activated = false;
    var hlsObject = null;

    function attachStream() {
      if (activated || !streamUrl) {
        return;
      }
      activated = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = streamUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsObject = new Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsObject.loadSource(streamUrl);
        hlsObject.attachMedia(video);
      } else {
        video.src = streamUrl;
      }
    }

    function startPlay(event) {
      if (event) {
        event.preventDefault();
      }
      attachStream();
      if (overlay) {
        overlay.classList.add("is-hidden");
      }
      video.controls = true;
      var playTask = video.play();
      if (playTask && playTask.catch) {
        playTask.catch(function() {
          if (overlay) {
            overlay.classList.remove("is-hidden");
          }
        });
      }
    }

    if (overlay) {
      overlay.addEventListener("click", startPlay);
    }
    if (button) {
      button.addEventListener("click", startPlay);
    }
    video.addEventListener("click", function() {
      if (video.paused) {
        startPlay();
      }
    });
    video.addEventListener("play", function() {
      if (overlay) {
        overlay.classList.add("is-hidden");
      }
    });
  });
})();
