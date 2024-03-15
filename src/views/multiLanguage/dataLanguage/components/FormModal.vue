<template>
  <a-modal
    :width="640"
    :title="title"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form-model ref="ruleForm" :model="form" :rules="rules">
        <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" label="语言key">
          <div>{{ form.sourceRowId }}</div>
        </a-form-model-item>
        <a-form-model-item v-for="(v,i) in form.translateList" :key="v.lang" :label="v.name" :prop="`translateList.${i}.fieldValue`" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-input v-model="v.fieldValue" :maxLength="50"/>
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
import { getLangForm, setLangForm } from "@/api/lang";
export default {
  data() {
    return {
      title: "",
      visible: false,
      confirmLoading: false,
      form: {
        sourceRowId: "",
        translateList: [],
      },
      labelCol: { xs: { span: 24 }, sm: { span: 3 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 21 } },
      rules:{
        "translateList.0.fieldValue":[{required:true,message: '请输入文本内容'}]
      }
    };
  },
  computed: {
    ...mapGetters(["langTypeList"]),
  },
  methods: {
    init(sourceRowId, sourceTable, fieldName) {
      this.visible = true;
      this.title = "修改文案";
      this.confirmLoading = true;
      getLangForm({ sourceTable, sourceRowId,fieldName })
        .then((res) => {
          if (res.code === 0) {
            let translateList = this.langTypeList.map((v) => {
              let obj = {
                lang: v.code,
                name: v.name,
                fieldName,
                fieldValue: "",
              };
              res.data.some((item) => {
                if (item.lang === v.code) {
                  obj.fieldValue = item.fieldValue;
                  return true;
                }
              });
              return obj;
            });
            this.form = {
              sourceRowId,
              sourceTable,
              translateList,
            };
          }
        })
        .finally(() => {
          this.confirmLoading = false;
        });
    },
    handleOk() {
      this.$refs["ruleForm"].validate((res) => {
        if (!res) return;
        this.visible = false;
        this.confirmLoading = true;
        setLangForm(this.form)
          .then((res) => {
            this.toast(res);
            if (res.code === 0) {
              this.visible = false;
              this.$refs["ruleForm"] && this.$refs["ruleForm"].resetFields();
              this.$emit("ok");
            }
          })
          .finally(() => {
            this.confirmLoading = false;
          });
      });
    },
    handleCancel() {
      this.visible = false;
      this.$refs["ruleForm"] && this.$refs["ruleForm"].resetFields();
    },
  },
};
</script>
<style lang="less" scoped></style>
