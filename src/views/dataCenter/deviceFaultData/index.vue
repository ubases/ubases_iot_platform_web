<template>
  <a-card :bordered="false">
    <!-- 筛选栏 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-input v-model="queryParam.query.did" placeholder="请输入设备ID" :allowClear="true"  @keyup.enter.native="query"/>
            </a-form-item>
          </a-col>
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-select v-model="queryParam.query.productId" placeholder="请选择产品类型" :allowClear="true" @keyup.enter.native="query" >
                <a-select-option v-for="v in productList" :key="v.id" :value="v.id">
                  {{ v.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-select v-model="queryParam.query.faultCode" placeholder="请选择故障类型" :allowClear="true" @keyup.enter.native="query">
                <a-select-option v-for="v in $DictList('device_fault_type')" :value="v.key" :key="v.key">
                  {{ v.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-select v-model="queryParam.query.lastDay" placeholder="时间范围" :allowClear="true" @keyup.enter.native="query">
                <a-select-option v-for="v in $DictList('query_time_type')" :value="v.key" :key="v.key">
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
    <!-- 表格 -->
    <a-table size="small" rowKey="rowKey" :data-source="dataSource" :columns="columns" :loading="loading" :pagination="pagination" @change="onChangePagination">
      <template slot="time" slot-scope="text, item">
        {{ item.time | momentFilter }}
      </template>
    </a-table>
  </a-card>
</template>
<script>
import { getDeviceFaultList } from "@/api/data";
import { getProductList } from "@/api/product";
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
        { title: "序号", width: "80px", customRender: (item, value, index) => index + 1 },
        { dataIndex: "faultName", title: "故障类型名称" },
        { dataIndex: "faultCode", title: "故障编号" },
        { dataIndex: "productName", title: "产品类型" },
        { dataIndex: "deviceName", title: "设备名称" },
        { dataIndex: "deviceId", title: "设备ID" },
        { dataIndex: "time", title: "上报时间", scopedSlots: { customRender: "time" } },
        { dataIndex: "ip", title: "上报IP" },
      ],
      dataSource: [],
      loading: false,
      productList: [],
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
      getProductList({}).then((res) => {
        if (res.code === 0) {
          this.productList = res.data.list;
        }
      });
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
  },
};
</script>
<style lang="less" scoped></style>
