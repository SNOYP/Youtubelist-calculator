const menuTitles = {
    en: "Calculate Playlist Time",
    ru: "Посчитать время плейлиста",
    uk: "Порахувати час плейлиста",
    de: "Playlist-Zeit berechnen"
};

const MENU_ID = "open-yt-tracker-pro";

function updateOrContextMenu(lang) {
    chrome.contextMenus.update(MENU_ID, {
        title: menuTitles[lang] || menuTitles['en']
    });
}

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get(['ytPtLang'], (result) => {
        const lang = result.ytPtLang || 'en';
        chrome.contextMenus.create({
            id: MENU_ID,
            title: menuTitles[lang] || menuTitles['en'],
            contexts: ["all"],
            documentUrlPatterns: ["*://*.youtube.com/*"]
        });
    });
});

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.ytPtLang) {
        const newLang = changes.ytPtLang.newValue;
        if (menuTitles[newLang]) {
            updateOrContextMenu(newLang);
        }
    }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === MENU_ID) {
        chrome.tabs.sendMessage(tab.id, { action: "toggle_ui" }).catch(() => {});
    }
});