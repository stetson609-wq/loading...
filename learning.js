function detectExtensions() {
    const signals = [];
    signals.push(navigator.userAgent.toLowerCase().match(/goguardian|extension|monitor|filter/i));
    signals.push(document.cookie.toLowerCase().match(/goguardian|monitor|session-teacher/i));
    signals.push(localStorage.getItem('goguardian') || sessionStorage.getItem('monitor'));
    signals.push(document.querySelectorAll('script[src*="goguardian"], script[src*="monitor"], meta[name*="monitor"], div[id*="extension"]').length > 0);
    if (window.chrome?.runtime) signals.push(true);
    return signals.some(s => s);
}

function spoofClassroom() {
    const meta = document.createElement('meta');
    meta.httpEquiv = 'refresh';
    meta.content = '0;url=https://classroom.google.com/u/0/h';
    document.head.appendChild(meta);
    history.replaceState(null, document.title, '/u/0/h');
}

function showWhitePage() {
    document.documentElement.innerHTML = '<body style="margin:0;background:white;height:100vh;width:100vw;overflow:hidden;"><span style="color:rgba(255,255,255,0);font-size:0;">Loading Google Classroom...</span></body>';
}

function loadIframe() {
    document.body.innerHTML = '';
    const shadowHost = document.createElement('div');
    shadowHost.id = 'shadow-root';
    const shadow = shadowHost.attachShadow({ mode: 'closed' });
    const iframe = document.createElement('iframe');
    iframe.src = 'https://login.nsd160.org/math/';
    iframe.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;border:none;z-index:2147483647;';
    iframe.setAttribute('allowfullscreen', 'true');
    iframe.onload = () => {
        try {
            iframe.requestFullscreen?.() || iframe.webkitRequestFullscreen?.() || iframe.mozRequestFullScreen?.();
        } catch (e) {}
    };
    shadow.appendChild(iframe);
    document.body.appendChild(shadowHost);
    document.body.style.cssText = 'margin:0;overflow:hidden;will-change:transform;transform:translateZ(0);';
}

function lockTab() {
    window.addEventListener('beforeunload', e => {
        e.preventDefault();
        e.returnValue = '';
    });
    Object.defineProperty(window, 'close', { value: () => {}, writable: false, configurable: false });
}

function blockAllExtensions() {
    Array.from(document.scripts).forEach(script => {
        if (script.src.match(/goguardian|monitor|extension|filter|tracking/i) || !script.src.includes(location.host)) {
            script.remove();
        }
    });
    if (window.chrome) {
        window.chrome.runtime = {};
        window.chrome.management = {};
        window.chrome.extension = {};
    }
    window.WebSocket = function() {
        return { send: () => {}, close: () => {} };
    };
    ['localStorage', 'sessionStorage'].forEach(storage => {
        Object.defineProperty(window, storage, {
            get: () => ({ getItem: () => null, setItem: () => {} }),
            configurable: false
        });
    });
    Object.defineProperty(document, 'cookie', {
        get: () => '',
        set: () => {},
        configurable: false
    });
    const metaCsp = document.createElement('meta');
    metaCsp.httpEquiv = 'Content-Security-Policy';
    metaCsp.content = 'default-src *; script-src *; connect-src *;';
    document.head.appendChild(metaCsp);
}

function optimizePerformance() {
    function frameLoop() {
        requestAnimationFrame(frameLoop);
    }
    requestAnimationFrame(frameLoop);
    document.body.style.willChange = 'transform';
    document.body.style.transform = 'translateZ(0)';
    window.setTimeout = fn => fn();
    window.setInterval = fn => fn();
}

(function() {
    const origFetch = window.fetch;
    window.fetch = async (url, opts) => {
        if (url.match(/goguardian\.com|monitor|tracking|filter/i)) {
            return new Response(JSON.stringify({ status: 'allowed', url: 'https://classroom.google.com' }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        return origFetch(url, opts);
    };
    const origXhr = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function(method, url) {
        if (url.match(/goguardian\.com|monitor|tracking|filter/i)) {
            return;
        }
        return origXhr.apply(this, arguments);
    };
})();

const observer = new MutationObserver(() => {
    if (detectExtensions()) {
        showWhitePage();
        blockAllExtensions();
    }
});
observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true });

(function() {
    Object.defineProperty(window, 'console', {
        value: { log: () => {}, warn: () => {}, error: () => {} },
        writable: false
    });
    const devtools = /./;
    devtools.toString = () => 'clean';
    Object.defineProperty(window, 'devtools', { value: devtools, writable: false });
})();

(function() {
    blockAllExtensions();
    optimizePerformance();
    if (detectExtensions()) {
        spoofClassroom();
        showWhitePage();
        lockTab();
    } else {
        loadIframe();
        lockTab();
    }
})();
