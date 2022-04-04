export default `
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
