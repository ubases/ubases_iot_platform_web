<template>
  <a-spin :spinning="spinning">
  <div :class="prefixCls">
    <input
      id="quill-img"
      type="file"
      accept=".jpg,.png,.bmp,.jpeg"
      v-show="false"
      @change="onChangeImg"
    />
    <input
      id="quill-video"
      type="file"
      accept=".mp4"
      v-show="false"
      @change="onChangeVideo"
    />
    <quill-editor
      v-model="content"
      ref="myQuillEditor"
      :options="editorOption"
      @input="onEditorInput($event)"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @ready="onEditorReady($event)"
      @change="onEditorChange($event)"
    >
    </quill-editor>
  </div>
</a-spin>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
// 背景颜色 - background
// 加粗- bold
// 颜色 - color
// 字体 - font
// 内联代码 - code
// 斜体 - italic
// 链接 - link
// 大小 - size
// 删除线 - strike
// 上标/下标 - script
// 下划线 - underline
// 引用- blockquote
// 标题 - header
// 缩进 - indent
// 列表 - list
// 文本对齐 - align
// 文本方向 - direction
// 代码块 - code-block
// 公式 - formula
// 图片 - image
// 视频 - video
// 清除字体样式- clean
var container = [
  //以下内容可根据自己需要进行自定义
  ["bold", "italic", "underline", "strike"], // 加粗，斜体，下划线，删除线
  ["blockquote", "code-block"], //引用，代码块
  [
    {
      header: 1,
    },
    {
      header: 2,
    },
  ], // 几级标题
  [
    {
      list: "ordered",
    },
    {
      list: "bullet",
    },
  ], // 有序列表，无序列表
  [
    {
      script: "sub",
    },
    {
      script: "super",
    },
  ], // 下角标，上角标
  [
    {
      indent: "-1",
    },
    {
      indent: "+1",
    },
  ], // 缩进
  [
    {
      direction: "rtl",
    },
  ], // 文字输入方向
  [
    {
      size: [],
    },
  ], // 字体大小
  [
    {
      header: [1, 2, 3, 4, 5, 6, false],
    },
  ], // 标题
  [
    {
      color: [],
    },
    {
      background: [],
    },
  ], // 颜色选择
  [
    {
      font: [],
    },
  ], // 字体
  [
    {
      align: [],
    },
  ], // 居中
  ["clean"], // 清除样式
  ["image"],
  // ["video"],
  ["link"],
];
export default {
  name: "QuillEditor",
  components: {
    quillEditor,
  },
  props: {
    prefixCls: {
      type: String,
      default: "ant-editor-quill",
    },
    // 表单校验用字段
    // eslint-disable-next-line
    value: {
      type: String,
    },
  },
  data() {
    return {
      content: null,
      editorOption: {
        modules: {
          toolbar: {
            container,
            handlers: {
              image: function (value) {
                if (value) {
                  document.getElementById("quill-img").click();
                } else {
                  this.quill.format("image", false);
                }
              },
              video: function (value) {
                if (value) {
                  document.getElementById("quill-video").click();
                } else {
                  this.quill.format("video", false);
                }
              },
            },
          },
        },
      },
      spinning: false,
    };
  },
  watch: {
    value (val) {
      this.content = val
    },
  },
  mounted(){
    this.content = this.value
  },
  methods: {
    // 上传视频
    onChangeVideo() {
      let file = document.getElementById("quill-video").files[0];
      const isType = file.type === "video/mp4";
      if (!isType) {
        this.$message.warning("请选择.mp4视频");
        return;
      }
      this.uploadFile("video", file);
    },
    // 上传图片
    onChangeImg() {
      let file = document.getElementById("quill-img").files[0];
      const isType =
        file.type === "image/jpg" ||
        file.type === "image/png" ||
        file.type === "image/bmp" ||
        file.type === "image/jpeg";
      if (!isType) {
        this.$message.warning("请选择.jpg,.png,.bmp,.jpeg图片");
        return;
      }
      this.uploadFile("image", file);
    },
    async uploadFile(type, file) {
      this.spinning = true
      let res = await this.$UploadFile({ file, dir: "quillEditor" });
      if (res && res.code == 0) {
        let quill = this.$refs.myQuillEditor.quill;
        let length = quill.getSelection().index; //获取插件光标index
        quill.insertEmbed(length, type, res.data.fullPath); //将img插入光标所在位置
        quill.setSelection(length + 1); //光标位置下移
        this.spinning = false
        // var img_append = document.querySelector(".ql-snow .ql-editor img"); //选择图片区域
        // img_append.setAttribute("style", "max-width:300px;max-height:400px;"); //设置最大宽高
      } else{
        this.spinning = false
      }
    },
    onEditorInput(e) {
      this.$emit("input", e);
    },
    onEditorBlur(quill) {
      // console.log('editor blur!', quill)
    },
    onEditorFocus(quill) {
      // this.$emit("focus", quill);
    },
    onEditorReady(quill) {
      // console.log("editor ready!", quill);
    },
    onEditorChange({ quill, html, text }) {
      // console.log('editor change!', quill, html, text)
      this.$emit("change", html);
    },
  },
};
</script>

<style lang="less" scoped>
@import url("../index.less");

/* 覆盖 quill 默认边框圆角为 ant 默认圆角，用于统一 ant 组件风格 */
.ant-editor-quill {
  line-height: initial;
  /deep/ .ql-toolbar.ql-snow {
    border-radius: @border-radius-base @border-radius-base 0 0;
  }
  /deep/ .ql-container.ql-snow {
    border-radius: 0 0 @border-radius-base @border-radius-base;
  }
}

/deep/ .ql-editor {
  height: 300px;
}
</style>
