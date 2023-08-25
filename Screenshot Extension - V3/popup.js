document.addEventListener("DOMContentLoaded", function() {
    const changeBackgroundButton = document.getElementById("captureButton");

    changeBackgroundButton.addEventListener("click", function() {
        chrome.runtime.sendMessage({ action: "captureScreenshotEvent" });
    });
});