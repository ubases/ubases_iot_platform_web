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
              <a-input v-model="queryParam.query.appName" placeholder="请输入App名称" :allowClear="true"  @keyup.enter.native="query" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
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

    <!-- 表格 -->
    <a-table
      size="small"
      rowKey="appId"
      :data-source="dataSource"
      :columns="columns"
      :loading="loading"
      :pagination="pagination"
      @change="onChangePagination"
    >
      <template slot="appName" slot-scope="text, record">
        <div class="link-a" @click="linkToPage('/data-center/app-data/details', record)" >
          {{ record.appName }}
        </div>
      </template>
    </a-table>
  </a-card>
</template>
<script>
import { getAppList } from "@/api/data";
export default {
  name: "AppData",
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
        { dataIndex: "appName", title: "App名称", scopedSlots: { customRender: "appName" } },
        { dataIndex: "developerId", title: "开发者账号" },
        { dataIndex: "registerUserTotal", title: "注册用户" },
        { dataIndex: "acitveUserTotal", title: "近七天活跃用户" },
        { dataIndex: "version", title: "最新版本" },
        { dataIndex: "verTotal", title: "故障累计" },
        { dataIndex: "feedbackQuantity", title: "用户反馈" },
      ],
      dataSource: [],
      loading: false,
    };
  },
  computed: {},
  created() {
    this.isInit = true
    this.queryList();
  },
  activated () {
    if(this.isInit){
      this.isInit = false
    }else{
    this.queryList()
    }
  },
  methods: {
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
      this.loading = true;
      getAppList(this.queryParam)
        .then((res) => {
          if (res.code === 0) {
            this.dataSource = res.data.list;
            this.pagination.total = res.data.total;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    linkToPage(path, item) {
      this.$routerPush({
        path,
        name: "AppDataDetails",
        query: { id: item.appId },
      });
    },
  },
};
</script>
<style lang="less" scoped></style>
