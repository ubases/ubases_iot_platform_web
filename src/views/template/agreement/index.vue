<template>
  <a-card :bordered="false">
    <!-- 搜索 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="20">
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-input
                v-model="queryParam.query.tplName"
                placeholder="请输入标题"
                :allowClear="true" 
                @keyup.enter.native="query"
              />
            </a-form-item>
          </a-col>
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-select
                v-model="queryParam.query.lang"
                placeholder="请选择语种"
                :allowClear="true" 
                @keyup.enter.native="query"
              >
                <a-select-option
                  :value="v.code"
                  v-for="v in langTypeList"
                  :key="v.code"
                >
                  {{ v.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-select
                v-model="queryParam.query.status"
                placeholder="请选择状态"
                :allowClear="true" 
                @keyup.enter.native="query"
              >
                <a-select-option
                  v-for="v in $DictList('web_status')"
                  :key="v.key"
                  :value="v.key"
                >
                  {{ v.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col v-bind="aColFlex">
            <span class="table-page-search-submitButtons">
              <a-button icon="search" type="primary" @click="query">
                {{ $t("public.search") }}
              </a-button>
              <a-divider type="vertical" />
              <a-button icon="redo" @click="reset"> 重置 </a-button>
              <a-divider type="vertical" />
              <a-button type="primary" icon="plus" @click="handleAdd()">
                {{ $t("public.add") }}
              </a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-operator">
      <a-alert
        message="提示：您可以创建用户政策，隐私协议，关于我们这三个页面。如果需要增加其他页面，请注意检查APP端是否预留了展示入口"
        type="warning"
        banner
        closable
      />
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
      <template slot="status" slot-scope="text, item">
        <span>{{ $DictName("web_status", item.status) }}</span>
      </template>
      <template slot="lang" slot-scope="text, item">
        <span>
          {{
            langTypeList.find((v) => item.lang === v.code)
              ? langTypeList.find((v) => item.lang === v.code).name
              : ""
          }}
        </span>
      </template>
      <template slot="action" slot-scope="text, item">
        <a-button
          type="link"
          size="small"
          icon="edit"
          @click="handleEdit(item.id)"
        >
          {{ $t("public.edit") }}
        </a-button>
        <a-divider type="vertical" v-if="item.status === 2" />
        <a-button
          type="link"
          size="small"
          icon="setting"
          v-if="item.status === 2"
          @click="setStatus(item.id, 1)"
        >
          启用
        </a-button>
        <a-divider type="vertical" v-if="item.status === 1" />
        <a-button
          type="link"
          size="small"
          icon="setting"
          v-if="item.status === 1"
          @click="setStatus(item.id, 2)"
        >
          停用
        </a-button>
        <a-divider type="vertical" />
        <a-button
          type="link"
          size="small"
          icon="delete"
          @click="handleDel(item.id)"
        >
          删除
        </a-button>
      </template>
    </a-table>
    <form-modal ref="formModal" @ok="queryList"></form-modal>
  </a-card>
</template>
<script>
import FormModal from "./components/FormModal.vue";
import {
  getAgreementList,
  deleteAgreement,
  setAgreementStatus,
} from "@/api/template";
import { mapGetters } from "vuex";
const pageSize = 10;
export default {
  name: "Agreement",
  components: {
    "form-modal": FormModal,
  },
  data() {
    return {
      isInit:false,
      queryParam: {
        page: 1,
        limit: pageSize,
        query: {},
      },
      loading: false,
      dataSource: [],
      columns: [
        {
          title: "序号",
          width: "80px",
          customRender: (text, record, index) => index + 1,
        },
        {
          dataIndex: "tplName",
          title: "标题",
          ellipsis: true,
        },
        {
          dataIndex: "tplType",
          title: "协议类型",
          customRender: (text, record, index) =>
            this.$DictName("tpl_document_type", record.tplType),
        },
        {
          dataIndex: "lang",
          title: "语种",
          scopedSlots: { customRender: "lang" },
        },
        {
          dataIndex: "status",
          title: "状态",
          scopedSlots: { customRender: "status" },
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          width: "290px",
          scopedSlots: { customRender: "action" },
        },
      ],
      pagination: {
        showSizeChanger: true,
        current: 1,
        pageSize,
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
  computed: {
    ...mapGetters(["langTypeList"]),
  },
  methods: {
    onChangePagination(e) {
      this.queryParam.page = e.current;
      this.queryParam.limit = e.pageSize;
      this.pagination.current = e.current;
      this.pagination.pageSize = e.pageSize;
      this.queryList();
    },
    handleAdd() {
      this.$refs["formModal"].init("add");
    },
    handleDel(id) {
      this.$confirm({
        title: "确定是否删除",
        content: "删除后，将不可恢复",
        onOk: async () => {
          let res = await deleteAgreement({ id });
          if (res.code === 0) {
            this.queryList();
          }
          this.toast(res);
        },
      });
    },
    handleEdit(id) {
      this.$refs["formModal"].init("edit", id);
    },
    setStatus(id, status) {
      this.$confirm({
        content: status === 1 ? "确定是否启用" : "确定是否停用",
        onOk: async () => {
          let res = await setAgreementStatus({ id, status });
          if (res.code === 0) {
            this.queryList();
          }
          this.toast(res);
        },
      });
    },
    queryList() {
      this.loading = true;
      getAgreementList(this.queryParam).then((res) => {
        if (res.code === 0) {
          this.dataSource = res.data.list;
          this.pagination.total = res.data.total;
        }
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
        query: {},
      };
      this.pagination.current = 1;
      this.queryList();
    },
  },
};
</script>
<style lang="less" scoped></style>
