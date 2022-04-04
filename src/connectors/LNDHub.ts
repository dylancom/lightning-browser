import axios, { AxiosRequestConfig, Method } from "axios";

interface Config {
  login: string;
  password: string;
  url: string;
}

class LNDHub {
  config: Config;
  access_token?: string;
  access_token_created?: number;
  refresh_token?: string;
  refresh_token_created?: number;
  noRetry?: boolean;

  constructor(config: Config) {
    this.config = config;
  }

  async getInfo() {
    const data = await this.request<{ alias: string }>(
      "GET",
      "/getinfo",
      undefined,
      {}
    );
    return {
      alias: data.alias,
    };
  }

  async getBalance() {
    const data = await this.request<{ BTC: { AvailableBalance: number } }>(
      "GET",
      "/balance",
      undefined,
      {}
    );
    return {
      balance: data.BTC.AvailableBalance,
    };
  }

  async sendPayment(paymentRequest: string) {
    const data = await this.request<{
      error?: string;
      message: string;
      payment_error?: string;
      payment_hash:
        | {
            type: string;
            data: ArrayBuffer;
          }
        | string;
      payment_preimage:
        | {
            type: string;
            data: ArrayBuffer;
          }
        | string;
      payment_route?: { total_amt: number; total_fees: number };
    }>("POST", "/payinvoice", {
      invoice: paymentRequest,
    });
  }

  async authorize() {
    const headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Access-Control-Allow-Origin", "*");
    headers.append("Content-Type", "application/json");
    return fetch(this.config.url + "/auth?type=auth", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        login: this.config.login,
        password: this.config.password,
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("API error: " + response.status);
        }
      })
      .then((json) => {
        if (json && json.error) {
          throw new Error(
            "API error: " + json.message + " (code " + json.code + ")"
          );
        }
        if (!json.access_token || !json.refresh_token) {
          throw new Error("API unexpected response: " + JSON.stringify(json));
        }

        this.refresh_token = json.refresh_token;
        this.access_token = json.access_token;
        this.refresh_token_created = +new Date();
        this.access_token_created = +new Date();
        return json;
      });
  }

  async request<Type>(
    method: Method,
    path: string,
    args?: Record<string, unknown>,
    defaultValues?: Record<string, unknown>
  ): Promise<Type> {
    if (!this.access_token) {
      await this.authorize();
    }

    const reqConfig: AxiosRequestConfig = {
      method,
      url: this.config.url + path,
      responseType: "json",
      headers: {
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.access_token}`,
      },
    };
    if (method === "POST") {
      reqConfig.data = args;
    } else if (args !== undefined) {
      reqConfig.params = args;
    }
    let data;
    try {
      const res = await axios(reqConfig);
      data = res.data;
    } catch (e) {
      console.log(e);
      if (e instanceof Error) throw new Error(e.message);
    }
    if (data && data.error) {
      if (data.code * 1 === 1 && !this.noRetry) {
        try {
          await this.authorize();
        } catch (e) {
          console.log(e);
          if (e instanceof Error) throw new Error(e.message);
        }
        this.noRetry = true;
        return this.request(method, path, args, defaultValues);
      } else {
        throw new Error(data.message);
      }
    }
    if (defaultValues) {
      data = Object.assign(Object.assign({}, defaultValues), data);
    }
    return data;
  }
}

export default LNDHub;
