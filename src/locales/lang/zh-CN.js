import antd from "ant-design-vue/es/locale-provider/zh_CN";
import momentCN from "moment/locale/zh-cn";

import setting from './zh-CN/setting'
import login from "./zh-CN/login";
import publicObj from "./zh-CN/public";
import system from "./zh-CN/system"; // 系统设置
import authority from "./zh-CN/authority"; // 权限管理
import product from "./zh-CN/product"; // 产品管理
import dictionaries from "./zh-CN/dictionaries";
import permissions from "./zh-CN/permissions";
import firmware from "./zh-CN/firmware";

const components = {
  antLocale: antd,
  momentName: "zh",
  momentLocale: momentCN,
};

export default {
  message: "-",
  ...components,
  ...publicObj,
  ...login,
  ...system,
  ...setting,
  ...authority,
  ...product,
  ...dictionaries,
  ...permissions,
  ...firmware,
};
