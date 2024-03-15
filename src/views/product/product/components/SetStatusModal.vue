<template>
  <a-modal
    :title="modalTitle"
    :width="640"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <p v-if="status == 1">
        发布后，以下信息将不能修改，请确保以下信息正确无误！<br />
        发布成功后，本产品类型将在开放平台展示
      </p>
      <p v-if="status == 2">
        停用后，本产品类型将不在开放平台展示，开放平台原有的该类型产品，不受影响
      </p>
      <a-form-model
        :label-col="{
          xs: { span: 24 },
          sm: { span: 4 },
        }"
        :wrapperCol="{
          xs: { span: 24 },
          sm: { span: 20 },
        }"
      >
        <a-form-model-item label="产品名称">{{ info.name }}</a-form-model-item>
        <a-form-model-item label="产品分类">
          {{ info.productTypeName }}
        </a-form-model-item>
        <a-form-model-item label="设备性质">
          <div>{{ $DictName("device_nature", info.attributeType) }}</div>
        </a-form-model-item>
        <a-form-model-item label="通讯协议">
          {{ $DictName("network_type", info.networkType) }}
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
import { setProductStatus } from "@/api/product";
export default {
  props: {
    productTypeList: {
      type: Array,
      default: ()=>[],
    },
  },
  data() {
    return {
      info: {},
      status: null,
      modalTitle: null,
      visible: false,
      confirmLoading: false,
    };
  },
  methods: {
    init(msg, info, status) {
      this.modalTitle = msg;
      this.info = info;
      this.status = status;
      this.visible = true;
      // 产品分类回显
      this.getProductTypeName(this.productTypeList);
    },
    getProductTypeName(data) {
      return data.some((value) => {
        if (value.id === this.info.productTypeId) {
          this.info.productTypeName = value.name;
          return true;
        } else if (value.children && value.children.length) {
          return this.getProductTypeName(value.children);
        }
      });
    },
    handleOk() {
      this.confirmLoading = true;
      setProductStatus({ id: this.info.id, status: this.status })
        .then((res) => {
          this.toast(res);
          if (res.code == 0) {
            this.$emit("ok");
            this.visible = false;
          }
        })
        .finally(() => {
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
