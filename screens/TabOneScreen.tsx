import { useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  Text,
  View,
  StyleSheet,
} from "react-native";
import { WebView } from "react-native-webview";

import { RootTabScreenProps } from "../types";
import injectedJavaScript from "../src/injectedJavaScript";
import handleMessage from "../src/handleMessage";

export default function TabOneScreen({
  navigation,
}: RootTabScreenProps<"TabOne">) {
  const [uri, setUri] = useState("https://fortune.lngames.net/");
  const [loading, setLoading] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.addressBar}>
        <Text>{uri}</Text>
      </View>
      <View style={styles.webView}>
        <WebView
          source={{ uri }}
          injectedJavaScript={injectedJavaScript}
          onMessage={(event) => handleMessage(event, setLoading)}
          scalesPageToFit={false}
        />
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="white" />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  addressBar: {
    borderRadius: 100,
    backgroundColor: "#eee",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 8,
    marginBottom: 8,
  },
  webView: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "center",
    alignItems: "center",
  },
});
