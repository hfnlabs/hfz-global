import Vue from "vue";

declare global {
  interface Window {
    Vue: typeof Vue;
    $HFZ_VUE: typeof Vue;
    $HFC_CDN_URL: string;
    $HFC_CONTAINERS: Record<string, any>;
    $HFC_SHARE_DEP: Record<string, any>;

    $HFC_LOAD_JS: (url: string) => Promise<any>;
    $HFC_LOAD_CSS: (url: string) => Promise<any>;
  }
}
