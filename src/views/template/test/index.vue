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
                placeholder="请输入用例名称"
                :allowClear="true" 
                @keyup.enter.native="query"
              />
            </a-form-item>
          </a-col>
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-tree-select
                v-model="queryParam.query.productTypeId"
                placeholder="请选择产品分类"
                :replaceFields="{
                  children: 'children',
                  title: 'name',
                  key: 'id',
                  value: 'id',
                }"
                :tree-data="productTypeList"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                style="width: 100%"
                tree-default-expand-all
                :allowClear="true" 
                @keyup.enter.native="query"
              >
              </a-tree-select>
            </a-form-item>
          </a-col>
          <a-col v-bind="aColFlex">
            <span class="table-page-search-submitButtons">
              <a-button icon="search" type="primary" @click="query">
                {{ $t("public.search") }}
              </a-button>
              <a-divider type="vertical" />
              <a-button icon="redo" @click="reset">
                {{ $t("public.reset") }}
              </a-button>
              <a-divider type="vertical" />
              <a-button type="primary" icon="plus" @click="handleAdd()">
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
      <template slot="status" slot-scope="text, item">
        <span v-if="item.status === 1">已发布</span>
        <span v-if="item.status === 2">未发布</span>
      </template>
      <template slot="action" slot-scope="text, item">
        <a-button
          type="link"
          size="small"
          icon="download"
          v-if="item.status === 1"
          @click="$DownloadFile(item.tplFile, item.tplFileName)"
        >
          下载
        </a-button>
        <a-button
          type="link"
          size="small"
          icon="upload"
          v-if="item.status === 2"
          @click="setTestStatus(item.id, 1)"
        >
          发布
        </a-button>
        <a-divider type="vertical" v-if="item.status === 2" />
        <a-button
          type="link"
          size="small"
          icon="edit"
          v-if="item.status === 2"
          @click="handleEdit(item.id)"
        >
          {{ $t("public.edit") }}
        </a-button>
      </template>
    </a-table>
    <form-modal
      ref="formModal"
      :productTypeList="productTypeList"
      @ok="queryList"
    ></form-modal>
  </a-card>
</template>
<script>
import FormModal from "./components/FormModal.vue";
import { getTestList, setTestStatus } from "@/api/template";
import { getClassificationList } from "@/api/product";
const pageSize = 10;
export default {
  name: "Test",
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
      dataSource: [],
      columns: [
        {
          title: "序号",
          width: "50px",
          customRender: (text, record, index) => index + 1,
        },
        {
          dataIndex: "tplName",
          title: "用例名称",
          ellipsis: true,
        },
        {
          dataIndex: "productTypeName",
          title: "产品分类",
          ellipsis: true,
        },
        {
          dataIndex: "version",
          title: "版本号",
          ellipsis: true,
        },
        {
          dataIndex: "status",
          title: "发布状态",
          scopedSlots: { customRender: "status" },
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          width: "220px",
          scopedSlots: { customRender: "action" },
        },
      ],
      loading: false,
      pagination: {
        showSizeChanger: true,
        current: 1,
        pageSize,
        total: 0,
        showTotal: (total, range) =>
          `总数:${total} 当前:${range[0]}-${range[1]}`,
      },
      productTypeList: [],
    };
  },
  created() {
    this.isInit = true
    this.queryList();
    this.init();
  },
  activated () {
    if(this.isInit){
      this.isInit = false
    }else{
    this.queryList()
    }
  },
  methods: {
    init() {
      getClassificationList({}).then((res) => {
        if (res.code === 0) {
          this.productTypeList = res.data.list;
        }
      });
    },
    onChangePagination(e) {
      this.queryParam.page = e.current;
      this.queryParam.limit = e.pageSize;
      this.pagination.current = e.current;
      this.pagination.pageSize = e.pageSize;
      this.queryList();
    },
    queryList() {
      this.loadin = true;
      getTestList(this.queryParam).then((res) => {
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
    setTestStatus(id, status) {
      this.$confirm({
        content: "是否发布该版本测试用例？",
        onOk: () => {
          setTestStatus({ id, status }).then((res) => {
            if (res.code === 0) {
              this.queryList();
            }
            this.toast(res);
          });
        },
      });
    },
    handleAdd() {
      this.$refs["formModal"].init("add");
    },
    handleEdit(id) {
      this.$refs["formModal"].init("edit", id);
    },
  },
};
</script>
<style lang="less" scoped></style>
