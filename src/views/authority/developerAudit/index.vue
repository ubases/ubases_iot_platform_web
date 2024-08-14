<template>
  <div class="aithings-developer-audit">
    <a-card :bordered="false">
      <!-- 筛选栏 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="16">
            <a-col v-bind="aColFlex">
              <a-form-item>
                <a-input v-model="queryParam.companyName" placeholder="请输入企业名称" :allowClear="true"  @keyup.enter.native="query"/>
              </a-form-item>
            </a-col>
            <a-col v-bind="aColFlex">
              <a-form-item>
                <a-select v-model="queryParam.status" placeholder="请选择认证状态" :allowClear="true" @keyup.enter.native="query">
                  <a-select-option :value="v.key" v-for="v in $DictList('auth_status')" :key="v.key">
                    {{ v.label }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col v-bind="aColFlex">
              <span class="table-page-search-submitButtons">
                <a-button icon="search" type="primary" @click="query">
                  搜索
                </a-button>
                <a-divider type="vertical" />
                <a-button icon="redo" @click="reset">重置</a-button>
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
        <template slot="companyName" slot-scope="text, item">
          <div class="link-a" @click="linkToPage(item.id)">
            {{ item.companyName }}
          </div>
        </template>
        <template slot="status" slot-scope="text, item">
          {{ $DictName("auth_status", item.status) }}
        </template>
        <template slot="requestDateTime" slot-scope="text, record">
          <span v-if="record.requestDateTime">
            {{ record.requestDateTime | momentFilter }}
          </span>
        </template>
        <template v-slot:action="item">
          <a-button type="link" size="small" v-if="item.status === 3" @click="revocationApply(item.id)" >
            撤销
          </a-button>
          <div v-else>无</div>
        </template>
      </a-table>
      <form-modal ref="formModal" @ok="queryList"></form-modal>
    </a-card>
  </div>
</template>
<script>
import { getCompanyAuthList } from "@/api/authority";
import FormModal from "./components/FormModal.vue";
// 1 未提交申请 2 认证中 3 已认证 4 不通过
// 1 通过 2 不通过 3 撤销
export default {
  name: "DeveloperAuditList",
  components: {
    "form-modal": FormModal,
  },
  data() {
    return {
      isInit:false,
      queryParam: {
        page: 1,
        limit: 10,
      },
      // 表格
      columns: [
        { dataIndex: "key", title: "序号", width: "50px", customRender: (item, value, index) => index + 1 },
        { dataIndex: "companyName", title: "企业名称", ellipsis: true, scopedSlots: { customRender: "companyName" } },
        { dataIndex: "userName", title: "账号" },
        { dataIndex: "status", title: "认证状态", scopedSlots: { customRender: "status" } },
        { dataIndex: "requestDateTime", title: "申请时间", scopedSlots: { customRender: "requestDateTime" } },
        { title: "操作", key: "action", align: "center", width: "120px", scopedSlots: { customRender: "action" } },
      ],
      dataSource: [],
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
    this.isInit = true
    this.queryList();
  },
  activated () {
    if(this.isInit){
      this.isInit = false
    }else{
    this.queryList()
    }
  },
  methods: {
    query() {
      this.queryParam.page = 1;
      this.pagination.current = 1;
      this.queryList();
    },
    reset() {
      this.queryParam = {
        page: 1,
        limit: this.queryParam.limit,
      };
      this.pagination.current = 1;
      this.queryList();
    },
    queryList() {
      this.loading = true;
      getCompanyAuthList(this.queryParam).then((res) => {
        if (res.code === 0) {
          this.dataSource = res.data.list;
          this.pagination.total = res.data.total;
        }
        this.loading = false;
      });
    },
    onChangePagination(e) {
      this.queryParam.limit = e.pageSize;
      this.queryParam.page = e.current;
      this.pagination.current = e.current;
      this.pagination.pageSize = e.pageSize;
      this.queryList();
    },
    revocationApply(id) {
      this.$refs["formModal"].init(id, 3, "撤销申请");
    },
    linkToPage(id) {
      this.$routerPush({
        path: `/authority/developer-audit/details?id=${id}`,
        name: "DeveloperAuditDetails",
      });
    },
  },
};
</script>
<style lang="less" scoped></style>
