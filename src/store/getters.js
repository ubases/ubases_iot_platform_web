const getters = {
  // 项目主题相关
  isMobile: (state) => state.app.isMobile,
  lang: (state) => state.app.lang,
  theme: (state) => state.app.theme,
  color: (state) => state.app.color,
  multiTab: (state) => state.app.multiTab,
  // 用户角色相关
  avatar: (state) => state.user.avatar,
  roles: (state) => state.user.roles,
  userInfo: (state) => state.user.info,
  addRouters: (state) => state.permission.addRouters,
  keepAliveRouters: (state) => state.permission.keepAliveRouters,
  rememberPassword: (state) => state.app.rememberPassword,
  // 项目公用资源相关
  langTypeList: (state) => state.app.langTypeList,
  includeRouterView: (state) => state.app.includeRouterView,
};

export default getters;
