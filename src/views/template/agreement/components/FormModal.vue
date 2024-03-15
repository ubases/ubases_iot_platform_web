<template>
  <a-modal
    :title="modalTitle"
    :width="800"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form-model ref="ruleForm" :model="form" :rules="rules">
        <!-- 协议名称 -->
        <a-form-model-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          label="协议名称"
          prop="tplName"
        >
          <a-input placeholder="请输入协议名称" v-model="form.tplName" />
        </a-form-model-item>
        <a-form-model-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          label="协议类型"
          prop="tplType"
        >
          <a-select v-model="form.tplType" placeholder="请选择协议类型">
            <a-select-option
              v-for="v in $DictList('tpl_document_type')"
              :key="v.key"
              :value="v.key"
            >
              {{ v.label }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 语种 -->
        <a-form-model-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          label="语种"
          prop="lang"
        >
          <a-select v-model="form.lang" placeholder="请选择语种">
            <a-select-option
              :value="v.code"
              v-for="v in langTypeList"
              :key="v.code"
            >
              {{ v.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 协议内容 -->
        <a-form-model-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          label="协议内容"
          prop="tplContent"
        >
          <quill-editor
            v-model="form.tplContent"
            @input="$refs['ruleForm'].clearValidate(['tplContent'])"
          ></quill-editor>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
    <template #footer>
      <a-button key="back" @click="handleCancel">取消</a-button>
      <a-divider type="vertical" />
      <a-button
        key="submit"
        type="primary"
        @click="handleOk"
        :loading="confirmLoading"
      >
        确定
      </a-button>
    </template>
  </a-modal>
</template>
<script>
import QuillEditor from "@/components/Editor/QuillEditor.vue";
import {
  addAgreement,
  getAgreementDetails,
  editAgreement,
} from "@/api/template";
import { CommonRules, CommonNameRules } from "@/utils/validate";
import { mapGetters } from "vuex";
export default {
  components: {
    "quill-editor": QuillEditor,
  },
  data() {
    const checkLength = (rule, value, callback) => {
      let str = this.filgerHtmlTag(value);
      if (str.length > 50000) {
        callback(new Error("长度在1-50000个字符"));
      } else {
        callback();
      }
    };
    return {
      modalTitle: "",
      id: "",
      visible: false,
      confirmLoading: false,
      form: {},
      rules: {
        tplName: CommonNameRules("请输入协议名称"),
        lang: CommonRules("请选择语种"),
        tplType: CommonRules("请选择协议类型", "any"),
        tplContent: [
          {
            required: true,
            message: "请输入模板内容",
          },
          // { required: true, validator: checkLength },
        ],
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 21 },
      },
    };
  },
  computed: {
    ...mapGetters(["langTypeList"]),
  },
  methods: {
    async init(type, id = "") {
      this.form = {
        tplName: "",
        // lang: "", // 显示placeholder
        tplContent: "",
        status: 2, // 默认停用
      };
      this.id = id;
      if (type === "add") {
        this.modalTitle = "添加协议";
      } else if (type === "edit") {
        this.modalTitle = "编辑协议";
        let res = await getAgreementDetails(this.id);
        if (res.code === 0) {
          this.form = res.data;
        }
      }
      this.visible = true;
      this.$refs["ruleForm"] && this.$refs["ruleForm"].clearValidate();
    },
    filgerHtmlTag(data) {
      let msg = data.replace(/<\/?[^>]*>/g, "");
      msg = msg.replace(/[|]*\n/, "");
      msg = msg.replace(/&npsp;/gi, "");
      return msg;
    },
    handleOk() {
      this.$refs["ruleForm"].validate(async (valid) => {
        if (!valid) return;
        this.confirmLoading = true;
        let res;
        if (this.form.id) {
          res = await editAgreement(this.form);
        } else {
          res = await addAgreement(this.form);
        }
        if (res.code === 0) {
          this.$emit("ok");
          this.visible = false;
        }
        this.toast(res);
        this.confirmLoading = false;
      });
    },
    handleCancel() {
      this.visible = false;
    },
  },
};
</script>
<style lang="less" scoped></style>
