<template>
  <div :class="prefixCls">
    <a-tabs v-model="currentTab" @change="handleTabChange">
      <a-tab-pane v-for="v in icons" :tab="v.title" :key="v.key">
        <ul style="height: 400px">
          <li
            v-for="(icon, key) in v.icons"
            :key="`${v.key}-${key}`"
            :class="{ active: selectedIcon == icon }"
            @click="handleSelectedIcon(icon)"
          >
            <icon-font :type="icon" :style="{ fontSize: '36px', color: '#343A40'}" />
          </li>
        </ul>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import icons from "./icons";

export default {
  name: "IconSelect",
  props: {
    prefixCls: {
      type: String,
      default: "ant-pro-icon-selector",
    },
    // eslint-disable-next-line
    value: {
      type: String,
    },
    loadType: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      selectedIcon: this.value || "",
      currentTab: "brand_logo",
      icons,
    };
  },
  watch: {
    value(val) {
      this.selectedIcon = val;
      this.autoSwitchTab();
    },
  },
  created() {
    if (this.loadType.length) {
      this.icons = icons.filter((value) =>
        this.loadType.some((item) => value.key === item)
      );
    }
    if (this.value) {
      this.autoSwitchTab();
    }
  },
  methods: {
    handleSelectedIcon(icon) {
      this.selectedIcon = icon;
      this.$emit("change", icon);
    },
    handleTabChange(activeKey) {
      this.currentTab = activeKey;
    },
    autoSwitchTab() {
      this.icons.some(
        (item) =>
          item.icons.some((icon) => icon === this.value) &&
          (this.currentTab = item.key)
      );
    },
  },
};
</script>

<style lang="less" scoped>
@import "../index.less";

ul {
  list-style: none;
  padding: 0;
  overflow-y: scroll;
  height: 250px;

  li {
    display: inline-block;
    padding: @padding-sm;
    margin: 3px 0;
    border-radius: @border-radius-base;

    &:hover,
    &.active {
      // box-shadow: 0px 0px 5px 2px @primary-color;
      cursor: pointer;
      color: @white;
      background-color: @primary-color;
    }
  }
}
</style>
