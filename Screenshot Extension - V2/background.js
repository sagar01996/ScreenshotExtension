chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "captureScreenshotEvent") {
        chrome.desktopCapture.chooseDesktopMedia([
            "screen",
            "window",
            "tab"
        ], (streamId) => {
            let track, canvas;
            var constraints = {
                "audio": false,
                "video": { mandatory: { chromeMediaSource: 'desktop', chromeMediaSourceId: streamId } }
            };
            navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
                track = stream.getVideoTracks()[0]
                const imageCapture = new ImageCapture(track)
                return imageCapture.grabFrame()
            }).then((bitmap) => {
                track.stop();
                canvas = document.createElement('canvas');
                canvas.width = bitmap.width;
                canvas.height = bitmap.height;
                let context = canvas.getContext('2d');
                context.drawImage(bitmap, 0, 0, bitmap.width, bitmap.height);
                return canvas.toDataURL();
            }).then((url) => {
                chrome.downloads.download({
                    filename: 'screenshot.png',
                    url: url
                })
                canvas.remove()
            }).catch((err) => {
                alert("Could not take screenshot")
            })
        })
    }
});