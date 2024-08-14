// 数据中心
import request from "@/utils/request";

/**
 * 数据概览-累计
 * @param {*} params 查询参数
 * @returns
 */
export function getOverviewAccumulate(params = {}) {
  return request({
    url: "/v1/platform/web/data/pm/overview/accumulate",
    method: "get",
    params,
  });
}

/**
 * 数据概览-今日
 * @param {*} params 查询参数
 * @returns
 */
export function getOverviewToday(params = {}) {
  return request({
    url: "/v1/platform/web/data/pm/overview/today",
    method: "get",
    params,
  });
}

/**
 * 数据概览-设备区域分布
 * @param {*} params 查询参数
 * @returns
 */
export function getOverviewCity(params = {}) {
  return request({
    url: "/v1/platform/web/data/pm/overview/city",
    method: "get",
    params,
  });
}

/**
 * 开发者数据-列表
 * @param {*} data 查询参数
 * @returns
 */
export function getDeveloperList(data = {}) {
  return request({
    url: "/v1/platform/web/data/pm/developer/list",
    method: "post",
    data,
  });
}

/**
 * 开发者数据-详情
 * @param {*} params 查询参数
 * @returns
 */
export function getDeveloperDetails(params = {}) {
  return request({
    url: "/v1/platform/web/data/pm/developer/detail",
    method: "get",
    params,
  });
}

/**
 * 开发者数据-统计
 * @param {*} params 查询参数
 * @returns
 */
export function getDeveloperStatistics(params = {}) {
  return request({
    url: "/v1/platform/web/data/pm/developer/total",
    method: "get",
    params,
  });
}


/**
 * 获取激活设备和在线设备总数
 * @param {*} params 查询参数
 * @returns
 */
export function getDeviceStatistics(params = {}) {
  return request({
    url: "/v1/platform/web/data/pm/device/total",
    method: "get",
    params,
  });
}


/**
 * 产品故障值列表
 * @param {*} params 查询参数
 * @returns
 */
export function getFaultValues(params = {}) {
  return request({
    url: "/v1/platform/web/data/pm/product/faultValues",
    method: "get",
    params,
  });
}

/**
 * 设备故障-列表
 * @param {*} data 查询参数
 * @returns
 */
export function getDeviceFaultList(data = {}) {
  return request({
    url: "/v1/platform/web/data/pm/deviceFault/list",
    method: "post",
    data,
  });
}

/**
 * App数据-列表
 * @param {*} data 查询参数
 * @returns
 */
export function getAppList(data = {}) {
  return request({
    url: "/v1/platform/web/data/pm/app/list",
    method: "post",
    data,
  });
}

/**
 * App数据-列表
 * @param {*} params 查询参数
 * @returns
 */
export function getAppDetails(params = {}) {
  return request({
    url: "/v1/platform/web/data/pm/app/detail",
    method: "get",
    params,
  });
}

/**
 * 发送短信/邮件增加发送记录
 * @param {*} data 查询参数
 * @returns
 */
export function sendRecord(data = {}) {
  return request({
    url: "/v1/platform/web/data/noticeInfo/sendRecord",
    method: "post",
    data,
  });
}

/**
 * 获取开发者的故障类型物模型数据
 * @param {*} params 查询参数
 * @returns
 */
export function getFaultFuncList(params = {}) {
  return request({
    url: "/v1/platform/web/open/product/faultFuncList",
    method: "get",
    params,
  });
}