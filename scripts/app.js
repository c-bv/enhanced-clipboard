window.onload = () => {
    const notificationsContainer = document.createElement('div');
    notificationsContainer.id = 'notifications-container';
    document.body.appendChild(notificationsContainer);
}

(async () => {
    const clipboard = await import(chrome.runtime.getURL('scripts/clipboard.js'));
    document.addEventListener('copy', () => {
        const selection = window.getSelection().toString();
        clipboard.storeItem(selection);
    });

    const notification = await import(chrome.runtime.getURL('scripts/notification.js'));
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        const { message, status, data } = request;
        message === 'clipboard changed' && notification.pushNotification(status, data);
    });

    document.addEventListener('mouseover', (e) => {
        const pointerPosition = document.elementFromPoint(e.clientX, e.clientY);

        pointerPosition.parentElement.getAttribute('role') === 'presentation' && (
            document.addEventListener('copy', () => {
                const selection = pointerPosition.textContent;
                clipboard.storeItem(selection);
            })
        );
    });
})();