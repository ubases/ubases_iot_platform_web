// 平台配置项
import request from "@/utils/request";

/**
 * 平台配置项-列表
 * @param {*} data 查询参数
 * @returns
 */
export function getSystemConfigList(data = {}) {
  return request({
    url: "/v1/platform/web/config/systemConfig/list",
    method: "post",
    data,
  });
}

/**
 * 平台配置项-详情
 * @param {*} id 配置id
 * @returns
 */
export function getSystemConfigDetails(id) {
  return request({
    url: `/v1/platform/web/config/systemConfig/detail/${id}`,
    method: "get",
  });
}

/**
 * 平台配置项-添加
 * @param {*} data 添加参数
 * @returns
 */
export function addSystemConfig(data = {}) {
  return request({
    url: "/v1/platform/web/config/systemConfig/add",
    method: "post",
    data,
  });
}

/**
 * 平台配置项-编辑
 * @param {*} data 编辑参数
 * @returns
 */
export function editSystemConfig(data = {}) {
  return request({
    url: "/v1/platform/web/config/systemConfig/edit",
    method: "post",
    data,
  });
}

/**
 * 平台配置项-删除
 * @param {*} data 删除参数
 * @returns
 */
export function deleteSystemConfig(data = {}) {
  return request({
    url: "/v1/platform/web/config/systemConfig/delete",
    method: "post",
    data,
  });
}
