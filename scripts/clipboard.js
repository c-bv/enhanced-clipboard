const renderClipboard = (search) => {
    chrome.storage.sync.get('clipboard', ({ clipboard = [] }) => {
        search && (clipboard = clipboard.filter(item => item.data.toLowerCase().includes(search.toLowerCase())));

        const clipboardContainer = document.getElementById('clipboard-container');
        clipboardContainer.innerHTML = '';

        clipboard.reverse().forEach((item) => {
            const itemContainer = document.createElement('div');
            itemContainer.classList.add('item-container');

            const deleteIcon = chrome.runtime.getURL('images/delete.svg');
            itemContainer.innerHTML = `
                <div class='item-content' data-id='${item.id}'>
                    <span class='item-date'>${item.date}</span>
                    <span class='item-text'>${item.data}</span>
                </div>
                <div class='item-actions'>
                    <img src=${deleteIcon} class='item-action delete' />
                </div>
            `;
            clipboardContainer.appendChild(itemContainer);

            const deleteButton = itemContainer.querySelector('.delete');

            itemContainer.addEventListener('click', () => {
                copyItemFromClipboard(item.id);
            });

            deleteButton.addEventListener('click', () => {
                deleteItemFromClipboard(item.id);
                itemContainer.remove();
            });
        });
    });
};

const storeItem = (text) => {
    if (text === '') return;
    chrome.storage.sync.get('clipboard', ({ clipboard = [] }) => {
        const id = Math.random().toString(36).substr(2, 9);
        const date = new Date().toLocaleString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' });
        clipboard.push({
            id: id,
            date: date,
            data: text
        });
        chrome.storage.sync.set({ clipboard });
    });
};

const jiraMode = (selection, mousePosition) => {
    const target = document.elementFromPoint(mousePosition.x, mousePosition.y);
    const targetClassList = target.classList;
    if (selection) {
        storeItem(selection)
    } else if (targetClassList.contains('sc-15cfu5s-1') || targetClassList.contains('css-1gd7hga')) {
        navigator.clipboard.writeText(target.innerText);
        storeItem(target.innerText)
    }
};

const copyItemFromClipboard = (id) => {
    chrome.storage.sync.get('clipboard', ({ clipboard = [] }) => {
        navigator.clipboard.writeText(clipboard.find(item => item.id === id).data);
    });
};

const deleteItemFromClipboard = (id) => {
    new Promise((resolve, reject) => {
        chrome.storage.sync.get('clipboard', ({ clipboard = [] }) => {
            clipboard.splice(clipboard.findIndex(item => item.id === id), 1);
            chrome.storage.sync.set({ clipboard });
            resolve(clipboard);
        });
    });
};

const clearClipboard = () => {
    chrome.storage.sync.set({ clipboard: [] })
};

export {
    renderClipboard,
    storeItem,
    jiraMode,
    copyItemFromClipboard,
    deleteItemFromClipboard,
    clearClipboard
};