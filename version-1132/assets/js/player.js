(function() {
    function ready(fn) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", fn);
        } else {
            fn();
        }
    }

    ready(function() {
        document.querySelectorAll(".video-frame").forEach(function(frame) {
            var video = frame.querySelector("video");
            var button = frame.querySelector(".video-play");

            if (!video) {
                return;
            }

            var streamUrl = video.getAttribute("data-stream-url");
            var attached = false;

            function attachStream() {
                if (attached || !streamUrl) {
                    return;
                }
                attached = true;

                if (window.Hls && window.Hls.isSupported()) {
                    var hls = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: false
                    });
                    hls.loadSource(streamUrl);
                    hls.attachMedia(video);
                } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = streamUrl;
                } else {
                    video.src = streamUrl;
                }
            }

            function startPlay() {
                attachStream();
                var action = video.play();
                if (action && typeof action.catch === "function") {
                    action.catch(function() {});
                }
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
                frame.classList.add("is-playing");
            });

            video.addEventListener("pause", function() {
                frame.classList.remove("is-playing");
            });

            video.addEventListener("ended", function() {
                frame.classList.remove("is-playing");
            });

            attachStream();
        });
    });
})();
