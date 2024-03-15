import request from "@/utils/request";

// 修改用户信息
export function updateUserInfo(data) {
  return request({
    url: `/v1/platform/web/system/auth/editUserCenter`,
    method: "post",
    data,
  });
}

// 获取用户信息
export function getUserInfo(params) {
  return request({
    url: `/v1/platform/web/system/user/profile`,
    method: "get",
    params,
  });
}

// 修改密码
export function updatePwd(data) {
  return request({
    url: "/v1/platform/web/system/user/updatePwd",
    method: "post",
    data,
  });
}
