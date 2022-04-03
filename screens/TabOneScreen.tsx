import { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

import { RootTabScreenProps } from "../types";
const js = `
// Intercept any lightning: requests
window.addEventListener("click", (event) => {
  const target = event.target;
  if (!target || !target.closest) {
    return;
  }
  const lightningLink = target.closest('[href^="lightning:" i]');
  if (!lightningLink) {
    return;
  }
  event.preventDefault();

  const href = lightningLink.getAttribute("href").toLowerCase();
  const paymentRequest = href.replace("lightning:", "");
  window.ReactNativeWebView.postMessage(JSON.stringify({
    type: "payReq",
    data: paymentRequest
  }));
});  
`;

export default function TabOneScreen({
  navigation,
}: RootTabScreenProps<"TabOne">) {
  const [uri, setUri] = useState("https://fortune.lngames.net/");

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri }}
        injectedJavaScript={js}
        onMessage={(event) => {
          const request = JSON.parse(event.nativeEvent.data);
          switch (request.type) {
            case "payReq":
              alert(`should pay: ${request.data}`);
              break;
            default:
              break;
          }
        }}
      />
      <View style={styles.addressBar}>
        <Text>{uri}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addressBar: {
    borderRadius: 100,
    backgroundColor: "white",
    padding: 16,
    margin: 8,
  },
});
