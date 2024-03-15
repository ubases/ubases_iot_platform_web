<template>
  <a-card :bordered="false">
    <!-- 筛选栏 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="4" :sm="24">
            <a-form-item>
              <a-range-picker :allowClear="true" @keyup.enter.native="query"/>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item>
              <a-input v-model="queryParam.queryObj.did" placeholder="请输入操作人" :allowClear="true" @keyup.enter.native="query" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item>
              <a-input v-model="queryParam.queryObj.did" placeholder="请输入所属模块" :allowClear="true" @keyup.enter.native="query"/>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button icon="search" type="primary" @click="query">
                查询
              </a-button>
              <a-button icon="redo" style="margin-left: 8px" @click="reset">
                重置
              </a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 表格 -->
    <a-table size="small" rowKey="id" :data-source="dataSource" :columns="columns" :loading="loading" :pagination="pagination" @change="onChangePagination">
    </a-table>
  </a-card>
</template>
<script>
import { getDeviceCount } from "@/api/product";
export default {
  name: "SystemLog",
  data() {
    return {
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
        queryObj: {},
      },
      columns: [
        { title: "序号", width: "80px", customRender: (item, value, index) => index + 1},
        { dataIndex: "deviceName", title: "操作内容", scopedSlots: { customRender: "deviceName" } },
        { dataIndex: "activeStatus", title: "操作账号", scopedSlots: { customRender: "activeStatus" } },
        { dataIndex: "onlineStatus", title: "角色", scopedSlots: { customRender: "onlineStatus" } },
        { dataIndex: "productName", title: "所属模块", scopedSlots: { customRender: "productName" } },
        { dataIndex: "deviceNature", title: "操作类型", scopedSlots: { customRender: "deviceNature" }},
        { dataIndex: "userName", title: "操作时间" },
        { dataIndex: "address", title: "访问IP" },
        { dataIndex: "address1", title: "客户端" },
      ],
      dataSource: [{}],
      loading: false,
      deviceCount: {},
    };
  },
  computed: {},
  created() {
    this.queryList();
    this.init();
  },
  methods: {
    init() {
      getDeviceCount({}).then((res) => {
        if (res.code == 0) {
          this.deviceCount = res.data;
        }
      });
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
        queryObj: {},
      };
      this.pagination.current = 1;
      this.queryList();
    },
    queryList() {
      this.loading = false;
    },
    linkToPage(path, item) {
      // this.$router.push({
      //   path,
      //   query: { deviceName: item.deviceName, did: item.did },
      // });
    },
  },
};
</script>
<style lang="less" scoped></style>
