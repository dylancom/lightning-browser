import { StyleSheet } from "react-native";
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
  return (
    <WebView
      source={{ uri: "https://fortune.lngames.net/" }}
      injectedJavaScript={js}
      onMessage={(event) => {
        const message = JSON.parse(event.nativeEvent.data);
        switch (message.type) {
          case "payReq":
            alert(`should pay: ${message.data}`);
            break;
          default:
            break;
        }
      }}
      style={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
