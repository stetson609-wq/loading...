// Advanced Anti-Extension Fortress: Neutralizes Chrome extension interference
(function() {
    'use strict';

    // Configuration: Dynamic patterns and behaviors
    const config = {
        patterns: {
            selectors: ['.goguardian-overlay', '[data-extension*="monitor"]', 'iframe[src*="goguardian"]', 'iframe[src*="securly"]', 'script[src*="extension"]', '[class*="block"]'],
            scripts: [/goguardian\.com/i, /securly\.com/i, /monitor/i, /extension.*block/i],
            events: ['beforeunload', 'unload', 'pagehide', 'contextmenu', 'visibilitychange', 'mouseleave'],
            keys: ['W', 'T', 'R', 'I', 'C', 'J', 'F12', 'U'] // Ctrl+W, Ctrl+Shift+I, F12, etc.
        },
        checkInterval: () => Math.random() * 800 + 400 // Random 400-1200ms
    };

    // Deep freeze to lock objects
    const lockObject = obj => {
        Object.keys(obj).forEach(key => {
            if (typeof obj[key] === 'object' && obj[key] !== null) lockObject(obj[key]);
            Object.defineProperty(obj, key, { writable: false, configurable: false });
        });
        Object.seal(obj);
    };

    // Store original APIs
    const originals = {
        close: window.close,
        open: window.open,
        location: Object.getOwnPropertyDescriptor(window, 'location'),
        history: Object.getOwnPropertyDescriptor(window.history, 'pushState')
    };

    // Lock down critical APIs
    Object.defineProperty(window, 'close', {
        value: () => { console.log('Tab closure blocked.'); return false; },
        writable: false, configurable: false
    });
    Object.defineProperty(window, 'open', {
        value: () => { console.log('Window open blocked.'); return null; },
        writable: false, configurable: false
    });
    Object.defineProperty(window, 'location', {
        get: () => originals.location.get.call(window),
        set: () => { console.log('Location change blocked.'); },
        configurable: false
    });
    ['assign', 'replace'].forEach(method => {
        Object.defineProperty(window.location, method, {
            value: () => { console.log(`Location.${method} blocked.`); },
            writable: false, configurable: false
        });
    });
    ['pushState', 'replaceState'].forEach(method => {
        Object.defineProperty(window.history, method, {
            value: () => { console.log(`History.${method} blocked.`); },
            writable: false, configurable: false
        });
    });
    lockObject(window.location);
    lockObject(window.history);

    // Proxy console to prevent tampering
    window.console = new Proxy(console, {
        get: (target, prop) => typeof target[prop] === 'function' ? target[prop].bind(target) : target[prop]
    });
    lockObject(window.console);

    // Block dev tools detection
    Object.defineProperty(window, 'devtools', {
        value: undefined,
        writable: false, configurable: false
    });

    // Suppress events
    config.patterns.events.forEach(event => {
        window.addEventListener(event, e => {
            e.preventDefault();
            e.stopPropagation();
            if (event === 'beforeunload') e.returnValue = '';
            console.log(`${event} blocked.`);
        }, { capture: true, passive: false });
    });

    // Block keyboard shortcuts
    document.addEventListener('keydown', e => {
        const combo = (e.ctrlKey ? 'Ctrl+' : '') + (e.shiftKey ? 'Shift+' : '') + e.key.toUpperCase();
        if (config.patterns.keys.some(key => combo.includes(key))) {
            e.preventDefault();
            e.stopPropagation();
            console.log(`Shortcut ${combo} blocked.`);
        }
    }, { capture: true, passive: false });

    // Advanced DOM protection
    const cleanDOM = () => {
        // Remove matching elements
        config.patterns.selectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                el.remove();
                console.log('Injected element purged.');
            });
        });
        // Scan scripts for extension signatures
        document.querySelectorAll('script').forEach(script => {
            if (config.patterns.scripts.some(regex => script.src.match(regex))) {
                script.remove();
                console.log('Suspicious script removed.');
            }
        });
        // Check shadow DOM
        document.querySelectorAll('*').forEach(el => {
            if (el.shadowRoot) {
                config.patterns.selectors.forEach(sel => {
                    el.shadowRoot.querySelectorAll(sel).forEach(shadowEl => {
                        shadowEl.remove();
                        console.log('Shadow DOM injection removed.');
                    });
                });
            }
        });
    };

    // High-performance observer
    const observer = new MutationObserver(mutations => {
        cleanDOM();
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1 && config.patterns.selectors.some(sel => node.matches(sel))) {
                    node.remove();
                    console.log('Dynamic injection blocked.');
                }
            });
        });
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

    // Self-healing with adaptive timing
    const protect = () => {
        if (window.close !== originals.close) {
            Object.defineProperty(window, 'close', {
                value: () => { console.log('Tab closure blocked.'); return false; },
                writable: false, configurable: false
            });
        }
        if (window.open !== originals.open) {
            Object.defineProperty(window, 'open', {
                value: () => { console.log('Window open blocked.'); return null; },
                writable: false, configurable: false
            });
        }
        cleanDOM();
    };
    setInterval(protect, config.checkInterval());

    // Block extension-specific listeners
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (config.patterns.events.includes(type) || config.patterns.keys.some(key => type.includes(key))) {
            console.log(`Blocked event listener: ${type}`);
            return;
        }
        originalAddEventListener.call(this, type, listener, options);
    };

    console.log('Advanced fortress active: Extensions neutralized.');
})();
