<template>
  <a-modal title="导出日志" :width="800" :visible="visible" :confirm-loading="confirmLoading" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-row :gutter="16">
        <a-col :md="24" :sm="24">
          <a-form-item>
            <a-date-picker
              style="width: 48%"
              format="YYYY-MM-DD"
              placeholder="请选择开始时间"
              v-model="startValue"
              :allowClear="false"
              :disabled-date="disabledStartDate"
              @openChange="handleStartOpenChange"
            />
            <span style="width: 4%; display: inline-block; text-align: center">
              ~
            </span>
            <a-date-picker
              style="width: 48%"
              format="YYYY-MM-DD"
              placeholder="请选择结束时间"
              v-model="endValue"
              :allowClear="false"
              :disabled-date="disabledEndDate"
              :open="endOpen"
              @openChange="handleEndOpenChange"
            />
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item>
            <a-select v-model="queryParam.eventType" placeholder="请选择设备事件" style="width: 100%" default-value="" :options="$DictList('event_type')" />
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item>
            <a-select v-model="queryParam.eventKey" placeholder="请选择事件名称" style="width: 100%" default-value="">
              <a-select-option v-for="v in eventList" :key="v.identifier" :value="v.identifier">
                  {{ v.name }}
                </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item>
            <a-select v-model="queryParam.origin" placeholder="请选择来源" style="width: 100%" default-value="" :options="$DictList('device_mode_type')" />
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item>
            <a-button icon="search" type="primary" @click="queryList">
              查询
            </a-button>
            <a-divider type="vertical" />
            <a-button icon="redo" @click="reset"> 重置 </a-button>
          </a-form-item>
        </a-col>
      </a-row>
      <div class="log-total">
        导出日志 共查询到{{ logTotal }}条数据，请确认是否全部导出
      </div>
    </a-spin>
    <template #footer>
      <a-button key="back" @click="handleCancel">取消</a-button>
      <a-divider type="vertical" />
      <a-button key="submit" type="primary" @click="handleOk" :loading="confirmLoading">
        确定
      </a-button>
    </template>
  </a-modal>
</template>
<script>
import { getDeviceLogCount } from "@/api/product";
import moment from "moment";
export default {
  props: {
    did: { type: String, default: "" },
    eventList:{ type: Array, default: () => [] }
  },
  data() {
    return {
      // 导出框
      visible: false,
      confirmLoading: false,
      endValue: moment(),
      startValue: moment(),
      queryParam: {},
      endOpen: false,
      logTotal: 0,
    };
  },
  watch: {
    visible: function (newData, oldData) {
      // 初始化
      if (newData) {
        this.queryParam = {};
        this.endValue = moment();
        this.startValue = moment();
        this.logTotal = 0;
      }
    },
  },
  methods: {
    queryList() {
      this.queryParam.endTime = Date.parse(this.endValue) / 1000;
      this.queryParam.startTime = Date.parse(this.startValue) / 1000;
      this.queryParam.did = this.did;
      this.confirmLoading = true;
      getDeviceLogCount({ query: this.queryParam })
        .then((res) => {
          if (res.code == 0) {
            this.logTotal = res.data.total;
          }
        })
        .finally(() => {
          this.confirmLoading = false;
        });
    },
    reset() {
      this.queryParam = {};
      this.endValue = moment();
      this.startValue = moment();
      this.queryList();
    },
    handleOk() {
      if (!this.logTotal) {
        this.$message.error("请先查询日志");
        return;
      }
      this.confirmLoading = true;
      this.$DownloadTemplate(
        this,
        {
          url: `/v1/platform/web/iot/activeDevice/logExport`,
          ...this.queryParam,
        },
        "设备日志.xlsx"
      ).finally(() => {
        this.confirmLoading = false;
      });
    },
    handleCancel() {
      this.visible = false;
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
<style lang="less" scoped>
.log-total {
  padding: 20px;
  text-align: center;
}
</style>
