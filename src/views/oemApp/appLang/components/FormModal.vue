<template>
  <!-- 添加 编辑框 -->
  <a-modal :title="modalTitle" :width="640" :visible="visible" :confirm-loading="confirmLoading" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form-model ref="ruleForm" :model="form" :rules="rules">
        <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" label="模板类型" prop="appTemplateType">
          <a-select v-model="form.appTemplateType" :disabled="editDisable" placeholder="请选择模板类型" @change="typeChange" :options="$DictList('app_template_type')" />
        </a-form-model-item>
        <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" label="模板版本号" prop="appTemplateId">
          <a-select v-model="form.appTemplateId" :disabled="editDisable" placeholder="请选择模板版本号" :options="versionOptions" />
        </a-form-model-item>
        <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" label="语言包名称" prop="packageName">
          <a-input placeholder="请输入语言包名称" v-model="form.packageName" />
        </a-form-model-item>
        <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" label="上传文件" prop="fileName">
          <input type="text" v-show="false" v-model="form.fileName" />
          <upload-file
            fileIcon="icon-excel"
            fileHint="必须为xls,csv格式,且不超过10M,请注意文件总的表头已区分语种，方便系统自动识别语种"
            :fileType="[
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              'application/vnd.ms-excel',
              'text/csv',
            ]"
            :propsAccept="['.xls', '.xlsx', '.csv']"
            :propsFileName="form.fileName"
            :fileSize="10"
            :download="type === 'edit'?true:false"
            :propsImgSrc="form.filePath"
            @download="handleDownload"
            @ok="onChangeExcelFile"
          ></upload-file>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
    <template #footer>
      <a-button key="back" @click="handleCancel">取消</a-button>
      <a-divider type="vertical" />
      <a-button key="submit" type="primary" @click="handleOk" :loading="confirmLoading"> 确定 </a-button>
    </template>
  </a-modal>
</template>
<script>
import { CommonNameRules, CommonRules } from "@/utils/validate";
import { getAppLangDetail, addAppLangPkg, editAppLang, getAppTemplateList } from "@/api/oemApp"
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
        appTemplateType: CommonRules('请选择模板类型','number'),
        appTemplateId: CommonRules('请选择模板版本号','string'),
        packageName: CommonNameRules("请输入语言包名称"),
        fileName: CommonRules("请上传文件"),
      },
      labelCol: { xs: { span: 24 }, sm: { span: 5 }},
      wrapperCol: { xs: { span: 24 }, sm: { span: 19 } },
      versionOptions:[],
      editDisable: false,
    };
  },
  created() {},
  methods: {
    init(type, id) {
      this.type = type
      this.id = id
      this.$refs["ruleForm"] && this.$refs["ruleForm"].resetFields()
      if (this.type === "add") {
        this.modalTitle = "上传语言包"
        this.editDisable = false
      } else if (this.type === "edit") {
        this.modalTitle = "修改语言包"
        this.editDisable = true
        this.getAppLangDetail()
      }
      
      this.visible = true;
    },

    // 模板类型变更
    async typeChange(type,value){
      this.$set(this.form,'appTemplateId', typeof(value)==='string' ? value : '')
      // 获取模板列表
      const res = await getAppTemplateList({query:{type}})
      if(res.code !== 0) return
      this.versionOptions = res?.data?.list?.map(item=>{
        return {
          label: item.version,
          value: item.id
        }
      }) || []
    },

    // 获取详情
    async getAppLangDetail(){
      const res = await getAppLangDetail(this.id)
      if(res.code !== 0 ) return
      this.typeChange(res.data.appTemplateType,res.data.appTemplateId)
      this.form = res.data
    },

    handleOk() {
      this.$refs["ruleForm"].validate(async (valid) => {
        if (!valid) return
        const formData = new FormData()
        formData.append("file", this.form.file)
        formData.append("packageName", this.form.packageName)
        formData.append("appTemplateType", this.form.appTemplateType)
        formData.append("appTemplateId", this.form.appTemplateId)
        formData.append("belongType", 3)
        if(this.form.id){
          formData.append("id", this.form.id)
        }
        const res = this.type == 'add' ? await addAppLangPkg(formData) : await editAppLang(formData)
        if(res.code !== 0) return
        this.$emit('handleOk')
        this.visible = false
      });
    },
    handleCancel() {
      this.visible = false;
    },
    handleDownload(){
      this.$DownloadTemplate(
        this,
        {
          url: `/v1/platform/web/lang/appResources/download`,
          method: "get",
          belongType: this.form.belongType,
          packageId: this.form.id,
        },
        this.form.fileName || "语言包.xlsx"
      )
    },
    onChangeExcelFile(file) {
      this.$set(this.form,'file', file.file)
      this.$set(this.form,'fileName', file.name)
    },
  },
};
</script>
<style lang="less" scoped></style>
