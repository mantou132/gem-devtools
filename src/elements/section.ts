import { attribute, customElement, Emitter, emitter, GemElement, html, property } from '@mantou/gem';

import { Item } from '../store';

@customElement('devtools-section')
export class Section extends GemElement {
  @attribute name: string;
  @property data: Item[] = [];
  @property path: string[];
  @emitter valueclick: Emitter<string[]>;

  renderInspect = (path?: string[]) => {
    if (!path) return '';
    return html`
      <span
        class="inspect"
        @click=${(e: Event) => {
          this.valueclick(path, { composed: true, bubbles: true });
          e.preventDefault();
        }}
        title="Inspect"
      >
        ◉
      </span>
    `;
  };

  renderItem = (data: Item[]) => {
    return html`
      <ul>
        ${data.map(
          e =>
            html`
              <li>
                <span class="name">${e.name}</span>
                <span class="sp">:</span>
                <span class="value ${e.type}">${e.value}</span>
                ${this.renderInspect(e.path)}
              </li>
            `,
        )}
      </ul>
    `;
  };

  render() {
    const { name, data = [] } = this;
    return html`
      <style>
        :host {
          line-height: 1.5;
          cursor: default;
          font-family: sans-serif;
        }
        .inspect {
          cursor: pointer;
          display: inline-block;
          font-family: monospace;
          width: 1em;
          text-align: center;
          flex-shrink: 0;
          user-select: none;
        }
        summary {
          display: flex;
          background: #eee;
          border-bottom: 1px solid #fff;
          border-top: 1px solid #fff;
          padding-right: 1em;
          user-select: none;
        }
        .summary {
          flex-grow: 1;
        }
        summary:hover {
          background: #ddd;
        }
        summary::marker {
          content: '';
        }
        summary::-webkit-details-marker {
          display: none;
        }
        summary::before {
          content: '▸';
          display: inline-block;
          width: 1em;
          text-align: center;
        }
        details[open] summary::before {
          content: '▾';
        }
        .nodata {
          color: gray;
          padding: 0 1em;
          font-style: italic;
        }
        ul {
          margin: 0;
          padding: 0;
          list-style-type: none;
          font-family: monospace;
        }
        li {
          display: flex;
          padding: 0 1em;
        }
        .name {
          color: #75bfff;
        }
        .sp {
          padding: 0 0.2em;
        }
        .value {
          flex-shrink: 1;
          flex-grow: 1;
          color: #999;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .string {
          color: #ff7de9;
        }
        .string:empty::after {
          content: '<empty string>';
          color: #999;
          font-style: italic;
        }
        .number {
          color: #86de74;
        }
        .boolean {
          color: #86de74;
        }
        .object {
          color: #75bfff;
        }
        .function {
          color: #75bfff;
        }
      </style>
      <details open>
        <summary><span class="summary">${name}</span>${this.renderInspect(this.path)}</summary>
        <div>
          ${data.length
            ? this.renderItem(data)
            : html`
                <div class="nodata">no data</div>
              `}
        </div>
      </details>
    `;
  }
}
