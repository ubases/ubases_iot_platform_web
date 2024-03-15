<template>
  <a-card :bordered="false">
    <!-- 筛选栏 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="4" :sm="24">
            <a-form-item>
              <a-input v-model="queryParam.queryObj.did" placeholder="请输入设备名称" :allowClear="true"  @keyup.enter.native="query" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item>
              <a-input v-model="queryParam.queryObj.did" placeholder="请输入设备ID" :allowClear="true"  @keyup.enter.native="query"/>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item>
              <a-input v-model="queryParam.queryObj.did" placeholder="请输入开发者账号" :allowClear="true"  @keyup.enter.native="query"/>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item>
              <a-select v-model="queryParam.queryObj.isOnline" placeholder="请选择产品分类" :allowClear="true" @keyup.enter.native="query">
                <a-select-option v-for="v in $DictList('online_status')" :key="v.key" :value="v.key">
                  {{ v.label }}
                </a-select-option>
              </a-select>
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
      <template slot="action" slot-scope="text, record">
        <a-button type="link" size="small" icon="eye" @click="linkToPage('/product/device/log/index', record)">
          查看
        </a-button>
      </template>
    </a-table>
  </a-card>
</template>
<script>
import { getDeviceCount } from "@/api/product";
export default {
  name: "DeviceLog",
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
        { dataIndex: "deviceName", title: "设备名称", scopedSlots: { customRender: "deviceName" } },
        { dataIndex: "activeStatus", title: "设备ID", scopedSlots: { customRender: "activeStatus" } },
        { dataIndex: "onlineStatus", title: "产品类型", scopedSlots: { customRender: "onlineStatus" } },
        { dataIndex: "productName", title: "开发者账号", scopedSlots: { customRender: "productName" } },
        { dataIndex: "deviceNature", title: "激活时间", scopedSlots: { customRender: "deviceNature" } },
        { dataIndex: "userName", title: "当前状态" },
        { dataIndex: "address", title: "最后一次控制" },
        { title: "操作", key: "action", align: "center", width: "80px", scopedSlots: { customRender: "action" } },
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
