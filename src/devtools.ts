import { browser } from 'webextension-polyfill-ts';

browser.devtools.panels.elements.createSidebarPane('Gem').then((sidebar) => {
  sidebar.setPage('sidebarpanel.html');
});
