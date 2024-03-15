<template>
  <div class="aithings-previewModal">
    <a-modal
      width="588px"
      :visible="previewVisible"
      :footer="null"
      :zIndex="2000"
      @cancel="previewVisible = false"
    >
      <div style="padding: 20px 30px; position: relative;">
          <a-icon v-if="index > 0" type="left-circle" @click="changeIndex(-1)"/>
          <img
            style="width: 100%; height: 500px; object-fit: contain"
            :src="url[index]"
          />
          <a-icon v-if="index < url.length-1" type="right-circle" @click="changeIndex(1)" />
      </div>
    </a-modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      type: "image",
      previewVisible: false,
      url: [],
      index: 0,
    };
  },
  methods: {
    changeIndex(num){
      this.index = this.index + num
    }
  },
};
</script>
<style lang="less" scoped>
.anticon {
  z-index: 9999;
  position: absolute;
  top: 50%;
  font-size: 24px;
}
.anticon-left-circle{
  left: -10px;
}
.anticon-right-circle{
  right: -10px;
}
</style>
