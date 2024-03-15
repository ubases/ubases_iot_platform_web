<template>
  <div class="aithings-developer">
    <a-card :bordered="false">
      <!-- 筛选栏 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col v-bind="aColFlex">
              <a-form-item>
                <a-input v-model="queryParam.account" placeholder="请输入账号" :allowClear="true"  @keyup.enter.native="query"/>
              </a-form-item>
            </a-col>
            <a-col v-bind="aColFlex">
              <a-form-item>
                <a-input v-model="queryParam.companyName" placeholder="请输入公司名称" :allowClear="true"  @keyup.enter.native="query"/>
              </a-form-item>
            </a-col>
            <a-col v-bind="aColFlex">
              <a-form-item>
                <a-select v-model="queryParam.accountOrigin" placeholder="请选择账号来源" :allowClear="true" @keyup.enter.native="query">
                  <a-select-option v-for="v in $DictList('account_origin')" :value="v.key" :key="v.key">
                    {{ v.label }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col v-bind="aColFlex">
              <a-form-item>
                <a-select v-model="queryParam.status" placeholder="请选择状态">
                  <a-select-option v-for="v in $DictList('web_status')" :key="v.key" :value="v.key" :allowClear="true" @keyup.enter.native="query">
                    {{ v.label }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col v-bind="aColFlex">
              <span class="table-page-search-submitButtons">
                <a-button icon="search" type="primary" @click="query">
                  {{ $t("public.query") }}
                </a-button>
                <a-divider type="vertical" />
                <a-button icon="redo" @click="reset">
                  {{ $t("public.reset") }}
                </a-button>
                <a-divider type="vertical" />
                <a-button type="primary" icon="plus" @click="linkToPage('', 'add')">
                  {{ $t("public.add") }}
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
        <template slot="account" slot-scope="text, record">
          <div class="link-a" @click="linkToPage(record.id, 'details')">
            {{ record.account }}
          </div>
        </template>
        <template slot="accountType" slot-scope="text, record">
          {{ $DictName("account_type", record.accountType) }}
        </template>
        <template slot="accountOrigin" slot-scope="text, record">
          {{ $DictName("account_origin", record.accountOrigin) }}
        </template>
        <template slot="status" slot-scope="text, record">
          <span>{{ $DictName("web_status", record.status) }}</span>
        </template>
        <template slot="action" slot-scope="text, record">
          <a-button type="link" size="small" icon="edit" @click="linkToPage(record.id, 'edit')">
            {{ $t("public.edit") }}
          </a-button>
          <a-divider type="vertical" />
          <a-button type="link" size="small" icon="delete" @click="handleDel(record.id)">
            {{ $t("public.delete") }}
          </a-button>
        </template>
      </a-table>
    </a-card>
  </div>
</template>
<script>
import { getDeveloperList, deleteDeveloper, getDeveloperCompanyList } from "@/api/authority";
export default {
  name: "DeveloperList",
  data() {
    return {
      isInit:false,
      queryParam: {
        pageNum: 1,
        pageSize: 10,
      },
      companyList: [],
      dataSource: [],
      columns: [
        { title: "序号", width: "80px", customRender: (text, record, index) => index + 1 },
        { dataIndex: "account", title: "账号", scopedSlots: { customRender: "account" } },
        { dataIndex: "roleName", title: "角色", ellipsis: true },
        { dataIndex: "companyName", title: "所属公司", ellipsis: true },
        { dataIndex: "accountType", title: "账号类型", scopedSlots: { customRender: "accountType" } },
        { dataIndex: "accountOrigin", title: "账号来源", scopedSlots: { customRender: "accountOrigin" } },
        { dataIndex: "status", title: "状态", scopedSlots: { customRender: "status" } },
        { title: this.$t("public.action"), key: "action", align: "center", width: "220px", scopedSlots: { customRender: "action" } },
      ],
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
    onChangePagination(e) {
      this.queryParam.pageNum = e.current;
      this.queryParam.pageSize = e.pageSize;
      this.pagination.current = e.current;
      this.pagination.pageSize = e.pageSize;
      this.queryList();
    },
    queryList() {
      this.loading = true;
      getDeveloperList(this.queryParam).then((res) => {
        if (res.code === 0) {
          this.dataSource = res.data.list;
          this.pagination.total = res.data.total;
        }
        this.loading = false;
      });
    },
    reset() {
      this.queryParam = {
        pageNum: 1,
        pageSize: this.queryParam.pageSize,
      };
      this.pagination.current = 1;
      this.companyList = [];
      this.queryList();
    },
    query() {
      this.queryParam.pageNum = 1;
      this.pagination.current = 1;
      this.queryList();
    },
    linkToPage(id, type) {
      this.$routerPush({
        path: `/authority/developer/details?id=${id}&type=${type}`,
        name: "DeveloperDetails",
      });
    },
    handleDel(id) {
      this.$confirm({
        title: "确定是否删除",
        content: "删除后，将不可恢复",
        onOk: () => {
          deleteDeveloper({ id }).then((res) => {
            if (res.code === 0) {
              this.queryList();
            }
            this.toast(res);
          });
        },
      });
    },
    handleSearch(companyName) {
      getDeveloperCompanyList({ companyName }).then((res) => {
        if (res.code === 0) {
          this.companyList = res.data;
        }
      });
    },
    handleChange(value) {
      this.queryParam.companyid = value;
    },
  },
};
</script>
<style lang="less" scoped></style>
