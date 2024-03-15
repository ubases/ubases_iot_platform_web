<template>
  <a-modal :title="modalTitle" :width="640" :visible="visible" :confirm-loading="confirmLoading" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form-model ref="ruleForm" :model="form" :rules="rules">
        <!-- 选择目录 -->
        <a-row>
          <a-col :span="24">
            <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" label="选择目录" prop="dirId">
              <a-row :gutter="16">
                <a-col :md="8" :sm="24">
                  <a-select placeholder="目录" v-model="form.parentId" @change="handleProvinceChange">
                    <a-select-option v-for="v in MenuList" :key="v.id" :value="v.id">
                      {{ v.docDirName }}
                    </a-select-option>
                  </a-select>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-select placeholder="目录" v-model="form.dirId">
                    <a-select-option v-for="v in TwoMenuList" :key="v.id" :value="v.id">
                      {{ v.docDirName }}
                    </a-select-option>
                  </a-select>
                </a-col>
              </a-row>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" label="序号" prop="sort">
              <a-input-number v-model="form.sort" :min="1" :max="999" :precision="0" placeholder="请输入排序, 1~999" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" label="是否启用" prop="isEnable">
              <a-radio-group v-model="form.isEnable" :options="$DictList('is_doc_enable')"></a-radio-group>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" label="设为常见问题" prop="isNormal">
              <a-radio-group v-model="form.isNormal" :options="$DictList('is_doc_familiar')"></a-radio-group>
            </a-form-model-item>
          </a-col>
        </a-row>
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
import { getDocEntrySetDetails, setDocEntrySetDetails } from "@/api/oemApp";
import { CommonRules } from "@/utils/validate";
export default {
  data() {
    return {
      modalTitle: "目录编辑",
      visible: false,
      confirmLoading: false,
      id: "",
      form: {
        sort: "",
      },
      labelCol: { xs: { span: 24 }, sm: { span: 5 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 19 } },
      rules: {
        dirId: CommonRules("请选择目录id"),
        sort: CommonRules('请输入排序', "number"),
      },
      id: "",
      TwoMenuList: [], // 二级目录
    };
  },
  inject: ["menuList"],
  computed: {
    MenuList() {
      return this.menuList(); // 接收穿透的动态数据需要通过计算属性获取
    },
  },
  methods: {
    init(id) {
      this.id = id;
      this.visible = true;
      this.confirmLoading = true;
      getDocEntrySetDetails({ setingId: id })
        .then((res) => {
          if (res.code !== 0) return;
          this.form = res.data;
          this.handleProvinceChange(this.form.dirId);
        })
        .finally(() => {
          this.confirmLoading = false;
        });
    },
    handleProvinceChange(dirId) {
      this.MenuList.forEach((value) => {
        if (dirId === value.id) {
          this.TwoMenuList = value.children || [];
          this.$set(this.form, "dirId", "");
        }
        value.children &&
          value.children.forEach((item) => {
            if (dirId === item.id) {
              this.TwoMenuList = value.children;
              this.$set(this.form, "parentId", value.id);
            }
          });
      });
    },
    handleOk() {
      this.$refs["ruleForm"].validate((valid) => {
        if (!valid) return;
        this.confirmLoading = true;
        setDocEntrySetDetails(this.form)
          .then((res) => {
            this.toast(res);
            if (res.code !== 0) return;
            this.$emit("ok");
            this.visible = false;
          })
          .finally(() => {
            this.confirmLoading = false;
          });
      });
    },
    handleCancel() {
      this.visible = false;
    },
  },
};
</script>
<style lang="less" scoped></style>
