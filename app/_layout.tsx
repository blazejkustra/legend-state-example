// app/OnyxTest.tsx
import Onyx, { useOnyx } from "@/react-native-legend-onyx";
import React from "react";
import { Button, ScrollView, Text, View } from "react-native";

const ONYXKEYS = {
  TEST: "test",
  COLLECTION: {
    REPORTS: "reports_",
  },
};

Onyx.init({
  keys: ONYXKEYS,
  initialKeyStates: {
    test: "test",
    reports_: {
      reports_1: { name: "report 1" },
      reports_2: { name: "report 2" },
    },
  },
});

export default function OnyxTest() {
  const [testValue, { status: testStatus }] = useOnyx("test");
  const [reports, { status: reportsStatus }] = useOnyx("reports_");

  if (testStatus === "loading" || reportsStatus === "loading") {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <View style={{ marginTop: 20 }}>
        <Button
          title="Set 'test' to 'Hello World'"
          onPress={() => Onyx.set("test", "Hello World")}
        />

        <Button
          title="MultiSet test & reports"
          onPress={() =>
            Onyx.multiSet({
              test: "multi-set value",
              reports_: {
                reports_3: { name: "report 3" },
              },
            })
          }
        />

        <Button
          title="Merge into reports_1"
          onPress={() =>
            Onyx.merge("reports_", {
              reports_1: { name: "Updated Report 1", updated: true },
            })
          }
        />

        <Button
          title="MergeCollection to reports_"
          onPress={() =>
            Onyx.mergeCollection("reports_", {
              reports_2: { merged: true },
              reports_4: { name: "report 4" },
            })
          }
        />

        <Button
          title="SetCollection to reports_"
          onPress={() =>
            Onyx.setCollection("reports_", {
              reports_10: { name: "Overwritten reports" },
            })
          }
        />

        <Button
          title="Use update() with various methods"
          onPress={() =>
            Onyx.update([
              {
                onyxMethod: Onyx.METHOD.SET,
                key: "test",
                value: "Updated via update()",
              },
              {
                onyxMethod: Onyx.METHOD.MERGE,
                key: "reports_",
                value: { reports_1: { updatedAgain: true } },
              },
            ])
          }
        />

        <Button title="Reset to Initial State" onPress={() => Onyx.clear()} />
        <Text style={{ fontWeight: "bold", marginBottom: 10 }}>Onyx Test</Text>
        <Text>test: {JSON.stringify(testValue)}</Text>
        <Text>reports_: {JSON.stringify(reports)}</Text>
      </View>
    </ScrollView>
  );
}
