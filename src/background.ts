chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleExtension' || request.action === 'updateKeywords') {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, request).catch(error => {
          console.error("Error sending message from background:", error);
        });
      }
    });
  }
  return true; 
});