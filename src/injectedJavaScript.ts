export default `(() => {
  // Prevent zooming
  const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta);

  const WebLNPromiseCallback = {};
  const timeout = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));
  let requestId = 0;
  const postMessage = async (message, waitForCallback = true) => {
    const currentId = requestId++;
    window.ReactNativeWebView.postMessage(JSON.stringify({
      ...message,
      id: currentId,
    }));
    if (!waitForCallback) {
      return;
    }
    while (!WebLNPromiseCallback[currentId]) {
      await timeout(1000);
    }
    if (WebLNPromiseCallback[currentId] instanceof Error) {
      throw WebLNPromiseCallback[currentId];
    }
    return WebLNPromiseCallback[currentId];
  };
  document.addEventListener("webln", (event) => {
    WebLNPromiseCallback[event.detail.id] = event.detail.data;
  });

  // WebLN
  window.webln = {
    enable: async () => {
      return;
    },
    getInfo: async () => {
    },
    makeInvoice: async (args) => {
    },
    sendPayment: async (paymentRequest) => {
      return await postMessage({
        type: "sendPayment",
        data: paymentRequest,
      });
    },
    signMessage: async (message) => {
    },
    verifyMessage: async (signature, message) => {
    },
  };

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
    postMessage({
      type: "sendPayment",
      data: paymentRequest
    }, false);
  });
})();`;
