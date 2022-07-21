import loadScript from "./load-script";
import type Vue from "vue";

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
      window.$HFC_NPM_CDN_URL + "/vue@3.2.37/dist/vue.global.prod.js"
    ).then(() => {
      window.$HFZ_VUE = window.Vue;
      resolve(window.$HFZ_VUE);
    });
  });
}
