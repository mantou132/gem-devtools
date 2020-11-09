type DevToolsHook = any;

interface Window {
  __GEM_DEVTOOLS__HOOK__: DevToolsHook;
}

// 序列化后在 page 中执行
function initDevToolsHook() {
  window.__GEM_DEVTOOLS__HOOK__ = {} as DevToolsHook;
}

const script = document.createElement('script');
script.textContent = `(${initDevToolsHook.toString()})()`;
document.documentElement.append(script);
script.remove();
