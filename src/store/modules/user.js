import storage from "store";
import {
  login,
  logout,
  getInfo,
  getUserRouters,
  updateToken,
} from "@/api/login";
import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  EXPIRES_AT,
} from "@/store/mutation-types";
const user = {
  state: {
    token: "",
    refreshToken: "",
    isRefreshing: true,
    expiresAt: 0,
    avatar: "",
    roles: [],
    info: {},
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_REFRESH_TOKEN: (state, refreshToken) => {
      state.refreshToken = refreshToken;
    },
    SET_EXPIRES_AT: (state, expiresAt) => {
      state.expiresAt = expiresAt;
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    SET_INFO: (state, info) => {
      state.info = info;
    },
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo)
          .then((res) => {
            if (res.code === 0) {
              const result = res.data;
              storage.set(ACCESS_TOKEN, result.token); // 正常请求token
              storage.set(REFRESH_TOKEN, result.refreshToken); // 验证token(token过期时需要通过它获取新的token)
              storage.set(EXPIRES_AT, result.expiresAt); // 过期时间
              commit("SET_TOKEN", result.token);
              commit("SET_REFRESH_TOKEN", result.refreshToken);
              commit("SET_EXPIRES_AT", result.expiresAt);
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    UpdateToken({ commit, state }) {
      return new Promise((resolve, reject) => {
        // 判断token过期 五分钟之内更新token
        const expiresAt = storage.get(EXPIRES_AT) || 0;
        const NowAt = Date.now() / 1000;
        if (state.isRefreshing && expiresAt && expiresAt - NowAt < 600) {
          state.isRefreshing = false;
          updateToken({ refreshToken: storage.get(REFRESH_TOKEN) })
            .then((res) => {
              if (res.code === 0) {
                const result = res.data;
                storage.set(ACCESS_TOKEN, result.token); // 正常请求token
                storage.set(REFRESH_TOKEN, result.refreshToken); // 验证token(token过期时需要通过它获取新的token)
                storage.set(EXPIRES_AT, result.expiresAt); // 过期时间
                commit("SET_TOKEN", result.token);
                commit("SET_REFRESH_TOKEN", result.refreshToken);
                commit("SET_EXPIRES_AT", result.expiresAt);
              }
              resolve(res);
            })
            .catch((error) => {
              reject(error);
            })
            .finally(() => {
              state.isRefreshing = true;
            });
        } else {
          resolve();
        }
      });
    },
    // 获取用户信息
    GetInfo({ commit }) {
      getInfo().then((res) => {
        if (res.code == 0 && res.data) {
          const result = res.data || { user: {} };
          commit("SET_INFO", result.user); // 登录用户信息
          commit("SET_AVATAR", result.user.avatar); // 登录用户头像
        }
      });
    },
    // 获取用户权限
    GetRoles({ commit }) {
      return new Promise((resolve, reject) => {
        getUserRouters()
          .then((res) => {
            if (res.code == 0 && res.data && res.data.length > 0) {
              const roles = res.data;
              commit("SET_ROLES", roles);
              resolve(res);
            } else {
              reject(new Error("getInfo: roles must be a non-null array !"));
            }
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // 登出
    Logout({ commit, state }, data) {
      return new Promise((resolve) => {
        if (data) {
          commit("SET_TOKEN", "");
          commit("SET_ROLES", []);
          commit("SET_REFRESH_TOKEN", "");
          commit("SET_EXPIRES_AT", 0);
          storage.remove(ACCESS_TOKEN);
          storage.remove(REFRESH_TOKEN);
          storage.remove(EXPIRES_AT);
          resolve();
        } else {
          logout().finally(() => {
            commit("SET_TOKEN", "");
            commit("SET_ROLES", []);
            commit("SET_REFRESH_TOKEN", "");
            commit("SET_EXPIRES_AT", 0);
            storage.remove(ACCESS_TOKEN);
            storage.remove(REFRESH_TOKEN);
            storage.remove(EXPIRES_AT);
            resolve();
          });
        }
      });
    },
  },
};

export default user;
