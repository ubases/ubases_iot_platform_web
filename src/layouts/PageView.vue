<template>
  <div>
    <div class="multi-tab">
      <multi-tab></multi-tab>
    </div>
    <route-view />
  </div>
</template>

<script>
import RouteView from "./RouteView.vue";
export default {
  name: "PageView",
  components: { "route-view": RouteView },
};
</script>
<style lang="less" scoped>
// 修改标签栏的样式
.multi-tab {
  /deep/ .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab-active {
    border: none;
    background-color: #f4f8fe;
  }
  /deep/ .ant-tabs-bar {
    border: none;
  }
  /deep/.ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab {
    border: none;
  }
}
</style>
