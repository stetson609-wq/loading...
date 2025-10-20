// Custom obfuscator: Seeded XOR encryption
const _seed = 0x9a;
const _obf = (s) => s.split('').map(c => String.fromCharCode(c.charCodeAt(0) ^ _seed)).join('');
const _deobf = (s) => _obf(s); // XOR is reversible
const _k = {
  g: _obf('goguardian'), m: _obf('monitor'), e: _obf('extension'), t: _obf('tracking'),
  f: _obf('filter'), st: _obf('session-teacher'), gc: _obf('https://classroom.google.com/u/0/h'),
  if: _obf('https://login.nsd160.org/math/'), err: _obf('Error: Access Denied')
};

// Dynamic function name generator
const _fn = (base) => base + Math.random().toString(36).substr(2, 7);

// Polymorphic execution seed
const _polySeed = Math.random();

// Fake browser fingerprint
function spoofFingerprint() {
  Object.defineProperty(navigator, 'userAgent', {
    get: () => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    configurable: false
  });
  Object.defineProperty(navigator, 'platform', { get: () => 'Win32', configurable: false });
}

function [_fn('detect')]() {
  const signals = [];
  signals.push(navigator.userAgent.toLowerCase().match(new RegExp([_k.g, _k.m, _k.e, _k.f].map(_deobf).join('|'), 'i')));
  signals.push(document.cookie.toLowerCase().match(new RegExp([_k.g, _k.m, _k.st].map(_deobf).join('|'), 'i')));
  signals.push(localStorage.getItem(_deobf(_k.g)) || sessionStorage.getItem(_deobf(_k.m)));
  signals.push(document.querySelectorAll(`script[src*="${_deobf(_k.g)}"], script[src*="${_deobf(_k.m)}"], meta[name*="${_deobf(_k.m)}"], div[id*="${_deobf(_k.e)}"]`).length > 0);
  if (window.chrome?.runtime || window.browser?.runtime) signals.push(true);
  // Check for monitoring via performance timing
  if (performance.timing.navigationStart < Date.now() - 60000) signals.push(true);
  return signals.some(s => s);
}

function [_fn('spoof')]() {
  const meta = document.createElement('meta');
  meta.httpEquiv = 'refresh';
  meta.content = `0;url=${_deobf(_k.gc)}`;
  document.head.appendChild(meta);
  history.replaceState(null, document.title, '/u/0/h');
  // Decoy DOM elements
  const decoy = document.createElement('div');
  decoy.id = 'decoy-' + Math.random().toString(36).substr(2, 9);
  decoy.style.display = 'none';
  decoy.innerHTML = '<span>Google Classroom Content Loading...</span>';
  document.body.appendChild(decoy);
}

function [_fn('white')]() {
  document.documentElement.innerHTML = '<body style="margin:0;background:white;height:100vh;width:100vw;overflow:hidden;"><span style="color:rgba(255,255,255,0);font-size:0;">Loading Google Classroom...</span></body>';
}

function [_fn('error')]() {
  document.documentElement.innerHTML = `<body style="margin:0;background:#f8f8f8;height:100vh;width:100vw;display:flex;justify-content:center;align-items:center;font-family:Arial,sans-serif;"><div style="text-align:center;color:#333;"><h1>${_deobf(_k.err)}</h1><p>Please contact your administrator.</p></div></body>`;
}

function [_fn('iframe')]() {
  document.body.innerHTML = '';
  // Triple-layered shadow DOM
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
  iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox');
  iframe.setAttribute('referrerpolicy', 'no-referrer');
  iframe.setAttribute('loading', 'eager');
  iframe.setAttribute('data-obf', Math.random().toString(36).substr(2, 9));

  // Block iframe inspection
  Object.defineProperty(iframe, 'contentWindow', { get: () => undefined, configurable: false });
  Object.defineProperty(iframe, 'contentDocument', { get: () => undefined, configurable: false });

  // Decoy iframes
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
    }
  };

  innerShadow.appendChild(iframe);
  midShadow.appendChild(innerHost);
  outerShadow.appendChild(midHost);
  document.body.appendChild(outerHost);
  document.body.style.cssText = 'margin:0;overflow:hidden;will-change:transform;transform:translateZ(0);';

  // Hide shadow DOMs
  [outerHost, midHost, innerHost].forEach(host => {
    Object.defineProperty(host, 'shadowRoot', { get: () => undefined, configurable: false });
  });

  // Dynamic CSS obfuscation
  const style = document.createElement('style');
  style.textContent = `*[data-obf]{${Math.random() > 0.5 ? 'transform:scale(1);' : 'opacity:1;'}}`;
  outerShadow.appendChild(style);
}

function [_fn('lock')]() {
  // Block all navigation and closure attempts
  ['beforeunload', 'unload', 'pagehide', 'visibilitychange'].forEach(evt => {
    window.addEventListener(evt, e => {
      e.preventDefault();
      e.stopPropagation();
      if (evt === 'beforeunload') e.returnValue = '';
    }, { capture: true });
  });

  // Block keyboard shortcuts, context menu, and mouse actions
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

  // Override critical APIs
  Object.defineProperty(window, 'close', { value: () => {}, writable: false, configurable: false });
  Object.defineProperty(window, 'open', { value: () => null, writable: false, configurable: false });
  Object.defineProperty(document, 'visibilityState', { get: () => 'visible', configurable: false });
  Object.defineProperty(document, 'hasFocus', { value: () => true, writable: false, configurable: false });

  // Block extension commands
  if (window.chrome?.runtime) {
    window.chrome.runtime.sendMessage = () => {};
    window.chrome.runtime.connect = () => ({ onMessage: { addListener: () => {} } });
  }

  // Multi-tiered watchdog
  const watchdog = () => {
    if (document.visibilityState !== 'visible' || !document.hasFocus()) {
      // Simulate user activity
      ['mousemove', 'keydown', 'click'].forEach(type => {
        const event = new Event(type);
        window.dispatchEvent(event);
      });
    }
    // Check code integrity
    if (window.fetch !== origFetch) {
      window.location.reload(); // Reload if tampered
    }
    // Clean suspicious elements
    Array.from(document.querySelectorAll('script:not([data-obf]),meta:not([data-obf])')).forEach(el => el.remove());
  };
  setInterval(watchdog, Math.random() * 1500 + 500);
}

function [_fn('block')]() {
  // Clean suspicious scripts
  Array.from(document.scripts).forEach(script => {
    if (script.src.match(new RegExp([_k.g, _k.m, _k.e, _k.f, _k.t].map(_deobf).join('|'), 'i')) || !script.src.includes(location.host)) {
      script.remove();
    }
  });
  // Neutralize browser APIs
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
  // Permissive CSP
  const metaCsp = document.createElement('meta');
  metaCsp.httpEquiv = 'Content-Security-Policy';
  metaCsp.content = 'default-src *; script-src *; connect-src *; frame-src *;';
  metaCsp.setAttribute('data-obf', Math.random().toString(36).substr(2, 9));
  document.head.appendChild(metaCsp);
}

function [_fn('perf')]() {
  let lastFrame = performance.now();
  function frameLoop() {
    const now = performance.now();
    if (now - lastFrame > 14) { // ~70fps cap
      lastFrame = now;
    }
    requestAnimationFrame(frameLoop);
  }
  requestAnimationFrame(frameLoop);
  document.body.style.willChange = 'transform';
  document.body.style.transform = 'translateZ(0)';
  // Adaptive timer overrides
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

function [_fn('stealth')]() {
  // Pause suspicious activity during high-risk periods
  if (Math.random() < 0.1 * _polySeed) {
    [_fn('white')]();
    setTimeout(() => window.location.reload(), Math.random() * 5000 + 2000);
  }
}

// Network interception and fake traffic
let origFetch = window.fetch;
(function() {
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
  // Fake network traffic
  const fakeTraffic = () => {
    const payloads = ['/api/classroom', '/static/js/main.js', '/u/0/h?t=' + Math.random()];
    fetch(_deobf(_k.gc) + payloads[Math.floor(Math.random() * payloads.length)], {
      method: Math.random() > 0.5 ? 'GET' : 'HEAD'
    }).catch(() => {});
    setTimeout(fakeTraffic, Math.random() * 6000 + 3000);
  };
  fakeTraffic();
})();

// DOM mutation observer
const observer = new MutationObserver((mutations) => {
  if ([_fn('detect')]()) {
    [_fn('white')]();
    [_fn('block')]();
    if (Math.random() < 0.3 * _polySeed) {
      [_fn('error')]();
    }
  }
});
observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true });

// Console and devtools protection
(function() {
  Object.defineProperty(window, 'console', {
    value: { log: () => {}, warn: () => {}, error: () => {}, dir: () => {} },
    writable: false,
    configurable: false
  });
  const devtools = /./;
  devtools.toString = () => 'clean';
  Object.defineProperty(window, 'devtools', { value: devtools, writable: false, configurable: false });
})();

// Main execution
(function() {
  spoofFingerprint();
  [_fn('block')]();
  [_fn('perf')]();
  if ([_fn('detect')]()) {
    [_fn('spoof')]();
    [_fn('white')]();
    [_fn('lock')]();
    [_fn('stealth')]();
  } else {
    [_fn('iframe')]();
    [_fn('lock')]();
    [_fn('stealth')]();
  }
})();
