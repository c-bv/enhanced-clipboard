// Set default settings on install
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({
        enabled: true,
        settings: { jiraMode: true },
        clipboard: []
    });
});

// Set badge text to number of clipboard items on startup
chrome.runtime.onStartup.addListener(() => {
    chrome.action.setBadgeBackgroundColor({ color: '#000000' });
    chrome.storage.sync.get(['clipboard'], (result) => {
        chrome.action.setBadgeText({ text: `${result.clipboard.length}` });
    });
});

// Set badge text to number of clipboard items on clipboard change
chrome.storage.onChanged.addListener((changes, areaName) => {
    if (changes.clipboard) {
        const oldClipboard = changes.clipboard.oldValue;
        const newClipboard = changes.clipboard.newValue;

        const getDiff = (arr1, arr2) => {
            return arr1.filter((item) => {
                return !arr2.some((oldItem) => {
                    return oldItem.id === item.id;
                });
            });
        }

        const changedElement = newClipboard.length > oldClipboard.length ?
            getDiff(newClipboard, oldClipboard) :
            getDiff(oldClipboard, newClipboard);

        chrome.action.setBadgeText({ text: `${newClipboard.length}` });
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {
                message: 'clipboard changed',
                status: (oldClipboard.length === 1 && newClipboard.length === 0) ? 'clear' : newClipboard.length > oldClipboard.length ? 'copy' : 'delete',
                data: newClipboard.length !== 0 ? changedElement[0].data : changedElement.length
            });
        });
    }
    if (changes.enabled) {
        changes.enabled.newValue ?
            chrome.storage.sync.get(['clipboard'], (result) => {
                chrome.action.setBadgeText({ text: `${result.clipboard.length}` })
            })
            : chrome.action.setBadgeText({ text: 'OFF' });
    }
});