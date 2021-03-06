import { html, render } from '@mantou/gem';

import './elements/panel';
import { changeStore } from './store';

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

changeStore({
  observedAttributes: [
    { name: 'song-id', value: String(Date.now()), type: 'number' },
    { name: 'id', value: '', type: 'string' },
  ],
  observedPropertys: [
    { name: 'list', value: '[1, 2]', type: 'object' },
    { name: 'config', value: '{a: "https://gem-docs.netlify.app/#are-you-ready"}', type: 'object' },
  ],
  observedStores: [{ name: 'store', value: '{...}', type: 'object' }],
  lifecycleMethod: [{ name: 'render', value: 'function ()', type: 'function' }],
  method: [{ name: 'click', value: 'function ()', type: 'function' }],
  state: [{ name: 'loaded', value: true, type: 'boolean' }],
  propertys: [
    { name: 'mute', value: 'true', type: 'boolean' },
    { name: 'data', value: 'null', type: 'object' },
  ],
  attributes: [{ name: 'title', value: 'Song ID', type: 'string' }],
});
