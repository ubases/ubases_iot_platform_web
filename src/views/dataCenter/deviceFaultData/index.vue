<template>
  <a-card :bordered="false">
    <!-- 筛选栏 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="10">
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-input v-model="queryParam.query.did" placeholder="请输入设备ID" :allowClear="true"  @keyup.enter.native="query"/>
            </a-form-item>
          </a-col>
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-select v-model="queryParam.query.developer" placeholder="请选择开发者" :options="developerList" :allowClear="true" @keyup.enter.native="query" @change="developerChange"/>
            </a-form-item>
          </a-col>
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-select v-model="queryParam.query.productId" placeholder="请选择产品" :options="productList" :allowClear="true" @keyup.enter.native="query" @change="productChange" />
            </a-form-item>
          </a-col>
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-cascader v-model="faultCode" :options="faultCodeOptions" placeholder="请选择故障类型" :allowClear="true" @keyup.enter.native="query"/>
            </a-form-item>
          </a-col>
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-range-picker v-model="timeRange" :ranges="dateRange"/>
            </a-form-item>
          </a-col>
          <a-col v-bind="aColFlex">
            <span class="table-page-search-submitButtons">
              <a-button icon="search" type="primary" @click="query">搜索</a-button>
              <a-divider type="vertical" />
              <a-button icon="redo" @click="reset"> 重置 </a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 表格 -->
    <div class="total">故障总数：{{ pagination.total }}</div>
    <a-table size="small" rowKey="rowKey" :data-source="dataSource" :columns="columns" :loading="loading" :pagination="pagination" @change="onChangePagination">
      <template slot="faultCode" slot-scope="text, item">
        {{ `F${item.faultDpid}-${item.faultCode}` }}
      </template>
      <template slot="time" slot-scope="text, item">
        {{ item.time | momentFilter }}
      </template>
    </a-table>
  </a-card>
</template>
<script>
import { getDeviceFaultList, getFaultFuncList } from "@/api/data"
import { getPlatformProductList } from "@/api/product"
import { getDeveloperList } from "@/api/data"
import moment from 'moment';
export default {
  name: "DeviceFaultData",
  data() {
    return {
      isInit:false,
      pagination: {
        showSizeChanger: true,
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: (total, range) =>
          `总数:${total} 当前:${range[0]}-${range[1]}`,
      },
      // 查询参数
      queryParam: {
        page: 1,
        limit: 10,
        query: {},
      },
      columns: [
        { title: "序号", width: "50px", customRender: (item, value, index) => index + 1 },
        { dataIndex: "faultName", title: "故障类型名称" },
        { dataIndex: "faultCode", title: "故障编号", scopedSlots: { customRender: "faultCode" } },
        { dataIndex: "productName", title: "产品名称" },
        { dataIndex: "productKey", title: "产品Key" },
        { dataIndex: "deviceName", title: "设备名称" },
        { dataIndex: "deviceId", title: "设备ID" },
        { dataIndex: "developer", title: "所属开发者" },
        { dataIndex: "time", title: "上报时间", scopedSlots: { customRender: "time" } },
      ],
      dataSource: [],
      loading: false,
      productList: [],
      dateRange:{ 
        '上周': [ moment().week(moment().week() - 1).startOf('week').add(1,'days'), moment().week(moment().week() - 1).endOf('week').add(1,'days') ], 
        '上月': [ moment().month(moment().month() - 1).startOf('month'), moment().month(moment().month() - 1).endOf('month') ],
        '前三个月':[ moment().month(moment().month() - 3).startOf('month'), moment().month(moment().month() - 1).endOf('month')]
      },
      faultCodeOptions:[],
      timeRange:[],
      faultCode:[],
      developerList:[]
    };
  },
  computed: {},
  created() {
    this.isInit = true
    this.queryList();
    this.init();
  },
  activated () {
    if(this.isInit){
      this.isInit = false
    }else{
    this.queryList()
    }
  },
  methods: {
    init() {
      this.getDeveloperList()
      this.getPlatformProductList()
    },

    getPlatformProductList(developer){
      let params = {query:{}}
      if(developer){
        params.query.developer = developer
      }
      getPlatformProductList(params).then((res) => {
        if (res.code === 0) {
          this.productList = res.data?.list?.map((v) => {
            return {
              label: `${v.name}（${v.productKey}）`,
              value: v.id,
            }
          }) || []
        }
      })
    },

    onChangePagination(e) {
      this.queryParam.page = e.current;
      this.queryParam.limit = e.pageSize;
      this.pagination.current = e.current;
      this.pagination.pageSize = e.pageSize;
      this.queryList();
    },
    query() {
      this.queryParam.page = 1;
      this.pagination.current = 1;
      this.queryList();
    },
    reset() {
      this.queryParam = {
        page: 1,
        limit: this.queryParam.limit,
        query: {},
      };
      this.faultCodeOptions = []
      this.timeRange=[]
      this.pagination.current = 1;
      this.queryList();
    },
    queryList() {
      this.loading = true;
      if(this.timeRange.length>0){
        this.queryParam.query.startTime = Date.parse(this.timeRange[0]) / 1000
        this.queryParam.query.endTime = Date.parse(this.timeRange[1]) / 1000
      } else {
        delete this.queryParam.query.startTime
        delete this.queryParam.query.endTime
      }
      if(this.faultCode.length>0){
        this.queryParam.query.faultCode=this.faultCode[1]
      } else {
        delete this.queryParam.query.faultCode
      }
      getDeviceFaultList(this.queryParam)
        .then((res) => {
          if (res.code === 0) {
            res.data.list.forEach((v, i) => {
              v.rowKey = i;
            });
            this.dataSource = res.data.list;
            this.pagination.total = res.data.total;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },

    getDeveloperList(){
      getDeveloperList({}).then((res) => {
        if (res.code === 0) {
          this.developerList = res.data?.list?.map(item=>{
            return{
              label:item.userName,
              value:item.userId
            }
          }) ||[]
        }
      });
    },
    async productChange(productId){
      // 请求物模型故障类型
      this.faultCode = []
      if(!productId){
        this.faultCodeOptions = []
        return
      }
      const res = await getFaultFuncList({productId})
      if (res.code != 0) return
      this.faultCodeOptions = res.data?.map(item=>{
        return {
          label: item.name,
          value: item.dpid,
          children:item.dataSpecsList?.map(t=>{
            return {
              label:t.desc || t.name,
              value:t.value
            }
          })
        }
      }) || []
    },

    developerChange(developer){
      this.getPlatformProductList(developer)
      if(developer){
        this.$set(this.queryParam.query,'productId', '')
      }
    }
  },
};
</script>
<style lang="less" scoped>
.total{
  padding-bottom: 10px;
}
</style>
