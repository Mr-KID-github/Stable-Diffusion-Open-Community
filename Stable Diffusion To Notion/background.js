chrome.runtime.onInstalled.addListener(function () {
  console.log("Extension installed");
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (tab && tab.url && changeInfo.status == "complete" && tab.url.indexOf("http://127.0.0.1:7860/") == 0) {
    chrome.tabs.executeScript(tabId, { file: "content.js" });
    console.log("插入content.js");
  } else {
    console.log("未插入content.js");
  }
});

// 监听来自content.js的消息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // 如果请求是打开popup.html并传递信息
  if (request.action === "open_popup") {
    // 创建一个新的窗口，打开popup.html
    chrome.windows.create({
      url: chrome.extension.getURL("popup.html"),
      type: "popup",
      width: 600,
      height: 400
    }, function (window) {
      // 在窗口加载完成后向它发送一个消息，将信息传递给它
      chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        if (changeInfo.status === "complete") {
          chrome.tabs.sendMessage(tabId, { info: request.info }, function (response) {
            console.log(response);
          });
        }
      });
    });
  }
});