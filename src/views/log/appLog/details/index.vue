<template>
  <a-card :bordered="false">
    <a-page-header title="查看设备" @back="$multiTab.closeCurrentPage()">
      <a-spin :spinning="confirmLoading">
        <a-card title="账号信息" :bordered="false">
          <a-descriptions>
            <a-descriptions-item label="账号">
              {{ logInfo.account }}
            </a-descriptions-item>
            <a-descriptions-item label="APP名称">
              {{ logInfo.appName }}
            </a-descriptions-item>
            <a-descriptions-item label="服务区">
              {{ logInfo.region }}
            </a-descriptions-item>
          </a-descriptions>
        </a-card>
        <a-card title="日志记录" :bordered="false">
          <!-- 筛选栏 -->
          <div class="table-page-search-wrapper">
            <a-form layout="inline">
              <a-row :gutter="48">
                <a-col :md="6" :sm="24">
                  <a-form-item>
                    <a-range-picker
                      @change="dateChange"
                      @calendarChange="calendarChange"
                      @openChange="openChange"
                      v-model="date"
                      :allowClear="false"
                      :disabled-date="disabledDate"
                      :placeholder="['激活时间', '激活时间']"
                      separator="—"
                      @keyup.enter.native="query"
                    >
                    </a-range-picker>
                  </a-form-item>
                </a-col>
                <a-col :md="4" :sm="24">
                  <a-form-item>
                    <a-select v-model="queryParam.query.eventName" placeholder="请选择事件名称" :allowClear="true" @keyup.enter.native="query" :options="$DictList('user_events')" />
                  </a-form-item>
                </a-col>
                <a-col :md="4" :sm="24">
                  <a-form-item>
                    <a-select v-model="queryParam.query.logType" placeholder="请选择日志类型" :allowClear="true" @keyup.enter.native="query">
                      <a-select-option v-for="v in logTypeList" :key="v.key" :value="v.key">
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
          <a-table
            size="small"
            rowKey="id"
            :data-source="dataSourceRecord"
            :columns="columnsRecord"
            :loading="loading"
            :pagination="pagination"
            @change="onChangePagination"
          >
            <template slot="createdAt" slot-scope="text, record">
              {{ record.createdAt | momentFilter }}
            </template>
            <template slot="details" slot-scope="text, record">
              <div>ip:{{ record.details && record.details.ip }}</div>
              <div>系统信息:{{ record.details && record.details.system }}</div>
            </template>
          </a-table>
        </a-card>
      </a-spin>
    </a-page-header>
  </a-card>
</template>
<script>
import { getAppUserLogRecords } from "@/api/log";
import moment from "moment";
export default {
  name: "AppLogDetails",
  data() {
    return {
      two: {
        labelCol: { xs: { span: 24 }, sm: { span: 2 }},
        wrapperCol: { xs: { span: 24 }, sm: { span: 22 } },
      },
      did: "",
      logInfo: {},
      confirmLoading: false,
      dataSourceRecord: [],
      columnsRecord: [
        { title: "序号", width: "80px", customRender: (item, value, index) => index + 1 },
        { dataIndex: "createdAt", title: "时区(GMT+8)", scopedSlots: { customRender: "createdAt" } },
        { dataIndex: "eventName", title: "事件名称" },
        { dataIndex: "logType", title: "日志类型" },
        { dataIndex: "details", title: "详情", scopedSlots: { customRender: "details" }},

      ],
      queryParam: {
        page: 1,
        limit: 10,
        account: "",
        appKey: "",
        tenantId: "",
        query: {},
      },
      loading: false,
      pagination: {
        showSizeChanger: true,
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: (total, range) =>
          `总数:${total} 当前:${range[0]}-${range[1]}`,
      },
      disabledCurrent: null,
      date: [moment(), moment()],
      eventList: [
        { key: "注册", label: "注册" },
        { key: "登录", label: "登录" },
        { key: "注销账号", label: "注销账号" },
        { key: "忘记密码", label: "忘记密码" },
        { key: "第三方登录", label: "第三方登录" },
        { key: "第三方渠道注册", label: "第三方渠道注册" },
        { key: "添加家庭", label: "添加家庭" },
        { key: "发送邀请码", label: "发送邀请码" },
        { key: "转移家庭所有权", label: "转移家庭所有权" },
        { key: "设备激活", label: "设备激活" },
        { key: "删除设备", label: "删除设备" },
        { key: "创建智能场景", label: "创建智能场景" },
        { key: "场景删除", label: "场景删除" },
        { key: "反馈提交", label: "反馈提交" },
      ],
      logTypeList: [
        { key: "操作日志", label: "操作日志" },
        { key: "错误日志", label: "错误日志" },
      ],
    };
  },
  created() {
    this.logInfo = this.$route.query;

    this.queryList();
  },
  methods: {
    // 日期选项变化
    dateChange(e) {
      this.date = e;
      if (e.length > 0) {
        this.queryParam.query.startTime = Date.parse(e[0]) / 1000;
        this.queryParam.query.endTime = Date.parse(e[1]) / 1000;
      } else {
        this.queryParam.query.startTime = "";
        this.queryParam.query.endTime = "";
      }
    },
    // 清空禁用时间段的设置
    openChange() {
      this.disabledCurrent = this.date[0] ?? null;
    },
    // 获取手动选择的时间段起始值
    calendarChange(dates) {
      this.disabledCurrent = dates[0];
    },
    //时间限制范围 开始时间~结束时间不能超过7天，且禁选超过当前日期时间
    disabledDate(current) {
      if (!this.disabledCurrent) return current > moment();
      return (
        current > moment(this.disabledCurrent).add(6, "days").endOf("day") ||
        current <
          moment(this.disabledCurrent).subtract(7, "days").endOf("day") ||
        current > moment()
      );
    },
    queryList() {
      this.queryParam.account = this.logInfo.account;
      this.queryParam.appKey = this.logInfo.appKey;
      this.queryParam.tenantId = this.logInfo.tenantId;
      this.queryParam.regionServerId = this.logInfo.regionServerId;
      this.confirmLoading = true;
      if (this.date.length > 0) {
        this.queryParam.query.startTime = Date.parse(this.date[0]) / 1000;
        this.queryParam.query.endTime = Date.parse(this.date[1]) / 1000;
      }
      getAppUserLogRecords(this.queryParam)
        .then((res) => {
          if (res.code === 0) {
            this.dataSourceRecord = res.data.list;
            this.pagination.total = res.data.total;
          }
        })
        .finally(() => {
          this.confirmLoading = false;
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
      this.date = [moment(), moment()];
      this.pagination.current = 1;
      this.queryList();
    },
  },
};
</script>
<style lang="less" scoped>
h3 {
  padding: 30px 0 10px;
}
</style>
