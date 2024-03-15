import { message } from "ant-design-vue";

export function toast(res, duration = 2) {
  if (res && (res.code === 200 || res.code === 0)) {
    message.success(res.msg, duration);
  }
}
