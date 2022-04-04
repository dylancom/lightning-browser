export interface Connector {
  getInfo(): Promise<{ alias: string }>;
  getBalance(): Promise<{ balance: number }>;
  sendPayment(paymentRequest: string): Promise<void>;
}
