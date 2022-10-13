export default function loadScript(src: string) {
  return new Promise((resolve, reject) => {
    const head = document.head || document.getElementsByTagName("head")[0];

    const script = document.createElement("script");
    script.async = true;
    script.src = src;

    script.onload = () => {
      script.onerror = script.onload = null;
      head.removeChild(script);
      resolve(null);
    };

    script.onerror = () => {
      script.onerror = script.onload = null;
      head.removeChild(script);
      reject(new Error(`Failed to load ${src}`));
    };

    head.appendChild(script);
  });
}
