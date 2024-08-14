<template>
  <a-card :bordered="false">
    <a-page-header :title="title" @back="$multiTab.closeCurrentPage()">
      <a-spin :spinning="confirmLoading">
        <a-alert message="温馨提示：为确保上架审核的通过率，因此可以选择临时皮肤用于上架，更改皮肤后，请提醒爱发着同步修改上架图片，上架完成后请标记上架。尽量避免相同皮肤，同一时间段准备上架。" banner/>
        <a-form-model ref="ruleForm" :model="form" :rules="formDisabled ? {} : rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item label="开发者账号" prop="developPhone">
            <div v-if="formDisabled">{{form.developPhone}}</div>
            <a-input v-else placeholder="请输入开发者账号" v-model="form.developPhone" @blur="handlePhone" @change="handlePhoneChange"/>
          </a-form-model-item>
          <a-form-model-item label="选择App" prop="appKey">
            <div v-if="formDisabled">{{form.appKey}}</div>
            <a-select v-else placeholder="请选择App名称" v-model="form.appKey" :options="appOptions" @change="appChange" />
          </a-form-model-item>
          <a-form-model-item label="IOS包名" prop="appIosPkg">
            <div>{{form.appIosPkg}}</div>
          </a-form-model-item>
          <a-form-model-item label="Android包名" prop="appAndroidPkg">
            <div>{{form.appAndroidPkg}}</div>
          </a-form-model-item>
          <a-form-model-item label="上架版本" prop="appVersion">
            <div v-if="formDisabled">{{form.appVersion}}</div>
            <a-select v-else placeholder="请选择上架版本" v-model="form.appVersion" :options="versionOptions" @change="versionChange"/>
          </a-form-model-item>
          <a-form-model-item label="模板版本" prop="appTemplateVersion">
            <div>{{form.appTemplateVersion}}</div>
          </a-form-model-item>
          <a-form-model-item label="上架皮肤" prop="skinId">
            <template v-if="formDisabled">
              <template v-for="(item,index) in skinOptions">
                <div :key="index" v-if="item.skinKey == form.skinId">
                  <p>{{item.skinName}}</p>
                  <div style="width:50px;height: 50px;">
                    <img class="aithings-microcheiria" :style="{ width: '100%', height: '100%', 'object-fit': 'fit' }" :src="item.skinImgs[0]" @click="$PreviewModal({ url: item.skinImgs })" />
                  </div>
                </div>
              </template>
            </template>
            <a-radio-group v-else v-model="form.skinId" :disabled="formDisabled">
              <a-row>
                <a-col :span="12" v-for="(item,index) in skinOptions" :key="index">
                  <a-radio :value="item.skinKey"> {{item.skinName}} </a-radio>
                  <div style="width:50px;height: 50px;">
                    <img class="aithings-microcheiria" :style="{ width: '100%', height: '100%', 'object-fit': 'fit' }" :src="item.skinImgs[0]" @click="$PreviewModal({ url: item.skinImgs })"/>
                  </div>
                </a-col>
              </a-row>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item label="有效期" prop="time">
            <div v-if="formDisabled && type !== 'update'">{{`${form.startTime} - ${form.endTime}`}}</div>
            <a-range-picker v-else v-model="form.time"  :disabled-date="disabledDate" format="YYYY-MM-DD HH:mm:ss" :show-time="{ hideDisabledOptions: true, defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]}"/>
          </a-form-model-item>
          <a-form-model-item label="上架市场" prop="marketIds">
            <div v-if="formDisabled && type !== 'update'">
              <template v-for="(item,index) in releaseMarkets">
                <p :key="index" v-if="item.isCheck == 1">
                  <span>{{$DictName('release_market', item.marketId)}} </span>
                  <a-divider type="vertical" v-if="form.status == 1" />
                  <span v-if="form.status == 1">  {{$DictName('app_release_status',item.releaseStatus)}}</span>
                  <a-divider type="vertical"  v-if="item.finishTime"/>
                  <span v-if="item.finishTime">  {{item.finishTime | momentFilter("YYYY-MM-DD")}}</span>
                </p>
              </template>
            </div>
            <a-checkbox-group v-else v-model="form.marketIds">
              <div v-for="(item,index) in releaseMarkets" :key="index" style=" display: flex; height: 40px; line-height: 40px;">
                <a-checkbox :value="item.value"> {{item.label}} </a-checkbox>
                <div v-if="type == 'update'">
                  <a-radio-group v-model="releaseMarkets[index].releaseStatus" :options="$DictList('app_release_status')" @change="releaseStatusChange(index)"/>
                </div>
                <div v-if="type == 'update' && releaseMarkets[index].releaseStatus === 1" >
                  <a-date-picker v-model="releaseMarkets[index].finishTime" type="date" format="YYYY-MM-DD"/>
                </div>
              </div>
            </a-checkbox-group>
          </a-form-model-item>
          <a-form-model-item v-if="type == 'detail'" label="状态" prop="status">
            {{$DictName(form.status)}}
          </a-form-model-item>
          <a-form-model-item :wrapper-col="{ span: 14, offset: 3 }">
            <a-button v-if="type !== 'detail'" type="primary" @click="handleSave"> 保存 </a-button>
            <a-divider v-if="type !== 'detail'" type="vertical" />
            <a-button @click="$multiTab.closeCurrentPage()"> 取消 </a-button>
          </a-form-model-item>
        </a-form-model>
      </a-spin>
    </a-page-header>
  </a-card>
</template>
<script>
import { CommonNameRules, CommonRules } from "@/utils/validate";
import { addRelease, editRelease, getReleaseDetail, getDevAppList} from "@/api/oemApp"
import moment from "moment"

export default {
  name: "FooterMenuDetails",
  data() {
    return {
      title: "新上架App",
      form: {
        releaseMarkets:[
          {}
        ],
        marketIds:[]
      },
      formDisabled: false,
      rules: {
        developPhone: CommonNameRules('请输入开发者账号'),
        appKey: CommonRules("请选择App", 'string'),
        appVersion: CommonRules("请选择App上架版本", 'string'),
        skinId: CommonRules("请选择上架皮肤"),
        time: CommonRules("请选择有效期", 'array'),
        marketIds: CommonRules("请选择上架市场", 'array'),
      },
      confirmLoading: false,
      labelCol: { xs: { span: 24 }, sm: { span: 3 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 14 } },
      id:'',
      type:'',
      appOptions:[],
      versionOptions:[],
      skinOptions:[],
      releaseMarkets:this.$DictList('release_market'),
      isAccountChange: false
    };
  },
  async created() {
    this.id = this.$route.query.id
    this.type = this.$route.query.type
    this.init()
    if(this.id) this.getReleaseDetail()
    
  },
  methods: {
    moment,
    init() {
      if (this.type === "add") {
        this.title = "新上架App";
      } else if (this.type === "detail") {
        this.title = "新上架App";
        this.formDisabled = true;
      } else if (this.type === "edit") {
        this.title = "编辑信息";
      }else if (this.type === "update") {
        this.title = "编辑信息";
        this.formDisabled = true;
      }
      this.$route.meta.title = this.title;
    },

    // 获取开发者app列表
    async getDevAppList(account){
      const res = await getDevAppList({account})
      if(res.code !== 0) return
      this.appOptions = res.data?.appList?.map(item=>{
        return {
          ...item,
          label:item.appName,
          value:item.appKey
        }
      }) || []
      this.form.developId = res.data.developId
      this.form.tenantId = res.data.tenantId
    },

    // 获取详情
    async getReleaseDetail(){
      const res = await getReleaseDetail(this.id)
      if(res.code!==0)return
      if(!res.data.developPhone) return
      await this.getDevAppList(res.data.developPhone)
      const data = this.appOptions.filter(item => item.appKey === res.data?.appKey)?.pop()
      this.versionOptions = data.appVersions?.map(item=>{
        return {
          ...item,
          value: item.appVersion,
          label: item.appVersion,
        }
      })
      this.skinOptions = this.versionOptions.filter(item=>item.appVersion === res.data.appVersion)?.pop()?.appTemplateSkins || []
      this.releaseMarkets = this.releaseMarkets.map(item=>{
        const data = res.data?.releaseMarkets?.filter(m=>m.marketId == item.value)?.pop() || {}
        return{
          ...data,
          ...item,
          finishTime: data.finishTime ? moment(data.finishTime * 1000).format('YYYY-MM-DD') : ''
        }
      })
      const time = [ moment(res.data.startTime * 1000).format('YYYY-MM-DD HH:mm:ss'),moment(res.data.endTime * 1000).format('YYYY-MM-DD HH:mm:ss')]
      const marketIds = res.data?.releaseMarkets?.filter(item=>item.isCheck === 1)?.map(item=>item.marketId)
      this.form = { ...res.data, appIosPkg: data.appIosPkg, appAndroidPkg: data.appAndroidPkg, time, marketIds}
    },

    // 开发者账号值变化
    handlePhoneChange(){
      this.isAccountChange = true
    },

    // 开发者账号输入框失去焦点
    async handlePhone(){
      if(this.isAccountChange){
        // 账号值有变化
        this.appOptions = []
        this.versionOptions = []
        this.skinOptions = []
        this.form = { ...this.form, appKey:'', appIosPkg: '', appAndroidPkg: '', appVersion: '', appTemplateVersion: '', skinId: ''}
      }
      this.isAccountChange = false
      if(!this.form.developPhone) return
      await this.getDevAppList(this.form.developPhone)
    },
    
    // 选择app
    appChange(appKey){
      const data = this.appOptions.filter(item=>item.value === appKey).pop()
      this.versionOptions = data.appVersions?.map(item=>{
        return {
          ...item,
          value: item.appVersion,
          label: item.appVersion,
        }
      })
      this.skinOptions = this.versionOptions.filter(item=>item.appVersion === this.form.appVersion)?.pop()?.appTemplateSkins || []
      this.form = { ...this.form, appIosPkg: data.appIosPkg, appAndroidPkg: data.appAndroidPkg, appVersion: '', appTemplateVersion: '', skinId: ''}
    },

    // 选择版本
    versionChange(version){
      const data = this.versionOptions.filter(item=>item.appVersion === version)?.pop() || {}
      this.skinOptions = data?.appTemplateSkins || []
      this.form.appTemplateVersion = data.appTemplateVersion
      this.form.skinId = ''
    },

    // 限制日期
    disabledDate(current) {
      return current && current < moment().startOf('day');
    },

    // 切换开启状态
    releaseStatusChange(index){
      this.releaseMarkets[index].finishTime = ''
    },

    handleSave() {
      this.$refs["ruleForm"].validate(async (valid) => {
        if (!valid) return;
        const {developId,tenantId,developPhone,appKey,appVersion,appTemplateId,appTemplateVersion,skinId} = {...this.form}
        const param = {
          developId,tenantId,developPhone,appKey,appVersion,appTemplateId,appTemplateVersion,skinId,
          startTime:Date.parse(this.form.time[0]) / 1000,
          endTime: Date.parse(this.form.time[1]) / 1000,
          releaseMarkets: this.releaseMarkets.map(item=>{
            return {
              marketId:item.value,
              releaseStatus:item.releaseStatus || 0,
              isCheck:this.form.marketIds.some(id=>id === item.value) ? 1: 0,
              assistReleaseId:item.assistReleaseId,
              finishTime:item.finishTime ? Date.parse(item.finishTime) / 1000 : 0,
            }
          })
        }
        if(this.form.id) {
          param['id'] = this.form.id
        }
        const res = this.type == 'add' ? await addRelease(param) :await editRelease(param)
        if (res.code !== 0) return
        this.$multiTab.closeCurrentPage()
        this.toast(res);
      });
    },
  },
};
</script>
<style lang="less" scoped>
/deep/.ant-checkbox-wrapper{
  width: 140px;
}
</style>
