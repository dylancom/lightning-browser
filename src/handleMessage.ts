import { Alert } from "react-native";
import { WebViewMessageEvent } from "react-native-webview";
import globals from "./globals";

async function handleMessage(
  event: WebViewMessageEvent,
  setLoading: (bool: boolean) => void
) {
  const request = JSON.parse(event.nativeEvent.data);
  switch (request.type) {
    case "payReq": {
      const connector = await globals.getConnector();
      if (connector) {
        Alert.alert(
          "Invoice",
          request.data,
          [
            {
              text: "Pay",
              onPress: async () => {
                setLoading(true);
                connector
                  .sendPayment(request.data)
                  .catch((e) => {
                    Alert.alert(e.message);
                  })
                  .finally(() => {
                    setLoading(false);
                  });
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
