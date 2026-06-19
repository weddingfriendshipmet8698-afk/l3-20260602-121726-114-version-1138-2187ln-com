document.addEventListener('DOMContentLoaded', function () {
    var panel = document.querySelector('[data-player-panel]');

    if (!panel) {
        return;
    }

    var video = panel.querySelector('[data-player-video]');
    var startButton = panel.querySelector('[data-player-start]');
    var source = panel.getAttribute('data-video-src');
    var hlsInstance = null;

    function startPlayback() {
        if (!video || !source) {
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            if (hlsInstance) {
                hlsInstance.destroy();
            }

            hlsInstance = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hlsInstance.loadSource(source);
            hlsInstance.attachMedia(video);
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
        } else {
            video.src = source;
        }

        if (startButton) {
            startButton.classList.add('hide');
        }

        var playResult = video.play();

        if (playResult && typeof playResult.catch === 'function') {
            playResult.catch(function () {
                if (startButton) {
                    startButton.classList.remove('hide');
                }
            });
        }
    }

    if (startButton) {
        startButton.addEventListener('click', startPlayback);
    }

    video.addEventListener('play', function () {
        if (startButton) {
            startButton.classList.add('hide');
        }
    });
});
