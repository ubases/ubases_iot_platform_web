<template>
  <a-modal
    title="图片选择"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    :width="640"
    :footer="null"
    @cancel="cancelHandel"
  >
    <a-row>
      <a-col :xs="24" :md="12" :style="{ height: '350px' }">
        <vue-cropper
          v-if="!reloadCutter"
          ref="cropper"
          v-bind="options"
          @realTime="realTime"
        >
        </vue-cropper>
      </a-col>
      <a-col :xs="24" :md="12" :style="{ height: '350px' }">
        <div :class="previewCss || 'avatar-upload-preview'">
          <img :src="previews.url" :style="previews.img" />
        </div>
      </a-col>
    </a-row>
    <br />
    <a-row>
      <a-col :lg="2" :md="2">
        <a-upload
          name="file"
          accept=".jpg,.png,.bmp,.jpeg"
          :beforeUpload="beforeUpload"
          :showUploadList="false"
        >
          <a-button icon="upload">选择图片</a-button>
        </a-upload>
      </a-col>
      <a-col :lg="{ span: 1, offset: 2 }" :md="2">
        <a-button icon="plus" @click="changeScale(1)" />
      </a-col>
      <a-col :lg="{ span: 1, offset: 1 }" :md="2">
        <a-button icon="minus" @click="changeScale(-1)" />
      </a-col>
      <a-col :lg="{ span: 1, offset: 1 }" :md="2">
        <a-button icon="undo" @click="rotateLeft" />
      </a-col>
      <a-col :lg="{ span: 1, offset: 1 }" :md="2">
        <a-button icon="redo" @click="rotateRight" />
      </a-col>
      <a-col :lg="{ span: 2, offset: 6 }" :md="2">
        <a-button type="primary" @click="finish()">保存</a-button>
      </a-col>
    </a-row>
  </a-modal>
</template>
<script>
export default {
  props: {
    userId: {
      type: String,
      default: "",
    },
    mode: {
      type: String,
      default: "base64",
    },
    type: {
      type: String,
      default: "Temp",
    },
    autoCropWidth: {
      type: Number,
      default: 200,
    },
    autoCropHeight: {
      type: Number,
      default: 200,
    },
    previewCss: {
      type: String,
      defualt: "avatar-upload-preview",
    },
    fixedNumber: {
      type: Array,
      default: () => {
        return [1, 1];
      },
    },
  },
  data() {
    return {
      callback: function (imgpath) {},
      visible: false,
      id: null,
      confirmLoading: false,
      fileList: [],
      uploading: false,
      /**
      img	裁剪图片的地址	空	url 地址 || base64 || blob
      outputSize	裁剪生成图片的质量	1	0.1 - 1
      outputType	裁剪生成图片的格式	jpg (jpg 需要传入jpeg)	jpeg || png || webp
      info	裁剪框的大小信息	true	true || false
      canScale	图片是否允许滚轮缩放	true	true || false
      autoCrop	是否默认生成截图框	false	true || false
      autoCropWidth	默认生成截图框宽度	容器的80%	0~max
      autoCropHeight	默认生成截图框高度	容器的80%	0~max
      fixed	是否开启截图框宽高固定比例	true	true | false
      fixedNumber	截图框的宽高比例	[1, 1]	[宽度, 高度]
      full	是否输出原图比例的截图	false	true | false
      fixedBox	固定截图框大小 不允许改变	false	true | false
      canMove	上传图片是否可以移动	true	true | false
      canMoveBox	截图框能否拖动	true	true | false
      original	上传图片按照原始比例渲染	false	true | false
      centerBox	截图框是否被限制在图片里面	false	true | false
      high	是否按照设备的dpr 输出等比例图片	true	true | false
      infoTrue	true 为展示真实输出图片宽高 false 展示看到的截图框宽高	false	true | false
      maxImgSize	限制图片最大宽度和高度	2000	0-max
      enlarge	图片根据截图框输出比例倍数	1	0-max(建议不要太大不然会卡死的呢)
      mode	图片默认渲染方式	contain	contain , cover, 100px, 100% auto
       */
      options: {
        // img: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        img: "",
        info: true,
        autoCrop: true,
        autoCropWidth: this.autoCropWidth,
        autoCropHeight: this.autoCropHeight,
        fixedBox: true,
        fixedNumber: [1, 0.75], //this.fixedNumber,
        high: false,
        canScale: true,
        canMove: true,
        outputType: "jpeg",
        centerBox: true,
        full: false,
        infoTrue: false,
        canMoveBox: true,
      },
      previews: {},
      reloadCutter: false,
    };
  },
  watch: {
    userId: {
      handler(oldvalue, newvalue) {
        this.$nextTick(() => {
          this.reloadCutter = true;
          this.options.img = "";
          setTimeout(() => {
            this.reloadCutter = false;
          }, 100);
        });
      },
      immediate: true,
    },
  },
  methods: {
    open(_callback) {
      this.visible = true;
      this.callback = _callback;
      /* 获取原始头像 */
    },
    close() {
      this.id = null;
      this.visible = false;
    },
    cancelHandel() {
      this.close();
    },
    changeScale(num) {
      num = num || 1;
      this.$refs.cropper.changeScale(num);
    },
    rotateLeft() {
      this.$refs.cropper.rotateLeft();
    },
    rotateRight() {
      this.$refs.cropper.rotateRight();
    },
    beforeUpload(file) {
      return new Promise((resolve, reject) => {
        const isType =
          file.type === "image/jpg" ||
          file.type === "image/png" ||
          file.type === "image/bmp" ||
          file.type === "image/jpeg";
        if (!isType) {
          this.$message.warning("请选择.jpg,.png,.bmp,.jpeg图片");
          return reject(false);
        }
        const isLimit = file.size / 1024 / 1024 <= 1;
        if (!isLimit) {
          this.$message.warning("上传图片最大1M");
          return reject(false);
        }
        const reader = new FileReader();
        // 把Array Buffer转化为blob 如果是base64不需要
        // 转化为base64
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.options.img = reader.result;
        };
        return reject(true);
      });
    },

    // 上传图片（点击上传按钮）
    finish() {
      const _this = this;
      // 自动生成autoUpload、 自定义上传customUpload
      if (_this.mode === "autoUpload") {
        this.$refs.cropper.getCropBlob(async (data) => {
          let res = await this.$UploadFile({ file: data, dir: "avatar" });
          this.toast(res);
          if(res.code === 0){
            this.$emit("ok", { dataURL: res.data.fullPath });
            if (this.callback) {
              this.callback({ dataURL: res.data.fullPath });
            }
            this.visible = false;
          }
        });
      } else if (this.mode === "customUpload") {
        this.$refs.cropper.getCropBlob((data) => {
          this.$emit("ok", { file: data });
          if (this.callback) {
            this.callback({ dataURL: data });
          }
        });
      } else {
        this.$refs.cropper.getCropData((data) => {
          this.visible = false;
          this.$emit("ok", { dataURL: data });
          if (this.callback) {
            this.callback({ dataURL: data });
          }
        });
      }
    },
    okHandel() {
      const vm = this;

      vm.confirmLoading = true;
      setTimeout(() => {
        vm.confirmLoading = false;
        vm.close();
        vm.$message.success("上传头像成功");
      }, 2000);
    },

    realTime(data) {
      this.previews = data;
    },
  },
};
</script>

<style lang="less" scoped>
.avatar-upload-preview {
  position: absolute;
  top: 50%;
  transform: translate(50%, -50%);
  width: 200px;
  height: 200px;
  // border-radius: 50%;
  box-shadow: 0 0 4px #ccc;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
  }
}

.avatar-upload-preview_ext {
  position: absolute;
  top: 50%;
  transform: translate(10%, -50%);
  width: 400px;
  height: 300px;
  // border-radius: 50%;
  box-shadow: 0 0 4px #ccc;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
  }
}
</style>
