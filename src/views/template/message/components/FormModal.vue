<template>
  <!-- 添加 编辑框 -->
  <a-modal
    :title="modalTitle"
    :width="640"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form-model ref="ruleForm" :model="form" :rules="rules">
        <!-- 消息名称 -->
        <a-form-model-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          label="消息名称"
          prop="tplName"
        >
          <a-input placeholder="请输入消息名称" v-model="form.tplName" />
        </a-form-model-item>
        <!-- 消息平台 -->
        <a-form-model-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          label="消息平台"
          prop="pushType"
        >
          <a-select v-model="form.pushType" placeholder="请选择消息平台">
            <a-select-option
              v-for="v in $DictList('tpl_message_platform')"
              :key="v.key"
              :value="v.key"
            >
              {{ v.label }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 消息类型 -->
        <a-form-model-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          label="消息类型"
          prop="messageType"
        >
          <a-select v-model="form.messageType" placeholder="请选择模板类型">
            <a-select-option
              v-for="v in $DictList('tpl_message_type')"
              :key="v.key"
              :value="v.key"
            >
              {{ v.label }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 消息KEY -->
        <a-form-model-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          label="消息KEY"
          prop="tplCode"
        >
          <a-input placeholder="请输入消息KEY" v-model="form.tplCode" />
        </a-form-model-item>
        <!-- 中文内容 -->
        <a-form-model-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          label="中文内容"
          prop="tplContent"
        >
          <input-textarea
            placeholder="请输入中文内容"
            v-model="form.tplContent"
            @input="$refs['ruleForm'].clearValidate(['tplContent'])"
          >
          </input-textarea>
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
import { addMessage, getMessageDetails, editMessage } from "@/api/template";
import { CommonNameRules, CommonRules } from "@/utils/validate";
import { EN_NUMBER___REG } from "@/utils/validate";
export default {
  data() {
    return {
      id: "",
      type: "",
      modalTitle: "",
      visible: false,
      confirmLoading: false,
      form: {},
      rules: {
        tplName: CommonNameRules("请输入通知名称"),
        pushType: CommonRules("请选择消息平台", "number"),
        messageType: CommonRules("请选择消息类型", "number"),
        tplContent: CommonRules("请输入中文内容"),
        tplCode: [
          { required: true, message: "请输入消息KEY" },
          { required: true, min: 1, max: 50, message: `字符长度在1-50` },
          {
            required: true,
            pattern: EN_NUMBER___REG,
            message: "请输入英文,数字或者下划线",
          },
        ],
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 },
      },
    };
  },
  created() {},
  methods: {
    init(type, id) {
      this.type = type;
      this.$refs["ruleForm"] && this.$refs["ruleForm"].resetFields();
      this.form = {};
      if (this.type === "add") {
        this.modalTitle = "添加消息模板";
      } else if (this.type === "edit") {
        this.modalTitle = "编辑消息模板";
        this.id = id;
        this.confirmLoading = true;
        getMessageDetails(id)
          .then((res) => {
            if (res.code === 0) {
              this.form = res.data;
            }
          })
          .finally(() => {
            this.confirmLoading = false;
          });
      }
      this.visible = true;
    },
    handleOk() {
      this.$refs["ruleForm"].validate(async (valid) => {
        if (!valid) return;
        this.confirmLoading = true;
        let res;
        if (this.form.id) {
          res = await editMessage(this.form);
        } else {
          res = await addMessage(this.form);
        }
        this.toast(res);
        this.confirmLoading = false;
        if (res.code === 0) {
          this.$emit("ok");
          this.visible = false;
        }
      });
    },
    handleCancel() {
      this.visible = false;
    },
  },
};
</script>
<style lang="less" scoped></style>
