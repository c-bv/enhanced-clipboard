const pushNotification = (status, message) => {
    const notificationsContainer = document.getElementById('notifications-container');
    const notification = document.createElement('div');
    notification.classList.add('notification');

    const closeIcon = chrome.runtime.getURL('images/close.svg');
    const copyIcon = chrome.runtime.getURL('images/icon.svg');
    const deleteIcon = chrome.runtime.getURL('images/delete.svg');

    notification.innerHTML = `
        <div class='notification-content'>
            <img src=${status === 'copy' ? copyIcon : deleteIcon} />
            <span class='notification-text'>
                ${status === 'clear' ? `${message} items deleted` : status === 'copy' ? `Copied: ${message}` : `Deleted: ${message} items`}
            </span>
        </div>
        <img src=${closeIcon} class='notification-close' />
        <div class='progress-bar ${status}'></div>
    `;
    
    notificationsContainer.appendChild(notification);
    const close = notification.querySelector('.notification-close');

    close.addEventListener('click', () => {
        notification.remove();
    });

    setTimeout(() => {
        notification.remove();
    }, 3000);
};

export { pushNotification };