// 字典
import request from "@/utils/request";

/**
 * 字典类型数据列表
 * @param {*} params 查询参数
 * @returns
 */
 export function getDictTypeList(params) {
  return request({
    url: "/v1/platform/web/basedata/dicttype/list",
    method: "get",
    params,
  });
}

/**
 * 新增字典类型数据
 * @param {*} data 新增参数
 * @returns
 */
export function addDictType(data) {
  return request({
    url: "/v1/platform/web/basedata/dicttype/add",
    method: "post",
    data,
  });
}

/**
 * 编辑字典类型数据
 * @param {*} data 编辑参数
 * @returns
 */
export function updateDictType(data) {
  return request({
    url: "/v1/platform/web/basedata/dicttype/edit" ,
    method: "post",
    data,
  });
}

/**
 * 删除字典类型数据
 * @param {*} id 字典类型数据id
 * @returns
 */
export function deleteDictType(id) {
  return request({
    url: "/v1/platform/web/basedata/dicttype/delete/" + id,
    method: "post",
  });
}

/**
 * 字典数据列表
 * @param {*} params 查询参数
 * @returns
 */
export function getDictList(params) {
  return request({
    url: "/v1/platform/web/basedata/dictdata/list",
    method: "get",
    params,
  });
}

/**
 * 新增字典数据
 * @param {*} data 新增字段
 * @returns
 */
export function addDict(data) {
  return request({
    url: "/v1/platform/web/basedata/dictdata/add",
    method: "post",
    data,
  });
}

/**
 * 编辑字典数据
 * @param {*} data 编辑字段
 * @returns
 */
export function updateDict(data) {
  return request({
    url: "/v1/platform/web/basedata/dictdata/edit",
    method: "post",
    data,
  });
}

/**
 * 删除字典数据
 * @param string id 字典id
 * @returns
 */
export function deleteDict(id) {
  return request({
    url: "/v1/platform/web/basedata/dictdata/delete/" + id,
    method: "post",
  });
}

