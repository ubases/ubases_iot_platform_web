<template>
  <!-- 添加 编辑框 -->
  <a-modal :title="modalTitle" :width="640" :visible="visible" :confirm-loading="confirmLoading" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-alert v-if="type === 'copy'" :message="`将复制“${form.originName}”以及其下${count}条问答`" banner/>
      <a-form-model ref="ruleForm" :model="form" :rules="rules">
        <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" label="APP模板类型" prop="templateType">
          <span v-if="type == 'copy'">{{$DictName('app_template_type',form.templateType)}}</span>
          <a-select v-if="type !== 'copy'" v-model="form.templateType" placeholder="请选择APP模板类型" @change="typeChange" :options="$DictList('app_template_type')" />
        </a-form-model-item>
        <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" label="模板版本号" prop="version">
          <a-select v-model="form.version" placeholder="请选择模板版本号" :options="versionOptions" />
        </a-form-model-item>
        <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" label="帮助中心名称" prop="name">
          <a-input placeholder="请输入帮助中心名称" v-model="form.name" />
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
import { CommonNameRules, CommonRules } from "@/utils/validate"
import { getHelpCenterDetail, addHelpCenter, editHelpCenter, getAppTemplateList, copyHelpCenter} from "@/api/oemApp"
export default {
  data() {
    return {
      id: "",
      type: "",
      count: 0,
      modalTitle: "",
      visible: false,
      confirmLoading: false,
      form: {},
      rules: {
        templateType: CommonRules("请选择APP模板类型", 'number'),
        version: CommonRules("请选择模板版本号", 'string'),
        name: CommonNameRules("请输入帮助中心名称"),
      },
      labelCol: { xs: { span: 24 }, sm: { span: 5 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 19 } },
      versionOptions:[]
    };
  },
  created() {

  },
  methods: {
    init(type, id, count) {
      this.type = type
      this.id = id
      this.count = count
      this.$refs["ruleForm"] && this.$refs["ruleForm"].resetFields();
      if (this.type === "add") {
        this.modalTitle = "创建帮助中心"
      } else if (this.type === "edit") {
        this.modalTitle = "编辑帮助中心"
      } else if (this.type === "copy") {
        this.modalTitle = "确认复制吗？"
      }
      if(this.id) this.getHelpCenterDetail()
      this.visible = true
    },

    // 获取详情
    async getHelpCenterDetail(){
      const res = await getHelpCenterDetail({id: this.id})
      if(res.code !== 0) return
      this.typeChange(res.data?.templateType || '', res.data?.version || '')
      this.form = res.data
      if(this.type == 'copy'){
        this.form.originName = this.form.name
        this.form.name = `${this.form.name}-副本`
        this.form.version = ''
      }
    },

    // 模板类型变更
    async typeChange(type, value){
      this.$set(this.form,'version',value || '')
      const res = await getAppTemplateList({query:{type}})
      if(res.code !== 0) return
       const list = res?.data?.list?.map(item=>item.version) || []
       this.versionOptions = Array.from(new Set(list))?.map(item=>{
        return{
          label: item,
          value: item
        }
       }) || []
    },

    handleOk() {
      this.$refs["ruleForm"].validate(async (valid) => {
        if (!valid) return
        let res = null
        if(this.type === 'add') {
          res = await addHelpCenter(this.form)
        } else if(this.type === 'edit'){
          res = await editHelpCenter(this.form)
        }else if (this.type === 'copy'){
          res = await copyHelpCenter(this.form)
        }
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
