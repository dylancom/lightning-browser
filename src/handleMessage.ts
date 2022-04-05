import { Alert } from "react-native";
import { WebView, WebViewMessageEvent } from "react-native-webview";
import globals from "./globals";

const injectResponseToWebView = (
  webview: WebView,
  id: number,
  inject: string | Error
) => {
  webview.injectJavaScript(
    `document.dispatchEvent(
      new CustomEvent("webln", {
        detail: {
          id: "${id}",
          data: ${
            inject instanceof Error ? `new Error("${inject.message}")` : inject
          }
        }
      })
    );`
  );
};

async function handleMessage(webview: WebView, event: WebViewMessageEvent) {
  const request = JSON.parse(event.nativeEvent.data);
  const id = request.id;

  switch (request.type) {
    case "sendPayment": {
      const connector = await globals.getConnector();
      if (connector) {
        Alert.alert(
          "Invoice",
          request.data,
          [
            {
              text: "Pay",
              onPress: async () => {
                try {
                  const response = await connector.sendPayment(request.data);
                  injectResponseToWebView(
                    webview,
                    id,
                    JSON.stringify(response)
                  );
                } catch (e) {
                  if (e instanceof Error) {
                    injectResponseToWebView(webview, id, new Error(e.message));
                  }
                }
              },
            },
            {
              text: "Cancel",
              style: "cancel",
            },
          ],
          {
            cancelable: true,
          }
        );
      } else {
        Alert.alert("Please sign in to your account.");
      }
      break;
    }
    default:
      break;
  }
}

export default handleMessage;
