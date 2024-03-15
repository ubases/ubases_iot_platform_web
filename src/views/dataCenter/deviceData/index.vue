<template>
  <a-card :bordered="false">
    <!-- 筛选栏 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item>
              <a-input v-model="queryParam.queryObj.did" placeholder="请输入设备ID" :allowClear="true"  @keyup.enter.native="query"/>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item>
              <a-select v-model="queryParam.queryObj.isActive" placeholder="是否激活" :allowClear="true" @keyup.enter.native="query">
                <a-select-option v-for="v in $DictList('active_status')" :key="v.key" :value="v.key">
                  {{ v.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item>
              <a-select v-model="queryParam.queryObj.isOnline" placeholder="是否在线" :allowClear="true" @keyup.enter.native="query" >
                <a-select-option v-for="v in $DictList('online_status')" :key="v.key" :value="v.key">
                  {{ v.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item>
              <a-select v-model="queryParam.queryObj.belongType" placeholder="设备归属" :allowClear="true" @keyup.enter.native="query">
                <a-select-option v-for="v in $DictList('belong_type')" :key="v.key" :value="v.key">
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

    <!-- 表格操作栏 -->
    <div class="table-operator">
      <a-row>
        <a-col :md="4" :sm="24">
          <div>设备总数：{{ deviceCount.deviceTotal }}</div>
        </a-col>
        <a-col :md="4" :sm="24">
          <div>已激活设备：{{ deviceCount.activeTotal }}</div>
        </a-col>
        <a-col :md="4" :sm="24">
          <div>当前在线设备：{{ deviceCount.onlineTotal }}</div>
        </a-col>
      </a-row>
    </div>
    <!-- 表格 -->
    <a-table size="small" rowKey="id" :data-source="dataSource" :columns="columns" :loading="loading" :pagination="pagination" @change="onChangePagination">
    </a-table>
  </a-card>
</template>
<script>
import { getDeviceCount } from "@/api/product";
export default {
  name: "Device",
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
        { dataIndex: "deviceName", title: "设备名称", scopedSlots: { customRender: "deviceName" }},
        { dataIndex: "activeStatus", title: "设备ID", scopedSlots: { customRender: "activeStatus" }},
        { dataIndex: "onlineStatus", title: "产品类型", scopedSlots: { customRender: "onlineStatus" }},
        { dataIndex: "productName", title: "是否在线", scopedSlots: { customRender: "productName" } },
        { dataIndex: "deviceNature", title: "激活时间", scopedSlots: { customRender: "deviceNature" } },
        { dataIndex: "userName", title: "激活IP" },
        { title: "操作", key: "action", align: "center", width: "80px", scopedSlots: { customRender: "action" }},
      ],
      dataSource: [],
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
      this.loading = true;
    },

  },
};
</script>
<style lang="less" scoped></style>
