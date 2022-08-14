import type IVue from "vue";
import importVue from "./import-vue";
import domReady from "./dom-ready";
import loadScript from "./load-script";
// import loadStyleLink from "./load-style-link";
import { initSharing, registerShareModule, loadWfm } from "./wfm";
import strToJsVar from "./str-to-js-var";
import HfcToVue from "hfc-to-vue/dist/to-vue";

window.$HFC_NPM_CDN_URL = window.$HFC_NPM_CDN_URL || "https://npm.hyper.fun";
window.$HFC_WFM_CONTAINERS = window.$HFC_WFM_CONTAINERS || {};

interface TeleportItem {
  target: string;
  component: any;
}

let Vue: typeof IVue;
let app: IVue.App;
let data: any;
let hfcToVue: any;

let isReady = false;
function run() {
  if (isReady) return Promise.resolve();
  return Promise.all([importVue(), initSharing(), domReady]).then(([_vue]) => {
    registerShareModule("vue", window.$HFZ_VUE.version, window.$HFZ_VUE);

    Vue = _vue;
    hfcToVue = HfcToVue(Vue);
    data = Vue.reactive({
      teleports: [],
    });
    app = Vue.createApp({
      data() {
        return data;
      },
      render() {
        return this.teleports.map((item: TeleportItem) =>
          Vue.h(Vue.Teleport, { to: item.target }, item.component)
        );
      },
    });

    app.component("block", {
      emits: ["mounted", "unmounted"],
      setup(_, { slots, emit }) {
        Vue.onMounted(() => emit("mounted"));
        Vue.onUnmounted(() => emit("unmounted"));
        return () => slots.default && slots.default();
      },
    });

    // mount to ghost element
    app.mount(document.createElement("template"));

    isReady = true;
  });
}

function mountTemplates() {
  const templates =
    document.querySelectorAll<HTMLTemplateElement>("template[hfz]");

  const teleports: any[] = [];
  templates.forEach((template) => {
    const component = templateToComponent(template);

    if (component.name) {
      app.component(component.name, component);
      template.parentNode?.removeChild(template);
      return;
    }

    let target;
    if (template.hasAttribute("mount")) {
      target = document.querySelector(template.getAttribute("mount")!);

      if (!target) return;
    } else {
      target = document.createElement("div");
      template.parentNode?.insertBefore(target, template);
    }

    teleports.push({ target, component: Vue.h(component) });
    template.parentNode?.removeChild(template);
  });

  Array.prototype.push.apply(data.teleports, teleports);
}

function templateToComponent(template: HTMLTemplateElement) {
  let component: any = {};

  const script = template.content.querySelector("script");
  if (script) {
    // Uncaught TypeError: Cannot read properties of undefined (reading 'version')
    const text = script.textContent!.trim();
    const objText = text.slice(text.indexOf("{"));
    component = new Function("return " + objText)();
    template.content.removeChild(script);
  }

  if (template.hasAttribute(":data") && !component.data) {
    component.data = strToJsVar(template.getAttribute(":data")!);
  }

  if (template.hasAttribute(":props") && !component.props) {
    component.props = strToJsVar(template.getAttribute(":props")!);
  }

  const components: Record<string, any> = {};

  template.getAttributeNames().forEach((key) => {
    if (key.slice(0, 7) !== "import:") return;
    const arr = key.split(":");
    const name = arr[1];
    const alias = arr[2];
    let versionOrPath = template.getAttribute(key)!;
    if (versionOrPath[0] === "." || versionOrPath[0] === "/") {
      components[alias || name] = buildRemoteVueHfc(versionOrPath);
    } else {
      components[alias || name] = buildVueHfc(name, versionOrPath);
    }
  });

  component.name = template.getAttribute("name");
  component.components = components;

  component.render = Vue.compile(template.innerHTML, {
    runtimeGlobalName: "$HFZ_VUE",
  });

  if (typeof component.data !== "function") {
    const data = component.data;
    component.data = () => data;
  }

  return component;
}

function buildVueHfc(name: string, version?: string) {
  return Vue.defineAsyncComponent({
    loader() {
      let target = "@hyper.fun/" + name;
      if (version) target = target + "@" + version;

      let cdnUrl = window.$HFC_NPM_CDN_URL;
      const rewrite = (window as any)[`$HFC_CDN_REWRITE_${target}`];
      if (rewrite) cdnUrl = rewrite;
      const componentUrl = `${cdnUrl}/${target}/wfm/entry.js`;

      return loadScript(componentUrl)
        .then(() => {
          // loadStyleLink(`${cdnUrl}/${target}/hfc.css`);
          return loadWfm("@hyper.fun/" + name);
        })
        .then((comp: any) => {
          return hfcToVue(comp.default, true);
        })
        .catch((err) => {
          console.error(err);
          console.warn(`[hfz] faild to load component: ${name} ${version} `);
          return Vue.defineComponent({});
        });
    },
  });
}

function buildRemoteVueHfc(src: string) {
  return Vue.defineAsyncComponent({
    loader() {
      return new Promise((resolve, reject) => {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
          if (this.readyState == 4) {
            if (this.status == 200) {
              const templateText = this.responseText;
              const elem = document.createElement("template");

              elem.innerHTML = templateText;
              const template = elem.content.querySelector("template");
              resolve(templateToComponent(template!));
              return;
            }
            reject(new Error("fail to load remote template: " + src));
          }
        };

        xhttp.open("GET", src, true);
        xhttp.send();
      });
    },
  });
}

run().then(() => {
  mountTemplates();

  new MutationObserver((mutations) => {
    let hasAdd;
    for (const mutation of mutations) {
      if (mutation.addedNodes.length) {
        hasAdd = true;
        break;
      }
    }

    if (hasAdd) {
      mountTemplates();
    }
  }).observe(document.body, {
    subtree: true,
    childList: true,
    attributes: false,
    characterData: false,
    attributeOldValue: false,
    characterDataOldValue: false,
  });
});
