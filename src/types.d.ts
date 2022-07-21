import Vue from "vue";

declare global {
  const __webpack_share_scopes__ = any;
  const __webpack_init_sharing__ = any;
  interface Window {
    Hfz: any;
    Vue: typeof Vue;
    $HFZ_VUE: typeof Vue;
    $HFC_NPM_CDN_URL: string;
    $HFC_WFM_CONTAINERS: Record<string, any>;
    $HFZ_MOUNT_TEMPLATES: () => void;
  }
}
