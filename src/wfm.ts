export function initSharing() {
  const init = __webpack_init_sharing__("default");
  return init.then ? init : Promise.resolve();
}

export function loadWfm<T>(name: string): Promise<T> {
  const container = window.$HFC_WFM_CONTAINERS[name];

  const init = container.init(__webpack_share_scopes__.default);
  return (init && init.then ? init : Promise.resolve())
    .then(() => container.get("./hfc"))
    .then((factory: any) => factory());
}

export function registerShareModule(
  name: string,
  version: string,
  instance: any
) {
  const versions = (__webpack_share_scopes__.default[name] =
    __webpack_share_scopes__.default[name] || {});
  const activeVersion = versions[version];
  if (!activeVersion || !activeVersion.loaded)
    versions[version] = {
      get: () => Promise.resolve(() => instance),
      from: "hfc",
      eager: false,
    };
}
