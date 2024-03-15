import request from "@/utils/request";

/**
 * 图片文件上传
 * @param {*} file 文件
 * @param {*} type 1 单文件 2 多文件
 * @param {*} source 3 七牛
 * @param {*} dir 产品图片 product 固件图片 firmware 模组文档 moduleDoc 模组图片 module
 * @returns
 */
export function uploadFile(data) {
  return request({
    url: "/v1/platform/web/common/fileStore/uploadOssFile",
    method: "post",
    data,
    timeout: 10*60*1000,
  });
}

// 文件下载
export function downloadTemplate(params) {
  return request({
    url: params.url,
    method: params.method || "get",
    params,
    data: params,
    responseType: "blob", // 返回格式，默认json，可选arraybuffer、blob、document、json、text、stream
  });
}
