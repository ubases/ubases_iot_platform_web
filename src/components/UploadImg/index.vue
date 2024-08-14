<template>
  <div>
    <div class="upload-wrap">
      <a-button type="dashed" class="aithings-upload-img">
        <input
          v-show="false"
          ref="file"
          type="file"
          :disabled="disabled"
          :accept="accept"
          @click="
            (e) => {
              e.target.value = '';
            }
          "
          @change="getFileData"
        />
        <!-- 启用上传 -->
        <template v-if="!disabled">
          <!-- 上传前 -->
          <div
            class="upload-add"
            v-if="!loading && !imgSrc"
            @click="onChangeFile"
          >
            <a-icon class="add-icon" type="plus" />
            <div class="add">上传图片</div>
          </div>
          <!-- 上传中 -->
          <div class="upload-loading" v-if="loading">
            <a-spin />
          </div>
          <!-- 上传后 -->
          <div class="upload-edit" v-if="!loading && imgSrc">
            <img
              style="object-fit: contain"
              :src="imgSrc"
              @click="handlePreview"
            />
            <div class="edit" @click="onChangeFile">上传</div>
          </div>
        </template>
        <!-- 禁用上传 -->
        <template v-else>
          <div class="upload-details">
            <img
              style="object-fit: contain"
              v-if="imgSrc"
              :src="imgSrc"
              @click="handlePreview"
            />
          </div>
        </template>
      </a-button>
      <div class="link-a download" v-if="download" @click="onChangeDownload">下载</div>
    </div>
    
    <div class="img-hint" v-if="imgHint">{{ imgHint }}</div>
  </div>
</template>
<script>
import { calculateImageSize } from "@/utils/util";
export default {
  props: {
    // input文件类型限制
    propsAccept: {
      type: [Array],
      default: () => {
        return [".jpg", ".png", ".bmp", ".jpeg"];
      },
    },
     // 文件名
     propsFileName: {
      type: [String],
      default: "",
    },
    // 文件地址
    propsImgSrc: {
      type: [String],
      default: "",
    },
    // 文件类型限制
    fileType: {
      type: [Array],
      default: () => {
        return ["image/jpg", "image/png", "image/bmp", "image/jpeg"];
      },
    },
    // 图片尺寸模式(限制) 1 宽高是否符合规则 2 宽高是否相等 3 不做任何处理(获取图片宽高)
    imgSizeMode: {
      type: [Number],
      default: 3,
    },
    imgWidth: {
      type: [Number],
      default: 0,
    },
    imgHeight: {
      type: [Number],
      default: 0,
    },
    // 图片大小限制
    imgSize: {
      type: [Number],
      default: 1,
    },
    // 是否禁用
    disabled: {
      type: [Boolean],
      default: false,
    },
    // 提示语
    imgHint: {
      type: [String],
      default: "",
    },
    // 是否提交上传
    imgRequest: {
      type: [Boolean],
      default: false,
    },
    // 图片oss表名
    imgDir: {
      type: [String],
      default: "",
    },
    // 是否下载
    download: {
      type: [Boolean],
      default: false,
    },
  },
  data() {
    return {
      accept: "",
      imgSrc: "",
      loading: false,
    };
  },
  created() {
    this.accept = this.propsAccept.join(",");
  },
  watch: {
    propsImgSrc: {
      handler: function (value) {
        this.imgSrc = value;
      },
      immediate: true,
    },
  },
  methods: {
    onChangeFile() {
      this.$refs.file.dispatchEvent(new MouseEvent("click"));
    },
    async getFileData() {
      const inputFile = this.$refs.file.files[0];
      if (await this.fileVerify(inputFile)) return; // 校验图片是否符合规则
      this.loading = true;
      if (!this.imgRequest) {
        // 获取本地图片展示到页面 不执行实际上传流程
        const reader = new FileReader();
        reader.readAsDataURL(inputFile);
        reader.onload = () => {
          this.imgSrc = reader.result;
          // 模拟上传过程
          setTimeout(() => {
            this.$emit("ok", { file: inputFile, src: this.imgSrc }); // 文件本体
            this.loading = false;
          }, 500);
        };
        return;
      } else {
        if (!this.imgDir) return;
        let res = await this.$UploadFile({ file: inputFile, dir: this.imgDir });
        if (res && res.code == 0) {
          this.$emit("ok", res.data); // 文件上传oss后的文件信息
          this.imgSrc = res.data.fullPath; // 图片回显
          this.$message.success("上传成功");
        } else {
          this.$emit("error", { code: -1 });
          this.$message.error("上传失败");
        }
        this.loading = false;
      }
    },
    async fileVerify(file) {
      let isType = this.fileType.some((value) => {
        return value === file.type;
      });
      if (!isType) {
        this.$message.warning("请选择" + this.accept + "图片");
        return true;
      }
      const isLimit = file.size / 1024 / 1024 <= this.imgSize;
      if (!isLimit) {
        this.$message.warning("上传图片最大" + this.imgSize + "M");
        return true;
      }
      const sizeMode = await calculateImageSize({
        file,
        mode: this.imgSizeMode,
        width: this.imgWidth,
        height: this.imgHeight,
      });
      if (!sizeMode) {
        this.$message.warning("图片尺寸不符合规则");
        return true;
      }
      return false;
    },
    handlePreview() {
      this.$PreviewModal({ url: this.imgSrc });
    },
    onChangeDownload() {
      if (this.propsImgSrc) {
        this.$DownloadFile(
          this.propsImgSrc,
          this.propsFileName || "不知名文件"
        );
      } else {
        this.$emit("download");
      }
    },
  },
};
</script>
<style lang="less" scoped>
.aithings-upload-img {
  width: 104px;
  height: 104px;
  padding: 2px;
  border-radius: 6px;
  .upload-add,
  .upload-loading,
  .upload-edit,
  .upload-details {
    position: relative;
    width: 98px;
    height: 98px;
    img {
      width: 98px;
      height: 98px;
      border-radius: 6px;
      border: none;
      object-fit: cover;
    }
  }
  .upload-add {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .add-icon {
      font-size: 18px;
      color: #ccc;
    }
    .add {
      height: 18px;
      line-height: 18px;
      color: #ccc;
    }
  }
  .upload-loading {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .upload-edit {
    .edit {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 98px;
      height: 30px;
      border-radius: 0 0 6px 6px;
      line-height: 30px;
      text-align: center;
      color: #fff;
      background-color: rgba(0, 0, 0, 0.6);
    }
  }

}
.upload-wrap{
  display: flex;
  align-items: center;
  .download{
    padding-left: 20px;
    text-decoration: underline;
  }
}
.img-hint {
  height: 18px;
  line-height: 18px;
  color: #ccc;
}
</style>
