import request from "@/utils/request";
export function getPermissionList(params) {
  return request({
    url: "/permissions",
    method: "get",
    params,
  });
}

export function store(data) {
  return request({
    url: "/permissions",
    method: "post",
    data,
  });
}

export function read(id) {
  return request({
    url: "/permissions/" + id,
    method: "get",
  });
}

export function update(id, data) {
  return request({
    url: "/permissions/" + id,
    method: "post",
    data,
  });
}

export function del(id) {
  return request({
    url: "/permissions/" + id,
    method: "post",
  });
}

// 修改菜单状态
export function show(id, data) {
  return request({
    url: "/permissionsshow/" + id,
    method: "post",
    data,
  });
}
