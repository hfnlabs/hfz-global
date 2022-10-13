import loadScript from "./load-script";
import loadStyleLink from "./load-style-link";

window.$HFC_CDN_URL = window.$HFC_CDN_URL || "https://repo.hyper.fun/hfm/";
window.$HFC_SHARE_DEP = window.$HFC_SHARE_DEP || {};
window.$HFC_LOAD_JS = loadScript;
window.$HFC_LOAD_CSS = loadStyleLink;

const remotesMap: Record<
  string,
  {
    inited: Boolean;
    lib?: any;
  }
> = {};

export function loadHfc(name: string, version?: string): Promise<any> {
  if (!remotesMap[name]) remotesMap[name] = { inited: false };

  const remote = remotesMap[name];
  if (remote.inited) return remote.lib;

  const entry = `${name}/${version}/hfm.js`;
  let cdnUrl = window.$HFC_CDN_URL;
  const cdnRewrite = (window as any)[`$HFC_CDN_REWRITE_${name}_${version}`];
  if (cdnRewrite) cdnUrl = cdnRewrite;

  let container: any;
  return loadScript(cdnUrl + entry)
    .then(() => {
      container = window.$HFC_CONTAINERS[name];
      return container.init();
    })
    .then(() => {
      return container.get("./hfc");
    })
    .then((factory: any) => {
      return factory();
    })
    .then((m: any) => {
      if (!remote.inited) {
        remote.lib = m;
        remote.inited = true;
      }

      return m;
    });
}

export function registerShareModule(name: string, instance: any) {
  window.$HFC_SHARE_DEP[name] = instance;
}
