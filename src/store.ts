import { createStore, updateStore } from '@mantou/gem';

const any: any = '';
const types = typeof any;

export interface Item {
  value: string | number | boolean;
  name: string;
  type: typeof types;
  path?: string[];
}

export class PanelStore {
  isGemElement = true;
  observedAttributes: Item[] = [];
  observedPropertys: Item[] = [];
  observedStores: Item[] = [];
  lifecycleMethod: Item[] = [];
  state: Item[] = [];
  method: Item[] = [];
  propertys: Item[] = [];
  attributes: Item[] = [];
}

export const panelStore = createStore({ ...new PanelStore(), isGemElement: false });

export function changeStore(panel: Partial<PanelStore> | null) {
  if (panel === null) {
    updateStore(panelStore, { isGemElement: false });
  } else {
    updateStore(panelStore, {
      ...new PanelStore(),
      ...panel,
    });
  }
}
