import router from "./router";
import store from "./store";
import storage from "store";
import NProgress from "nprogress"; // 进度条
import "@/components/NProgress/nprogress.less"; // 进度条 style
import { setDocumentTitle, domTitle } from "@/utils/domUtil";
import { ACCESS_TOKEN } from "@/store/mutation-types";
import { i18nRender } from "@/locales";

NProgress.configure({ showSpinner: false }); // 进度条配置

const allowList = ["Login", "ResetPasswords"]; // 免登陆页面
const loginRoutePath = "/user/login"; // 登录页面
const defaultRoutePath = "/aithings"; // 默认进入页面

router.beforeEach((to, from, next) => {
  NProgress.start(); // 进度条开始
  to.meta &&
    typeof to.meta.title !== "undefined" &&
    setDocumentTitle(`${i18nRender(to.meta.title)} - ${domTitle}`);
  if (storage.get(ACCESS_TOKEN)) {
    // 登录页面进入直接去首页
    if (to.path === loginRoutePath) {
      next({ path: defaultRoutePath });
      NProgress.done();
    } else {
      // 检查用户角色权限 权限为null 需要先添加路由表才可以访问其余内容
      if (store.getters.roles.length === 0) {
        try {
          // 获取用户信息 个人权限列表
          store.dispatch("GetInfo");
          store
            .dispatch("GetRoles")
            .then((res) => {
              const roles = res && res.data;
              // 生成动态路由
              store.dispatch("GenerateRoutes", { roles }).then(() => {
                // 根据roles权限生成可访问的路由表
                // 动态添加可访问路由表
                store.getters.addRouters.forEach((r) => {
                  router.addRoute(r);
                });
                // 请求带有 redirect 重定向时，登录自动重定向到该地址
                const redirect = decodeURIComponent(
                  from.query.redirect || to.path
                );
                if (to.path === redirect) {
                  // 设置replace: true，这样导航就不会留下历史记录
                  next({ ...to, replace: true });
                } else {
                  // 跳转到目的路由
                  next({ path: redirect });
                }
              });
            })
            .catch(() => {
              // 失败时，获取用户信息失败时，调用登出，来清空历史保留信息
              store.dispatch("Logout", true).then(() => {
                next({
                  path: loginRoutePath,
                  query: { redirect: to.fullPath },
                });
              });
              NProgress.done();
            });
        } catch (error) {
          store.dispatch("Logout", true).then(() => {
            next({
              path: loginRoutePath,
              query: { redirect: to.fullPath },
            });
          });
          NProgress.done();
        }
      } else {
        // 首选判断是否需要刷新token
        store
          .dispatch("UpdateToken")
          .then((res) => {
            next();
          })
          .catch((err) => {
            // 失败时，获取用户信息失败时，调用登出，来清空历史保留信息
            store.dispatch("Logout", true).then(() => {
              next({
                path: loginRoutePath,
                query: { redirect: to.fullPath },
              });
            });
            NProgress.done();
          });
      }
    }
  } else {
    if (allowList.includes(to.name)) {
      // 在免登录的名单，直接进入
      next();
    } else {
      next({ path: loginRoutePath, query: { redirect: to.fullPath } });
      NProgress.done(); // 如果当前页面是登录后将不会触发每个钩子，所以手动处理它
    }
  }
});

router.afterEach(() => {
  NProgress.done(); //进度条结束
});
