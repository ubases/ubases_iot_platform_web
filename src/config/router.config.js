// eslint-disable-next-line
import { UserLayout } from "@/layouts";
/**
 * 基础路由无需配置权限
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: "/user",
    component: UserLayout,
    redirect: "/user/login",
    hidden: true,
    children: [
      {
        path: "login",
        name: "Login",
        component: () => import("@/views/user/Login/index"),
      },
      {
        path: "reset-passwords",
        name: "ResetPasswords",
        component: () => import("@/views/user/ResetPasswords/index"),
      },
    ],
  },
  {
    path: "/404",
    component: () => import("@/views/exception/404"),
  },
];
