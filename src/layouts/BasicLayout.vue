<template>
  <pro-layout
    :menus="menus"
    :collapsed="collapsed"
    :mediaQuery="query"
    :isMobile="isMobile"
    :handleMediaQuery="handleMediaQuery"
    :handleCollapse="handleCollapse"
    :i18nRender="i18nRender"
    v-bind="settings"
  >
    <template v-slot:menuHeaderRender>
      <div :style="{ 'margin-left': collapsed ? '0px' : '-7px' }">
        <logo-svg />
        <h1 style="color: #fff">爱星物联云管平台</h1>
      </div>
    </template>
    <!-- 顶部导航栏 -->
    <template v-slot:headerContentRender>
      <version style="padding-left: 10px;"/>
    </template>
    <!-- 面包屑 -->
    <template v-slot:rightContentRender>
      <right-content
        :top-menu="settings.layout === 'topmenu'"
        :is-mobile="isMobile"
        :theme="settings.theme"
      />
    </template>
    <route-view />
  </pro-layout>
</template>

<script>
import { SettingDrawer, updateTheme } from "@ant-design-vue/pro-layout";
import { i18nRender } from "@/locales";
import { mapState } from "vuex";
import {
  CONTENT_WIDTH_TYPE,
  SIDEBAR_TYPE,
  TOGGLE_MOBILE_TYPE,
} from "@/store/mutation-types";

import defaultSettings from "@/config/defaultSettings";
import RightContent from "@/components/GlobalHeader/RightContent";
import LogoSvg from "../assets/logo.svg?inline";
import RouteView from "./RouteView.vue";
import { isMobile } from "@/utils/util"
import Version from "@/components/GlobalHeader/Version.vue";

export default {
  name: "BasicLayout",
  components: {
    SettingDrawer,
    RightContent,
    LogoSvg,
    "route-view": RouteView,
    Version
  },
  data() {
    return {
      // preview.pro.antdv.com only use.
      isProPreviewSite: process.env.NODE_ENV !== "development",
      // end
      isDev: process.env.NODE_ENV === "development",

      // base
      menus: [],
      // 侧栏收起状态
      collapsed: false,
      title: defaultSettings.title,
      settings: {
        // 布局类型
        layout: defaultSettings.layout, // 'sidemenu', 'topmenu'
        // CONTENT_WIDTH_TYPE
        contentWidth:
          defaultSettings.layout === "sidemenu"
            ? CONTENT_WIDTH_TYPE.Fluid
            : defaultSettings.contentWidth,
        // 主题 'dark' | 'light'
        theme: defaultSettings.navTheme,
        // 主色调
        primaryColor: defaultSettings.primaryColor,
        fixedHeader: defaultSettings.fixedHeader,
        fixSiderbar: defaultSettings.fixSiderbar,
        colorWeak: defaultSettings.colorWeak,

        hideHintAlert: false,
        hideCopyButton: false,
      },
      // 媒体查询
      query: {},

      // 是否手机模式
      isMobile: false,

      // 头部nav
      navType: 1,
    };
  },
  computed: {
    ...mapState({
      // 动态主路由
      mainMenu: (state) => state.permission.addRouters,
    }),
  },
  created() {
    const routes = this.mainMenu.find((item) => item.path === "/");
    this.menus = (routes && routes.children) || [];
    // 处理侧栏收起状态
    this.$watch("collapsed", () => {
      this.$store.commit(SIDEBAR_TYPE, this.collapsed);
    });
    this.$watch("isMobile", () => {
      this.$store.commit(TOGGLE_MOBILE_TYPE, this.isMobile);
    });
  },
  mounted() {
    const userAgent = navigator.userAgent;
    if (userAgent.indexOf("Edge") > -1) {
      this.$nextTick(() => {
        this.collapsed = !this.collapsed;
        setTimeout(() => {
          this.collapsed = !this.collapsed;
        }, 16);
      });
    }

    // first update color
    // TIPS: THEME COLOR HANDLER!! PLEASE CHECK THAT!!
    if (process.env.NODE_ENV !== "production") {
      updateTheme(this.settings.primaryColor);
    }
  },
  methods: {
    i18nRender,
    navClick(e) {
      this.navType = e;
    },
    handleMediaQuery(val) {
      this.isMobile = false
      if(isMobile()){
        this.collapsed = true
        this.settings.contentWidth = CONTENT_WIDTH_TYPE.Fluid
      } else {
        this.collapsed = false
      }
      this.query = val;
    },
    handleCollapse(val) {
      this.collapsed = val;
    },
  },
};
</script>

<style lang="less">
@import "./BasicLayout.less";
// 样式调整 参照ui设计稿
.ant-pro-global-header {
  background-color: #242933;
}
.ant-pro-basicLayout-content{
  margin: 0;
  padding: 20px;
  background: #F4F8FE;
}
.ant-pro-sider-menu-logo {
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.5) !important;
  background-color: #242933 !important;
}
.ant-pro-sider-menu-sider.light .ant-pro-sider-menu-logo {
  background: none;
  -webkit-box-shadow: none;
  box-shadow: none;
}
.ant-pro-global-header-trigger {
  color: #fff;
}
.headerContentNav {
  display: flex;
  div {
    width: 100px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 500;
    color: #ffffff;
    text-align: center;
  }
  .select {
    background-color: #3b7cff;
  }
}
.ant-layout-footer{
  display: none;
}
</style>
