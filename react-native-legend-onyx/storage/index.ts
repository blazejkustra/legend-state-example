import { observable } from "@legendapp/state";
import { observablePersistAsyncStorage } from "@legendapp/state/persist-plugins/async-storage";
import { configureSynced } from "@legendapp/state/sync";
import AsyncStorage from "@react-native-async-storage/async-storage/lib/commonjs/AsyncStorage";
import { OnyxData } from "./types";

const persistOptions = configureSynced({
  persist: {
    plugin: observablePersistAsyncStorage({
      AsyncStorage,
    }),
  },
});

const observableData = observable<OnyxData>(
  persistOptions({
    initial: {},
    persist: {
      name: "legend-onyx",
    },
  })
);

export default observableData;
