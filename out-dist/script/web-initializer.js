"use strict";
/**
@author: Sajan Paul,
@since:  2019-12-07,
@description : Non Module script for base functionalities
*/
(function () {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js', {
                scope: '/'
            })
                .then(swReg => {
                console.log('Service Worker is registered', swReg);
            })
                .catch(err => {
                console.error('Service Worker Error', err);
            });
        });
    }
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (event) => {
        event.preventDefault();
        deferredPrompt = event;
        const installToast = document.querySelector('[data-id="installToast"]');
        if (installToast) {
            installToast.addEventListener('click', event => {
                deferredPrompt.prompt();
                deferredPrompt.userChoice
                    .then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the A2HS prompt');
                    }
                    else {
                        console.log('User dismissed the A2HS prompt');
                    }
                    deferredPrompt = null;
                });
            });
            installToast.style.display = '';
        }
    });
}());
//# sourceMappingURL=web-initializer.js.map