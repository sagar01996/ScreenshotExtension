chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "captureScreenshotEvent") {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            if (tabs.length > 0) {
                const activeTab = tabs[0];
                chrome.desktopCapture.chooseDesktopMedia([
                    "screen",
                    "window",
                    "tab"
                ], activeTab ,(streamId) => {
                    if (streamId && streamId.length) {
                        setTimeout(() => {
                            chrome.tabs.sendMessage(activeTab.id, {name: "stream", streamId})
                        }, 2000)
                    }
                })
            }
        });
    }
});

chrome.runtime.onMessage.addListener((message, sender, senderResponse) => {
    if (message.name === 'download' && message.url) {
        chrome.downloads.download({
            filename: 'screenshotV3.png',
            url: message.url
        }, (downloadId) => {
            senderResponse({success: true})
        })

        return true;
    }
});