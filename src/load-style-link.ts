export default function loadStyleLink(src: string) {
  return new Promise((resolve, reject) => {
    const link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";

    link.href = src;

    link.onload = () => {
      link.onerror = link.onload = null;
      resolve(null);
    };

    link.onerror = () => {
      link.onerror = link.onload = null;
      reject(new Error(`Failed to load ${src}`));
    };

    const node = document.head || document.getElementsByTagName("head")[0];
    node.appendChild(link);
  });
}
