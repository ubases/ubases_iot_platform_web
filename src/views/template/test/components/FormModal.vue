<template>
  <a-modal
    :title="modalTitle"
    :width="640"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form-model ref="ruleForm" :model="form" :rules="rules">
        <!-- 用例名称 -->
        <a-row>
          <a-col>
            <a-form-model-item
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
              label="用例名称"
              prop="tplName"
            >
              <a-input placeholder="请输入用例名称" v-model="form.tplName" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <!-- 产品分类 -->
        <a-row>
          <a-col>
            <a-form-model-item
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
              label="产品分类"
              prop="productTypeId"
            >
              <a-tree-select
                v-model="form.productTypeId"
                placeholder="请选择产品分类"
                :replaceFields="{
                  children: 'children',
                  title: 'name',
                  key: 'id',
                  value: 'id',
                }"
                :tree-data="productTypeList"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                style="width: 100%"
                tree-default-expand-all
              >
              </a-tree-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <!-- 版本号 -->
        <a-row>
          <a-col>
            <a-form-model-item
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
              label="版本号"
              prop="version"
            >
              <a-input placeholder="请输入版本号" v-model="form.version" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <!-- 上传文件 -->
        <a-row>
          <a-col>
            <a-form-model-item
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
              label="上传文件"
              prop="tplFileName"
            >
              <input type="text" v-show="false" v-model="form.tplFileName" />
              <upload-file
                fileIcon="icon-excel"
                fileHint="必须为xls,csv格式,且不超过10M"
                :fileType="[
                  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                  'application/vnd.ms-excel',
                  'text/csv',
                ]"
                :propsAccept="['.xls', '.xlsx', '.csv']"
                :propsFileName="form.tplFileName"
                :fileSize="10"
                @ok="onChangeExcelFile"
              ></upload-file>
            </a-form-model-item>
          </a-col>
        </a-row>
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
import { CommonNameRules, CommonRules, VersionRules } from "@/utils/validate";
import { addTest, editTest, getTestDetails } from "@/api/template";
export default {
  props: {
    productTypeList: [Array],
  },
  data() {
    return {
      type: "",
      id: "",
      modalTitle: "添加测试用例",
      visible: false,
      confirmLoading: false,
      form: {},
      rules: {
        tplName: CommonNameRules("请输入测试用例名称"),
        productTypeId: CommonRules("请选择产品分类"),
        version: VersionRules("请输入版本号"),
        tplFileName: CommonRules("请选择测试用例文件"),
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
      fileList: [],
    };
  },
  methods: {
    init(type, id = "") {
      this.type = type;
      this.id = id;
      this.$refs["ruleForm"] && this.$refs["ruleForm"].clearValidate();
      this.visible = true;
      if (this.type === "add") {
        this.modalTitle = "添加测试用例";
        this.form = {
          tplFile: null,
          tplName: "",
          version: "",
          tplFileName: "",
        };
      } else if (this.type === "edit") {
        this.modalTitle = "编辑测试用例";
        getTestDetails(this.id).then((res) => {
          if (res.code === 0) {
            this.form = {
              id: res.data.id,
              tplFile: null, // 回显文件名即可 后面以这个字段判断
              tplName: res.data.tplName,
              version: res.data.version,
              productTypeId: res.data.productTypeId,
              tplFileName: res.data.tplFileName,
            };
          }
        });
      }
    },
    handleOk() {
      this.$refs["ruleForm"].validate(async (valid) => {
        if (!valid) return;
        const formData = new FormData();
        // 有选择文件才上传
        if (this.form.tplFile) {
          formData.append("tplFile", this.form.tplFile);
        }
        // 编辑则添加id
        if (this.form.id) {
          formData.append("id", this.form.id);
        }
        formData.append("tplName", this.form.tplName);
        formData.append("version", this.form.version);
        formData.append("productTypeId", this.form.productTypeId);
        this.confirmLoading = true;
        let res;
        if (this.form.id) {
          res = await editTest(formData);
        } else {
          res = await addTest(formData);
        }
        this.toast(res);
        this.$emit("ok");
        res.code === 0 && (this.visible = false);
        this.confirmLoading = false;
      });
    },
    handleCancel() {
      this.visible = false;
    },
    // 文档上传
    onChangeExcelFile(res) {
      // 获取文件名展示
      this.form = {
        ...this.form,
        tplFile: res.file,
        tplFileName: res.name,
      };
      this.$refs["ruleForm"].clearValidate(["tplFileName"]);
    },
  },
};
</script>
<style lang="less" scoped>
.file-upload {
  display: flex;
  align-items: center;
  .file-name {
    margin-right: 10px;
    text-decoration: underline;
  }
}
</style>
