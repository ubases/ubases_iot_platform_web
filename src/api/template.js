// 产品管理
import request from "@/utils/request";

/**
 * 通知模板列表
 * @param {*} data 查询参数
 * @returns
 */
export function getInformList(data = {}) {
  return request({
    url: "/v1/platform/web/template/noticeTpl/list",
    method: "post",
    data,
  });
}

/**
 * 删除通知模板
 * @param {*} data id
 * @returns
 */
export function deleteInform(data = {}) {
  return request({
    url: "/v1/platform/web/template/noticeTpl/delete",
    method: "post",
    data,
  });
}

/**
 * 添加通知模板
 * @param {*} data 添加参数
 * @returns
 */
export function addInform(data = {}) {
  return request({
    url: "/v1/platform/web/template/noticeTpl/add",
    method: "post",
    data,
  });
}

/**
 * 编辑通知模板
 * @param {*} data 编辑参数
 * @returns
 */
export function editInform(data = {}) {
  return request({
    url: "/v1/platform/web/template/noticeTpl/edit",
    method: "post",
    data,
  });
}

/**
 * 通知模板详情
 * @param {*} id 模板id
 * @returns
 */
export function getInformDetails(id) {
  return request({
    url: `/v1/platform/web/template/noticeTpl/detail/${id}`,
    method: "get",
  });
}

/**
 * 测试用例列表
 * @param {*} data 查询参数
 * @returns
 */
export function getTestList(data = {}) {
  return request({
    url: "/v1/platform/web/template/testCaseTpl/list",
    method: "post",
    data,
  });
}

/**
 * 测试用例-设置状态
 * @param {*} data 修改参数
 * @returns
 */
export function setTestStatus(data = {}) {
  return request({
    url: "/v1/platform/web/template/testCaseTpl/setStatus",
    method: "post",
    data,
  });
}

/**
 * 测试用例-添加
 * @param {*} data 添加参数
 * @returns
 */
export function addTest(data = {}) {
  return request({
    url: "/v1/platform/web/template/testCaseTpl/add",
    method: "post",
    data,
    timeout: 300000,
  });
}

/**
 * 测试用例-编辑
 * @param {*} data 编辑参数
 * @returns
 */
export function editTest(data = {}) {
  return request({
    url: "/v1/platform/web/template/testCaseTpl/edit",
    method: "post",
    data,
    timeout: 300000,
  });
}

/**
 * 测试用例-详情
 * @param {*} id 用例id
 * @returns
 */
export function getTestDetails(id) {
  return request({
    url: `/v1/platform/web/template/testCaseTpl/detail/${id}`,
    method: "get",
  });
}

/**
 * App协议列表
 * @param {*} data 查询参数
 * @returns
 */
export function getAgreementList(data = {}) {
  return request({
    url: "/v1/platform/web/template/documentTpl/list",
    method: "post",
    data,
  });
}

/**
 * App协议-删除
 * @param {*} id 协议ID
 * @returns
 */
export function deleteAgreement(data = {}) {
  return request({
    url: "/v1/platform/web/template/documentTpl/delete",
    method: "post",
    data,
  });
}

/**
 * App协议-修改状态
 * @param {*} id 协议ID
 * @returns
 */
export function setAgreementStatus(data = {}) {
  return request({
    url: "/v1/platform/web/template/documentTpl/setStatus",
    method: "post",
    data,
  });
}

/**
 * App协议-添加
 * @param {*} data 添加参数
 * @returns
 */
export function addAgreement(data = {}) {
  return request({
    url: "/v1/platform/web/template/documentTpl/add",
    method: "post",
    data,
  });
}

/**
 * App协议-编辑
 * @param {*} data 编辑参数
 * @returns
 */
export function editAgreement(data = {}) {
  return request({
    url: "/v1/platform/web/template/documentTpl/edit",
    method: "post",
    data,
  });
}

/**
 * App协议-详情
 * @param {*} id 协议ID
 * @returns
 */
export function getAgreementDetails(id) {
  return request({
    url: `/v1/platform/web/template/documentTpl/detail/${id}`,
    method: "get",
  });
}

/**
 * 消息模板-列表
 * @param {*} data 查询参数
 * @returns
 */
export function getMessageList(data) {
  return request({
    url: `/v1/platform/web/template/messageTpl/list`,
    method: "post",
    data,
  });
}

/**
 * 消息模板-添加
 * @param {*} data 添加参数
 * @returns
 */
export function addMessage(data) {
  return request({
    url: `/v1/platform/web/template/messageTpl/add`,
    method: "post",
    data,
  });
}

/**
 * 消息模板-编辑
 * @param {*} data 编辑参数
 * @returns
 */
export function editMessage(data) {
  return request({
    url: `/v1/platform/web/template/messageTpl/edit`,
    method: "post",
    data,
  });
}

/**
 * 消息模板-详情
 * @param {*} data 模板ID
 * @returns
 */
export function getMessageDetails(data) {
  return request({
    url: `/v1/platform/web/template/messageTpl/detail/${data}`,
    method: "get",
  });
}

/**
 * 消息模板-删除
 * @param {*} data 模板ID
 * @returns
 */
export function deleteMessage(data) {
  return request({
    url: `/v1/platform/web/template/messageTpl/delete`,
    method: "post",
    data,
  });
}
