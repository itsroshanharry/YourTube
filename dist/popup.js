(()=>{"use strict";document.addEventListener("DOMContentLoaded",(()=>{const e=document.getElementById("keywords"),t=document.getElementById("save");chrome.storage.sync.get(["keywords"],(t=>{t.keywords&&(e.value=t.keywords.join("\n"))})),t.addEventListener("click",(()=>{const t=e.value.split("\n").filter((e=>""!==e.trim()));chrome.storage.sync.set({keywords:t},(()=>{console.log("Keywords saved"),chrome.tabs.query({active:!0,currentWindow:!0},(e=>{e[0].id&&chrome.tabs.sendMessage(e[0].id,{action:"updateKeywords",keywords:t})}))}))}))}))})();