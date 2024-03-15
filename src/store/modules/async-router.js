/**
 * 向后端请求用户的菜单，动态生成路由
 */
import { constantRouterMap } from "@/config/router.config";
import { generatorDynamicRouter } from "@/router/generator-routers";

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    keepAliveRouters: ["PageView", "BlankLayout"],
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers;
      state.routers = constantRouterMap.concat(routers);
    },
    ADD_KEEP_ALIVE_ROUTERS: (state, router) => {
      if (state.keepAliveRouters.includes(router)) {
        return;
      }
      state.keepAliveRouters.push(router);
    },
    DELETE_KEEP_ALIVE_ROUTERS: (state, router) => {
      state.keepAliveRouters = state.keepAliveRouters.filter((value) => {
        return router !== value;
      });
    },
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise((resolve) => {
        const { roles } = data;
        generatorDynamicRouter(roles).then((routers) => {
          commit("SET_ROUTERS", routers);
          resolve();
        });
      });
    },
  },
};

export default permission;
