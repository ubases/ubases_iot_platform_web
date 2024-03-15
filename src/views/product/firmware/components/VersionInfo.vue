<template>
  <a-modal title="查看版本信息" cancelText="" :width="640" :visible="visible" :confirm-loading="confirmLoading" @cancel="visible = false">
    <a-spin :spinning="confirmLoading">
      <a-form-model :model="form">
        <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" label="版本号">
          <div>{{ form.version }}</div>
        </a-form-model-item>
        <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" label="版本描述">
          <div>{{ form.desc }}</div>
        </a-form-model-item>
        <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" label="资源包">
          <upload-file fileIcon="folder" disabled download :propsFileName="form.zipFileName" :propsFileSrc="form.zipFilePath"></upload-file>
        </a-form-model-item>
        <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" label="OTA包">
          <upload-file fileIcon="folder" disabled download :propsFileName="form.fileName" :propsFileSrc="form.filePath"></upload-file>
        </a-form-model-item>
        <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" label="关键版本">
          {{ $DictName('yes_no', form.isMust) }}
        </a-form-model-item>
      </a-form-model>
    </a-spin>
    <template #footer>
      <a-button key="submit" type="primary" @click="handleOk" :loading="confirmLoading">
        确定
      </a-button>
    </template>
  </a-modal>
</template>
<script>
export default {
  data() {
    return {
      visible: false,
      confirmLoading: false,
      form: {},
      labelCol: { xs: { span: 24 }, sm: { span: 6 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 18 } },
    };
  },
  methods: {
    init(data) {
      this.visible = true;
      this.form = data;
    },
    handleOk() {
      this.visible = false;
    },
  },
};
</script>
<style lang="less" scoped></style>
