// Handle ON/OFF switch
const toggleExtensionButton = document.getElementById('toggle-button');

toggleExtensionButton.addEventListener('click', () => {
    chrome.storage.sync.get(['enabled'], (result) => {
        chrome.storage.sync.set({ enabled: !result.enabled }, () => {
            location.reload();
        });
    });
});

chrome.storage.sync.get(['enabled'], (result) => {
    result.enabled &&
        main(),
        toggleExtensionButton.checked = result.enabled,
        document.getElementById('disabled-layer').classList.toggle('active', !result.enabled),
        document.getElementById('logo-container').classList.toggle('disabled', !result.enabled),
        document.getElementById('toggle-button').innerHTML = result.enabled ? 'OFF' : 'ON',
        document.getElementById('toggle-button').classList.toggle('off', !result.enabled);
});

const main = async () => {
    const clipboardFunc = await import(chrome.runtime.getURL('scripts/clipboard.js'));

    // Render clipboard items
    clipboardFunc.renderClipboard();

    // Search through clipboard items
    const searchInput = document.getElementById('searchbar');
    searchInput.addEventListener('input', (e) => {
        clipboardFunc.renderClipboard(e.target.value);
    });

    // Clear clipboard items
    const clearClipboard = document.getElementById('clear-clipboard-button');
    const clipboardContainer = document.getElementById('clipboard-container');
    clearClipboard.addEventListener('click', () => {
        clipboardFunc.clearClipboard();
        clipboardContainer.innerHTML = '';
    });

    // Handle clipboard settings
    const settingsButton = document.getElementById('settings-button');
    const settingsMenu = document.getElementById('settings-menu');
    settingsButton.addEventListener('click', () => {
        settingsMenu.classList.toggle('active');
    });

    // Set jira mode
    const jiraButton = document.getElementById('jira-mode');
    chrome.storage.sync.get('settings', ({ settings = {} }) => {
        settings.jiraMode && (jiraButton.checked = true);
    });
    jiraButton.addEventListener('change', () => {
        chrome.storage.sync.set({ settings: { jiraMode: jiraButton.checked ? true : false } });
    });
};