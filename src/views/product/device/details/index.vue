<template>
  <a-card :bordered="false">
    <a-page-header title="查看设备" @back="$multiTab.closeCurrentPage()">
      <a-spin :spinning="confirmLoading">
        <a-card title="基本信息" :bordered="false">
          <a-descriptions>
            <a-descriptions-item label="设备名称">
              {{ deviceInfo.deviceName }}
            </a-descriptions-item>
            <a-descriptions-item label="设备ID">
              {{ deviceInfo.did }}
            </a-descriptions-item>
            <a-descriptions-item label="生产UUID">
              {{ deviceInfo.id }}
            </a-descriptions-item>
            <a-descriptions-item label="设备序列号">
              {{ deviceInfo.deviceSN }}
            </a-descriptions-item>
            <a-descriptions-item label="所属产品">
              {{ deviceInfo.productName }}
            </a-descriptions-item>
            <a-descriptions-item label="产品model">
              {{ deviceInfo.productKey }}
            </a-descriptions-item>
            <a-descriptions-item label="模组固件key">
              {{ deviceInfo.firmwallKey }}
            </a-descriptions-item>
            <a-descriptions-item label="模组固件版本">
              {{ deviceInfo.firmwallVersion }}
            </a-descriptions-item>
            <a-descriptions-item label="MCU固件key">
              {{ deviceInfo.mcuFirmwallKey }}
            </a-descriptions-item>
            <a-descriptions-item label="MCU固件版本">
              {{ deviceInfo.mcuFirmwallVersion }}
            </a-descriptions-item>
          </a-descriptions>
        </a-card>
        <a-card title="激活信息" :bordered="false">
          <a-descriptions>
            <a-descriptions-item label="是否激活">
              {{ activeInfo.activeStatus }}
            </a-descriptions-item>
            <a-descriptions-item label="首次激活时间">
              {{ activeInfo.activatedTime | momentFilter }}
            </a-descriptions-item>
            <a-descriptions-item label="最近激活时间">
              {{ activeInfo.lastActivatedTime | momentFilter }}
            </a-descriptions-item>
            <a-descriptions-item label="更新时间">
              {{ activeInfo.updateTime | momentFilter }}
            </a-descriptions-item>
            <a-descriptions-item label="当前在线">
              {{ activeInfo.onlineStatus }}
            </a-descriptions-item>
            <a-descriptions-item label="绑定用户">
              {{ activeInfo.activeUser }}
            </a-descriptions-item>
            <a-descriptions-item label="绑定APP">
              {{ activeInfo.activeApp }}
            </a-descriptions-item>
            <a-descriptions-item label="地理位置">
              {{ activeInfo.activeLoc }}
            </a-descriptions-item>
            <a-descriptions-item label="时区">
              {{ activeInfo.activeTimeZone }}
            </a-descriptions-item>
            <a-descriptions-item label="所属开发者">
              {{ activeInfo.belogOpenUser }}
            </a-descriptions-item>
          </a-descriptions>
        </a-card>
        <a-card title="设备当前运行状态" :bordered="false">
          <a-descriptions>
            <a-descriptions-item v-for="(v, i) in deviceStatus" :key="i" :label="v.attrKeyName">
              {{ v.attrValueName }}
            </a-descriptions-item>
          </a-descriptions>
        </a-card>
      </a-spin>
    </a-page-header>
  </a-card>
</template>
<script>
import { getDeviceInfo } from "@/api/product";
export default {
  name: "DeviceDetails",
  data() {
    return {
      two: {
        labelCol: { xs: { span: 24 }, sm: { span: 8 }},
        wrapperCol: { xs: { span: 24 }, sm: { span: 16 } },
      },
      did: "",
      deviceInfo: {},
      activeInfo: {},
      deviceStatus: [],
      confirmLoading: false,
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.did = this.$route.query.did;
      this.confirmLoading = true;
      getDeviceInfo(this.did)
        .then((res) => {
          if (res.code == 0) {
            this.deviceInfo = res.data.deviceInfo || {};
            this.activeInfo = res.data.activeInfo || {};
            this.deviceStatus = res.data.deviceStatus || [];
          }
        })
        .finally(() => {
          this.confirmLoading = false;
        });
    },
  },
};
</script>
<style lang="less" scoped></style>
