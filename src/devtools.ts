// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
// https://github.com/mozilla/webextension-polyfill/issues/246
chrome.devtools.panels.elements.createSidebarPane('Gem', sidebar => {
  sidebar.setPage('sidebarpanel.html');
});
