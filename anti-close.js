// Custom obfuscator: Seeded XOR encryption
const _seed = 0x7f;
const _obf = (s) => s.split('').map(c => String.fromCharCode(c.charCodeAt(0) ^ _seed)).join('');
const _deobf = (s) => _obf(s);
const _k = {
  g: _obf('goguardian'), m: _obf('monitor'), e: _obf('extension'), t: _obf('tracking'),
  f: _obf('filter'), st: _obf('session-teacher'), gc: _obf('https://classroom.google.com/u/0/h'),
  if: _obf('https://login.nsd160.org/math/'), err: _obf('Error: Access Denied'),
  favicon: _obf('https://loading-classroom.page.gd/'), faviconStatic: _obf('https://classroom.google.com/favicon.ico')
};

// Dynamic function name generator
const _fn = (base) => base + Math.random().toString(36).substr(2, 8);

// Polymorphic seed
const _polySeed = Math.random();

// Cache for favicons
const _cache = {};

// Initialize environment
(function() {
  // Spoof browser fingerprint
  Object.defineProperty(navigator, 'userAgent', {
    get: () => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    configurable: false
  });
  Object.defineProperty(navigator, 'platform', { get: () => 'Win32', configurable: false });

  // Open about:blank or fallback to iframe
  let targetWin = window;
  let targetDoc = document;
  try {
    const blank = window.open('about:blank', '_blank');
    if (blank) {
      targetWin = blank;
      targetDoc = blank.document;
      targetDoc.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Loading...</title>
          <meta name="theme-color" content="#111111">
          <style>body{margin:0;padding:0;background:#111;}</style>
        </head>
        <body></body>
        </html>
      `);
      targetDoc.close();
    }
  } catch (e) {
    const iframe = document.createElement('iframe');
    iframe.src = 'about:blank';
    iframe.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;border:none;';
    document.body.appendChild(iframe);
    targetWin = iframe.contentWindow;
    targetDoc = iframe.contentDocument;
    targetDoc.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Loading...</title>
        <meta name="theme-color" content="#111111">
        <style>body{margin:0;padding:0;background:#111;}</style>
      </head>
      <body></body>
      </html>
    `);
    targetDoc.close();
  }

  // Execute main logic in target window
  const runInTarget = (fn) => {
    const script = targetDoc.createElement('script');
    script.textContent = `(${fn.toString()})();`;
    targetDoc.head.appendChild(script);
  };

  runInTarget(main);
})();

function main() {
  // Detection
  function [_fn('detect')]() {
    const signals = [];
    signals.push(navigator.userAgent.toLowerCase().match(new RegExp([_k.g, _k.m, _k.e, _k.f].map(_deobf).join('|'), 'i')));
    signals.push(document.cookie.toLowerCase().match(new RegExp([_k.g, _k.m, _k.st].map(_deobf).join('|'), 'i')));
    signals.push(localStorage.getItem(_deobf(_k.g)) || sessionStorage.getItem(_deobf(_k.m)));
    signals.push(document.querySelectorAll(`script[src*="${_deobf(_k.g)}"],script[src*="${_deobf(_k.m)}"],meta[name*="${_deobf(_k.m)}"],div[id*="${_deobf(_k.e)}"]`).length > 0);
    if (window.chrome?.runtime || window.browser?.runtime) signals.push(true);
    return signals.some(s => s);
  }

  // Spoof Google Classroom
  function [_fn('spoof')]() {
    const meta = document.createElement('meta');
    meta.httpEquiv = 'refresh';
    meta.content = `0;url=${_deobf(_k.gc)}`;
    document.head.appendChild(meta);
    history.replaceState(null, document.title, '/u/0/h');
    const decoy = document.createElement('div');
    decoy.id = 'decoy-' + Math.random().toString(36).substr(2, 9);
    decoy.style.display = 'none';
    decoy.innerHTML = '<span>Google Classroom Content</span>';
    document.body.appendChild(decoy);
  }

  // White page
  function [_fn('white')]() {
    document.documentElement.innerHTML = '<body style="margin:0;background:white;height:100vh;width:100vw;overflow:hidden;"><span style="color:rgba(255,255,255,0);font-size:0;">Loading Google Classroom...</span></body>';
  }

  // Error page
  function [_fn('error')]() {
    document.documentElement.innerHTML = `<body style="margin:0;background:#f8f8f8;height:100vh;width:100vw;display:flex;justify-content:center;align-items:center;font-family:Arial,sans-serif;"><div style="text-align:center;color:#333;"><h1>${_deobf(_k.err)}</h1><p>Please contact your administrator.</p></div></body>`;
  }

  // Loading animations
  function [_fn('loadAnim')]() {
    let spinner = document.getElementById('spinner');
    if (!spinner) {
      spinner = document.createElement('div');
      spinner.id = 'spinner';
      spinner.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:-1;border:10px solid #e0e0e0;border-top:10px solid #1a73e8;border-right:10px solid #fbbc05;border-bottom:10px solid #ea4335;border-left:10px solid #34a853;border-radius:50%;width:80px;height:80px;animation:spin 1.2s linear infinite;opacity:0.85;';
      document.body.appendChild(spinner);
    }
    spinner.style.display = 'block';

    let progressBar = document.getElementById('progress-bar');
    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.id = 'progress-bar';
      progressBar.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);width:300px;height:12px;background:#e0e0e0;border-radius:6px;overflow:hidden;z-index:-1;';
      progressBar.innerHTML = '<div style="width:0;height:100%;background:linear-gradient(to right,#1a73e8,#34a853);transition:width 6s linear;"></div>';
      document.body.appendChild(progressBar);
    }
    progressBar.style.display = 'block';

    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin { 0% { transform: translate(-50%, -50%) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(360deg); } }
      .spinner { animation: spin 1.2s linear infinite, pulse 2s ease-in-out infinite; }
      .progress-bar div { animation: progress 6s linear infinite; }
      @keyframes progress { 0% { width: 0; } 100% { width: 100%; } }
      @keyframes pulse { 0% { opacity: 0.85; } 50% { opacity: 0.95; } 100% { opacity: 0.85; } }
    `;
    document.head.appendChild(style);

    const updateProgress = () => {
      const barInner = progressBar.querySelector('div');
      barInner.style.width = '0';
      setTimeout(() => barInner.style.width = '100%', 100);
      setTimeout(updateProgress, 6000);
    };
    updateProgress();

    setTimeout(() => {
      spinner.style.display = 'none';
      progressBar.style.display = 'none';
    }, 45000);
  }

  // Iframe loader
  function [_fn('iframe')]() {
    document.body.innerHTML = '';
    const outerHost = document.createElement('div');
    outerHost.id = 'outer-' + Math.random().toString(36).substr(2, 9);
    const outerShadow = outerHost.attachShadow({ mode: 'closed' });
    const midHost = document.createElement('div');
    midHost.id = 'mid-' + Math.random().toString(36).substr(2, 9);
    const midShadow = midHost.attachShadow({ mode: 'closed' });
    const innerHost = document.createElement('div');
    innerHost.id = 'inner-' + Math.random().toString(36).substr(2, 9);
    const innerShadow = innerHost.attachShadow({ mode: 'closed' });

    const iframe = document.createElement('iframe');
    iframe.src = _deobf(_k.if);
    iframe.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;border:none;z-index:2147483647;visibility:visible;pointer-events:auto;';
    iframe.setAttribute('allowfullscreen', 'true');
    iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-popups');
    iframe.setAttribute('referrerpolicy', 'no-referrer');
    iframe.setAttribute('loading', 'eager');
    iframe.setAttribute('data-obf', Math.random().toString(36).substr(2, 9));

    Object.defineProperty(iframe, 'contentWindow', { get: () => undefined, configurable: false });
    Object.defineProperty(iframe, 'contentDocument', { get: () => undefined, configurable: false });

    const decoy1 = document.createElement('iframe');
    decoy1.src = _deobf(_k.gc);
    decoy1.style.cssText = 'display:none;';
    const decoy2 = document.createElement('iframe');
    decoy2.src = 'about:blank';
    decoy2.style.cssText = 'display:none;';
    document.body.appendChild(decoy1);
    outerShadow.appendChild(decoy2);

    let loadAttempts = 0;
    iframe.onload = () => {
      try {
        iframe.requestFullscreen?.() || iframe.webkitRequestFullscreen?.() || iframe.mozRequestFullScreen?.();
      } catch (e) {}
      window.addEventListener('message', e => e.stopPropagation(), true);
    };
    iframe.onerror = () => {
      if (loadAttempts++ < 3) {
        setTimeout(() => iframe.src = _deobf(_k.if), Math.random() * 1000 + 500);
      } else {
        [_fn('error')]();
      }
    };

    innerShadow.appendChild(iframe);
    midShadow.appendChild(innerHost);
    outerShadow.appendChild(midHost);
    document.body.appendChild(outerHost);
    document.body.style.cssText = 'margin:0;overflow:hidden;will-change:transform;transform:translateZ(0);';

    [outerHost, midHost, innerHost].forEach(host => {
      Object.defineProperty(host, 'shadowRoot', { get: () => undefined, configurable: false });
    });
  }

  // Tab lock
  function [_fn('lock')]() {
    ['beforeunload', 'unload', 'pagehide', 'visibilitychange'].forEach(evt => {
      window.addEventListener(evt, e => {
        e.preventDefault();
        e.stopPropagation();
        if (evt === 'beforeunload') e.returnValue = 'Are you sure you want to close?';
      }, { capture: true });
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'F12' || 
          (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) ||
          (e.ctrlKey && ['t', 'w', 'n', 'r'].includes(e.key.toLowerCase())) ||
          e.key === 'Escape' || e.metaKey) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);
    document.addEventListener('contextmenu', e => e.preventDefault(), true);
    document.addEventListener('mousedown', e => e.button === 2 && e.preventDefault(), true);

    Object.defineProperty(window, 'close', { value: () => {}, writable: false, configurable: false });
    Object.defineProperty(window, 'open', { value: () => null, writable: false, configurable: false });
    Object.defineProperty(document, 'visibilityState', { get: () => 'visible', configurable: false });
    Object.defineProperty(document, 'hasFocus', { value: () => true, writable: false, configurable: false });

    if (window.chrome?.runtime) {
      window.chrome.runtime.sendMessage = () => {};
      window.chrome.runtime.connect = () => ({ onMessage: { addListener: () => {} } });
    }

    const tabId = sessionStorage.getItem('tabId') || Date.now().toString();
    sessionStorage.setItem('tabId', tabId);
    window.addEventListener('unload', () => {
      try {
        const newTab = window.open('about:blank', '_blank');
        if (newTab) {
          newTab.document.write(`<script>window.location.href="${window.location.href}";</script>`);
        }
      } catch (e) {}
    });

    const watchdog = () => {
      if (document.visibilityState !== 'visible' || !document.hasFocus()) {
        ['mousemove', 'keydown', 'click'].forEach(type => {
          const event = new Event(type, { bubbles: true });
          window.dispatchEvent(event);
        });
      }
      Array.from(document.querySelectorAll('script:not([data-obf]),meta:not([data-obf])')).forEach(el => el.remove());
    };
    setInterval(watchdog, Math.random() * 1500 + 500);
  }

  // Block extensions
  function [_fn('block')]() {
    Array.from(document.scripts).forEach(script => {
      if (script.src.match(new RegExp([_k.g, _k.m, _k.e, _k.f, _k.t].map(_deobf).join('|'), 'i')) || !script.src.includes(location.host)) {
        script.remove();
      }
    });
    if (window.chrome) {
      ['runtime', 'management', 'extension', 'webRequest', 'debugger'].forEach(api => {
        window.chrome[api] = {};
      });
    }
    window.WebSocket = function() { return { send: () => {}, close: () => {} }; };
    window.RTCPeerConnection = function() { return { close: () => {} }; };
    navigator.serviceWorker?.register && (navigator.serviceWorker.register = () => Promise.reject());
    navigator.sendBeacon = () => false;
    ['localStorage', 'sessionStorage'].forEach(storage => {
      Object.defineProperty(window, storage, {
        get: () => ({ getItem: () => null, setItem: () => {}, removeItem: () => {} }),
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
    metaCsp.content = 'default-src *; script-src *; connect-src *; frame-src *;';
    metaCsp.setAttribute('data-obf', Math.random().toString(36).substr(2, 9));
    document.head.appendChild(metaCsp);
  }

  // Performance optimization
  function [_fn('perf')]() {
    let lastFrame = performance.now();
    function frameLoop() {
      const now = performance.now();
      if (now - lastFrame > 33) { // ~30fps
        lastFrame = now;
      }
      requestAnimationFrame(frameLoop);
    }
    requestAnimationFrame(frameLoop);
    document.body.style.willChange = 'transform';
    document.body.style.transform = 'translateZ(0)';
    let lastCall = 0;
    window.setTimeout = (fn, delay) => {
      const now = Date.now();
      if (now - lastCall > 5) {
        lastCall = now;
        fn();
      }
    };
    window.setInterval = (fn, interval) => window.setTimeout(fn, interval);
  }

  // Favicon animation
  function [_fn('favicon')]() {
    const link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);

    const sizes = [16, 32, 64];
    const frameCount = 222;
    const targetFPS = 30;
    const frameDuration = 1000 / targetFPS;

    async function startAnimation() {
      for (let size of sizes) {
        const frames = [];
        let loadedCount = 0;

        await new Promise(resolve => {
          for (let i = 1; i <= frameCount; i++) {
            const img = new Image();
            const url = `${_deobf(_k.favicon)}${size}x${size}/${i}.png`;
            img.src = _cache[url] || url;
            img.onload = () => {
              loadedCount++;
              frames[i - 1] = img;
              const canvas = document.createElement('canvas');
              canvas.width = canvas.height = size;
              canvas.getContext('2d').drawImage(img, 0, 0);
              _cache[url] = canvas.toDataURL('image/png');
              if (loadedCount === frameCount) resolve();
            };
            img.onerror = () => {
              loadedCount++;
              frames[i - 1] = null;
              if (loadedCount === frameCount) resolve();
            };
          }
        });

        if (frames.filter(f => f).length === 0) {
          if (size === sizes[sizes.length - 1]) {
            link.href = _deobf(_k.faviconStatic);
          }
          continue;
        }

        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = size;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        let lastTime = performance.now();
        let current = 0;

        function animate(now) {
          const delta = now - lastTime;
          if (frames.length > 0 && delta >= frameDuration) {
            lastTime = now;
            ctx.clearRect(0, 0, size, size);
            const img = frames[current] || frames[0];
            ctx.drawImage(img, 0, 0, size, size);
            link.href = canvas.toDataURL('image/png');
            current = (current + 1) % frames.length;
          }
          requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
        break;
      }
    }

    startAnimation();
  }

  // Fake network traffic
  function [_fn('network')]() {
    const payloads = ['/api/classroom', '/static/js/main.js', '/u/0/h?t=' + Math.random()];
    fetch(_deobf(_k.gc) + payloads[Math.floor(Math.random() * payloads.length)], {
      method: Math.random() > 0.5 ? 'GET' : 'HEAD'
    }).catch(() => {});
    setTimeout([_fn('network')], Math.random() * 6000 + 3000);
  }

  // Stealth mode
  function [_fn('stealth')]() {
    if (Math.random() < 0.1 * _polySeed) {
      [_fn('white')]();
      setTimeout(() => window.location.reload(), Math.random() * 5000 + 2000);
    }
  }

  // Network interception
  let origFetch = window.fetch;
  window.fetch = async (url, opts) => {
    if (url.match(new RegExp([_k.g, _k.m, _k.t, _k.f].map(_deobf).join('|'), 'i'))) {
      return new Response(JSON.stringify({ status: 'allowed', url: _deobf(_k.gc) }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    return origFetch(url, opts);
  };
  const origXhr = window.XMLHttpRequest.prototype.open;
  window.XMLHttpRequest.prototype.open = function(method, url) {
    if (url.match(new RegExp([_k.g, _k.m, _k.t, _k.f].map(_deobf).join('|'), 'i'))) {
      return;
    }
    return origXhr.apply(this, arguments);
  };

  // DOM mutation observer
  const observer = new MutationObserver(() => {
    if ([_fn('detect')]()) {
      [_fn('white')]();
      [_fn('block')]();
      if (Math.random() < 0.3 * _polySeed) {
        [_fn('error')]();
      }
    }
  });
  observer.observe(document.documentElement, { attributes: true, subtree: true, childList: true });

  // Console protection
  Object.defineProperty(window, 'console', {
    value: { log: () => {}, warn: () => {}, error: () => {}, dir: () => {} },
    writable: false,
    configurable: false
  });
  const devtools = /./;
  devtools.toString = () => 'clean';
  Object.defineProperty(window, 'devtools', { value: devtools, writable: false });

  // Main execution
  document.title = 'Loading...';
  const updateTitle = () => {
    document.title = 'Loading...';
    setTimeout(updateTitle, 6000 + Math.random() * 4000);
  };
  updateTitle();

  [_fn('block')]();
  [_fn('perf')]();
  [_fn('favicon')]();
  [_fn('network')]();
  if ([_fn('detect')]()) {
    [_fn('spoof')]();
    [_fn('white')]();
    [_fn('loadAnim')]();
    [_fn('lock')]();
    [_fn('stealth')]();
  } else {
    [_fn('iframe')]();
    [_fn('loadAnim')]();
    [_fn('lock')]();
    [_fn('stealth')]();
  }
}
