<template>
  <div>
    <a-form-model ref="ruleForm" :model="form" :rules="formDisabled ? {} : rules" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item label="模板类型" prop="type">
        <a-select style="width: 50%" placeholder="请选择模板类型" v-model="form.type" :options="$DictList('app_template_type')"/>
      </a-form-model-item>
      <a-form-model-item label="版本号" prop="version">
        <a-row type="flex" justify="space-between">
          <a-col :span="12">
            <a-input style="width: 50%" placeholder="例如:1.0.1" v-model="form.version" @change="resetValid('version')"/>
          </a-col>
          <a-col :span="12">版本号格式: xx.xx.xx 开放平台展示</a-col>
        </a-row>
      </a-form-model-item>
      <a-form-model-item label="代码仓库" prop="gitUrl">
        <a-row type="flex" justify="space-between">
          <a-col :span="16">
            <a-input placeholder="https://xxxx.xxx.xx" v-model="form.gitUrl" @change="resetValid('gitUrl')"/>
          </a-col>
        </a-row>
      </a-form-model-item>
      <a-form-model-item label="版本说明" prop="remark">
        <a-row type="flex" justify="space-between">
          <a-col :span="16">
            <input-textarea v-model="form.remark" :maxLength="200" placeholder="请输入备注" @input="resetValid('remark')"></input-textarea>
          </a-col>
          <a-col :span="6">开放平台展示</a-col>
        </a-row>
      </a-form-model-item>
      <a-form-model-item label="开放范围" prop="openRangeType">
        <a-row type="flex" justify="space-between">
          <a-col :span="12">
            <a-radio-group v-model="form.openRangeType" :options="$DictList('app_template_open_range')" @change="resetValid('openRangeType')"/>
          </a-col>
          <a-col :span="12">内测版本，建议先开放给内部测试账号</a-col>
        </a-row>
      </a-form-model-item>
      <a-form-model-item v-if="form.openRangeType == 2" label="开发者账号" prop="developers">
        <a-button @click="handleSelect"> 选择 </a-button>
        <div>
          <a-tag color="blue" v-for="(item,index) in form.developers" :key="index" @close="$e=>deleteDeveloper($e, index)" closable> {{item.companyName}} | {{item.account}} </a-tag>
        </div>
      </a-form-model-item>
    </a-form-model>
    <a-modal title="选择开发者" :width="800" :visible="visible" :confirm-loading="confirmLoading" @cancel="handleCancel">
      <a-spin :spinning="confirmLoading">
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="20">
              <a-col :span="20">
                <a-form-item label="账号">
                  <a-input placeholder="请输入名称(英文)" v-model="query.account" :allowClear="true" @keyup.enter.native="queryByAccount"/>
                </a-form-item>
              </a-col>
              <a-col :span="4">
                <a-form-item>
                  <a-button icon="search" type="primary" @click="queryByAccount">
                    {{ $t("public.search") }}
                  </a-button>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <a-table size="small" rowKey="id" class="account-table" :data-source="dataSource" :columns="columns" :loading="loading" :pagination="false">
          <template slot="action" slot-scope="text, item">
            <a-button :disabled="item.disabled" type="link" size="small" icon="setting" @click="handleSelectAcount(item)"> 选择 </a-button>
          </template>
        </a-table>
      </a-spin>
      <template #footer>
        <a-button key="back" @click="handleCancel"> 关闭 </a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
import { CommonNameRules, CommonRules, VersionEnRules } from "@/utils/validate";
import { addAppTemplate, editAppTemplate, getAppTemplateDetail,queryByAccount } from "@/api/oemApp"
export default {
  props: {
    type: { type: String, default: '' },
    id: { type: String, default: '' },
  },
  data() {
    return {
      form: {
        developers:[]
      },
      rules: {
        type: CommonRules("请选择模板类型", 'number'),
        version: VersionEnRules('请输入版本号'),
        gitUrl: CommonNameRules("请输入代码仓库地址",100,1),
        remark: CommonNameRules("请输入版本说明",200,1),
        openRangeType: CommonRules("请选择开放范围", 'number'),
        developers:  CommonRules("请选择开发者账号", 'array'),
      },
      formDisabled: false,
      labelCol: { xs: { span: 24 }, sm: { span: 8 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 12 } },
      visible: false,
      confirmLoading: false,
      loading: false,
      dataSource: [],
      query:{},
      columns: [
        { dataIndex: "account", title: "账号", },
        { dataIndex: "companyName", title: "企业名称", },
        { title: "操作", key: "action", align: "center", width: "90px", scopedSlots: { customRender: "action" } },
      ],
    };
  },
  mounted(){
    if(this.id){
      this.getAppTemplateDetail()
    }
  },
  watch:{
    id(){
      this.getAppTemplateDetail()
    }
  },
  methods: {
    // 获取模板详情
    async getAppTemplateDetail(){
      const res = await getAppTemplateDetail(this.id)
      if(res.code !== 0) return
      this.form = {developers: [], ...res.data}
    },
    
    // 获取开发者账号
    async queryByAccount(){
      const res = await queryByAccount({...this.query})
      if(res.code !== 0) return
      this.dataSource = res.data?.list?.map(item=> {
        return{
          ...item,
          disabled: this.form?.developers?.some(dev=>dev.account == item.account) || false
        }
      } ) || []
    },

    // 点击选择打开弹窗
    async handleSelect(){
      await this.queryByAccount()
      this.visible = true
    },

    // 选择账号
    handleSelectAcount(data){
      this.dataSource.forEach(item=>{
        if(item.id === data.id){
          item.disabled = true
        }
      })
      this.form['developers'] = this.form.developers  || []
      this.form['developers'].push({
        account:data.account,
        companyName:data.companyName,
        tenantId:data.tenantId,
      })
      this.$refs["ruleForm"].validateField('developers')
    },

    // 删除开发者账号
    deleteDeveloper(e, index){
      e.preventDefault()
      this.form.developers.splice(index, 1)
      this.$refs["ruleForm"].validateField('developers')
    },

    // 表单值校验
    formValid(){
      this.$refs["ruleForm"].validate(async(valid) => {
        if (!valid) return
        const res =this.id ? await editAppTemplate(this.form) : await addAppTemplate(this.form)
        if(res.code !== 0 ) return
        this.$emit('next', this.id || `${res.data}`)
      });
    },

    // 重置校验
    resetValid(key){
      this.$refs["ruleForm"].validateField(key)
    },

    handleCancel() {
      this.visible = false;
    },
    handleOk() {
      this.visible = false;
    },
  },
};
</script>
<style lang="less" scoped>
/deep/.ant-modal-body{
  max-height: 500px;
  overflow-y: auto;
}
</style>
