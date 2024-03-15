<template>
  <a-card :bordered="false">
    <!-- 筛选栏 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-input v-model="queryParam.query.userName" placeholder="请输入开发者账号" :allowClear="true"  @keyup.enter.native="query" />
            </a-form-item>
          </a-col>
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-select v-model="queryParam.query.lastDay" placeholder="请选择时间范围" :allowClear="true" @keyup.enter.native="query">
                <a-select-option v-for="v in $DictList('query_time_type')" :value="v.key" :key="v.key">
                  {{ v.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-input  placeholder="中国大陆" disabled />
            </a-form-item>
          </a-col>
          <a-col v-bind="aColFlex">
            <span class="table-page-search-submitButtons">
              <a-button icon="search" type="primary" @click="query">
                查询
              </a-button>
              <a-divider type="vertical" />
              <a-button icon="redo" @click="reset"> 重置 </a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 表格操作栏 -->
    <div class="table-operator">
      <a-row>
        <a-col :md="4" :sm="24">
          <div>开发者用户：{{ devUserTotal }}</div>
        </a-col>
        <a-col :md="4" :sm="24">
          <div>当前在线设备：{{ devUserOnlineTotal }}</div>
        </a-col>
      </a-row>
    </div>
    <!-- 表格 -->
    <a-table
      size="small"
      rowKey="userId"
      :data-source="dataSource"
      :columns="columns"
      :loading="loading"
      :pagination="pagination"
      @change="onChangePagination"
    >
      <template slot="online" slot-scope="text, record">
        {{ $DictName("online_status", record.online) }}
      </template>
      <template slot="registerTime" slot-scope="text, record">
        {{ record.registerTime | momentFilter }}
      </template>
      <template slot="userName" slot-scope="text, record">
        <div class="link-a" @click="linkToPage('/data-center/developer-data/details', record)">
          {{ record.userName }}
        </div>
      </template>
    </a-table>
  </a-card>
</template>
<script>
import { getDeveloperList, getDeveloperStatistics, getDeviceStatistics } from "@/api/data";
export default {
  name: "DeveloperData",
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
        { title: "序号", width: "80px", customRender: (item, value, index) => index + 1},
        { dataIndex: "userName", title: "开发者账号", scopedSlots: { customRender: "userName" } },
        { dataIndex: "activeDeviceTotal", title: "已激活设备量" },
        { dataIndex: "appTotal", title: "已开发APP" },
        { dataIndex: "online", title: "在线状态", scopedSlots: { customRender: "online" } },
        { dataIndex: "registerTime", title: "注册时间", scopedSlots: { customRender: "registerTime" } },
        { dataIndex: "loginAddr", title: "登录地区" },
      ],
      dataSource: [],
      loading: false,
      devUserOnlineTotal: 0,
      devUserTotal: 0,
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
      getDeveloperStatistics().then((res) => {
        if (res.code === 0) {
          this.devUserTotal = res.data.devUserTotal;
        }
      });
      getDeviceStatistics().then((res) => {
        if (res.code === 0) {
          this.devUserOnlineTotal = res.data.devOnlineTotal;
        }
      }

      )
    },
    // 导出设备
    exportDevice() {
      this.$refs["exportDevice"].visible = true;
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
      this.pagination.current = 1;
      this.queryList();
    },
    queryList() {
      this.loading = false;
      getDeveloperList(this.queryParam).then((res) => {
        if (res.code === 0) {
          this.dataSource = res.data.list;
          this.pagination.total = res.data.total;
        }
      });
    },
    linkToPage(path, item) {
      this.$routerPush({
        path,
        query: { id: item.userId },
        name: "DeveloperDataDetails",
      });
    },
  },
};
</script>
<style lang="less" scoped></style>
