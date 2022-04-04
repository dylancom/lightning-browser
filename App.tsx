import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  DefaultTheme as PaperDefaultTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";

import useCachedResources from "./hooks/useCachedResources";
// import useColorScheme from "./hooks/useColorScheme";
import RootNavigator from "./navigation";
import LinkingConfiguration from "./navigation/LinkingConfiguration";

const CombinedDefaultTheme = {
  ...PaperDefaultTheme,
  ...NavigationDefaultTheme,
  colors: {
    ...PaperDefaultTheme.colors,
    ...NavigationDefaultTheme.colors,
    primary: "#F8C455",
    // accent: "",
  },
};

export default function App() {
  const isLoadingComplete = useCachedResources();
  // const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <PaperProvider theme={CombinedDefaultTheme}>
        <SafeAreaProvider>
          <NavigationContainer
            linking={LinkingConfiguration}
            theme={CombinedDefaultTheme}
          >
            <RootNavigator />
          </NavigationContainer>
          <StatusBar />
        </SafeAreaProvider>
      </PaperProvider>
    );
  }
}
