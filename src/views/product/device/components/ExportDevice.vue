<template>
  <a-modal title="导出设备" :width="800" :visible="visible" :confirm-loading="confirmLoading" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-row :gutter="16">
        <a-col :md="8" :sm="24">
          <a-form-item>
            <a-select v-model="queryParam.isActive" placeholder="是否绑定" style="width: 100%">
              <a-select-option :value="1">已激活</a-select-option>
              <a-select-option :value="2">未激活</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item>
            <a-select v-model="queryParam.isOnline" placeholder="是否在线" style="width: 100%">
              <a-select-option :value="1">在线</a-select-option>
              <a-select-option :value="2">离线</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item>
            <a-select v-model="queryParam.deviceNature" placeholder="设备归属" style="width: 100%">
              <a-select-option :value="1">开发者</a-select-option>
              <a-select-option :value="2">公司名称&账号</a-select-option>
              <a-select-option :value="3">个人账号</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item>
            <a-input v-model="queryParam.searchKey" placeholder="请输入设备ID，设备名称"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item>
            <a-select v-model="queryParam.productId" placeholder="所属产品" style="width: 100%">
              <a-select-option :value="v.id" v-for="v in dataSource" :key="v.id">
                {{ v.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="19" :sm="24">
          <a-form-item>
            <a-date-picker style="width: 48%" format="YYYY-MM-DD" placeholder="请选择开始时间" v-model="startValue" :disabled-date="disabledStartDate" @openChange="handleStartOpenChange"/>
            <span style="width: 4%; display: inline-block; text-align: center">
              ~
            </span>
            <a-date-picker style="width: 48%" format="YYYY-MM-DD" placeholder="请选择结束时间" v-model="endValue" :disabled-date="disabledEndDate" :open="endOpen" @openChange="handleEndOpenChange" />
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
        导出设备 共查询到{{ logTotal }}条数据，请确认是否全部导出
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
import { getDeviceList, getProductList } from "@/api/product";
import moment from "moment";
export default {
  data() {
    return {
      // 导出框
      visible: false,
      confirmLoading: false,
      endValue: '',
      startValue: '',
      queryParam: {},
      endOpen: false,
      logTotal: 0,
      dataSource: [],
    };
  },
  watch: {
    visible: function (newData, oldData) {
      // 初始化
      if (newData) {
        this.queryParam = {};
        // this.endValue = moment();
        // this.startValue = moment();
        this.logTotal = 0;
      }
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      getProductList({}).then((res) => {
        if (res.code == 0) {
          this.dataSource = res.data.list || [];
        } else {
          this.dataSource = [];
        }
      });
    },
    queryList() {
      this.queryParam.endTime = Date.parse(this.endValue) / 1000;
      this.queryParam.startTime = Date.parse(this.startValue) / 1000;
      this.confirmLoading = true;
      getDeviceList({
        query: this.queryParam,
        isOnlyCount: 1,
        searchKey: this.queryParam.searchKey,
      })
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
      this.endValue = '';
      this.startValue = '';
      this.queryList();
    },
    handleOk() {
      if (!this.logTotal) {
        this.$message.error("请先查询设备");
        return;
      }
      this.confirmLoading = true;
      this.$DownloadTemplate(
        this,
        {
          url: `/v1/platform/web/iot/activeDevice/platformExport`,
          method: "post",
          query:{...this.queryParam},
          searchKey: this.queryParam.searchKey,
        },
        "设备列表.xlsx"
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
        startValue.valueOf() > endValue.valueOf()
      );
    },
    disabledEndDate(endValue) {
      const startValue = this.startValue;
      if (!endValue || !startValue) {
        return false;
      }
      return (
        startValue.valueOf() >= endValue.valueOf() 
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
