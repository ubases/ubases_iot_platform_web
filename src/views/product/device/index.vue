<template>
  <a-card :bordered="false">
    <!-- 筛选栏 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="16">
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-input v-model="queryParam.query.did" placeholder="请输入设备ID" :allowClear="true"  @keyup.enter.native="query"/>
            </a-form-item>
          </a-col>
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-input v-model="queryParam.query.developer" placeholder="请输入开发者账号" :allowClear="true"  @keyup.enter.native="query"/>
            </a-form-item>
          </a-col>
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-input v-model="queryParam.query.deviceName" placeholder="请输入设备名称" :allowClear="true"  @keyup.enter.native="query"/>
            </a-form-item>
          </a-col>
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-input v-model="queryParam.query.productKey" placeholder="请输入产品key" :allowClear="true"  @keyup.enter.native="query"/>
            </a-form-item>
          </a-col>
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-select v-model="queryParam.query.isActive" placeholder="是否激活" :allowClear="true"  @keyup.enter.native="query">
                <a-select-option v-for="v in $DictList('active_status')" :key="v.key" :value="v.key">
                  {{ v.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-select v-model="queryParam.query.isOnline" placeholder="是否在线" :allowClear="true"  @keyup.enter.native="query">
                <a-select-option v-for="v in $DictList('online_status')" :key="v.key" :value="v.key">
                  {{ v.label }}
                </a-select-option>
              </a-select>
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
      <a-row :gutter="48" type="flex" justify="space-between" align="middle">
        <a-col :md="18" :sm="24">
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
        </a-col>
        <a-col>
          <a-button icon="cloud-download" @click="exportDevice">
            导出
          </a-button>
        </a-col>
      </a-row>
    </div>
    <!-- 表格 -->
    <a-table
      size="small"
      rowKey="rowKey"
      :data-source="dataSource"
      :columns="columns"
      :loading="loading"
      :pagination="pagination"
      @change="onChangePagination"
    >
      <template slot="deviceName" slot-scope="text, record">
        <div class="link-a" @click="linkToPage('/product/device/details/index', 'DeviceDetails', record)">
          {{ record.deviceName }} <br />{{ record.did }}
        </div>
      </template>
      <template slot="productName" slot-scope="text, record">
        <div>{{ record.productName }} <br />{{ record.productKey }}</div>
      </template>
      <template slot="activeStatus" slot-scope="text, record">
        {{ $DictName("active_status", record.activeStatus) }}
      </template>
      <template slot="onlineStatus" slot-scope="text, record">
        {{ $DictName("online_status", record.onlineStatus) }}
      </template>
      <template slot="activatedTime" slot-scope="text, record">
        <div v-if="record.activatedTime">
          {{ record.activatedTime | momentFilter }}
        </div>
        <div v-else>无</div>
      </template>
      <template slot="account" slot-scope="text, record">
        <div>{{ record.account }} <br />{{ record.companyName }}</div>
      </template>
      <template v-slot:action="item">
        <a-button type="link" size="small" icon="unordered-list" @click="linkToPage('/product/device/log/index', 'DeviceLogDetails', item)">
          日志
        </a-button>
      </template>
    </a-table>
    <export-device ref="exportDevice"></export-device>
  </a-card>
</template>
<script>
import ExportDevice from "./components/ExportDevice";
import { getDeviceList, getDeviceCount } from "@/api/product";
export default {
  name: "DeviceList",
  components: {
    "export-device": ExportDevice,
  },
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
        { title: "序号", width: "46px", customRender: (item, value, index) => index + 1 },
        { dataIndex: "deviceName", title: "设备名称", scopedSlots: { customRender: "deviceName" } },
        { dataIndex: "activeStatus", title: "是否激活", scopedSlots: { customRender: "activeStatus" } },
        { dataIndex: "onlineStatus", title: "是否在线", scopedSlots: { customRender: "onlineStatus" } },
        { dataIndex: "productName", title: "所属产品", scopedSlots: { customRender: "productName" } },
        { dataIndex: "deviceNature", title: "设备性质" },
        { dataIndex: "account", title: "开发者", width: "15%", scopedSlots: { customRender: "account" }},
        { dataIndex: "activatedTime", title: "首次激活时间", scopedSlots: { customRender: "activatedTime" }, width:"104px"},
        { title: "操作", key: "action", align: "center", width: "70px", scopedSlots: { customRender: "action" } },
      ],
      dataSource: [],
      loading: false,
      deviceCount: {},
      account:''
    };
  },
  computed: {},
  watch:{
    $route(){
      this.account = this.$route.query.account || "";
      this.$set(this.queryParam.query,'developer',this.$route.query.account || "")
      this.queryParam = this.$deepClone(this.queryParam)
    }
  },
  created() {
    this.isInit = true
    this.account = this.$route.query.account || "";
    this.$set(this.queryParam.query,'developer',this.$route.query.account || "")
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
      let params = {}
      if(this.account){
        params = {
          query:{
            developer: this.account
          }
        }
      }
      getDeviceCount(params).then((res) => {
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
        query: {},
      };
      this.pagination.current = 1;
      this.queryList();
    },
    queryList() {
      this.loading = true;
      getDeviceList(this.queryParam)
        .then((res) => {
          if (res.code == 0) {
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
    linkToPage(path, name, item) {
      this.$routerPush({
        path,
        query: {
          deviceName: item.deviceName,
          did: item.did,
          productId: item.productId,
        },
        name,
      });
    },
  },
};
</script>
<style lang="less" scoped></style>
