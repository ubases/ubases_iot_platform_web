// oemApp
import request from "@/utils/request";

/**
 * 底部菜单栏列表
 * @param {*} params 查询参数
 * @returns
 */
export function getFooterMenuList(params = {}) {
  return request({
    url: "/v1/platform/web/system/oemapp/menu",
    method: "get",
    params,
  });
}

/**
 * 底部菜单栏添加
 * @param {*} data 新增参数
 * @returns
 */
export function addFooterMenu(data = {}) {
  return request({
    url: "/v1/platform/web/system/oemapp/menu",
    method: "post",
    data,
  });
}

/**
 * 底部菜单栏编辑
 * @param {*} data 编辑参数
 * @returns
 */
export function editFooterMenu(data = {}) {
  return request({
    url: "/v1/platform/web/system/oemapp/menu/update",
    method: "post",
    data,
  });
}

/**
 * app语言包-详情
 * @param {*} params 查询参数
 * @returns
 */
export function getAppLangDetails(params = {}) {
  return request({
    url: "/v1/platform/web/lang/appResources/detail",
    method: "get",
    params,
  });
}

/**
 * app语言包-上传添加
 * @param {*} data 上传添加参数
 * @returns
 */
export function addAppLang(data = {}) {
  return request({
    url: "/v1/platform/web/lang/appResources/import",
    method: "post",
    data,
    timeout: 300000,
  });
}

/**
 * 帮助中心-获取帮助中心列表
 * @param {*} data 目录参数
 * @returns
 */
 export function getHelpCenterList(data = {}) {
  return request({
    url: "/v1/platform/web/system/app/helpCenter/list",
    method: "post",
    data,
  });
}

/**
 * 帮助中心-删除帮助中心
 * @param {*} data 目录参数
 * @returns
 */
 export function deleteHelpCenter(data = {}) {
  return request({
    url: "/v1/platform/web/system/app/helpCenter/del",
    method: "post",
    data,
  });
}

/**
 * 帮助中心-复制帮助中心
 * @param {*} data 目录参数
 * @returns
 */
 export function copyHelpCenter(data = {}) {
  return request({
    url: "/v1/platform/web/system/app/helpCenter/copy",
    method: "post",
    data,
  });
}


/**
 * 帮助中心-获取帮助中心详情
 * @param {*} params 查询参数
 * @returns
 */
 export function getHelpCenterDetail(params = {}) {
  return request({
    url: "/v1/platform/web/system/app/helpCenter/detail",
    method: "get",
    params,
  });
}

/**
 * 帮助中心-添加帮助中心
 * @param {*} data 目录参数
 * @returns
 */
 export function addHelpCenter(data = {}) {
  return request({
    url: "/v1/platform/web/system/app/helpCenter/add",
    method: "post",
    data,
  });
}

/**
 * 帮助中心-编辑帮助中心
 * @param {*} data 目录参数
 * @returns
 */
 export function editHelpCenter(data = {}) {
  return request({
    url: "/v1/platform/web/system/app/helpCenter/edit",
    method: "post",
    data,
  });
}

/**
 * 帮助中心-文档目录列表
 * @param {*} id 目录id
 * @returns
 */
export function getDocDirectoryList(params = {}) {
  return request({
    url: "/v1/platform/web/system/app/doc/directory",
    method: "get",
    params,
  });
}

/**
 * 帮助中心-添加文档目录
 * @param {*} data 目录参数
 * @returns
 */
export function addDocDirectory(data = {}) {
  return request({
    url: "/v1/platform/web/system/app/doc/directory",
    method: "post",
    data,
  });
}

/**
 * 帮助中心-编辑文档目录
 * @param {*} data 目录参数
 * @returns
 */
export function eidtDocDirectory(data = {}) {
  return request({
    url: "/v1/platform/web/system/app/doc/directory/update",
    method: "post",
    data,
  });
}

/**
 * 帮助中心-文档目录详情
 * @param {*} params 目录id
 * @returns
 */
export function getDocDirectoryDetails(params = {}) {
  return request({
    url: "/v1/platform/web/system/app/doc/directory/detail",
    method: "get",
    params,
  });
}

/**
 * 帮助中心-删除文档目录
 * @param {*} id 目录id
 * @returns
 */
export function deleteDocDirectory(data = {}) {
  return request({
    url: "/v1/platform/web/system/app/doc/directory/delete",
    method: "post",
    params: data,
  });
}

/**
 * 帮助中心-文档词条列表
 * @param {*} data 查询参数
 * @returns
 */
export function getDocEntryList(data = {}) {
  return request({
    url: "/v1/platform/web/system/app/doc/entry/list",
    method: "post",
    data,
  });
}

/**
 * 帮助中心-文档词条删除
 * @param {*} params {setingId}
 * @returns
 */
export function deleteDocEntry(params = {}) {
  return request({
    url: "/v1/platform/web/system/app/doc/entry/delete",
    method: "post",
    params,
  });
}

/**
 * 帮助中心-文档词条设置详情
 * @param {*} params {setingId}
 * @returns
 */
export function getDocEntrySetDetails(params = {}) {
  return request({
    url: "/v1/platform/web/system/app/doc/entry/seting",
    method: "get",
    params,
  });
}

/**
 * 帮助中心-文档词条设置提交
 * @param {*} data 设置参数
 * @returns
 */
export function setDocEntrySetDetails(data = {}) {
  return request({
    url: "/v1/platform/web/system/app/doc/entry/seting",
    method: "post",
    data,
  });
}

/**
 * 帮助中心-文档词条详情
 * @param {*} setingId 词条id
 * @param {*} lang 语种编码
 * @returns
 */
export function getDocEntryDetails(params = {}) {
  return request({
    url: "/v1/platform/web/system/app/doc/entry/detail",
    method: "get",
    params,
  });
}

/**
 * 帮助中心-文档词条添加
 * @param {*} data 添加参数
 * @returns
 */
export function addDocEntry(data = {}) {
  return request({
    url: "/v1/platform/web/system/app/doc/entry",
    method: "post",
    data,
  });
}

/**
 * APP模板列表查询
 * @param {*} data 添加参数
 * @returns
 */
 export function getAppTemplateList(data = {}) {
  return request({
    url: "/v1/platform/web/app/appTemplate/list",
    method: "post",
    data,
  });
}

/**
 * APP模板复制
 * @param {*} data 添加参数
 * @returns
 */
 export function copyAppTemplate(data = {}) {
  return request({
    url: "/v1/platform/web/app/appTemplate/copy",
    method: "post",
    data,
  });
}

/**
 * APP模板设置状态
 * @param {*} data 添加参数
 * @returns
 */
 export function setAppTemplateStatus(data = {}) {
  return request({
    url: "/v1/platform/web/app/appTemplate/setStatus",
    method: "post",
    data,
  });
}

/**
 * APP模板删除
 * @param {*} params {id}
 * @returns
 */
 export function deleteAppTemplate(id) {
  return request({
    url: "/v1/platform/web/app/appTemplate/delete/"+ id,
    method: "post",
  });
}

/**
 * APP模板详细信息查询
 * @param {*} id id
 * @returns
 */
 export function getAppTemplateDetail(id) {
  return request({
    url: "/v1/platform/web/app/appTemplate/detail/"+id,
    method: "get",
  });
}

/**
 * 开发者账号查询
 * @param {*} account 账号
 * @returns
 */
 export function queryByAccount(params) {
  return request({
    url: "/v1/platform/web/system/deve/basicList",
    method: "get",
    params
  });
}

/**
 * APP模板新增
 * @param {*} data 添加参数
 * @returns
 */
 export function addAppTemplate(data = {}) {
  return request({
    url: "/v1/platform/web/app/appTemplate/add",
    method: "post",
    data,
  });
}

/**
 * APP模板修改
 * @param {*} data 添加参数
 * @returns
 */
 export function editAppTemplate(data = {}) {
  return request({
    url: "/v1/platform/web/app/appTemplate/edit",
    method: "post",
    data,
  });
}

/**
 * 上架皮肤列表
 * @param {*} data 添加参数
 * @returns
 */
 export function getSkinList(data = {}) {
  return request({
    url: "/v1/platform/web/app/appTemplate/skinList",
    method: "post",
    data,
  });
}

/**
 * 上架皮肤删除
 * @param {*} data 添加参数
 * @returns
 */
 export function deleteSkin(id) {
  return request({
    url: "/v1/platform/web/app/appTemplate/skinDel/"+id,
    method: "post",
  });
}

/**
 * 上架皮肤详情
 * @param {*} params 添加参数
 * @returns
 */
 export function getSkinDetail(params) {
  return request({
    url: "/v1/platform/web/app/appTemplate/skinDetail",
    method: "get",
    params
  });
}

/**
 * 上架皮肤新增
 * @param {*} data 添加参数
 * @returns
 */
 export function addSkin(data = {}) {
  return request({
    url: "/v1/platform/web/app/appTemplate/skinAdd",
    method: "post",
    data,
  });
}

/**
 * 上架皮肤编辑
 * @param {*} data 添加参数
 * @returns
 */
 export function editSkin(data = {}) {
  return request({
    url: "/v1/platform/web/app/appTemplate/skinEdit",
    method: "post",
    data,
  });
}

/**
 * 辅助上架查询
 * @param {*} data 添加参数
 * @returns
 */
 export function getReleaseList(data = {}) {
  return request({
    url: "/v1/platform/web/app/assistRelease/list",
    method: "post",
    data,
  });
}

/**
 * 辅助上架设置状态
 * @param {*} data 添加参数
 * @returns
 */
 export function setReleaseStatus(data = {}) {
  return request({
    url: "/v1/platform/web/app/assistRelease/setStatus",
    method: "post",
    data,
  });
}

/**
 * 辅助上架删除
 * @param {*} data 添加参数
 * @returns
 */
 export function deleteRelease(id) {
  return request({
    url: "/v1/platform/web/app/assistRelease/del/"+ id,
    method: "post",
  });
}

/**
 * 辅助上架新增
 * @param {*} data 添加参数
 * @returns
 */
 export function addRelease(data = {}) {
  return request({
    url: "/v1/platform/web/app/assistRelease/add",
    method: "post",
    data,
  });
}

/**
 * 辅助上架修改
 * @param {*} data 添加参数
 * @returns
 */
 export function editRelease(data = {}) {
  return request({
    url: "/v1/platform/web/app/assistRelease/edit",
    method: "post",
    data,
  });
}

/**
 * 辅助上架信息查询
 * @param {*} params 添加参数
 * @returns
 */
 export function getReleaseDetail(id) {
  return request({
    url: "/v1/platform/web/app/assistRelease/detail/"+id,
    method: "get"
  });
}

/**
 * 开发者APP信息
 * @param {*} params 添加参数
 * @returns
 */
 export function getDevAppList(params) {
  return request({
    url: "/v1/platform/web/app/developer/appList",
    method: "get",
    params
  });
}

/**
 * 多语言列表
 * @param {*} data 添加参数
 * @returns
 */
 export function getAppLangList(data = {}) {
  return request({
    url: "/v1/platform/web/lang/appResourcesPackage/list",
    method: "post",
    data,
  });
}

/**
 * 多语言删除
 * @param {*} id 参数
 * @returns
 */
 export function deleteAppLang(id) {
  return request({
    url: "/v1/platform/web/lang/appResourcesPackage/delete/"+id,
    method: "post",
  });
}

/**
 * 多语言详情
 * @param {*} params 添加参数
 * @returns
 */
 export function getAppLangDetail(id) {
  return request({
    url: "/v1/platform/web/lang/appResourcesPackage/get/"+id,
    method: "get"
  });
}

/**
 * 多语言新增
 * @param {*} data 添加参数
 * @returns
 */
 export function addAppLangPkg(data = {}) {
  return request({
    url: "/v1/platform/web/lang/appResourcesPackage/add",
    method: "post",
    data,
  });
}

/**
 * 多语言编辑
 * @param {*} data 添加参数
 * @returns
 */
 export function editAppLang(data = {}) {
  return request({
    url: "/v1/platform/web/lang/appResourcesPackage/edit",
    method: "post",
    data,
  });
}