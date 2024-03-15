<template>
  <!-- 一种是ant自带字体图标 一种是阿里图标库引入使用的 通过前缀‘icon-’区分 一种是本地自定义图标 通过前缀‘custom-’区分
   -->
  <ali-icon-font class="icon" v-if="type.indexOf('icon-') === 0" :type="type" />
  <a-icon v-else-if="type.indexOf('custom-') === 0" :component="customIcon" />
  <a-icon v-else-if="type" :type="type" />
</template>
<script>
// 本地自定义图标
import icons from "@/core/icons";
// 阿里图标库
import { Icon } from "ant-design-vue";
const AliIconFont = Icon.createFromIconfontCN({
  scriptUrl: require("./iconfont.js"),
});
export default {
  props: {
    type: [String],
  },
  components: {
    "ali-icon-font": AliIconFont,
  },
  data() {
    let customIcon = icons[this.type] || "";
    return {
      customIcon,
    };
  },
  methods: {},
};
</script>
<style lang="less">
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  overflow: hidden;
}
</style>
