// 日志管理
import request from "@/utils/request";

/**
 * app用户日志列表
 * @param {*} data 查询参数
 * @returns
 */
export function getAppUserLogList(data = {}) {
  return request({
    url: "/v1/platform/web/log/app/userList",
    method: "post",
    data,
  });
}

/**
 * app用户日志记录
 * @param {*} data 查询参数
 * @returns
 */
export function getAppUserLogRecords(data = {}) {
  return request({
    url: "/v1/platform/web/log/app/recordsList",
    method: "post",
    data,
  });
}
