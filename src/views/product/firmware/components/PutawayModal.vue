<template>
  <a-modal title="查看版本信息" cancelText="" :width="640" :visible="visible" :confirm-loading="confirmLoading" @cancel="visible = false">
    <a-spin :spinning="confirmLoading">
      <a-form-model>
        <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" label="固件名称">
          <div>{{ firmwareForm.name }}</div>
        </a-form-model-item>
        <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" label="固件类型">
          <div>{{ firmwareForm.typeName }}</div>
        </a-form-model-item>
        <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" label="固件KEY">
          <div>{{ firmwareForm.id }}</div>
        </a-form-model-item>
        <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" label="固件标识">
          <div>{{ firmwareForm.flag }}</div>
        </a-form-model-item>
        <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" label="Flash大小">
          <div>{{ $DictName("flash_size", firmwareForm.flashSize) }}</div>
        </a-form-model-item>
        <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" label="升级超时时间">
          <div>{{ firmwareForm.upgradeOvertime }}S</div>
        </a-form-model-item>
        <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" label="版本号">
          <div>{{ versionForm.version }}</div>
        </a-form-model-item>
        <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" label="版本描述">
          <div>{{ versionForm.desc }}</div>
        </a-form-model-item>
        <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" label="固件包">
          <upload-file
            fileIcon="folder"
            disabled
            download
            :propsFileName="versionForm.fileName"
            :propsFileSrc="versionForm.filePath"
          ></upload-file>
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
import { versionsOnShelf } from "@/api/product";
export default {
  data() {
    return {
      visible: false,
      confirmLoading: false,
      versionForm: {},
      firmwareForm: {},
      labelCol: { xs: { span: 24 }, sm: { span: 6 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 18 } },
    };
  },
  methods: {
    init(item, data) {
      this.visible = true;
      this.versionForm = item;
      this.firmwareForm = data;
    },
    handleOk() {
      this.confirmLoading = true;
      // 上架
      versionsOnShelf({
        id: this.versionForm.id,
      })
        .then((res) => {
          this.toast(res);
        })
        .finally(() => {
          this.visible = false;
          this.confirmLoading = false;
          this.$emit("ok");
        });
    },
  },
};
</script>
<style lang="less" scoped></style>
