<template>
  <a-card :bordered="false">
    <!-- 筛选栏 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-input
                v-model="queryParam.name"
                placeholder="请输入产品类型名称"
                :allowClear="true" 
                @keyup.enter.native="query"
              />
            </a-form-item>
          </a-col>
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-tree-select
                v-model="queryParam.productTypeId"
                :replaceFields="replaceFields"
                :tree-data="treeData"
                :dropdown-style="{ maxHeight: '300px', overflow: 'auto' }"
                style="width: 100%"
                placeholder="请选择产品分类"
                tree-default-expand-all
                :allowClear="true" 
                @keyup.enter.native="query"
              ></a-tree-select>
            </a-form-item>
          </a-col>
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-select
                v-model="queryParam.networkType"
                placeholder="请选择通讯协议"
                default-value=""
                :allowClear="true" 
                @keyup.enter.native="query"
              >
                <a-select-option
                  v-for="v in $DictList('network_type')"
                  :key="v.key"
                  :value="v.key"
                >
                  {{ v.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-select
                v-model="queryParam.attributeType"
                placeholder="请选择设备性质"
                :allowClear="true" 
                @keyup.enter.native="query"
              >
                <a-select-option
                  v-for="v in $DictList('device_nature')"
                  :key="v.key"
                  :value="v.key"
                >
                  {{ v.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-select
                v-model="queryParam.status"
                placeholder="请选择产品状态"
                :allowClear="true" 
                @keyup.enter.native="query"
              >
                <a-select-option
                  v-for="v in $DictList('product_release')"
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
                查询
              </a-button>
              <a-divider type="vertical" />
              <a-button icon="redo" @click="reset"> 重置 </a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 表格操作栏 -->
    <div class="table-operator">
      <a-space align="baseline">
        <a-button type="primary" icon="plus" @click="linkToPage('add')">
          {{ $t("public.add") }}
        </a-button>
        <a-alert
          message="提示：产品类型启用后禁止编辑"
          type="warning"
          banner
        />
      </a-space>
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
      <template slot="imageUrl" slot-scope="text, item">
        <a-image :src="item.imageUrl" />
      </template>
      <template slot="attributeType" slot-scope="text, item">
        {{ $DictName("device_nature", item.attributeType) }}
      </template>
      <template slot="networkType" slot-scope="text, item">
        {{ $DictName("network_type", item.networkType) }}
      </template>
      <template slot="status" slot-scope="text, item">
        {{ $DictName("product_release", item.status) }}
      </template>
      <template slot="action" slot-scope="text, item">
        <!-- 已发布产品禁止编辑 -->
        <a-button
          type="link"
          size="small"
          icon="edit"
          :disabled="item.status == 1"
          @click="linkToPage('edit', item.id)"
        >
          {{ $t("public.edit") }}
        </a-button>
        <a-divider type="vertical" v-if="item.status == 1" />
        <a-button
          type="link"
          size="small"
          icon="setting"
          v-if="item.status == 1"
          @click="setProductStatus(item)"
        >
          停用
        </a-button>
        <a-divider
          type="vertical"
          v-if="item.status == 0 || item.status == 2"
        />
        <a-button
          type="link"
          size="small"
          icon="setting"
          v-if="item.status == 0 || item.status == 2"
          @click="setProductStatus(item)"
        >
          发布
        </a-button>
      </template>
    </a-table>
    <set-status-modal ref="setStatusModal" @ok="queryList"></set-status-modal>
  </a-card>
</template>
<script>
import {
  getProductList,
  deleteProduct,
  getClassificationList,
} from "@/api/product";
import SetStatusModal from "./components/SetStatusModal.vue";
export default {
  name: "ProductList",
  components: {
    "set-status-modal": SetStatusModal,
  },
  data() {
    return {
      isInit:false,
      pagination: {
        showSizeChanger: true,
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: (total, range) =>
          `总数:${total} 当前:${range[0]}-${range[1]}`,
      },
      // 查询参数
      queryParam: {
        page: 1,
        limit: 10,
      },
      columns: [
        {
          title: "序号",
          width: "64px",
          customRender: (item, value, index) => index + 1,
        },
        {
          dataIndex: "name",
          title: "产品类型名称",
          scopedSlots: { customRender: "name" },
        },
        {
          dataIndex: "imageUrl",
          title: "图片",
          scopedSlots: { customRender: "imageUrl" },
        },
        {
          dataIndex: "productKey",
          title: "产品Key",
        },
        {
          dataIndex: "productTypeName",
          title: "产品分类",
        },
        {
          dataIndex: "networkType",
          title: "通讯协议",
          scopedSlots: { customRender: "networkType" },
        },
        {
          dataIndex: "attributeType",
          title: "设备性质",
          scopedSlots: { customRender: "attributeType" },
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
          width: "170px",
          scopedSlots: { customRender: "action" },
        },
      ],
      dataSource: [],
      loading: false,
      // 分类菜单选择相关
      treeData: [],
      replaceFields: {
        children: "children",
        title: "name",
        key: "id",
        value: "id",
      },
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
        if (res.code == 0) {
          this.treeData = res.data.list;
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
    reset() {
      this.queryParam = {
        page: 1,
        limit: this.queryParam.limit,
      };
      this.pagination.current = 1;
      this.queryList();
    },
    query() {
      this.queryParam.page = 1;
      this.pagination.current = 1;
      this.queryList();
    },
    queryList() {
      this.loading = true;
      getProductList({ attributeType: -1, status: -1, ...this.queryParam })
        .then((res) => {
          if (res.code == 0) {
            this.dataSource = res.data.list || [];
            this.pagination.total = res.data.total || 0;
          } else {
            this.dataSource = [];
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    linkToPage(type, id = "") {
      this.$routerPush({
        path: `/product/product/details/index?type=${type}&id=${id}`,
        name: "ProductDetails",
      });
    },
    handleDelete(id) {
      this.$Delete(this, "").then((res) => {
        deleteProduct({ id }).then((res) => {
          this.toast(res);
          this.queryList();
        });
      });
    },
    setProductStatus(item) {
      let msg = "";
      let status = null;
      if (item.status == 0 || item.status == 2) {
        status = 1;
        msg = "确认发布吗?";
      } else {
        status = 2;
        msg = "确认停用吗?";
      }
      this.$refs["setStatusModal"].init(msg, item, status);
    },
  },
};
</script>
<style lang="less" scoped></style>
