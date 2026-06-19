(function () {
  var video = document.querySelector("[data-video-url]");

  if (!video) {
    return;
  }

  var sourceUrl = video.getAttribute("data-video-url");

  if (!sourceUrl) {
    return;
  }

  function attachNativeSource() {
    video.src = sourceUrl;
  }

  if (window.Hls && window.Hls.isSupported()) {
    var hls = new window.Hls({
      enableWorker: true,
      lowLatencyMode: true
    });

    hls.loadSource(sourceUrl);
    hls.attachMedia(video);
  } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
    attachNativeSource();
  } else {
    attachNativeSource();
  }
})();
