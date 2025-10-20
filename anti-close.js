// persistent-loader.js - Keeps tab open with selective loading animation
// Include in HTML: <script src="persistent-loader.js"></script>
// Assumes HTML: Full-page about:blank iframe, title="Loading...", Google spinner favicon
// Optional elements: <div id="spinner" class="spinner">, <div id="progress-bar" class="progress-bar">

(function() {
    // Configuration
    const config = {
        pingEndpoints: [
            'https://api.github.com/ping',
            'https://www.cloudflare.com/cdn-cgi/trace',
            'https://jsonplaceholder.typicode.com/ping'
        ],
        messages: [
            'Are you sure you want to close?',
        ],
        titles: [
            'Loading...',
        ],
        spinnerHideDelay: 45000, // ms
        debug: false // Enable for console logs
    };

    // Log helper (disabled by default)
    const log = (...args) => config.debug && console.log('[Loader]', ...args);

    // Check if this is the user's screen (customize this condition)
    const isUserScreen = localStorage.getItem('userFlag') === 'student' || navigator.userAgent.includes('YourUniqueString'); // Replace 'YourUniqueString' with your device's user agent substring

    // Create spinner if on user's screen
    let spinner = document.getElementById('spinner');
    if (isUserScreen && !spinner) {
        spinner = document.createElement('div');
        spinner.id = 'spinner';
        spinner.className = 'spinner';
        spinner.style.cssText = 'display: block; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: -1; border: 10px solid #e0e0e0; border-top: 10px solid #1a73e8; border-right: 10px solid #fbbc05; border-bottom: 10px solid #ea4335; border-left: 10px solid #34a853; border-radius: 50%; width: 80px; height: 80px; animation: spin 1.2s linear infinite; opacity: 0.85;';
        document.body.appendChild(spinner);
    } else if (isUserScreen) {
        spinner.style.display = 'block';
    }

    // Create progress bar if on user's screen
    let progressBar = document.getElementById('progress-bar');
    if (isUserScreen && !progressBar) {
        progressBar = document.createElement('div');
        progressBar.id = 'progress-bar';
        progressBar.className = 'progress-bar';
        progressBar.style.cssText = 'display: block; position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); width: 300px; height: 12px; background: #e0e0e0; border-radius: 6px; overflow: hidden; z-index: -1;';
        progressBar.innerHTML = '<div style="width: 0; height: 100%; background: linear-gradient(to right, #1a73e8, #34a853); transition: width 6s linear;"></div>';
        document.body.appendChild(progressBar);
    } else if (isUserScreen) {
        progressBar.style.display = 'block';
    }

    // Blank page for non-user screens
    if (!isUserScreen) {
        document.body.innerHTML = '';
        document.body.style.background = '#fff';
        document.title = 'Loading...';
    }

    // Inject CSS animations for user's screen
    if (isUserScreen) {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin { 0% { transform: translate(-50%, -50%) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(360deg); } }
            .spinner { animation: spin 1.2s linear infinite; }
            .progress-bar div { animation: progress 6s linear infinite; }
            @keyframes progress { 0% { width: 0; } 100% { width: 100%; } }
            @keyframes pulse { 0% { opacity: 0.85; } 50% { opacity: 0.95; } 100% { opacity: 0.85; } }
        `;
        document.head.appendChild(style);
        if (spinner) spinner.style.animation += ', pulse 2s ease-in-out infinite';
    }

    // Dynamic title updates
    document.title = 'Loading...';
    const updateTitle = () => {
        document.title = config.titles[Math.floor(Math.random() * config.titles.length)];
        setTimeout(updateTitle, 6000 + Math.random() * 4000);
    };
    updateTitle();

    // Tab persistence: Method 1 - Persistent "Are you sure you want to close?" dialog
    window.addEventListener('beforeunload', function(e) {
        const message = config.messages[Math.floor(Math.random() * config.messages.length)];
        e.preventDefault();
        e.returnValue = message;
        log('Showing dialog:', message);
        return message;
    });

    // Method 2: Lock event handler
    Object.defineProperty(window, 'onbeforeunload', {
        value: null,
        writable: false,
        configurable: false
    });

    // Method 3: Simulate user activity
    const simulateActivity = () => {
        const events = [
            new Event('mousemove', { bubbles: true }),
            new Event('keydown', { bubbles: true, keyCode: 32 }),
            new Event('scroll', { bubbles: true })
        ];
        events.forEach(evt => document.dispatchEvent(evt));
        setTimeout(simulateActivity, 7000 + Math.random() * 4000);
    };
    simulateActivity();

    // Method 4: Tab resurrection
    const tabId = sessionStorage.getItem('tabId') || Date.now().toString();
    sessionStorage.setItem('tabId', tabId);
    window.addEventListener('unload', () => {
        const newTab = window.open('about:blank', '_blank');
        if (newTab) {
            newTab.document.write('<script>window.location.href="' + window.location.href + '";</script>');
            log('Reopened tab');
        }
    });

    // Method 5: Keep-alive pings
    const ping = () => {
        const endpoint = config.pingEndpoints[Math.floor(Math.random() * config.pingEndpoints.length)];
        fetch(endpoint, {
            method: 'HEAD',
            mode: 'no-cors',
            keepalive: true,
            cache: 'no-store'
        }).catch(() => log('Ping failed:', endpoint));
        setTimeout(ping, 5000 + Math.random() * 3000);
    };
    ping();

    // Method 6: Fake network activity
    const fakeNetwork = () => {
        const img = new Image();
        img.src = config.pingEndpoints[0] + '?t=' + Date.now();
        img.style.display = 'none';
        document.body.appendChild(img);
        setTimeout(() => img.remove(), 1000);
        setTimeout(fakeNetwork, 9000 + Math.random() * 5000);
    };
    fakeNetwork();

    // Method 7: Element and title persistence
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (isUserScreen) {
                if (mutation.target === spinner && spinner.style.display === 'none') {
                    spinner.style.display = 'block';
                    log('Spinner restored');
                }
                if (mutation.target === progressBar && progressBar.style.display === 'none') {
                    progressBar.style.display = 'block';
                    log('Progress bar restored');
                }
            }
            if (!config.titles.includes(document.title)) {
                document.title = 'Loading...';
                log('Title restored');
            }
        });
    });
    observer.observe(document.documentElement, { attributes: true, subtree: true, childList: true });

    // Method 8: Dynamic progress bar updates
    if (isUserScreen && progressBar) {
        const updateProgress = () => {
            const barInner = progressBar.querySelector('div');
            barInner.style.width = '0';
            setTimeout(() => barInner.style.width = '100%', 100);
            setTimeout(updateProgress, 6000);
        };
        updateProgress();
    }

    // Auto-hide elements on user's screen after delay
    if (isUserScreen) {
        setTimeout(() => {
            if (spinner) spinner.style.display = 'none';
            if (progressBar) progressBar.style.display = 'none';
            log('Hid spinner and progress bar');
        }, config.spinnerHideDelay);
    }
})();
