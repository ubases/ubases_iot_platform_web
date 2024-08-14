// 产品管理
import request from "@/utils/request";

/**
 * 分类列表
 * @param {*} data 查询参数
 * @returns
 */
export function getClassificationList(data) {
  return request({
    url: "/v1/platform/web/pm/productType/get",
    method: "post",
    data,
  });
}

/**
 * 分类信息
 * @param {*} params 查询参数
 * @returns
 */
export function getClassificationInfo(params) {
  return request({
    url: "/v1/platform/web/pm/productType/get",
    method: "get",
    params,
  });
}

/**
 * 添加分类
 * @param {*} data 添加参数
 * @returns
 */
export function addClassification(data) {
  return request({
    url: "/v1/platform/web/pm/productType/save",
    method: "post",
    data,
  });
}

/**
 * 编辑分类
 * @param {*} data 编辑参数
 * @returns
 */
export function editClassification(data) {
  return request({
    url: "/v1/platform/web/pm/productType/update",
    method: "post",
    data,
  });
}

/**
 * 删除分类
 * @param {*} data 编辑参数
 * @returns
 */
export function deleteClassification(data) {
  return request({
    url: "/v1/platform/web/pm/productType/delete",
    method: "post",
    data,
  });
}

/**
 * 获取固件列表
 * @param {*} data 编辑参数
 * @returns
 */
export function getFirmwareList(data) {
  return request({
    url: "/v1/platform/web/product/firmware/list",
    method: "post",
    data,
  });
}

/**
 * 固件启用禁用
 * @param {*} data 参数
 * @returns
 */
export function setFirmwareStatus(data) {
  return request({
    url: "/v1/platform/web/product/firmware/setStatus",
    method: "post",
    data,
  });
}

/**
 * 固件版本新增
 * @param {*} data 添加参数
 * @returns
 */
export function addFirmwareVersions(data) {
  return request({
    url: "/v1/platform/web/product/firmwareVersion/add",
    method: "post",
    data,
  });
}

/**
 * 固件版本新增
 * @param {*} data 编辑参数
 * @returns
 */
export function editFirmwareVersions(data) {
  return request({
    url: "/v1/platform/web/product/firmwareVersion/edit",
    method: "post",
    data,
  });
}

/**
 * 获取固件版本列表
 * @param {*} data 参数
 * @returns
 */
export function getFirmwareVersionslist(data) {
  return request({
    url: "/v1/platform/web/product/firmwareVersion/list",
    method: "post",
    data,
  });
}

/**
 * 固件版本上架
 * @param {*} data 编辑参数
 * @returns
 */
export function versionsOnShelf(data) {
  return request({
    url: "/v1/platform/web/product/firmwareVersion/onShelf",
    method: "post",
    data,
  });
}

/**
 * 固件版本下架
 * @param {*} data 编辑参数
 * @returns
 */
export function versionsUnShelf(data) {
  return request({
    url: "/v1/platform/web/product/firmwareVersion/unShelf",
    method: "post",
    data,
  });
}

/**
 * 新增固件
 * @param {*} data 新增参数
 * @returns
 */
export function addFirmware(data) {
  return request({
    url: "/v1/platform/web/product/firmware/add",
    method: "post",
    data,
  });
}

/**
 * 编辑固件
 * @param {*} data 编辑参数
 * @returns
 */
export function editFirmware(data) {
  return request({
    url: "/v1/platform/web/product/firmware/edit",
    method: "post",
    data,
  });
}

/**
 * 固件详情
 * @param string id 固件id
 * @returns
 */
export function firmwareDetails(id) {
  return request({
    url: "/v1/platform/web/product/firmware/detail/" + id,
    method: "get",
  });
}

/**
 * 固件删除
 * @param {*} data 固件id
 * @returns
 */
export function deleteFirmware(data) {
  return request({
    url: "/v1/platform/web/product/firmware/delete",
    method: "post",
    data,
  });
}

/**
 * 获取产品列表
 * @param {*} data 编辑参数
 * @returns
 */
export function getProductList(data) {
  return request({
    url: "/v1/platform/web/pm/product/get",
    method: "post",
    data,
  });
}

/**
 * 获取产品详情
 * @param {*} data 编辑参数
 * @returns
 */
export function getProductInfo(params) {
  return request({
    url: "/v1/platform/web/pm/product/get",
    method: "get",
    params,
  });
}

/**
 * 获取产品指令列表
 * @param {*} data 查询参数
 * @returns
 */
export function getProductInstruction(params) {
  return request({
    url: "/v1/platform/web/pm/thingModel/getStandard",
    method: "get",
    params,
  });
}

/**
 * 发布停用产品
 * @param {*} data 产品参数
 * @returns
 */
export function setProductStatus(data) {
  return request({
    url: "/v1/platform/web/pm/product/status",
    method: "post",
    data,
  });
}

/**
 * 删除产品
 * @param {*} data 产品id
 * @returns
 */
export function deleteProduct(data) {
  return request({
    url: "/v1/platform/web/pm/product/delete",
    method: "post",
    data,
  });
}

/**
 * 添加产品
 * @param {*} data 添加参数
 * @returns
 */
export function addProduct(data) {
  return request({
    url: "/v1/platform/web/pm/product/save",
    method: "post",
    data,
  });
}

/**
 * 编辑产品
 * @param {*} data 编辑参数
 * @returns
 */
export function editProduct(data) {
  return request({
    url: "/v1/platform/web/pm/product/update",
    method: "post",
    data,
  });
}

/**
 * 获取芯片模组列表
 * @param {*} data 编辑参数
 * @returns
 */
export function getChipList(data) {
  return request({
    url: "/v1/platform/web/product/module/list",
    method: "post",
    data,
  });
}

/**
 * 删除芯片模组
 * @param {*} data 芯片模组ID
 * @returns
 */
export function deleteChip(data) {
  return request({
    url: "/v1/platform/web/product/module/delete",
    method: "post",
    data,
  });
}

/**
 * 芯片模组详情
 * @param {*} data 芯片模组ID
 * @returns
 */
export function getChipInfo(data) {
  return request({
    url: `/v1/platform/web/product/module/detail/${data}`,
    method: "get",
  });
}

/**
 * 芯片模组添加
 * @param {*} data 芯片模组参数
 * @returns
 */
export function addChip(data) {
  return request({
    url: `/v1/platform/web/product/module/add`,
    method: "post",
    data,
  });
}

/**
 * 芯片模组编辑
 * @param {*} data 芯片模组参数
 * @returns
 */
export function editChip(data) {
  return request({
    url: `/v1/platform/web/product/module/edit`,
    method: "post",
    data,
  });
}

/**
 * 芯片模组状态设置
 * @param {*} data 芯片模组设置参数
 * @returns
 */
export function setChipStatus(data) {
  return request({
    url: `/v1/platform/web/product/module/setStatus`,
    method: "post",
    data,
  });
}

/**
 * 设备列表
 * @param {*} data 查询参数
 * @returns
 */
export function getDeviceList(data) {
  return request({
    url: `/v1/platform/web/iot/activeDevice/platformList`,
    method: "post",
    data,
  });
}

/**
 * 设备统计相关
 * @param {*} data 查询参数
 * @returns
 */
export function getDeviceCount(data) {
  return request({
    url: `/v1/platform/web/iot/activeDevice/count`,
    method: "post",
    data,
  });
}

/**
 * 设备日志
 * @param {*} data 查询参数
 * @returns
 */
export function getDeviceLog(data) {
  return request({
    url: `/v1/platform/web/iot/activeDevice/logList`,
    method: "post",
    data,
  });
}

/**
 * 设备日志
 * @param {*} data 查询参数
 * @returns
 */
export function getDeviceLogCount(data) {
  return request({
    url: `/v1/platform/web/iot/activeDevice/logCount`,
    method: "post",
    data,
  });
}

/**
 * 设备日志-事件列表
 * @param {*} data 查询参数
 * @returns
 */
export function getDeviceLogEventList(params) {
  return request({
    url: `/v1/platform/web/open/product/funcList`,
    method: "get",
    params,
  });
}

/**
 * 设备详情
 * @param {*} data 查询参数
 * @returns
 */
export function getDeviceInfo(data) {
  return request({
    url: `/v1/platform/web/iot/activeDevice/detail/${data}`,
    method: "get",
  });
}

/**
 * 获取配网方式的配网流程
 * @returns
 */
export function getNetworkGuideList() {
  return request({
    url: "/v1/platform/web/pm/networkGuide/GetDefaultNetworkGuides",
    method: "get",
  });
}

/**
 * 控制面板列表
 * @param {*} data 查询参数
 * @returns
 */
export function getControlPanelList(data) {
  return request({
    url: "/v1/platform/web/pm/controlPanel/list",
    method: "post",
    data,
  });
}

/**
 * 删除控制面板
 * @param {*} id 删除id
 * @returns
 */
export function deleteControlPanel(id) {
  return request({
    url: `/v1/platform/web/pm/controlPanel/delete/${id}`,
    method: "post",
    data: { id },
  });
}

/**
 * 添加控制面板
 * @param {*} data 添加参数
 * @returns
 */
export function addControlPanel(data) {
  return request({
    url: `/v1/platform/web/pm/controlPanel/add`,
    method: "post",
    data,
    timeout: 300000,
  });
}

/**
 * 编辑控制面板
 * @param {*} data 编辑参数
 * @returns
 */
export function editControlPanel(data) {
  return request({
    url: `/v1/platform/web/pm/controlPanel/edit`,
    method: "post",
    data,
    timeout: 300000,
  });
}

/**
 * 控制面板详情
 * @param {*} data 详情id
 * @returns
 */
export function getControlPanelDetails(id) {
  return request({
    url: `/v1/platform/web/pm/controlPanel/detail/${id}`,
    method: "get",
  });
}

/**
 * 控制面板-启用禁用
 * @param {*} data 提交参数
 * @returns
 */
export function setControlPanelStatus(data) {
  return request({
    url: `/v1/platform/web/pm/controlPanel/setStatus`,
    method: "post",
    data,
  });
}

/**
 * 刷新产品类型物模型
 * @param {*} params 提交参数
 * @returns
 */
export function resetProductThingModels(params) {
  return request({
    url: `/v1/platform/web/pm/product/resetProductThingModels`,
    method: "get",
    params
  });
}

/**
 * 平台获取开发者产品列表数据
 * @param {*} data 编辑参数
 * @returns
 */
export function getPlatformProductList(data) {
  return request({
    url: "/v1/platform/web/open/product/platformList",
    method: "post",
    data,
  });
}