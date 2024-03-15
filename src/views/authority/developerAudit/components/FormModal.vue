<template>
  <a-modal
    :title="title"
    :width="480"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @cancel="visible = false"
  >
    <a-spin :spinning="confirmLoading">
      <a-form-model ref="rulesForm" :model="form" :rules="rules">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="理由" prop="why">
              <input-textarea placeholder="请输入理由" v-model="form.why" @input="$refs['rulesForm'].clearValidate()">
              </input-textarea>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-spin>
    <template #footer>
      <a-button key="back" @click="visible = false">取消</a-button>
      <a-divider type="vertical" />
      <a-button key="submit" type="primary" @click="submit" :loading="confirmLoading">
        确定
      </a-button>
    </template>
  </a-modal>
</template>
<script>
import { cmpanyAuthAudit } from "@/api/authority";
import { CommonRules } from "@/utils/validate";
export default {
  data() {
    return {
      title: "",
      visible: false,
      confirmLoading: false,
      form: {},
      rules: {
        why: CommonRules("请输入审核理由"),
      },
    };
  },
  methods: {
    init(id, status, title) {
      this.title = title;
      this.$refs["rulesForm"] && this.$refs["rulesForm"].clearValidate();
      this.form = {
        id,
        status,
        why: "",
      };
      this.visible = true;
    },
    submit() {
      this.$refs["rulesForm"].validate(async (valid) => {
        if (!valid) return;
        this.confirmLoading = true;
        let res = await cmpanyAuthAudit(this.form);
        if (res.code === 0) {
          this.$emit("ok");
          this.visible = false;
        }
        this.confirmLoading = false;
      });
    },
  },
};
</script>
<style lang="less" scoped></style>
