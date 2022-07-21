export default function loadScript(src: string) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.async = true;
    script.src = src;

    script.onload = () => {
      script.onerror = script.onload = null;
      resolve(null);
    };

    script.onerror = () => {
      script.onerror = script.onload = null;
      reject(new Error(`Failed to load ${src}`));
    };

    const node = document.head || document.getElementsByTagName("head")[0];
    node.appendChild(script);
  });
}
