chrome.runtime.onInstalled.addListener(function() {
    console.log("Extension installed");
  });
  
  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (tab && tab.url && changeInfo.status == "complete" && tab.url.indexOf("http://127.0.0.1:7860/") == 0) {
      chrome.tabs.executeScript(tabId, { file: "content.js" });
      console.log("插入content.js");
    } else {
        console.log("未插入content.js");
    }
  }); 
  