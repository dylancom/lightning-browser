import AsyncStorage from "@react-native-async-storage/async-storage";

import type { Connector } from "./types";
import LNDHub from "./connectors/LNDHub";

type Globals = {
  connector: Connector | null;
  getConnector: () => Promise<Connector | null>;
};

const globals: Globals = {
  connector: null,
  async getConnector() {
    if (this.connector === null) {
      try {
        const value = await AsyncStorage.getItem("@account");
        if (value !== null) {
          const match = value.match(/lndhub:\/\/(\S+):(\S+)@(\S+)/i);
          if (!match) {
            alert("Invalid LNDHub URI");
            return null;
          }
          const login = match[1];
          const password = match[2];
          const url = match[3].replace(/\/$/, "");
          this.connector = new LNDHub({
            login,
            password,
            url,
          });
        }
      } catch (e) {
        if (e instanceof Error) {
          alert(e.message);
        }
      }
    }
    return this.connector;
  },
};

export default globals;
