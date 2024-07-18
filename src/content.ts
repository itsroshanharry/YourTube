function hideVideos(keywords: string[]): void {
    console.log('Checking videos with keywords:', keywords);
    let hiddenCount = 0;
    const videoElements = document.querySelectorAll('ytd-rich-item-renderer, ytd-compact-video-renderer');
    videoElements.forEach((element: Element) => {
      const titleElement = element.querySelector('#video-title');
      if (titleElement instanceof HTMLElement) {
        const title = titleElement.textContent?.toLowerCase() || '';
        if (keywords.some(keyword => title.includes(keyword.toLowerCase()))) {
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
    const observer = new MutationObserver(() => {
      hideVideos(keywords);
    });
  
    observer.observe(document.body, { childList: true, subtree: true });
  }
  
  chrome.storage.sync.get(['keywords'], (result: { keywords?: string[] }) => {
    if (result.keywords) {
      hideVideos(result.keywords);
      observeNewVideos(result.keywords);
    }
  });
  
  chrome.runtime.onMessage.addListener((request: { action: string; keywords: string[] }, sender, sendResponse) => {
    if (request.action === 'updateKeywords') {
      hideVideos(request.keywords);
      observeNewVideos(request.keywords);
    }
  });