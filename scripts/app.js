window.onload = () => {
    const notificationsContainer = document.createElement('div');
    notificationsContainer.id = 'notifications-container';
    document.body.appendChild(notificationsContainer);
};

(async () => {
    const clipboard = await import(chrome.runtime.getURL('scripts/clipboard.js'));
    const notification = await import(chrome.runtime.getURL('scripts/notification.js'));

    // Handle settings
    let settings = {};
    chrome.storage.sync.get(['settings'], (result) => {
        settings = result.settings;
    });
    chrome.storage.onChanged.addListener((changes, areaName) => {
        changes.settings && (settings = changes.settings.newValue);
    });

    // Handle notifications
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        const { message, status, data } = request;
        message === 'clipboard changed' && notification.pushNotification(status, data);
    });

    // Handle clipboard
    let mousePosition;
    document.addEventListener('mousemove', (e) => {
        mousePosition = { x: e.clientX, y: e.clientY };
    });
    document.addEventListener('copy', () => {
        const selection = window.getSelection().toString();
        settings.jiraMode ?
            clipboard.jiraMode(selection, mousePosition) :
            clipboard.storeItem(selection);
    });
})();