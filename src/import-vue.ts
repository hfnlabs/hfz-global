import type Vue from "vue";
import loadScript from "./load-script";

function isValidVue(v: typeof Vue) {
  return (
    typeof v === "object" && v.version[0] === "3" && !!v.compile && !!v.Teleport
  );
}

export default function () {
  return new Promise<typeof Vue>((resolve) => {
    if (window.$HFZ_VUE) {
      resolve(window.$HFZ_VUE);
      return;
    }

    if (isValidVue(window.Vue)) {
      window.$HFZ_VUE = window.Vue;
      resolve(window.$HFZ_VUE);
      return;
    }

    loadScript(
      "https://repo.hyper.fun/share/vue/dist/vue.esm-browser.prod.js@3.2.40.js"
    ).then(() => {
      window.$HFZ_VUE =
        window.$HFC_SHARE_DEP["vue/dist/vue.esm-browser.prod.js"];

      resolve(window.$HFZ_VUE);
    });
  });
}
