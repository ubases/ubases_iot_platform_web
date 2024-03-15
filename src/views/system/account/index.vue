<template>
  <div class="aithings-account">
    <a-card :bordered="false">
      <a-tabs default-active-key="1" :tab-position="'left'">
        <a-tab-pane key="1" tab="基础设置">
          <base-setting></base-setting>
        </a-tab-pane>
        <a-tab-pane key="2" tab="安全设置">
          <update-pwd></update-pwd>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>
<script>
import UpdatePwd from "./components/UpdatePwd.vue";
import BaseSetting from "./components/BaseSetting.vue";
export default {
  name: "Account",
  components: {
    "update-pwd": UpdatePwd,
    "base-setting": BaseSetting,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
<style lang="less" scoped></style>
