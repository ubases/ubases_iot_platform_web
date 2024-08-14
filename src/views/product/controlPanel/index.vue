<template>
  <div class="aithings-control-panel">
    <a-card :bordered="false">
      <!-- 筛选栏 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col v-bind="aColFlex">
              <a-form-item>
                <a-input v-model="queryParam.query.name" placeholder="请输入面板名称" :allowClear="true"  @keyup.enter.native="query"/>
              </a-form-item>
            </a-col>
            <a-col v-bind="aColFlex">
              <a-form-item>
                <a-select v-model="queryParam.query.productId" placeholder="请选择产品类型" :allowClear="true" @keyup.enter.native="query">
                  <a-select-option v-for="v in productList" :key="v.id" :value="v.id">
                    {{ v.name }}
                  </a-select-option>
                </a-select>
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
                  查询
                </a-button>
                <a-divider type="vertical" />
                <a-button icon="redo" @click="reset"> 重置 </a-button>
                <a-divider type="vertical" />
                <a-button type="primary" icon="plus" @click="linkToPage('add')">
                  添加
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
        <template slot="name" slot-scope="text, item">
          <div class="link-a" @click="linkToPage('details', item.id)">
            {{ item.name }}
          </div>
        </template>
        <template slot="previewUrl" slot-scope="text, item">
          <a-image :src="item.previewUrl" />
        </template>
        <template v-slot:action="item">
          <a-button type="link" size="small" icon="edit" @click="linkToPage('edit', item.id)">
            {{ $t("public.edit") }}
          </a-button>
          <a-divider type="vertical" v-if="item.status === 2" />
          <a-button v-if="item.status === 2" type="link" size="small" icon="setting" @click="setStatus(item.id, 1)">
            启用
          </a-button>
          <a-divider type="vertical" v-if="item.status === 1" />
          <a-button v-if="item.status === 1" type="link" size="small" icon="setting" @click="setStatus(item.id, 2)">
            停用
          </a-button>
          <a-divider type="vertical" />
          <a-button type="link" size="small" icon="delete" @click="handleDelete(item.id)">
            {{ $t("public.delete") }}
          </a-button>
        </template>
      </a-table>
    </a-card>
  </div>
</template>
<script>
import { getControlPanelList, deleteControlPanel, getClassificationList, getProductList, setControlPanelStatus} from "@/api/product";
const pageSize = 10;
export default {
  name: "ControlPanel",
  data() {
    return {
      isInit:false,
      pagination: {
        showSizeChanger: true,
        current: 1,
        pageSize,
        total: 0,
        showTotal: (total, range) =>
          `总数:${total} 当前:${range[0]}-${range[1]}`,
      },
      // 查询参数
      queryParam: {
        page: 1,
        limit: pageSize,
        query: {},
      },
      columns: [
        { title: "序号", width: "50px", customRender: (item, value, index) => index + 1},
        { dataIndex: "name", title: "面板名称", scopedSlots: { customRender: "name" }},
        { dataIndex: "previewUrl", title: "预览图", scopedSlots: { customRender: "previewUrl" }},
        { dataIndex: "productName", title: "产品类型名称", ellipsis: true },
        { dataIndex: "productTypeName", title: "产品分类", ellipsis: true },
        { dataIndex: "code", title: "面板编码", ellipsis: true },
        { title: "操作", key: "action", align: "center", width: "290px", scopedSlots: { customRender: "action" }},
      ],
      loading: false,
      dataSource: [],
      productTypeList: [],
      productList: [],
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
    onChangePagination(e) {
      this.queryParam.limit = e.pageSize;
      this.queryParam.page = e.current;
      this.pagination.current = e.current;
      this.pagination.pageSize = e.pageSize;
      this.queryList();
    },
    init() {
      getClassificationList({}).then((res) => {
        if (res.code == 0) {
          this.productTypeList = res.data.list;
        }
      });
      getProductList({}).then((res) => {
        if (res.code == 0) {
          this.productList = res.data.list || [];
        }
      });
    },
    queryList() {
      this.loading = true;
      getControlPanelList(this.queryParam)
        .then((res) => {
          if (res.code === 0) {
            this.dataSource = res.data.list || [];
            this.pagination.total = res.data.total;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    linkToPage(type, id = "") {
      this.$routerPush({
        path: `/product/control-panel/details?type=${type}&id=${id}`,
        name: "ControlPanelDetails",
      });
    },
    handleDelete(id) {
      this.$confirm({
        title: "确定是否删除",
        content: "删除后，将不可恢复",
        onOk: () => {
          deleteControlPanel(id).then((res) => {
            if (res.code === 0) {
              this.queryList();
            } else {
              // this.deleteError(res.msg);
            }
          });
        },
      });
    },
    deleteError(content) {
      this.$error({
        title: "删除提醒",
        content,
      });
    },
    setStatus(id, status) {
      let content;
      if (status === 1) {
        content = "是否启用此控制面板";
      } else if (status === 2) {
        content = "是否禁用此控制面板";
      }
      this.$confirm({
        content,
        onOk: () => {
          setControlPanelStatus({ id, status }).then((res) => {
            this.toast(res);
            if (res.code === 0) {
              this.queryList();
            }
          });
        },
      });
    },
  },
};
</script>
<style lang="less" scoped></style>
