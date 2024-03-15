import request from "@/utils/request";

/**
 * @param data
 * @returns {*token*}
 */
export function login(data) {
  return request({
    url: "/v1/platform/web/system/login",
    method: "post",
    data,
  });
}

/**
 * @param data
 * @returns {*token*}
 */
export function updateToken(data) {
  return request({
    url: "/v1/platform/web/system/refreshToken",
    method: "post",
    data,
  });
}

/**
 * @param
 * @returns {*用户信息*}
 */
export function getInfo() {
  return request({
    url: "/v1/platform/web/system/user/getInfo",
    method: "get",
  });
}

/**
 * @param
 * @returns {*用户权限*}
 */
export function getUserRouters() {
  return request({
    url: "/v1/platform/web/system/user/getRouters",
    method: "get",
  });
}

/**
 * 注销登录
 * @returns
 */
export function logout() {
  return request({
    url: "/v1/platform/web/system/logout",
    method: "post",
  });
}

/**
 * 重置密码
 * @returns
 */
export function resetPassword(data) {
  return request({
    url: "/v1/platform/web/system/auth/resetPwd",
    method: "post",
    data,
  });
}

/**
 * 获取验证码
 * @returns
 */
export function getVerificationCodeForExists(params) {
  return request({
    url: "/v1/platform/web/system/auth/getVerificationCodeForExists",
    method: "get",
    params,
  });
}
