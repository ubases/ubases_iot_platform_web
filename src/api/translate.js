// 翻译
import request from "@/utils/request";

// 语言详情
export function getInfo(params) {
  return request({
    url: `/v1/platform/web/basedata/translate/detail`,
    method: "get",
    params,
  });
}

// 新增语言翻译
export function add(data) {
  return request({
    url: `/v1/platform/web/basedata/translate/add`,
    method: "post",
    data,
  });
}

// 编辑语言翻译
export function update(data) {
  return request({
    url: `/v1/platform/web/basedata/translate/edit`,
    method: "post",
    data,
  });
}

// 语言列表
export function getLanguageList(params) {
  return request({
    url: `/v1/platform/web/basedata/translate/detail`,
    method: "get",
    params,
  });
}
