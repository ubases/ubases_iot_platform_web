<template>
  <a-card :bordered="false">
    <!-- 筛选栏 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="10">
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-input v-model="queryParam.query.title" placeholder="请输入通知名称" :allowClear="true"  @keyup.enter.native="query"/>
            </a-form-item>
          </a-col>
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-input v-model="queryParam.query.account" placeholder="请输入手机号" :allowClear="true"  @keyup.enter.native="query"/>
            </a-form-item>
          </a-col>
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-select v-model="queryParam.query.noticeType" placeholder="请选择通知类型" :allowClear="true" :options="$DictList('sms_notice_type')" @keyup.enter.native="query" />
            </a-form-item>
          </a-col>
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-select v-model="queryParam.query.lang" placeholder="请选择模板语种" :allowClear="true" :options="$DictList('language_type')" @keyup.enter.native="query" />
            </a-form-item>
          </a-col>
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-select v-model="queryParam.query.status" placeholder="请选择发送状态" :allowClear="true" :options="$DictList('sms_send_status')" @keyup.enter.native="query" />
            </a-form-item>
          </a-col>
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-range-picker v-model="timeRange" :ranges="dateRange" @keyup.enter.native="query"/>
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
    <div class="total">短信发送记录：{{ pagination.total }}</div>
    <a-table size="small" rowKey="rowKey" :data-source="dataSource" :columns="columns" :loading="loading" :pagination="pagination" @change="onChangePagination">
      <template slot="noticeType" slot-scope="text, item">
        {{ $DictName('sms_notice_type', item.noticeType) }}
      </template>
      <template slot="lang" slot-scope="text, item">
        {{ $DictName('language_type', item.lang) }}
      </template>
      <template slot="createdAt" slot-scope="text, item">
        {{ item.createdAt | momentFilter }}
      </template>
      <span slot="status" slot-scope="text, item" :class="item.status == 1 ? 'text-success' : 'text-danger'">
        {{ $DictName('sms_send_status', item.status) }}
      </span>
    </a-table>
  </a-card>
</template>
<script>
import { sendRecord } from "@/api/data";
import moment from 'moment';

export default {
  name: "SmsRecord",
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
        { dataIndex: "title", title: "通知名称" },
        { dataIndex: "noticeType", title: "通知类型", scopedSlots: { customRender: "noticeType" } },
        { dataIndex: "lang", title: "模板语种", scopedSlots: { customRender: "lang" }},
        { dataIndex: "account", title: "手机号" },
        { dataIndex: "createdAt", title: "发送时间", scopedSlots: { customRender: "createdAt" } },
        { dataIndex: "status", title: "发送状态", scopedSlots: { customRender: "status" } },
        { dataIndex: "sendErrMsg", title: "说明" },
      ],
      dataSource: [],
      loading: false,
      productList: [],
      dateRange:{ 
        '上周': [ moment().week(moment().week() - 1).startOf('week').add(1,'days'), moment().week(moment().week() - 1).endOf('week').add(1,'days') ], 
        '上月': [ moment().month(moment().month() - 1).startOf('month'), moment().month(moment().month() - 1).endOf('month') ],
        '前三个月':[ moment().month(moment().month() - 3).startOf('month'), moment().month(moment().month() - 1).endOf('month')]
      },
      timeRange:[]
    };
  },
  computed: {},
  created() {
    this.isInit = true
    this.queryList()
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
      this.queryList();
    },
    query() {
      this.queryParam.page = 1
      this.pagination.current = 1
      this.queryList();
    },
    reset() {
      this.queryParam = {
        page: 1,
        limit: this.queryParam.limit,
        query: {},
      };
      this.timeRange = []
      this.pagination.current = 1
      this.queryList()
    },
    queryList() {
      this.loading = true
      if(this.timeRange.length>0){
        this.queryParam.query.beginTime = Date.parse(this.timeRange[0]) / 1000
        this.queryParam.query.endTime = Date.parse(this.timeRange[1]) / 1000
      } else {
        delete this.queryParam.query.beginTime
        delete this.queryParam.query.endTime
      }
      this.queryParam.query.method = 1
      sendRecord(this.queryParam)
        .then((res) => {
          if (res.code === 0) {
            res.data.list.forEach((v, i) => {
              v.rowKey = i;
            });
            this.dataSource = res.data.list
            this.pagination.total = res.data.total
          }
        })
        .finally(() => {
          this.loading = false
        });
    },

  },
};
</script>
<style lang="less" scoped>
.total{
  padding-bottom: 10px;
}
.text-success{
  color: #52c41a;
}
.text-error{
  color: #f5222d;
}
</style>
