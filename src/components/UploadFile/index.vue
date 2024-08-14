<template>
  <div class="aithings-upload-file">
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
    <div class="file-name" v-if="fileName">
      <div class="name">
        <icon-font :type="fileIcon" />
        {{ fileName }}
        <span class="link-a download" v-if="download" @click="onChangeDownload">下载</span>
      </div>
      <div class="link-a preview" v-if="preview">
        <a :href="propsFileSrc" target="_blank">预览</a>
      </div>
      
    </div>
    <a-button
      type="dashed"
      icon="cloud-upload"
      v-if="!disabled"
      :loading="loading"
      @click="onChangeFile"
    >
      {{ fileName ? "更新文件" : "上传文件" }}
    </a-button>
    <div class="file-hint" v-if="!disabled">{{ fileHint }}</div>
  </div>
</template>
<script>
export default {
  props: {
    // input文件类型限制
    propsAccept: {
      type: [Array],
      default: () => {
        return [".zip"];
      },
    },
    // 文件名
    propsFileName: {
      type: [String],
      default: "",
    },
    // 文件地址
    propsFileSrc: {
      type: [String],
      default: "",
    },
    // 文件类型限制
    fileType: {
      type: [Array],
      default: () => {
        return ['application/x-zip-compressed','application/octet-stream','application/zip','application/x-zip'];
      },
    },
    // 文件大小
    fileSize: {
      type: [Number],
      default: 1,
    },
    // 文件图标
    fileIcon: {
      type: [String],
      default: "folder",
    },
    // 是否提交上传
    isRequest: {
      type: [Boolean],
      default: false,
    },
    // 是否禁用
    disabled: {
      type: [Boolean],
      default: false,
    },
    // 提示语
    fileHint: {
      type: [String],
      default: "",
    },
    // 是否下载
    download: {
      type: [Boolean],
      default: false,
    },
    // 是否预览
    preview: {
      type: [Boolean],
      default: false,
    },
    // 文件oss表名
    fileDir: {
      type: [String],
      default: "",
    },
  },
  data() {
    return {
      accept: "",
      fileSrc: "",
      fileName: "",
      loading: false,
    };
  },
  created() {
    this.accept = this.propsAccept.join(",");
  },
  watch: {
    propsFileName: {
      handler: function (value) {
        this.fileName = value;
      },
      immediate: true,
    },
    propsFileSrc: {
      handler: function (value) {
        this.fileSrc = value;
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
      if (this.fileVerify(inputFile)) return; // 校验文件是否符合规则
      this.loading = true;
      if (this.isRequest) {
        if (!this.fileDir) return;
        let res = await this.$UploadFile({
          file: inputFile,
          dir: this.fileDir,
        });
        if (res && res.code == 0) {
          this.fileName = inputFile.name;
          this.$emit("ok", res.data); // 文件上传oss后的文件信息
          this.$message.success("上传成功");
        } else {
          this.$emit("error", { code: -1 });
          this.$message.error("上传失败");
        }
        this.loading = false;
      } else {
        setTimeout(() => {
          this.loading = false;
          this.fileName = inputFile.name;
          this.$emit("ok", { file: inputFile, name: this.fileName });
        }, 1000);
      }
    },
    fileVerify(file) {
      let isLimitType = false
      if(this.fileType.length>0 && !this.fileType.some(value =>value === file.type)){
        isLimitType = true
      } else if(this.propsAccept.length>0 && !this.propsAccept.some(value=>file.name.includes(value))){
        isLimitType = true
      }
      
      if (isLimitType) {
        this.$message.warning("请选择" + this.accept + "文件");
        return true;
      }
      const isLimit = file.size / 1024 / 1024 <= this.fileSize;
      if (!isLimit) {
        this.$message.warning("上传文件最大" + this.fileSize + "M");
        return true;
      }
      return false;
    },
    onChangeDownload() {
      console.log(11111111111111,this.propsFileSrc)
      if (this.propsFileSrc) {
        this.$DownloadFile(
          this.propsFileSrc,
          this.propsFileName || "不知名文件"
        );
      } else {
        this.$emit("download");
      }
    },
    onChangePreview() {},
  },
};
</script>
<style lang="less" scoped>
.aithings-upload-file {
  .file-name {
    .preview,
    .download {
      display: inline-block;
      text-decoration: underline;
      margin-left: 10px;
    }
    .name {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .file-hint {
    height: 18px;
    line-height: 18px;
    color: #ccc;
  }
}
</style>
