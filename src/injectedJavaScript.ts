export default `(() => {
  // Prevent zooming
  const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta);

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
})();`;
