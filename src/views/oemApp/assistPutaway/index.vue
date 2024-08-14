<template>
  <a-card :bordered="false">
    <!-- 搜索 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="20">
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-input v-model="queryParam.query.account" placeholder="开发者账号" :allowClear="true" @keyup.enter.native="query"/>
            </a-form-item>
          </a-col>
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-input v-model="queryParam.query.appName" placeholder="App名称" :allowClear="true" @keyup.enter.native="query"/>
            </a-form-item>
          </a-col>
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-select v-model="queryParam.query.appVersion" placeholder="请选择模板版本" :options="versionOptions" :allowClear="true"  @keyup.enter.native="query"/>
            </a-form-item>
          </a-col>
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-select v-model="queryParam.query.skinId" placeholder="请选择皮肤" :options="skinOptions" :allowClear="true"  @keyup.enter.native="query"/>
            </a-form-item>
          </a-col>
          <a-col v-bind="aColFlex">
            <span class="table-page-search-submitButtons">
              <a-button icon="search" type="primary" @click="query">
                {{ $t("public.search") }}
              </a-button>
              <a-divider type="vertical" />
              <a-button icon="redo" @click="reset"> 重置 </a-button>
              <a-divider type="vertical" />
              <a-button type="primary" icon="plus" @click="handleDetail('add','')">
                新上架
              </a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 表格 -->
    <a-table size="small" rowKey="id" :data-source="dataSource" :columns="columns" :loading="loading" :pagination="pagination" @change="onChangePagination">
      <span class="link-a" slot="appName" slot-scope="text, item"  @click="handleDetail('detail', item.id)">
        {{item.appName}}
      </span>
      <template slot="startTime" slot-scope="text, item">
        {{ item.startTime | momentFilter("YYYY-MM-DD HH:mm:ss") }}至{{ item.endTime | momentFilter("YYYY-MM-DD HH:mm:ss") }}
      </template>
      <template slot="status" slot-scope="text, item">
        {{ $DictName("assist_release_status", item.status) }}
      </template>
      <template slot="releaseMarkets" slot-scope="text, record" >
        <div v-for="(item,index) in record.releaseMarkets" :key="index">{{$DictName('release_market', item.marketId)}}: {{$DictName('app_release_status', item.releaseStatus)}}</div>
      </template>
      <template slot="action" slot-scope="text, item">
        <a-button v-if="item.status === 2" type="link" size="small" icon="edit" @click="handleDetail('edit',item.id)">
          编辑
        </a-button>
        <a-divider type="vertical" />
        <a-button v-if="item.status === 2" type="link" size="small" icon="delete" @click="handleDelete(item.id)">
          删除
        </a-button>
        <a-button v-if="item.status === 1" type="link" size="small" icon="edit" @click="handleDetail('update',item.id)">
          更新
        </a-button>
      </template>
    </a-table>
  </a-card>
</template>
<script>
import { getReleaseList, setReleaseStatus, deleteRelease, getAppTemplateList, getSkinList} from "@/api/oemApp"
const pageSize = 10;
export default {
  name: "AssistPutaway",
  data() {
    return {
      isInit:false,
      queryParam: {
        page: 1,
        limit: pageSize,
        query: {},
      },
      loading: false,
      dataSource: [{}],
      columns: [
        { title: "序号", width: "46px", customRender: (text, record, index) => index + 1},
        { dataIndex: "developPhone", title: "开发者账号" },
        { dataIndex: "appName", title: "App名称", scopedSlots: { customRender: "appName" } },
        { dataIndex: "appVersion", title: "App版本号" },
        { dataIndex: "appTemplateVersion", title: "公版模板"},
        { dataIndex: "skinName", title: "选择的皮肤" },
        { dataIndex: "startTime", title: "有效期", scopedSlots: { customRender: "startTime" } },
        { dataIndex: "status", title: "状态", scopedSlots: { customRender: "status" } },
        { dataIndex: "releaseMarkets", title: "上架情况", scopedSlots: { customRender: "releaseMarkets" } },
        { title: "操作", key: "action", align: "center", width: "170px", scopedSlots: { customRender: "action" } },
      ],
      pagination: {
        showSizeChanger: true,
        current: 1,
        pageSize,
        total: 0,
        showTotal: (total, range) =>
          `总数:${total} 当前:${range[0]}-${range[1]}`,
      },
      fieldName: "",
      defaultVal: "",
      versionOptions:[],
      skinOptions:[]
    };
  },
  created() {
    this.isInit = true
    this.queryList()
    this.getAppTemplateList()
    this.getSkinList()
  },
  activated () {
    if(this.isInit){
      this.isInit = false
    }else{
    this.queryList()
    }
  },
  methods: {
    onChangePagination(e) {
      this.queryParam.page = e.current
      this.queryParam.limit = e.pageSize
      this.pagination.current = e.current
      this.pagination.pageSize = e.pageSize
      this.queryList()
    },

    // 获取列表
    async queryList() {
      this.loading = true
      const res = await getReleaseList(this.queryParam)
      this.loading = false
      if (res.code !== 0) return
      this.dataSource = res.data?.list?.map(item=>{
        return {
          ...item,
          releaseMarkets: item.releaseMarkets.filter(item=>item.isCheck == 1)
        }
      }) || []
      this.pagination.total = res.data.total
    },

    // 获取模板列表
    async getAppTemplateList(){
      const res = await getAppTemplateList({query:{}})
      if(res.code !== 0) return
       const list = res?.data?.list?.map(item=>item.version) || []
       this.versionOptions = Array.from(new Set(list))?.map(item=>{
        return{
          label: item,
          value: item
        }
       }) || []
    },

    // 获取皮肤列表
    async getSkinList(){
      const res = await getSkinList({})
      if(res.code !== 0) return
      this.skinOptions = res.data?.list?.map(item=>{
        return {
          label:item.name,
          value: item.id
        }
      }) || []
    },

    query() {
      this.queryParam.page = 1
      this.pagination.current = 1
      this.queryList()
    },

    // 重置
    reset() {
      this.queryParam = {
        page: 1,
        limit: this.queryParam.limit,
        query: {},
      }
      this.pagination.current = 1
      this.queryList()
    },

    handleDetail(type,id){
      this.$routerPush({
        path: "/oem-app/assist-putaway/details",
        query: { type, id },
      })
    },
    
    // 删除
    handleDelete(id) {
      this.$confirm({
        title: "确定是否删除",
        content: "删除后，将不可恢复",
        onOk: async() => {
          const res = await deleteRelease(id)
          if(res.code!==0)return
          this.queryList()
        },
      });
    },
  },
};
</script>
<style lang="less" scoped></style>
