(async () => {
    const clipboardFunc = await import(chrome.runtime.getURL('scripts/clipboard.js'));

    // Render clipboard items
    clipboardFunc.renderClipboard();

    // Search clipboard items
    const searchInput = document.getElementById('searchbar');
    searchInput.addEventListener('input', (e) => {
        clipboardFunc.renderClipboard(e.target.value);
    });

    // Clear clipboard
    const clearClipboard = document.getElementById('clear-clipboard-button');
    const clipboardContainer = document.getElementById('clipboard-container');
    clearClipboard.addEventListener('click', () => {
        clipboardFunc.clearClipboard();
        clipboardContainer.innerHTML = '';
    });

    // Handle settings
    const settingsButton = document.getElementById('settings-button');
    const settingsMenu = document.getElementById('settings-menu');
    settingsButton.addEventListener('click', () => {
        settingsMenu.classList.contains('active') ?
            settingsMenu.classList.remove('active')
            :
            settingsMenu.classList.add('active');
    });

    // Set jira mode
    const jiraButton = document.getElementById('jira-mode');
    chrome.storage.sync.get('settings', ({ settings = {} }) => {
        settings.jiraMode && (jiraButton.checked = true);
    });

    jiraButton.addEventListener('change', () => {
        chrome.storage.sync.set({ settings: { jiraMode: jiraButton.checked ? true : false } });
    });

})();