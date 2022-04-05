import { useState, useRef } from "react";
import { SafeAreaView, View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { Searchbar } from "react-native-paper";

import { RootTabScreenProps } from "../../types";
import injectedJavaScript from "../injectedJavaScript";
import handleMessage from "../handleMessage";

const DEFAULT_WEBSITE = "https://fortune.lngames.net/";

export default function TabOneScreen({
  navigation,
}: RootTabScreenProps<"TabOne">) {
  const webview = useRef<WebView>(null);
  const [searchQuery, setSearchQuery] = useState(DEFAULT_WEBSITE);
  const [uri, setUri] = useState(DEFAULT_WEBSITE);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.addressBar}>
        <Searchbar
          placeholder="Enter a URL"
          onChangeText={setSearchQuery}
          onSubmitEditing={({ nativeEvent: { text } }) => setUri(text)}
          value={searchQuery}
        />
      </View>
      <View style={styles.webView}>
        <WebView
          ref={webview}
          source={{ uri }}
          injectedJavaScript={injectedJavaScript}
          onMessage={(event) => handleMessage(webview.current!, event)}
          scalesPageToFit={false}
        />
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
    paddingHorizontal: 16,
    paddingVertical: 8,
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
