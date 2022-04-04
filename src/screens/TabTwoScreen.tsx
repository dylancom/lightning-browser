import { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Avatar,
  Button,
  Card,
  Divider,
  Title,
  TextInput,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

import globals from "../globals";

export default function TabTwoScreen() {
  const [loading, setLoading] = useState(false);
  const [uri, setUri] = useState("");
  const [alias, setAlias] = useState("");
  const [balance, setBalance] = useState("");

  useEffect(() => {
    getAccountInfo();
  }, []);

  async function getAccountInfo() {
    setLoading(true);
    const connector = await globals.getConnector();
    if (connector) {
      try {
        const [infoRes, balanceRes] = await Promise.all([
          connector.getInfo(),
          connector.getBalance(),
        ]);
        setAlias(infoRes.alias);
        setBalance(`${balanceRes.balance} sats`);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }

  async function handleSignIn() {
    try {
      await AsyncStorage.setItem("@account", uri);
      await getAccountInfo();
      setUri("");
    } catch (e) {
      console.error(e);
    }
  }

  async function handleSignOut() {
    try {
      await AsyncStorage.removeItem("@account");
      globals.connector = null;
      setAlias("");
      setBalance("");
    } catch (e) {
      console.error(e);
    }
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!alias ? (
        <Card elevation={2}>
          <Card.Content>
            <Title>Connect to LNDHub</Title>
            <TextInput
              mode="outlined"
              autoComplete={false}
              label="LNDHub Export URI"
              secureTextEntry
              value={uri}
              onChangeText={(text) => setUri(text)}
              style={{ marginVertical: 16 }}
            />
          </Card.Content>
          <Divider />
          <Card.Actions style={{ justifyContent: "flex-end" }}>
            <Button mode="contained" onPress={handleSignIn}>
              Sign in
            </Button>
          </Card.Actions>
        </Card>
      ) : (
        <Card elevation={2}>
          <Card.Title
            title={alias}
            subtitle={balance}
            left={(props) => <Avatar.Icon {...props} icon="account" />}
          />
          <Divider />
          <Card.Actions style={{ justifyContent: "flex-end" }}>
            <Button mode="contained" onPress={handleSignOut}>
              Sign out
            </Button>
          </Card.Actions>
        </Card>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
