<template>
  <a-modal :title="modalTitle" :width="800" :visible="visible" :confirm-loading="confirmLoading" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form-model ref="ruleForm" :model="form" :rules="rules">
        <!-- 语种 -->
        <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" label="语种" prop="lang">
          <a-select v-model="form.lang" placeholder="请选择语种" @change="onChangeLang">
            <a-select-option :value="v.code" v-for="v in langTypeList" :key="v.code">
              {{ v.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 标题 -->
        <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" label="标题" prop="title">
          <a-input placeholder="请输入协议名称" v-model="form.title" />
        </a-form-model-item>
        <!-- 内容 -->
        <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" label="内容" prop="content">
          <quill-editor v-model="form.content" @input="$refs['ruleForm'].clearValidate(['content'])"></quill-editor>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
    <template #footer>
      <a-button key="back" @click="handleCancel">取消</a-button>
      <a-divider type="vertical" />
      <a-button key="submit" type="primary" @click="handleOk" :loading="confirmLoading">
        确定
      </a-button>
    </template>
  </a-modal>
</template>
<script>
import { mapGetters } from "vuex";
import QuillEditor from "@/components/Editor/QuillEditor.vue";
import { getDocEntryDetails, addDocEntry } from "@/api/oemApp";
import { CommonLengthRules, CommonRules } from "@/utils/validate";
export default {
  components: {
    "quill-editor": QuillEditor,
  },
  data() {
    return {
      modalTitle: "目录编辑",
      visible: false,
      confirmLoading: false,
      id: "",
      form: {},
      rules: {
        lang: CommonRules("请选择语种"),
        title: CommonLengthRules(1, 50, "请输入标题(字符长度1-50)", true),
        content: CommonRules("请输入内容"),
      },
      labelCol: { xs: { span: 24 }, sm: { span: 3 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 21 } },
      queryParam: {
        setingId: "",
        lang: "",
      },
      type: "",
    };
  },
  computed: {
    ...mapGetters(["langTypeList"]),
  },
  methods: {
    init(setingId, dirId, lang = "", type) {
      this.visible = true;
      this.type = type;
      this.$refs["ruleForm"] && this.$refs["ruleForm"].resetFields();
      if (!this.langTypeList.length) return;
      this.form = {
        lang,
        setingId,
        dirId,
        content: "",
        title: "",
      };
      this.queryParam.setingId = setingId;
      this.queryParam.lang = lang || this.langTypeList[0].code;
      this.getLangDetails();
    },
    getLangDetails() {
      if (this.type === "add") return; // 初始添加不执行查询操作
      this.confirmLoading = true;
      getDocEntryDetails(this.queryParam)
        .then((res) => {
          if (res.code !== 0) return;
          this.form = res.data;
        })
        .finally(() => {
          this.confirmLoading = false;
        });
    },
    handleOk() {
      this.$refs["ruleForm"].validate(async (valid) => {
        if (!valid) return;
        this.confirmLoading = true;
        let res = await addDocEntry(this.form);
        if (res.code === 0) {
          this.visible = false;
          this.$emit("ok");
        }
        this.toast(res);
        this.confirmLoading = false;
      });
    },
    handleCancel() {
      this.visible = false;
    },
    onChangeLang(e) {
      this.queryParam.lang = e;
      this.getLangDetails();
    },
  },
};
</script>
<style lang="less" scoped></style>
