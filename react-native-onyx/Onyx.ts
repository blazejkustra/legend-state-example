import {
  beginBatch,
  endBatch,
  mergeIntoObservable,
  observe,
  when,
} from "@legendapp/state";
import { registerLogger } from "./Logger";
import observableData, {
  getObservableDataForKey,
  observableDataSyncState,
} from "./ObservableData";
import { METHOD } from "./OnyxUtils";

let defaultKeyStates: Record<string, any> = {};

function connect({
  key,
  callback,
}: {
  key: string;
  callback: (value: any, key: string) => void;
}) {
  return observe(getObservableDataForKey(key), (e) => {
    callback(e.value, key);
  });
}

function disconnect(connection: () => void) {
  connection();
}

function set(key: string, value: any) {
  if (value === null) {
    return getObservableDataForKey(key).delete();
  }

  getObservableDataForKey(key).set(value);
}

function multiSet(values: Record<string, any>) {
  beginBatch();
  for (const [key, value] of Object.entries(values)) {
    set(key, value);
  }
  endBatch();
}

function merge(key: string, value: any) {
  if (value === null) {
    return getObservableDataForKey(key).delete();
  }

  mergeIntoObservable(getObservableDataForKey(key), value);
}

function mergeCollection(_key: string, values: Record<string, any>) {
  beginBatch();
  for (const [key, value] of Object.entries(values)) {
    merge(key, value);
  }
  endBatch();
}

function setCollection(key: string, values: Record<string, any>) {
  getObservableDataForKey(key).set(values);
}

function update(
  updates: {
    onyxMethod: (typeof METHOD)[keyof typeof METHOD];
    key: string;
    value: any;
  }[]
) {
  beginBatch();
  for (const { onyxMethod, key, value } of updates) {
    switch (onyxMethod) {
      case METHOD.SET:
        set(key, value);
        break;
      case METHOD.MERGE:
        merge(key, value);
        break;
      case METHOD.MERGE_COLLECTION:
        mergeCollection(key, value);
        break;
      case METHOD.SET_COLLECTION:
        setCollection(key, value);
        break;
      case METHOD.MULTI_SET:
        multiSet(value);
        break;
      case METHOD.CLEAR:
        clear();
        break;
      default:
        throw new Error(`Invalid onyx method: ${onyxMethod}`);
    }
  }
  endBatch();
}

function clear() {
  observableData.set({ ...defaultKeyStates });
}

function init({
  keys = {},
  initialKeyStates = {},
}: {
  keys: Record<string, any>;
  initialKeyStates: Record<string, any>;
}) {
  defaultKeyStates = { ...initialKeyStates };

  when(observableDataSyncState.isPersistLoaded, () => {
    if (Object.keys(observableData.get()).length === 0) {
      observableData.set(initialKeyStates);
    }
  });
}

function get(key: string) {
  return getObservableDataForKey(key).get();
}

const Onyx = {
  METHOD,
  connect,
  disconnect,
  set,
  multiSet,
  merge,
  mergeCollection,
  setCollection,
  update,
  clear,
  init,
  registerLogger,
  get,
};

(globalThis as any).Onyx = Onyx;
(globalThis as any).onyxData = observableData;

export default Onyx;

// TODO:
// - Evictable keys
// - Snapshots
// - persistence
