import { connectStore, customElement, GemElement, html } from '@mantou/gem';

import { panelStore } from '../store';

import './section';

@customElement('devtools-panel')
@connectStore(panelStore)
export class Panel extends GemElement {
  render() {
    if (!panelStore.isGemElement) {
      return html`
        <style>
          :host {
            display: block;
            text-align: center;
            color: #999;
            font-style: italic;
            padding: 2em;
          }
        </style>
        Not is GemElement
      `;
    }
    return html`
      <style>
        :host {
          font-size: 14px;
        }
      </style>
      <devtools-section name="Observed Attributes" .data=${panelStore.observedAttributes}></devtools-section>
      <devtools-section name="Observed Propertys" .data=${panelStore.observedPropertys}></devtools-section>
      <devtools-section name="Observed Stores" .data=${panelStore.observedStores}></devtools-section>
      <devtools-section name="Lifecycle Method" .data=${panelStore.lifecycleMethod}></devtools-section>
      <devtools-section name="State" .path=${['state']} .data=${panelStore.state}></devtools-section>
      <devtools-section name="Method" .data=${panelStore.method}></devtools-section>
      <devtools-section name="Propertys" .data=${panelStore.propertys}></devtools-section>
      <devtools-section name="Attributes" .data=${panelStore.attributes}></devtools-section>
    `;
  }
}
