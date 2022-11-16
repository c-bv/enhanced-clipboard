const storeItem = (text) => {
    if (text === '') return;
    chrome.storage.sync.get('clipboard', ({ clipboard = [] }) => {
        const id = Math.random().toString(36).substr(2, 9);
        clipboard.push({
            id: id,
            date: new Date().toLocaleString(),
            data: text
        })
        chrome.storage.sync.set({ clipboard });
    });
}

const copyItem= (index) => {
    chrome.storage.sync.get('clipboard', ({ clipboard = [] }) => {
        navigator.clipboard.writeText(clipboard[index].data);
    });
}

const deleteItem = (index) => {
    chrome.storage.sync.get('clipboard', ({ clipboard = [] }) => {
        clipboard.splice(index, 1);
        chrome.storage.sync.set({ clipboard });
    });
}

const clearClipboard = () => {
    chrome.storage.sync.set({ clipboard: [] })
}

const getClipboard = () => {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get('clipboard', ({ clipboard = [] }) => {
            resolve(clipboard);
        });
    });
}

const getClipboardLength = () => {
    chrome.storage.sync.get('clipboard', ({ clipboard = [] }) => {
        return clipboard.length;
    });
}

export {
    storeItem,
    copyItem,
    deleteItem,
    clearClipboard,
    getClipboard,
    getClipboardLength
}