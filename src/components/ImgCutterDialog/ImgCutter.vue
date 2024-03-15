<template>
  <a-modal
    title="图片选择"
    :width="700"
    style="top: 40px"
    :footer="false"
    :bodyStyle="{ overflow: 'auto' }"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <template slot="footer">
      <a-button key="back" @click="handleCancel">取消</a-button>
      <a-button key="submit" type="primary" v-if="!id" @click="handleSubmit">
        保存
      </a-button>
    </template>
    <img-cutter
      ref="imgCutterModal"
      label="选择图片"
      :crossOrigin="true"
      crossOriginHeader="*"
      rate="2:2"
      toolBgc="none"
      :isModal="false"
      :showChooseBtn="true"
      :lockScroll="true"
      :boxWidth="616"
      :boxHeight="616"
      :cutWidth="200"
      :cutHeight="200"
      :sizeChange="true"
      :moveAble="true"
      :originalGraph="false"
      :smallToUpload="true"
      :saveCutPosition="true"
      :scaleAble="true"
      @cutDown="handleSubmit"
    >
    </img-cutter>
  </a-modal>
</template>

<script>
import ImgCutter from "vue-img-cutter";
export default {
  components: {
    "img-cutter": ImgCutter,
  },
  data() {
    return {
      visible: false,
      confirmLoading: false,
    };
  },
  methods: {
    open() {
      this.visible = true;
    },
    handleSubmit(result) {
      this.visible = false;
      this.$emit("ok", result);
    },
    handleCancel() {
      this.visible = false;
    },
  },
};
</script>
