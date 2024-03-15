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
        <!-- 模板类型 -->
        <a-form-model-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          label="模板类型"
          prop="tplType"
        >
          <a-select v-model="form.tplType" placeholder="请选择模板类型">
            <a-select-option
              v-for="v in $DictList('tpl_notice_type')"
              :key="v.key"
              :value="v.key"
            >
              {{ v.label }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 通知类型 -->
        <a-form-model-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          label="通知方式"
          prop="method"
        >
          <a-select v-model="form.method" placeholder="请选择通知方式">
            <a-select-option
              v-for="v in $DictList('tpl_notice_method')"
              :key="v.key"
              :value="v.key"
            >
              {{ v.label }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
       
        <!-- 短信服务供应商 -->
        <a-form-model-item
          v-if="form.method != 2"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          label="短信服务供应商"
          prop="smsSupplier"
        >
          <a-select
            v-model="form.smsSupplier"
            placeholder="请选择短信服务供应商"
          >
            <a-select-option
              v-for="v in $DictList('sms_supplier')"
              :key="v.key"
              :value="v.key"
            >
              {{ v.label }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          v-if="form.method == 2"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          label="邮件服务供应商"
          prop="smsSupplier"
        >
          <a-select
            v-model="form.smsSupplier"
            placeholder="请选择邮件服务供应商"
          >
            <a-select-option
              v-for="v in $DictList('email_supplier')"
              :key="v.key"
              :value="v.key"
            >
              {{ v.label }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 第三方模板编码 -->
        <a-form-model-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          label="第三方模板编码"
          prop="thirdparyCode"
        >
          <a-input
            placeholder="请输入第三方模板编码"
            v-model="form.thirdparyCode"
          />
        </a-form-model-item>
         <!-- 通知名称 -->
         <a-form-model-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          label="通知名称"
          prop="tplName"
        >
          <a-input placeholder="请输入通知名称" v-model="form.tplName" />
        </a-form-model-item>
        <!-- 通知主题 -->
        <a-form-model-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          label="通知主题"
          prop="tplSubject"
        >
          <a-input placeholder="请输入通知主题" v-model="form.tplSubject" />
        </a-form-model-item>
        <a-form-model-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          label="模板语种"
          prop="lang"
        >
          <a-select v-model="form.lang" placeholder="请选择模板语种" :options="$DictList('language_type')" />
        </a-form-model-item>
        <!-- 通知内容 -->
        <a-form-model-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          label="通知内容"
          prop="tplContent"
        >
          <input-textarea
            placeholder="请输入通知内容"
            v-model="form.tplContent"
            :maxLength="1000"
            :rows="5"
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
import { addInform, getInformDetails, editInform } from "@/api/template";
import { CommonNameRules, CommonRules } from "@/utils/validate";
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
        method: CommonRules("请选择通知方式", "number"),
        smsSupplier: CommonRules("请选择短信服务商", "any"),
        tplType: CommonRules("请选择短信模板类型", "any"),
        tplSubject: CommonNameRules("请输入通知主题"),
        thirdparyCode: CommonNameRules("请输入第三方模板编码"),
        tplContent: CommonRules("请输入通知内容"),
        lang: CommonRules("请选择模板语种"),
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
      this.form = {
        tplName: "",
        tplSubject: "",
        tplContent: "",
      };
      if (this.type === "add") {
        this.modalTitle = "添加通知模板";
        this.form = {
          method:1
        }
      } else if (this.type === "edit") {
        this.modalTitle = "编辑通知模板";
        this.id = id;
        this.confirmLoading = true;
        getInformDetails(id)
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
          res = await editInform(this.form);
        } else {
          this.form.tplCode = this.form.thirdparyCode;
          res = await addInform(this.form);
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
