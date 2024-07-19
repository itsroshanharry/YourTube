document.addEventListener('DOMContentLoaded', () => {
  const keywordsTextarea = document.getElementById('keywords') as HTMLTextAreaElement;
  const saveButton = document.getElementById('save') as HTMLButtonElement;
  const toggleCheckbox = document.getElementById('toggle') as HTMLInputElement;
  const loader = document.getElementById('loader') as HTMLDivElement;

  chrome.storage.sync.get(['keywords', 'isEnabled'], (result: { keywords?: string[], isEnabled?: boolean }) => {
    if (result.keywords) {
      keywordsTextarea.value = result.keywords.join('\n');
    }
    toggleCheckbox.checked = result.isEnabled || false;
  });

  toggleCheckbox.addEventListener('change', () => {
    const isEnabled = toggleCheckbox.checked;
    showLoader();
    chrome.storage.sync.set({isEnabled}, () => {
      console.log('Extension toggled:', isEnabled);
      sendMessageToActiveTab({action: 'toggleExtension', isEnabled: isEnabled});
      setTimeout(hideLoader, 500);
    });
  });

  saveButton.addEventListener('click', () => {
    const keywords = keywordsTextarea.value.split('\n').filter(keyword => keyword.trim() !== '');
    showLoader();
    chrome.storage.sync.set({keywords: keywords}, () => {
      console.log('Keywords saved');
      chrome.storage.sync.get(['isEnabled'], (result) => {
        sendMessageToActiveTab({action: 'updateKeywords', keywords: keywords, isEnabled: result.isEnabled});
        setTimeout(hideLoader, 500);
      });
    });
  });

  function sendMessageToActiveTab(message: any) {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, message).catch(error => {
          console.log("Error sending message:", error);
        });
      } else {
        console.log("No active tab found");
      }
    });
  }

  function showLoader() {
    loader.classList.remove('hidden');
  }

  function hideLoader() {
    loader.classList.add('hidden');
  }
});