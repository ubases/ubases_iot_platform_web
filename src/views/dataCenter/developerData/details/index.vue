<template>
  <a-card :bordered="false">
    <a-page-header title="开发者数据" @back="$multiTab.closeCurrentPage()">
      <a-spin :spinning="confirmLoading">
        <a-card title="账号信息" :bordered="false">
          <a-descriptions>
            <a-descriptions-item label="平台主账号">
              {{ developerInfo.account }}
            </a-descriptions-item>
            <a-descriptions-item label="企业">
              {{ developerInfo.companyName }}
            </a-descriptions-item>
            <a-descriptions-item label="角色">
              {{ developerInfo.roleName }}
            </a-descriptions-item>
          </a-descriptions>
        </a-card>
        <a-card :title="`已激活设备数量：累计${developerInfo.activeDeviceTotal}个`" :bordered="false">
          <a-button type="primary" @click="linkToPage">
            查看设备详细，请跳转到“设备数据”
          </a-button>
        </a-card>
        <a-card :title="`已开发APP：${developerInfo.appList.length}个`" :bordered="false">
          <a-table size="small" rowKey="appId" :data-source="developerInfo.appList" :columns="columnsApp" :pagination="false">
            <template slot="devStatus" slot-scope="text, item">
              {{ $DictName("oem_app_status", item.devStatus) }}
            </template>
          </a-table>
        </a-card>
      </a-spin>
    </a-page-header>
  </a-card>
</template>
<script>
import { getDeveloperDetails } from "@/api/data";
export default {
  name: "DeveloperDataDetails",
  data() {
    return {
      two: {
        labelCol: { xs: { span: 24 }, sm: { span: 4 }},
        wrapperCol: { xs: { span: 24 }, sm: { span: 20 }},
      },
      id: "",
      developerInfo: { appList: [] },
      confirmLoading: false,
      columnsApp: [
        { dataIndex: "appName", title: "APP名称" },
        { dataIndex: "devStatus", title: "开发状态", scopedSlots: { customRender: "devStatus" } },
        { dataIndex: "version", title: "最新版本号" },
        { dataIndex: "verTotal", title: "历史迭代版本" },
      ],
    };
  },
  created() {
    this.init();
  },
  methods: {
    linkToPage() {
      this.$routerPush({
        path: `/product/device/index?account=${this.developerInfo.account}`,
        name: "Device",
      });
    },
    init() {
      this.id = this.$route.query.id;
      this.confirmLoading = true;
      getDeveloperDetails({ userId: this.id })
        .then((res) => {
          if (res.code === 0) {
            this.developerInfo = res.data;
          }
        })
        .finally(() => {
          this.confirmLoading = false;
        });
    },
  },
};
</script>
<style lang="less" scoped>
h3 {
  padding: 30px 0 10px;
}
</style>
