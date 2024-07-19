chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url?.includes('youtube.com')) {
    chrome.storage.sync.get(['isEnabled'], (result) => {
      if (result.isEnabled) {
        chrome.tabs.sendMessage(tabId, { action: 'checkForVideos' });
      }
    });
  }
});