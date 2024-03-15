<template>
  <a-card :bordered="false">
    <a-page-header title="查看APP信息" @back="$multiTab.closeCurrentPage()">
      <a-spin :spinning="confirmLoading">
        <a-card title="APP信息" :bordered="false">
          <a-descriptions>
            <a-descriptions-item label="APP名称">
              {{ appInfo.appName }}
            </a-descriptions-item>
            <a-descriptions-item label="所属开发者">
              {{ appInfo.account }}
            </a-descriptions-item>
            <a-descriptions-item label="APP类型">
              {{ appInfo.appType }}
            </a-descriptions-item>
          </a-descriptions>
        </a-card>
        <a-card title="用户信息" :bordered="false">
          <a-descriptions>
            <a-descriptions-item label="注册用户">
              {{ appInfo.registerUserTotal }}
            </a-descriptions-item>
            <a-descriptions-item label="近七天活跃用户">
              {{ appInfo.acitveUserTotal }}
            </a-descriptions-item>
          </a-descriptions>
        </a-card>
        <a-card title="版本记录" :bordered="false">
          <a-table
            size="small"
            rowKey="id"
            :data-source="dataSourceApp"
            :columns="columnsApp"
            :pagination="false"
          >
            <template slot="devStatus" slot-scope="text, item">
              {{ $DictName("oem_app_status", item.devStatus) }}
            </template>
            <template slot="lastOptTime" slot-scope="text, item">
              {{ item.lastOptTime | momentFilter }}
            </template>
          </a-table>
        </a-card>
      </a-spin>
    </a-page-header>
  </a-card>
</template>
<script>
import { getAppDetails } from "@/api/data";
export default {
  name: "AppDataDetails",
  data() {
    return {
      two: {
        labelCol: { xs: { span: 24 }, sm: { span: 4 } },
        wrapperCol: { xs: { span: 24 }, sm: { span: 20 } },
      },
      id: "",
      appInfo: {},
      confirmLoading: false,
      dataSourceApp: [],
      columnsApp: [
        { dataIndex: "appVersion", title: "版本号" },
        { dataIndex: "devStatus", title: "开发状态", scopedSlots: { customRender: "devStatus" } },
        { dataIndex: "buildNumber", title: "构建次数" },
        { dataIndex: "lastOptTime", title: "最新操作时间", scopedSlots: { customRender: "lastOptTime" } },
        { dataIndex: "lastOptUser", title: "操作人" },
      ],
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.id = this.$route.query.id;
      this.confirmLoading = true;
      getAppDetails({ appId: this.id })
        .then((res) => {
          if (res.code == 0) {
            this.appInfo = res.data || {};
            this.dataSourceApp = res.data.versionList || [];
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
