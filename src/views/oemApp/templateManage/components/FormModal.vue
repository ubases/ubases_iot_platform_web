<template>
  <!-- 添加 编辑框 -->
  <a-modal title="确认复制吗？" :width="500" :visible="visible" :confirm-loading="confirmLoading" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-alert message="除了模板版本号，其他信息都会完整复制" banner/>
      <a-form-model ref="ruleForm" :model="form" :rules="rules">
        <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" label="模板版本号" prop="version">
          <a-input v-model="form.version" placeholder="请选择模板版本号"/>
          <span>版本号格式：xx.xx.xx</span>
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
import { VersionRules } from "@/utils/validate"
import { copyAppTemplate } from "@/api/oemApp"
export default {
  data() {
    return {
      id: "",
      visible: false,
      confirmLoading: false,
      form: {},
      rules: {
        version: VersionRules("请选择模板版本号"),
      },
      labelCol: { xs: { span: 24 }, sm: { span: 5 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 19 } },
    };
  },
  created() {

  },
  methods: {
    init(id) {
      this.id = id
      this.$refs["ruleForm"] && this.$refs["ruleForm"].resetFields();
      this.visible = true
    },

    handleOk() {
      this.$refs["ruleForm"].validate(async (valid) => {
        if (!valid) return
        const res = await copyAppTemplate({id:this.id, ...this.form})
        if(res.code !== 0) return
        this.$emit('handleOk')
        this.visible = false
      });
    },
    handleCancel() {
      this.visible = false
    },
  },
};
</script>
<style lang="less" scoped></style>
