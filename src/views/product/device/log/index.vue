<template>
  <a-card :bordered="false">
    <a-page-header title="设备日志" @back="$multiTab.closeCurrentPage()">
      <a-card title="基本信息" :bordered="false">
        <div class="table-page-search-wrapper">
          <a-descriptions>
            <a-descriptions-item label="设备名称">
              {{ this.deviceName }}
            </a-descriptions-item>
            <a-descriptions-item label="设备ID">
              {{ this.did }}
            </a-descriptions-item>
          </a-descriptions>
        </div>
      </a-card>
      <a-card title="设备日志" :bordered="false">
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="48">
              <a-col :xxl="6" :xl="8" :lg="24" :md="24" :sm="24">
                <a-form-item>
                  <a-space>
                    <a-date-picker
                      v-model="startValue"
                      :allowClear="false"
                      :disabled-date="disabledStartDate"
                      format="YYYY-MM-DD"
                      placeholder="请选择开始时间"
                      @openChange="handleStartOpenChange"
                    />~
                    <a-date-picker
                      v-model="endValue"
                      :allowClear="false"
                      :disabled-date="disabledEndDate"
                      format="YYYY-MM-DD"
                      placeholder="请选择结束时间"
                      :open="endOpen"
                      @openChange="handleEndOpenChange"
                    />
                  </a-space>
                </a-form-item>
              </a-col>
              <a-col :xxl="4" :xl="6" :lg="8" :md="12" :sm="24">
                <a-form-item>
                  <a-select v-model="queryParam.query.eventType" placeholder="请选择设备事件" :allowClear="true"  @keyup.enter.native="query">
                    <a-select-option v-for="v in $DictList('event_type')" :key="v.key" :value="v.key">
                      {{ v.label }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :xxl="4" :xl="6" :lg="8" :md="12" :sm="24">
                <a-form-item>
                  <a-select v-model="queryParam.query.eventKey" placeholder="请选择事件名称" default-value="" :allowClear="true"  @keyup.enter.native="query">
                    <a-select-option v-for="v in eventList" :key="v.identifier" :value="v.identifier">
                      {{ v.name }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :xxl="4" :xl="6" :lg="8" :md="12" :sm="24">
                <a-form-item>
                  <a-select v-model="queryParam.query.origin" placeholder="请选择来源" default-value="" :allowClear="true"  @keyup.enter.native="query">
                    <a-select-option v-for="v in $DictList('device_mode_type')" :key="v.key" :value="v.key">
                      {{ v.label }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :xxl="6" :xl="6" :lg="8" :md="16" :sm="24">
                <span class="table-page-search-submitButtons">
                  <a-button icon="search" type="primary" @click="query">
                    查询
                  </a-button>
                  <a-divider type="vertical" />
                  <a-button icon="redo" @click="reset"> 重置 </a-button>
                  <a-divider type="vertical" />
                  <a-button icon="cloud-download" @click="exportLog">
                    导出
                  </a-button>
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
          <template slot="reportTime" slot-scope="text, item">
            {{ item.reportTime | momentFilter }}
          </template>
          <template slot="eventType" slot-scope="text, item">
            {{ $DictName("event_type", item.eventType) }}
          </template>
          <div slot="funcDesc" slot-scope="text, item" v-html="item.funcDesc">
          </div>
          <template slot="originType" slot-scope="text, item">
            {{ $DictName("device_mode_type", item.originType) }}
          </template>
        </a-table>
      </a-card>
    </a-page-header>
    <export-log :did="did" ref="exportLog"></export-log>
  </a-card>
</template>
<script>
import ExportLog from "../components/ExportLog.vue";
import { getDeviceLog, getDeviceLogEventList } from "@/api/product";
import moment from "moment";
export default {
  name: "DeviceLogDetails",
  components: {
    "export-log": ExportLog,
  },
  data() {
    return {
      queryParam: {
        page: 1,
        limit: 10,
        query: {},
      },
      dataSource: [],
      columns: [
        {title: "序号",customRender: (item,value,index) => index + 1 },
        {dataIndex: "reportTime",title: "时区(GMT+8)",scopedSlots: { customRender: "reportTime" }},
        {dataIndex: "eventType",title: "设备事件",scopedSlots: { customRender: "eventType" }},
        {dataIndex: "funcKey",title: "事件名称"},
        {dataIndex: "funcDesc",title: "事件详情",scopedSlots: { customRender: "funcDesc" }},
        {dataIndex: "originType",title: "来源",scopedSlots: { customRender: "originType" }},
        {dataIndex: "originDetail",title: "来源详情",width: "240px",ellipsis: true},
      ],
      pagination: {
        showSizeChanger: true,
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: (total, range) =>
          `总数:${total} 当前:${range[0]}-${range[1]}`,
      },
      loading: false,
      deviceName: "",
      did: "",
      // 时间范围限制
      startValue: moment(),
      endValue: moment(),
      endOpen: false,
      // 事件列表
      eventList: [],
    };
  },
  created() {
    this.init();
    getDeviceLogEventList({
      productId: this.$route.query.productId,
      isCustom: -1,
    }).then((res) => {
      if (res.code === 0) {
        this.eventList = res.data.list;
      }
    });
  },
  methods: {
    init() {
      this.deviceName = this.$route.query.deviceName;
      this.did = this.$route.query.did;
      this.queryParam.query.did = this.did;
      this.queryList();
    },
    onChangePagination(e) {
      this.queryParam.page = e.current;
      this.queryParam.limit = e.pageSize;
      this.pagination.current = e.current;
      this.pagination.pageSize = e.pageSize;
      this.queryList();
    },
    queryList() {
      this.loading = true;
      if (this.startValue) {
        this.queryParam.query.startTime = Date.parse(this.startValue) / 1000;
      }
      if (this.endValue) {
        this.queryParam.query.endTime = Date.parse(this.endValue) / 1000;
      }
      getDeviceLog(this.queryParam)
        .then((res) => {
          if (res.code == 0) {
            this.dataSource = res.data.list || []
            this.pagination.total = res.data.total;
          }
        })
        .finally(() => {
          this.loading = false;
        });
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
        query: {
          did: this.did,
        },
      };
      this.pagination.current = 1;
      this.startValue = moment();
      this.endValue = moment();
      this.queryList();
    },
    // 导出设备
    exportLog() {
      this.$refs["exportLog"].visible = true;
    },
    // 限定时间范围 - 一周
    disabledStartDate(startValue) {
      const endValue = this.endValue;
      if (!startValue || !endValue) {
        return false;
      }
      return (
        startValue.valueOf() > endValue.valueOf() ||
        startValue.valueOf() < endValue.valueOf() - 7 * 24 * 60 * 60 * 1000
      );
    },
    disabledEndDate(endValue) {
      const startValue = this.startValue;
      if (!endValue || !startValue) {
        return false;
      }
      return (
        startValue.valueOf() >= endValue.valueOf() ||
        endValue.valueOf() > startValue.valueOf() + 7 * 24 * 60 * 60 * 1000
      );
    },
    handleStartOpenChange(open) {
      if (!open) {
        this.endOpen = true;
      }
    },
    handleEndOpenChange(open) {
      this.endOpen = open;
    },
  },
};
</script>
<style lang="less" scoped></style>
