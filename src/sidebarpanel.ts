import { browser } from 'webextension-polyfill-ts';
import { GemElement, html, render, SheetToken } from '@mantou/gem';

import './elements/panel';
import { changeStore, PanelStore, Path } from './store';

// 不要使用作用域外的变量
const getSelectedGem = function(data: PanelStore): PanelStore | null {
  // 依赖 `constructor`，如果 `constructor` 被破坏，则扩展不能工作
  const tagClass = $0.constructor as typeof GemElement;
  if (tagClass.name in window || !($0 instanceof HTMLElement)) return null;

  const funcToString = (func: Function) => {
    // bound 方法
    if (func.toString() === 'function () { [native code] }') {
      return `function ${func.name} {}`;
    } else {
      return func.toString().replace(/{.*}/, '{}');
    }
  };

  const objToString = (arg: string) => {
    if (arg === null) return 'null';
    switch (typeof arg) {
      case 'function':
        return funcToString(arg);
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
        return funcToString(arg);
      case 'object': {
        if (arg instanceof HTMLElement) {
          return (arg.cloneNode() as HTMLElement).outerHTML.replace('><', '>...<');
        } else if (window.CSSStyleSheet && arg instanceof CSSStyleSheet) {
          return arg.cssRules
            ? Array.from(arg.cssRules)
                .map(rule => rule.cssText)
                .join('\n')
            : '';
        } else if (Array.isArray(arg)) {
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

  const getProps = (obj: any, set = new Set<string>()) => {
    Object.getOwnPropertyNames(obj).forEach(key => {
      if (!key.startsWith('__') && key !== 'constructor') set.add(key);
    });
    const proto = Object.getPrototypeOf(obj);
    if (proto !== HTMLElement.prototype) getProps(proto, set);
    return set;
  };

  const kebabToCamelCase = (str: string) => str.replace(/-(.)/g, (_substr, $1: string) => $1.toUpperCase());
  const attrs: Set<string> = $0.attributes ? new Set([...$0.attributes].map(attr => attr.nodeName)) : new Set();
  const lifecycleMethod = new Set(['willMount', 'render', 'mounted', 'shouldUpdate', 'updated', 'unmounted']);
  const buildInLifecycleMethod = new Set(['connectedCallback', 'attributeChangedCallback', 'disconnectedCallback']);
  const buildInMethod = new Set(['update', 'setState', 'effect']);
  const buildInProperty = new Set(['internals']);
  const buildInAttribute = new Set(['ref']);
  const menber = getProps($0);
  tagClass.observedAttributes?.forEach(attr => {
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
  attrs.forEach(attr => {
    const value = $0.getAttribute(attr);
    data.attributes.push({
      name: attr,
      value: value,
      type: 'string',
      buildIn: buildInAttribute.has(attr) ? 1 : 0,
    });
  });
  tagClass.observedPropertys?.forEach(prop => {
    menber.delete(prop);
    const value = $0[prop];
    const type = typeof value;
    data.observedPropertys.push({
      name: prop,
      value: objectToString(value),
      type,
      path: type === 'object' && value ? [prop] : undefined,
    });
  });
  tagClass.defineEvents?.forEach(prop => {
    menber.delete(prop);
    data.emitters.push({
      name: prop,
      value: objectToString($0[prop]),
      type: 'function',
      path: [prop],
    });
  });
  tagClass.adoptedStyleSheets?.forEach((sheet, index) => {
    data.adoptedStyles.push({
      name: `StyleSheet${index + 1}`,
      value: objectToString(sheet[Object.getOwnPropertySymbols(sheet)[0] as typeof SheetToken]),
      type: 'object',
      path: ['constructor', 'adoptedStyleSheets', String(index)],
    });
  });
  tagClass.observedStores?.forEach((store, index) => {
    data.observedStores.push({
      name: `Store${index + 1}`,
      value: objectToString(store),
      type: 'object',
      path: ['constructor', 'observedStores', String(index)],
    });
  });
  tagClass.defineSlots?.forEach(slot => {
    menber.delete(slot);
    const selector = `[slot=${$0[slot]}]`;
    data.slots.push({
      name: slot,
      value: objectToString($0.querySelector(selector)),
      type: 'element',
      path: ['querySelector', `[slot=${$0[slot]}]`],
    });
  });
  tagClass.defineParts?.forEach(part => {
    menber.delete(part);
    const selector = `[part=${$0[part]}]`;
    data.parts.push({
      name: part,
      value: objectToString(($0.shadowRoot || $0).querySelector(selector)),
      type: 'element',
      path: [['shadowRoot', ''], 'querySelector', selector],
    });
  });
  tagClass.defineRefs?.forEach(ref => {
    menber.delete(ref);
    data.refs.push({
      name: ref,
      value: objectToString($0[ref].element),
      type: 'element',
      path: [['shadowRoot', ''], 'querySelector', `[ref=${$0[ref].ref}]`],
    });
  });
  tagClass.defineCSSStates?.forEach(state => {
    menber.delete(state);
    data.cssStates.push({
      name: state,
      value: $0[state],
      type: 'boolean',
    });
  });
  menber.forEach(key => {
    menber.delete(key);
    // GemElement 不允许覆盖内置生命周期，所以不考虑
    if (buildInLifecycleMethod.has(key)) return;
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
    if (lifecycleMethod.has(key)) {
      data.lifecycleMethod.push({
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
        buildIn: buildInMethod.has(key) ? 2 : 0,
      });
      return;
    }
    data.propertys.push({
      name: key,
      value: objectToString($0[key]),
      type: typeof $0[key],
      path: [key],
      buildIn: buildInProperty.has(key) ? 2 : 0,
    });
  });

  return data;
};

/**
 * execution script in page
 * @param func A function that can be converted into a string and does not rely on external variables
 * @param args Array serializable using JSON
 */
async function execution(func: Function, args: any[]) {
  const [data, error] = await browser.devtools.inspectedWindow.eval(
    `(${func.toString()}).apply(null, ${JSON.stringify(args)})`,
  );
  if (error) {
    throw error;
  }
  return data;
}

async function updateElementProperties() {
  const data = await execution(getSelectedGem, [new PanelStore()]);
  changeStore(data);
}

browser.devtools.panels.elements.onSelectionChanged.addListener(updateElementProperties);
updateElementProperties();
setInterval(updateElementProperties, 300);

addEventListener('valueclick', ({ detail }: CustomEvent<Path>) => {
  const inspectObject = (path: Path, token: string) => {
    // [["shadowRoot", ""], "querySelector", "[ref=child-ref]"]
    // 只有 constructor 函数会当成对象读取
    const value = path.reduce((p, c, index) => {
      if (typeof p === 'function' && path[index - 1] !== 'constructor') {
        if (Array.isArray(c)) {
          return p(...c);
        } else {
          return p(c);
        }
      } else {
        if (Array.isArray(c)) {
          return c.reduce((pp, cc) => pp || (cc === '' ? p : p[cc]), undefined);
        } else {
          const value = p[c];
          return typeof value === 'function' && c !== 'constructor' ? value.bind(p) : value;
        }
      }
    }, $0);
    switch (typeof value) {
      case 'object':
        const symbol = Object.getOwnPropertySymbols(value)[0];
        if (symbol && symbol.toString() === token) {
          console.log(value[symbol]);
        } else {
          console.log(value);
        }
        break;
      default:
        console.dir(value);
        inspect(value);
        break;
    }
  };
  execution(inspectObject, [detail, SheetToken.toString()]);
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
