let observer: MutationObserver | null = null;

function hideVideos(keywords: string[]): void {
  console.log('Checking videos with keywords:', keywords);
  let hiddenCount = 0;
  const videoElements = document.querySelectorAll('ytd-rich-item-renderer, ytd-compact-video-renderer');
  videoElements.forEach((element: Element) => {
    const titleElement = element.querySelector('#video-title');
    const channelElement = element.querySelector('#channel-name, #text.ytd-channel-name');
    const descriptionElement = element.querySelector('#description-text');

    if (titleElement instanceof HTMLElement && channelElement instanceof HTMLElement) {
      const title = titleElement.textContent?.toLowerCase() || '';
      const channel = channelElement.textContent?.toLowerCase() || '';
      const description = descriptionElement instanceof HTMLElement ? descriptionElement.textContent?.toLowerCase() || '' : '';

      if (keywords.some(keyword => 
        title.includes(keyword.toLowerCase()) || 
        channel.includes(keyword.toLowerCase()) ||
        description.includes(keyword.toLowerCase())
      )) {
        (element as HTMLElement).style.display = 'none';
        hiddenCount++;
        console.log('Hidden video:', title);
      }
    }
  });
  console.log(`Total videos hidden: ${hiddenCount}`);
  updateCounter(hiddenCount);
}

function updateCounter(count: number): void {
  let counter = document.getElementById('yt-blocker-counter');
  if (!counter) {
    counter = document.createElement('div');
    counter.id = 'yt-blocker-counter';
    counter.style.position = 'fixed';
    counter.style.top = '10px';
    counter.style.right = '10px';
    counter.style.background = 'red';
    counter.style.color = 'white';
    counter.style.padding = '5px';
    counter.style.zIndex = '9999';
    document.body.appendChild(counter);
  }
  counter.textContent = `Videos hidden: ${count}`;
}

function observeNewVideos(keywords: string[]): void {
  observer = new MutationObserver(() => {
    hideVideos(keywords);
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

chrome.storage.sync.get(['keywords', 'isEnabled'], (result: { keywords?: string[], isEnabled?: boolean }) => {
  if (result.keywords && result.isEnabled) {
    hideVideos(result.keywords);
    observeNewVideos(result.keywords);
  }
});

chrome.runtime.onMessage.addListener((request: { action: string; keywords?: string[], isEnabled?: boolean }, sender, sendResponse) => {
  if (request.action === 'updateKeywords') {
    chrome.storage.sync.get(['isEnabled'], (result) => {
      if (result.isEnabled && request.keywords) {
        hideVideos(request.keywords);
        observeNewVideos(request.keywords);
      }
    });
  } else if (request.action === 'toggleExtension') {
    if (request.isEnabled) {
      chrome.storage.sync.get(['keywords'], (result) => {
        if (result.keywords) {
          hideVideos(result.keywords);
          observeNewVideos(result.keywords);
        }
      });
    } else {
      // If the extension is disabled, show all videos and disconnect observer
      showAllVideos();
      if (observer) {
        observer.disconnect();
        observer = null;
      }
    }
  }
  return true; // Keeps the message channel open for asynchronous responses
});

function showAllVideos() {
  const videoElements = document.querySelectorAll('ytd-rich-item-renderer, ytd-compact-video-renderer');
  videoElements.forEach((element: Element) => {
    (element as HTMLElement).style.display = '';
  });
}
