import { isIE } from "@/utils/util";

// 判断环境不是 prod ，加载 mock 服务
if (process.env.NODE_ENV == "development") {
  if (isIE()) {
    console.error(
      "[antd-pro] ERROR: `mockjs` NOT SUPPORT `IE` PLEASE DO NOT USE IN `production` ENV."
    );
  }
  // 使用同步加载依赖
  // 防止 vuex 中的 GetInfo 早于 mock 运行，导致无法 mock 请求返回结果
  const Mock = require("mockjs2");

  // require('./services/test')
  // require("./services/dev");

  Mock.setup({
    timeout: 800, // setter delay time
  });
}
