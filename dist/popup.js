(()=>{"use strict";document.addEventListener("DOMContentLoaded",(()=>{const e=document.getElementById("keywords"),s=document.getElementById("save"),t=document.getElementById("toggle");chrome.storage.sync.get(["keywords","isEnabled"],(s=>{s.keywords&&(e.value=s.keywords.join("\n")),t.checked=s.isEnabled||!1})),t.addEventListener("change",(()=>{const e=t.checked;chrome.storage.sync.set({isEnabled:e},(()=>{console.log("Extension toggled:",e),chrome.tabs.query({active:!0,currentWindow:!0},(s=>{s[0].id&&chrome.tabs.sendMessage(s[0].id,{action:"toggleExtension",isEnabled:e})}))}))})),s.addEventListener("click",(()=>{const s=e.value.split("\n").filter((e=>""!==e.trim()));chrome.storage.sync.set({keywords:s},(()=>{console.log("Keywords saved"),chrome.tabs.query({active:!0,currentWindow:!0},(e=>{e[0].id&&chrome.storage.sync.get(["isEnabled"],(t=>{chrome.tabs.sendMessage(e[0].id,{action:"updateKeywords",keywords:s,isEnabled:t.isEnabled})}))}))}))}))}))})();