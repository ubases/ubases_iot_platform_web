<template>
  <div class="aithings-image" :style="{ width: width, height: height }">
    <a-spin v-show="status === 1" />
    <img
      class="aithings-microcheiria"
      :style="{ width: '100%', height: '100%', 'object-fit': fit }"
      v-show="status === 2"
      :src="src"
      :alt="alt"
      @click="$PreviewModal({ url: src })"
      @load="onImgload"
      @error="onImgError"
    />
    <div class="error-hint" v-if="status === 3">加载失败</div>
  </div>
</template>
<script>
export default {
  props: {
    src: {
      type: String,
      default: '',
    },
    alt: {
      type: String,
      default: "",
    },
    fit: {
      type: String,
      default: "contain",
    },
    width: {
      type: String,
      default: "50px",
    },
    height: {
      type: String,
      default: "50px",
    },
  },
  data() {
    return {
      status: 1,
      loadSrc: "",
    };
  },
  methods: {
    onImgload() {
      this.status = 2;
    },
    onImgError() {
      this.status = 3;
    },
  },
};
</script>
<style lang="less" scoped>
.aithings-image {
  display: flex;
  align-items: center;
  justify-content: center;
}
.error-hint {
  font-size: 12px;
}
</style>
