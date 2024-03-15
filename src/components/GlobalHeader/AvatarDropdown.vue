<template>
  <a-dropdown v-if="$store.getters.userInfo" placement="bottomRight">
    <template v-slot:overlay>
      <a-menu class="ant-pro-drop-down menu" :selected-keys="[]">
        <a-menu-item v-if="menu" key="center" @click="handleToCenter">
          <a-icon type="user" />
          个人中心
        </a-menu-item>
        <a-menu-divider v-if="menu" />
        <a-menu-item key="logout" @click="handleLogout">
          <a-icon type="logout" />
          退出登录
        </a-menu-item>
      </a-menu>
    </template>
    <span class="ant-pro-account-avatar">
      <a-avatar
        size="small"
        :src="`${$store.getters.avatar}`"
        class="antd-pro-global-header-index-avatar"
      />
      <span>{{ $store.getters.userInfo.userName }}</span>
    </span>
  </a-dropdown>
  <span v-else>
    <a-spin size="small" :style="{ marginLeft: 8, marginRight: 8 }" />
  </span>
</template>

<script>
import { Modal } from "ant-design-vue";

export default {
  name: "AvatarDropdown",
  props: {
    menu: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    handleToCenter() {
      this.$routerPush({
        path: "/system/account/index",
        name: "Account",
      });
    },
    handleLogout(e) {
      Modal.confirm({
        title: "退出",
        content: "确定是否退出",
        onOk: () => {
          return this.$store.dispatch("Logout", false).then(() => {
            this.$router.push({ name: "login" });
          });
        },
        onCancel() {},
      });
    },
  },
};
</script>

<style lang="less" scoped>
.ant-pro-drop-down {
  /deep/ .action {
    margin-right: 8px;
  }
  /deep/ .ant-dropdown-menu-item {
    min-width: 160px;
  }
}
.ant-pro-account-avatar {
  color: #fff;
}
</style>
