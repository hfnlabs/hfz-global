export default new Promise<void>((resolve) => {
  if (document.readyState === "complete") {
    resolve();
  } else {
    window.addEventListener("load", () => resolve());
  }
});
