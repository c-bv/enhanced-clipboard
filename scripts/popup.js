(async () => {
    const clipboardFunc = await import(chrome.runtime.getURL('scripts/clipboard.js'));

    // RENDER CLIPBOARD
    const clipboardContainer = document.getElementById('clipboard-container');

    const clipboard = await clipboardFunc.getClipboard();

    clipboard.forEach((item) => {
        const itemContainer = document.createElement('div');
        itemContainer.classList.add('item-container');

        const copyIcon = chrome.runtime.getURL('images/icon.svg');
        const deleteIcon = chrome.runtime.getURL('images/delete.svg');

        itemContainer.innerHTML = `
            <div class='item-content'>
                <span class='item-date'>${item.date}</span>
                <span class='item-text'>${item.data}</span>
            </div>
            <div class='item-actions'>
                <img src=${copyIcon} class='item-action copy' />
                <img src=${deleteIcon} class='item-action delete' />
            </div>
        `;
        clipboardContainer.appendChild(itemContainer);

        const copyButton = itemContainer.querySelector('.copy');
        const deleteButton = itemContainer.querySelector('.delete');

        copyButton.addEventListener('click', () => {
            clipboardFunc.copyItem(clipboard.indexOf(item));
        });

        deleteButton.addEventListener('click', () => {
            clipboardFunc.deleteItem(clipboard.indexOf(item));
            // TODO: Refetch clipboard and re-render (useeffect?)
            itemContainer.remove();
        });
    });

    // CLEAR CLIPBOARD
    const clearClipboard = document.getElementById('clear-clipboard-button');
    clearClipboard.addEventListener('click', () => {
        clipboardFunc.clearClipboard();
        clipboardContainer.innerHTML = '';
    });
})();

// SETTINGS
const settingsButton = document.getElementById('settings-button');
const settingsMenu = document.getElementById('settings-menu');
settingsButton.addEventListener('click', () => {
    settingsMenu.classList.contains('active') ?
        settingsMenu.classList.remove('active')
        :
        settingsMenu.classList.add('active');
});

const jiraButton = document.getElementById('jira-mode');
chrome.storage.sync.get('settings', ({ settings = {} }) => {
    settings.jiraMode && (jiraButton.checked = true);
});

jiraButton.addEventListener('change', () => {
    chrome.storage.sync.set({ settings: { jiraMode: jiraButton.checked ? true : false } });
});