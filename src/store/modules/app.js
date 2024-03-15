import storage from "store";
import {
  SIDEBAR_TYPE,
  TOGGLE_MOBILE_TYPE,
  TOGGLE_NAV_THEME,
  TOGGLE_LAYOUT,
  TOGGLE_FIXED_HEADER,
  TOGGLE_FIXED_SIDEBAR,
  TOGGLE_CONTENT_WIDTH,
  TOGGLE_HIDE_HEADER,
  TOGGLE_COLOR,
  TOGGLE_WEAK,
  TOGGLE_MULTI_TAB,
  // i18n
  APP_LANGUAGE,
  APP_DICT_LIST,
  APP_LANG_TYPE_LIST,
  APP_REMEMBER_PASSWORD,
} from "@/store/mutation-types";
import { loadLanguageAsync } from "@/locales";
import { getDictList } from "@/api/dictionaries";
import { getLangTypeList } from "@/api/lang";

const app = {
  state: {
    sideCollapsed: false,
    isMobile: false,
    theme: "dark",
    layout: "",
    contentWidth: "",
    fixedHeader: false,
    fixedSidebar: false,
    autoHideHeader: false,
    color: "",
    weak: false,
    multiTab: true,
    lang: "en-US",
    _antLocale: {},
    dictList: [],
    langTypeList: [],
    rememberPassword: storage.get(APP_REMEMBER_PASSWORD) || {
      remember: false,
      username: "",
      password: "",
    },
    includeRouterView: ["PageView", "BlankLayout"], // 路由缓存-缓存name
  },
  mutations: {
    [SIDEBAR_TYPE]: (state, type) => {
      state.sideCollapsed = type;
      storage.set(SIDEBAR_TYPE, type);
    },
    [TOGGLE_MOBILE_TYPE]: (state, isMobile) => {
      state.isMobile = isMobile;
    },
    [TOGGLE_NAV_THEME]: (state, theme) => {
      state.theme = theme;
      storage.set(TOGGLE_NAV_THEME, theme);
    },
    [TOGGLE_LAYOUT]: (state, mode) => {
      state.layout = mode;
      storage.set(TOGGLE_LAYOUT, mode);
    },
    [TOGGLE_FIXED_HEADER]: (state, mode) => {
      state.fixedHeader = mode;
      storage.set(TOGGLE_FIXED_HEADER, mode);
    },
    [TOGGLE_FIXED_SIDEBAR]: (state, mode) => {
      state.fixedSidebar = mode;
      storage.set(TOGGLE_FIXED_SIDEBAR, mode);
    },
    [TOGGLE_CONTENT_WIDTH]: (state, type) => {
      state.contentWidth = type;
      storage.set(TOGGLE_CONTENT_WIDTH, type);
    },
    [TOGGLE_HIDE_HEADER]: (state, type) => {
      state.autoHideHeader = type;
      storage.set(TOGGLE_HIDE_HEADER, type);
    },
    [TOGGLE_COLOR]: (state, color) => {
      state.color = color;
      storage.set(TOGGLE_COLOR, color);
    },
    [TOGGLE_WEAK]: (state, mode) => {
      state.weak = mode;
      storage.set(TOGGLE_WEAK, mode);
    },
    [APP_LANGUAGE]: (state, lang, antd = {}) => {
      // 修改lang的名称失败，临时处理方案手动判断
      if (lang == "en-US") {
        state.lang = "en";
      } else {
        state.lang = "zh";
      }
      state._antLocale = antd;
      storage.set(APP_LANGUAGE, lang);
    },
    [TOGGLE_MULTI_TAB]: (state, bool) => {
      storage.set(TOGGLE_MULTI_TAB, bool);
      state.multiTab = bool;
    },
    [APP_DICT_LIST]: (state, dictList) => {
      storage.set(APP_DICT_LIST, dictList);
      state.dictList = dictList;
    },
    [APP_LANG_TYPE_LIST]: (state, langTypeList) => {
      storage.set(APP_LANG_TYPE_LIST, langTypeList);
      state.langTypeList = langTypeList;
    },
    [APP_REMEMBER_PASSWORD]: (state, value) => {
      storage.set(APP_REMEMBER_PASSWORD, value);
      state.rememberPassword = value;
    },
    addRouterKeepAlive: (state, value) => {
      if (!value) return;
      state.includeRouterView = [...new Set([...state.includeRouterView,value])]
      storage.set("includeRouterView", state.includeRouterView);
    },
    delRouterKeepAlive: (state, value) => {
      state.includeRouterView = state.includeRouterView.filter(
        (item) => item != value
      );
      storage.set("includeRouterView", state.includeRouterView);
    },
  },
  actions: {
    setLang({ commit }, lang) {
      return new Promise((resolve, reject) => {
        commit(APP_LANGUAGE, lang);
        loadLanguageAsync(lang)
          .then(() => {
            resolve();
          })
          .catch((e) => {
            reject(e);
          });
      });
    },
    setDictList({ commit }) {
      getDictList().then(({ data }) => {
        commit(APP_DICT_LIST, data);
      });
    },
    setLangTypeList({ commit }) {
      getLangTypeList().then((res) => {
        if (res.code === 0) {
          commit(APP_LANG_TYPE_LIST, res.data);
        }
      });
    },
  },
};

export default app;
