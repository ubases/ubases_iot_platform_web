<template>
  <a-card :bordered="false">
    <!-- 筛选栏 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-input v-model="queryParam.query.account" placeholder="请输入APP用户账号" :allowClear="true"  @keyup.enter.native="query"/>
            </a-form-item>
          </a-col>
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-input v-model="queryParam.query.appName" placeholder="请输入APP名称" :allowClear="true"  @keyup.enter.native="query"/>
            </a-form-item>
          </a-col>
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-input placeholder="中国大陆" disabled v-model="queryParam.query.region"/>
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
    <!-- 表格 -->
    <a-table
      size="small"
      rowKey="id"
      :data-source="dataSource"
      :columns="columns"
      :loading="loading"
      :pagination="pagination"
      @change="onChangePagination"
    >
      <template slot="loginTime" slot-scope="text, record">
        {{ record.loginTime | momentFilter }}
      </template>
      <template slot="account" slot-scope="text, record">
        <div class="link-a" @click="linkToPage('/log/app-log/details', record)">
          {{ record.account }}
        </div>
      </template>
    </a-table>
  </a-card>
</template>
<script>
import { getAppUserLogList } from "@/api/log";
export default {
  name: "AppLog",
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
        { title: "序号", width: "80px", customRender: (item, value, index) => index + 1 },
        { dataIndex: "account", title: "用户账号", scopedSlots: { customRender: "account" } },
        { dataIndex: "appName", title: "APP名称" },
        { dataIndex: "region", title: "服务区" },
        { dataIndex: "loginTime", title: "最后一次登录", scopedSlots: { customRender: "loginTime" } },
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
      getAppUserLogList(this.queryParam)
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
    linkToPage(path, query) {
      this.$routerPush({
        path,
        query,
        name: "AppLogDetails",
      });
    },
  },
};
</script>
<style lang="less" scoped></style>
