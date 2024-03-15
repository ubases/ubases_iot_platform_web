<template>
  <a-card :bordered="false">
    <!-- 表格操作栏 -->
    <a-space>
      <a-button type="link" size="large">{{ roleInfo.name }}</a-button>
      <a-button type="primary" icon="plus" @click="handleSave()">
        保存
      </a-button>
      <a-button icon="redo" @click="handleSave()"> 重置 </a-button>
    </a-space>
    <div class="aithings-rloe-set">
      <div v-for="v in 10" :key="v">
        <div class="aithings-rloe-set-header">
          <a-checkbox v-model="checked">角色权限</a-checkbox>
        </div>
        <div class="aithings-rloe-set-list">
          <div class="aithings-rloe-set-checkbox">
            <a-checkbox v-model="checked">角色权限</a-checkbox>
          </div>
          <div class="aithings-rloe-set-checkbox">
            <a-checkbox v-model="checked">角色权限</a-checkbox>
          </div>
          <div class="aithings-rloe-set-checkbox">
            <a-checkbox v-model="checked">角色权限</a-checkbox>
          </div>
          <div class="aithings-rloe-set-checkbox">
            <a-checkbox v-model="checked">角色权限</a-checkbox>
          </div>
          <div class="aithings-rloe-set-checkbox">
            <a-checkbox v-model="checked">角色权限</a-checkbox>
          </div>
        </div>
      </div>
    </div>
  </a-card>
</template>
<script>

export default {
  props: {
    roleInfo: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      checked: false,
      checkedRules: [], // 当前角色的权限
      menuList: [], // 全部权限
    };
  },
  watch: {
    roleInfo(n, o) {
      this.init();
    },
  },
  methods: {
    init() {
    },
    handleSave() {},
  },
};
</script>
<style lang="less" scoped>
.aithings-rloe-set {
  padding: 20px 0;
  .aithings-rloe-set-header {
    padding: 10px 10px;
    background-color: rgb(241, 215, 220);
  }
  .aithings-rloe-set-list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: 20px;
  }
  .aithings-rloe-set-checkbox {
    width: 140px;
  }
}
</style>
