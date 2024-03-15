// eslint-disable-next-line
import { BasicLayout, BlankLayout, PageView, RouteView } from "@/layouts";
import icons from "@/core/icons";

// 前端路由表
const constantRouterComponents = {
  // 基础页面 layout 必须引入
  BasicLayout: BasicLayout,
  BlankLayout: BlankLayout,
  RouteView: RouteView,
  PageView: PageView,
  Layout: PageView,
  404: () => import(/* webpackChunkName: "error" */ "@/views/exception/404"),
};

// 前端未找到页面路由（固定不用改）
const notFoundRouter = {
  path: "*",
  redirect: "/404",
  hidden: true,
};

// 根级菜单
const rootRouter = {
  key: "",
  name: "index",
  path: "/",
  component: "BasicLayout",
  jumpPath: "/aithings",
  meta: {
    title: "首页",
  },
  children: [
    {
      path: "/aithings",
      name: "Aithings",
      component: "PageView",
      hidden: false,
      meta: {
        title: "首页",
        keepAlive: false,
        permission: "Aithings",
        icon: "home",
      },
    },
  ],
};

/**
 * 动态生成菜单
 * @param roles
 * @returns {Promise<Router>}
 */
export const generatorDynamicRouter = (roles) => {
  return new Promise((resolve, reject) => {
    const menuNav = [];
    let routers = [];
    if (roles && roles.length) {
      const childrenNav = roles;
      rootRouter.children = childrenNav;
      menuNav.push(rootRouter);
      routers = generator(menuNav);
      routers.push(notFoundRouter);
    } else {
      menuNav.push(rootRouter);
      routers = generator(menuNav);
      routers.push(notFoundRouter);
    }
    resolve(routers);
  });
};

/**
 * 格式化树形结构数据 生成 vue-router 层级路由表
 *
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const generator = (routerMap) => {
  return routerMap.map((item) => {
    const { title, icon, isHideChildMenu, isCache, isFrame } = item;
    const currentRouter = {
      // 如果路由设置path
      path: item.path,
      // 路由名称，建议唯一
      name: item.name,
      // 该路由对应页面的组件: (动态加载)
      component:
        constantRouterComponents[item.component] ||
        (() => import(`@/views${item.component}`)),
      // meta: 页面标题, 菜单图标(先取自定义图标), 页面权限(供指令权限用，可去掉)
      meta: {
        title,
        icon: icons[icon] || icon,
        permission: item.name,
        target: isFrame == 1 ? "_blank" : "", // 是否外链
        keepalive: isCache == 1 ? true : false, // 是否缓存
      },
    };
    // 是否设置了隐藏菜单
    if (item.visible === 1) {
      currentRouter.hidden = false;
    } else {
      currentRouter.hidden = true;
    }

    // 是否设置了隐藏子菜单
    if (isHideChildMenu == 1) {
      currentRouter.hideChildrenInMenu = true;
    }

    // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
    if (currentRouter.path && !currentRouter.path.startsWith("http")) {
      currentRouter.path = currentRouter.path.replace("//", "/");
    }
    // 重定向 暂时不处理
    currentRouter.redirect = item.jumpPath || "";
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      // Recursion
      currentRouter.children = generator(item.children, currentRouter);
    }
    return currentRouter;
  });
};

/**
 * 数组转树形结构
 * @param list 源数组
 * @param tree 树
 * @param parentId 父ID
 */
const listToTree = (list, tree, parentId) => {
  list.forEach((item) => {
    // 判断是否为父级菜单
    if (item.parentId === parentId) {
      const child = {
        ...item,
        key: item.key || item.name,
        children: [],
      };
      // 迭代 list， 找到当前菜单相符合的所有子菜单
      listToTree(list, child.children, item.id);
      // 删掉不存在 children 值的属性
      if (child.children.length <= 0) {
        delete child.children;
      }
      // 加入到树中
      tree.push(child);
    }
  });
};
