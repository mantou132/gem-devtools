import { GemElement, html, render } from '@mantou/gem';
import { browser } from 'webextension-polyfill-ts';

import './elements/panel';
import { changeStore, PanelStore } from './store';

// 不要使用作用域外的变量
const getSelectedGem = function(): PanelStore | null {
  const tagClass = $0.constructor as typeof GemElement;
  if (tagClass.name in window || !($0 instanceof HTMLElement)) return null;

  const objToString = (arg: string) => {
    if (arg === null) return 'null';
    switch (typeof arg) {
      case 'function':
        return `fn ()`;
      case 'object':
        return '{...}';
      case 'string':
        return `"${String(arg)}"`;
      default:
        return String(arg);
    }
  };

  const objectToString = (arg: any) => {
    if (arg === null) return 'null';
    switch (typeof arg) {
      case 'function':
        return `function ${arg.name}()`;
      case 'object': {
        if (Array.isArray(arg)) {
          return `[${arg.map(objToString)}]`;
        } else {
          let result = '{';
          Object.keys(arg).forEach((key, index) => {
            result += `${index ? ',' : ''} ${key}: ${objToString(arg[key])}`;
          });
          return result + '}';
        }
      }
      default:
        return String(arg);
    }
  };

  const data: PanelStore = {
    isGemElement: true,
    observedAttributes: [],
    observedPropertys: [],
    observedStores: [],
    lifecycleMethod: [],
    state: [],
    method: [],
    propertys: [],
    attributes: [],
  };
  const kebabToCamelCase = (str: string) => str.replace(/-(.)/g, (_substr, $1: string) => $1.toUpperCase());
  const attrs: Set<string> = $0.attributes ? new Set([...$0.attributes].map(attr => attr.nodeName)) : new Set();
  const menber: Set<string> = new Set();
  for (const key in $0) {
    if (!key.startsWith('__') && !(key in HTMLElement.prototype)) {
      menber.add(key);
    }
  }
  if (tagClass.observedAttributes) {
    tagClass.observedAttributes.forEach(attr => {
      const prop = kebabToCamelCase(attr);
      const value = $0[prop];
      menber.delete(prop);
      attrs.delete(attr);
      data.observedAttributes.push({
        name: attr,
        value: String(value),
        type: typeof value,
      });
    });
  }
  attrs.forEach(attr => {
    data.attributes.push({
      name: attr,
      value: $0.getAttribute(attr),
      type: 'string',
    });
  });
  if (tagClass.observedPropertys) {
    tagClass.observedPropertys.forEach(prop => {
      menber.delete(prop);
      const value = $0[prop];
      const type = typeof value;
      data.observedPropertys?.push({
        name: prop,
        value: objectToString(value),
        type,
        path: type === 'object' && value ? [prop] : undefined,
      });
    });
  }
  if (tagClass.observedStores) {
    tagClass.observedStores.forEach((store, index) => {
      data.observedStores?.push({
        name: `Store${index + 1}`,
        value: objectToString(store),
        type: 'object',
        path: ['constructor', 'observedStores', String(index)],
      });
    });
  }
  menber.forEach(key => {
    menber.delete(key);
    if (['update', 'setState', 'effect'].includes(key)) return;
    if (key === 'state') {
      $0.state &&
        Object.keys($0.state).forEach(k => {
          const value = $0.state[k];
          data.state.push({
            name: k,
            value: objectToString(value),
            type: typeof value,
          });
        });
      return;
    }
    const lifecycleMethod = ['willMount', 'render', 'mounted', 'shouldUpdate', 'updated', 'unmounted'];
    if (lifecycleMethod.includes(key)) {
      data.lifecycleMethod?.push({
        name: key,
        value: objectToString($0[key]),
        type: 'function',
        path: [key],
      });
      return;
    }
    if (typeof $0[key] === 'function') {
      data.method.push({
        name: key,
        value: objectToString($0[key]),
        type: 'function',
        path: [key],
      });
      return;
    }
    data.propertys.push({
      name: key,
      value: objectToString($0[key]),
      type: typeof $0[key],
      path: [key],
    });
  });

  return data;
};

async function updateElementProperties() {
  const [data, error] = await browser.devtools.inspectedWindow.eval(`(${getSelectedGem.toString()})()`);
  if (error) return;
  changeStore(data);
}

browser.devtools.panels.elements.onSelectionChanged.addListener(updateElementProperties);
updateElementProperties();
setInterval(updateElementProperties, 300);

addEventListener('valueclick', ({ detail }: CustomEvent<string[]>) => {
  const inspectObject = (path: string[]) => {
    const value = path.reduce((p, c) => p[c], $0);
    switch (typeof value) {
      case 'object':
        return console.log(value);
      default:
        return inspect(value);
    }
  };
  browser.devtools.inspectedWindow.eval(`(${inspectObject.toString()})(${JSON.stringify(detail)})`);
});

render(
  html`
    <style>
      body {
        margin: 0;
      }
    </style>
    <devtools-panel></devtools-panel>
  `,
  document.body,
);
