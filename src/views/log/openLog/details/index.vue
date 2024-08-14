<template>
  <a-card :bordered="false">
    <a-page-header title="查看设备" @back="$router.back()">
      <a-spin :spinning="confirmLoading">
        <h3>平台信息</h3>
        <a-form-model>
          <a-form-model-item :label-col="two.labelCol" :wrapper-col="two.wrapperCol" label="平台主账号">
            {{ deviceInfo.deviceName }}
          </a-form-model-item>
          <a-form-model-item :label-col="two.labelCol" :wrapper-col="two.wrapperCol" label="企业">
            {{ deviceInfo.did }}
          </a-form-model-item>
          <a-form-model-item :label-col="two.labelCol" :wrapper-col="two.wrapperCol" label="角色">
            {{ deviceInfo.id }}
          </a-form-model-item>
          <a-form-model-item :label-col="two.labelCol" :wrapper-col="two.wrapperCol" label="平台部署方式">
            {{ deviceInfo.id }}
          </a-form-model-item>
        </a-form-model>
        <h3>日志记录</h3>
        <!-- 筛选栏 -->
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="48">
              <a-col :md="6" :sm="24">
                <a-form-item>
                  <a-range-picker />
                </a-form-item>
              </a-col>
              <a-col :md="4" :sm="24">
                <a-form-item>
                  <a-input v-model="queryParam.did" placeholder="请输入操作人"/>
                </a-form-item>
              </a-col>
              <a-col :md="4" :sm="24">
                <a-form-item>
                  <a-select v-model="queryParam.did" placeholder="请选择所属模块">
                    <a-select-option v-for="v in $DictList('belong_type')" :key="v.key" :value="v.key">
                      {{ v.label }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="4" :sm="24">
                <a-form-item>
                  <a-select v-model="queryParam.did" placeholder="请选择日志类型">
                    <a-select-option v-for="v in $DictList('belong_type')" :key="v.key" :value="v.key">
                      {{ v.label }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="4" :sm="24">
                <span class="table-page-search-submitButtons">
                  <a-button icon="search" type="primary"> 查询 </a-button>
                  <a-button icon="redo" style="margin-left: 8px">
                    重置
                  </a-button>
                </span>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <a-table size="small" rowKey="id" :data-source="dataSourceRecord" :columns="columnsRecord" :loading="loading" :pagination="pagination" @change="onChangePagination">
        </a-table>
      </a-spin>
    </a-page-header>
  </a-card>
</template>
<script>
import { getDeviceInfo } from "@/api/product";
export default {
  name: "AppLogDetails",
  data() {
    return {
      two: {
        labelCol: { xs: { span: 24 }, sm: { span: 2 } },
        wrapperCol: { xs: { span: 24 }, sm: { span: 22 } },
      },
      did: "",
      deviceInfo: {},
      confirmLoading: false,
      dataSourceRecord: [{}],
      columnsRecord: [
        { title: "序号", width: "50px", customRender: (item, value, index) => index + 1},
        { dataIndex: "deviceName", title: "操作内容" },
        { dataIndex: "deviceName1", title: "操作人" },
        { dataIndex: "deviceName2", title: "角色" },
        { dataIndex: "deviceName3", title: "所属模块" },
        { dataIndex: "deviceName4", title: "操作类型" },
        { dataIndex: "deviceName5", title: "日志类型" },
        { dataIndex: "deviceName6", title: "操作时间" },
        { dataIndex: "deviceName7", title: "访问IP" },
        { dataIndex: "deviceName8", title: "客户端" },
      ],
      queryParam: {},
      loading: false,
      pagination: {
        showSizeChanger: true,
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: (total, range) =>
          `总数:${total} 当前:${range[0]}-${range[1]}`,
      },
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
          }
        })
        .finally(() => {
          this.confirmLoading = false;
        });
    },
    queryList() {},
    onChangePagination(e) {
      this.queryParam.page = e.current;
      this.queryParam.limit = e.pageSize;
      this.pagination.current = e.current;
      this.pagination.pageSize = e.pageSize;
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
