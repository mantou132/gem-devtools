import "https://dev.jspm.io/webextension-polyfill";

const getSelectedGem = function() {
  /**
   * @type HTMLElement
   */
  const data = {'<spec>': {}, __proto__: null};
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

  window.$g = data;
  return data;
};

chrome.devtools.panels.elements.createSidebarPane("Gem", function(sidebar) {
  function updateElementProperties() {
    sidebar.setExpression(
      "(" + getSelectedGem.toString() + ")()",
      "Properties"
    );
  }
  updateElementProperties();
  chrome.devtools.panels.elements.onSelectionChanged.addListener(
    updateElementProperties
  );
});
