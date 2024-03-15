import request from "@/utils/request";

/**
 * 获取语言列表
 * @param params
 * @returns
 */
export function getLangTypeList(params) {
  return request({
    url: "/v1/platform/web/lang/langTypeList",
    method: "get",
    params,
  });
}

/**
 * 多语言设置
 * @param {*} data 多语言参数
 * @returns
 */
export function setLangForm(data) {
  return request({
    url: `/v1/platform/web/lang/translation/save`,
    method: "post",
    data,
  });
}

/**
 * 多语言详情
 * @param {*} data 模板id 业务表
 * @returns
 */
export function getLangForm(params) {
  return request({
    url: `/v1/platform/web/lang/translation/getV2`,
    method: "get",
    params,
  });
}

/**
 * 获取数据多语言列表
 * @param data
 * @returns
 */
export function getDataLangList(data) {
  return request({
    url: "/v1/platform/web/lang/translation/list",
    method: "post",
    data,
  });
}
