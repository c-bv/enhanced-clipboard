window.onload = () => {
    const notificationsContainer = document.createElement('div');
    notificationsContainer.id = 'notifications-container';
    document.body.appendChild(notificationsContainer);
}

(async () => {
    const clipboard = await import(chrome.runtime.getURL('scripts/clipboard.js'));
    const notification = await import(chrome.runtime.getURL('scripts/notification.js'));

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
        const targetElement = document.elementFromPoint(mousePosition.x, mousePosition.y)
        const selection = window.getSelection().toString();

        selection ?
            clipboard.storeItem(selection)
            :
            (targetElement.classList.contains('sc-15cfu5s-1')) && clipboard.storeItem(targetElement.innerText);
    });
})();