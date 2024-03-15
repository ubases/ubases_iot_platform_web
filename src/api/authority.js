// 权限管理
import request from "@/utils/request";

/**
 * 用户列表
 * @param {*} params 查询参数
 * @returns
 */
export function getUserList(params) {
  return request({
    url: "/v1/platform/web/system/auth/userList",
    method: "get",
    params,
  });
}

/**
 * 用户信息
 * @param {*} params 查询参数
 * @returns
 */
export function getUserInfo(params) {
  return request({
    url: "/v1/platform/web/system/auth/getEditUser",
    method: "get",
    params,
  });
}

/**
 * 新增用户
 * @param {*} data 添加参数
 * @returns
 */
export function addUser(data) {
  return request({
    url: "/v1/platform/web/system/auth/addUser",
    method: "post",
    data,
  });
}

/**
 * 编辑用户
 * @param {*} data 编辑参数
 * @returns
 */
export function editUser(data) {
  return request({
    url: "/v1/platform/web/system/auth/editUser",
    method: "post",
    data,
  });
}

/**
 * 删除用户
 * @param {*} params 删除参数
 * @returns
 */
export function deleteUser(params) {
  return request({
    url: "/v1/platform/web/system/auth/deleteUser",
    method: "post",
    params,
    data: params,
  });
}

/**
 * 用户重置密码
 * @param {*} params 查询参数
 * @returns
 */
export function editUserPassword(data) {
  return request({
    url: "/v1/platform/web/system/auth/resetUserPwd",
    method: "post",
    data,
  });
}

/**
 * 用户设置状态
 * @param {*} data 设置参数
 * @returns
 */
export function setUserStatus(data) {
  return request({
    url: "/v1/platform/web/system/user/status",
    method: "post",
    data,
  });
}

/**
 * 岗位列表
 * @param {*} params 查询参数
 * @returns
 */
export function getPostList(params) {
  return request({
    url: "/v1/platform/web/system/auth/postList",
    method: "get",
    params,
  });
}

/**
 * 添加岗位
 * @param {*} data 添加参数
 * @returns
 */
export function addPost(data) {
  return request({
    url: "/v1/platform/web/system/auth/postAdd",
    method: "post",
    data,
  });
}

/**
 * 岗位详情
 * @param {*} params 查询参数
 * @returns
 */
export function getPostInfo(params) {
  return request({
    url: "/v1/platform/web/system/auth/postGet",
    method: "get",
    params,
  });
}

/**
 * 岗位编辑
 * @param {*} params 编辑参数
 * @returns
 */
export function editPost(params) {
  return request({
    url: "/v1/platform/web/system/auth/postEdit",
    method: "post",
    params,
    data: params,
  });
}

/**
 * 岗位删除
 * @param {*} params 删除参数
 * @returns
 */
export function deletePost(params) {
  return request({
    url: "/v1/platform/web/system/auth/postDelete",
    method: "post",
    params,
    data: params,
  });
}

/**
 * 部门列表
 * @param {*} params 查询参数
 * @returns
 */
export function getDepartmentList(params) {
  return request({
    url: "/v1/platform/web/system/auth/deptList",
    method: "get",
    params,
  });
}

/**
 * 添加部门
 * @param {*} data 添加参数
 * @returns
 */
export function addDepartment(data) {
  return request({
    url: "/v1/platform/web/system/auth/deptAdd",
    method: "post",
    data,
  });
}

/**
 * 部门详情
 * @param {*} params 查询参数
 * @returns
 */
export function getDepartmentInfo(params) {
  return request({
    url: "/v1/platform/web/system/auth/deptGet",
    method: "get",
    params,
  });
}

/**
 * 部门编辑
 * @param {*} params 编辑参数
 * @returns
 */
export function editDepartment(params) {
  return request({
    url: "/v1/platform/web/system/auth/deptEdit",
    method: "post",
    params,
    data: params,
  });
}

/**
 * 部门删除
 * @param {*} params 删除参数
 * @returns
 */
export function deleteDepartment(params) {
  return request({
    url: "/v1/platform/web/system/auth/deptDelete",
    method: "post",
    params,
    data: params,
  });
}

/**
 * 角色列表
 * @param {*} params 查询参数
 * @returns
 */
export function getRoleList(params) {
  return request({
    url: "/v1/platform/web/system/auth/roleList",
    method: "get",
    params,
  });
}

/**
 * 添加角色
 * @param {*} data 添加参数
 * @returns
 */
export function addRole(data) {
  return request({
    url: "/v1/platform/web/system/auth/addRole",
    method: "post",
    data,
  });
}

/**
 * 角色详情
 * @param {*} params 查询参数
 * @returns
 */
export function getRoleInfo(params) {
  return request({
    url: "/v1/platform/web/system/auth/editRole",
    method: "get",
    params,
  });
}

/**
 * 角色编辑
 * @param {*} params 编辑参数
 * @returns
 */
export function editRole(params) {
  return request({
    url: "/v1/platform/web/system/auth/editRole",
    method: "post",
    params,
    data: params,
  });
}

/**
 * 角色删除
 * @param {*} params 删除信息
 * @returns
 */
export function deleteRole(params) {
  return request({
    url: "/v1/platform/web/system/auth/deleteRole",
    method: "post",
    params,
    data: params,
  });
}

/**
 * 角色删除
 * @param {*} data 查询参数
 * @returns
 */
export function setRoleStatus(data) {
  return request({
    url: "/v1/platform/web/system/auth/statusSetRole",
    method: "post",
    data,
  });
}

/**
 * 编辑 获取角色权限
 * @param {*} data 查询参数
 * @returns
 */
export function getRoleEditAuth(data) {
  return request({
    url: "/v1/platform/web/system/auth/editRole/",
    method: "get",
    data,
  });
}

/**
 * 添加 获取角色权限
 * @param {*}
 * @returns
 */
export function getRoleAddAuth() {
  return request({
    url: "/v1/platform/web/system/auth/addRole",
    method: "get",
  });
}

/**
 * 云平台 菜单列表
 * @param {*}
 * @returns
 */
export function getCloudMenuList(params) {
  return request({
    url: "/v1/platform/web/system/auth/menuList",
    method: "get",
    params,
  });
}

/**
 * 云平台 添加菜单
 * @param {*}
 * @returns
 */
export function addCloudMenu(data) {
  return request({
    url: "/v1/platform/web/system/auth/addMenu",
    method: "post",
    data,
  });
}

/**
 * 云平台 编辑菜单
 * @param {*}
 * @returns
 */
export function editCloudMenu(data) {
  return request({
    url: "/v1/platform/web/system/auth/editMenu",
    method: "post",
    data,
  });
}

/**
 * 云平台 菜单详情
 * @param {*}
 * @returns
 */
export function getCloudMenuInfo(params) {
  return request({
    url: "/v1/platform/web/system/auth/menu/",
    method: "get",
    params,
  });
}

/**
 * 云平台 删除菜单
 * @param {*}
 * @returns
 */
export function deleteCloudMenu(params) {
  return request({
    url: "/v1/platform/web/system/auth/deleteMenu",
    method: "post",
    params,
    data: params,
  });
}

/**
 * 开放平台 菜单列表
 * @param {*}
 * @returns
 */
export function getDisparkMenuList(params) {
  return request({
    url: "/v1/platform/web/system/auth/openmenuList",
    method: "get",
    params,
  });
}

/**
 * 开放平台 添加菜单
 * @param {*}
 * @returns
 */
export function addDisparkMenu(data) {
  return request({
    url: "/v1/platform/web/system/auth/openaddMenu",
    method: "post",
    data,
  });
}

/**
 * 开放平台 编辑菜单
 * @param {*}
 * @returns
 */
export function editDisparkMenu(data) {
  return request({
    url: "/v1/platform/web/system/auth/openeditMenu",
    method: "post",
    data,
  });
}

/**
 * 开放平台 菜单详情
 * @param {*}
 * @returns
 */
export function getDisparkMenuInfo(params) {
  return request({
    url: "/v1/platform/web/system/auth/openmenu",
    method: "get",
    params,
  });
}

/**
 * 开放平台 删除菜单
 * @param {*}
 * @returns
 */
export function deleteDisparkMenu(params) {
  return request({
    url: "/v1/platform/web/system/auth/opendeleteMenu",
    method: "post",
    params,
    data: params,
  });
}

/**
 * 开发者认证列表
 * @param {*} params 查询参数
 * @returns
 */
export function getCompanyAuthList(params) {
  return request({
    url: "/v1/platform/web/system/opendev/list",
    method: "get",
    params,
  });
}

/**
 * 开发者认证详情
 * @param {*} params 查询参数
 * @returns
 */
export function getCompanyAuthDetails(params) {
  return request({
    url: "/v1/platform/web/system/opendev/detail",
    method: "get",
    params,
  });
}

/**
 * 开发者认证审核
 * @param {*} data 认证审核
 * @returns
 */
export function cmpanyAuthAudit(data) {
  return request({
    url: "/v1/platform/web/system/opendev/auth",
    method: "post",
    data,
  });
}

/**
 * 开发者账号列表
 * @param {*} data 查询参数
 * @returns
 */
export function getDeveloperList(params) {
  return request({
    url: "/v1/platform/web/system/deve/list",
    method: "get",
    params,
  });
}

/**
 * 开发者账号-删除
 * @param {*} data 账号id
 * @returns
 */
export function deleteDeveloper(params) {
  return request({
    url: "/v1/platform/web/system/deve/delete",
    method: "post",
    params,
  });
}

/**
 * 开发者账号-详情
 * @param {*} data 账号id
 * @returns
 */
export function getDeveloperDetails(params) {
  return request({
    url: "/v1/platform/web/system/deve/detail",
    method: "get",
    params,
  });
}

/**
 * 开发者账号-公司列表
 * @param {*} data 公司名
 * @returns
 */
export function getDeveloperCompanyList(params) {
  return request({
    url: "/v1/platform/web/system/deve/companyList",
    method: "get",
    params,
  });
}

/**
 * 开发者账号-新增
 * @param {*} data 新增参数
 * @returns
 */
export function addDeveloper(data) {
  return request({
    url: "/v1/platform/web/system/deve/add",
    method: "post",
    data,
  });
}

/**
 * 开发者账号-编辑
 * @param {*} data 编辑参数
 * @returns
 */
export function editDeveloper(data) {
  return request({
    url: "/v1/platform/web/system/deve/edit",
    method: "post",
    data,
  });
}

/**
 * 开发者账号-禁用启用
 * @param {*} data 设置参数
 * @returns
 */
export function setDeveloperStatus(data) {
  return request({
    url: "/v1/platform/web/system/deve/status",
    method: "post",
    data,
  });
}

/**
 * 开发者账号-重置密码
 * @param {*} data id
 * @returns
 */
export function resetDeveloperPassword(params) {
  return request({
    url: "/v1/platform/web/system/deve/resetPassword",
    method: "post",
    params,
  });
}
