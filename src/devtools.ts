import { browser } from 'webextension-polyfill-ts';

const getSelectedGem = function() {
  const data: { [index: string]: any } = { '<spec>': {}, __proto__: null };
  // 看不到 getter
  for (const key in $0) {
    if ($0.constructor.name in window) {
      if ($0.hasOwnProperty(key) && !(key in HTMLElement.prototype)) {
        data[key] = $0[key];
      } else {
        data['<spec>'][key] = $0[key];
      }
    } else {
      if (key in HTMLElement.prototype) {
        data['<spec>'][key] = $0[key];
      } else {
        data[key] = $0[key];
      }
    }
  }

  return data;
};

browser.devtools.panels.elements.createSidebarPane('Gem').then(function(sidebar) {
  function updateElementProperties() {
    sidebar.setExpression(`(${getSelectedGem.toString()})()`, 'Properties');
  }
  updateElementProperties();
  (browser.devtools.panels.elements as any).onSelectionChanged.addListener(updateElementProperties);
});
