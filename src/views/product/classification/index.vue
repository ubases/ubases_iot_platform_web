<template>
  <a-card :bordered="false">
    <!-- 筛选栏 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-input v-model="queryParam.searchKey" style="width: 100%" :placeholder="$t('productAdm.class.inputNameId')" :allowClear="true"  @keyup.enter.native="query"/>
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
              <a-button type="primary" icon="plus" @click="linkToPage('add', '')">
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
      <template slot="name" slot-scope="text, item">
        <span class="link-a" @click="linkToPage('details', item.id)">
          {{ item.name }}
        </span>
      </template>
      <template slot="imgFullPath" slot-scope="text, item">
        <a-image :src="item.imgFullPath" />
      </template>
      <template v-slot:action="item">
        <a-button type="link" size="small" icon="edit" @click="linkToPage('edit', item.id)">
          {{ $t("public.edit") }}
        </a-button>
        <a-divider v-if="item.parentId" type="vertical" />
        <a-button v-if="item.parentId" :disabled="item.count>0" type="link" size="small" icon="delete" @click="handleDel(item.id)">
          {{ $t("public.delete") }}
        </a-button>
      </template>
    </a-table>
  </a-card>
</template>
<script>
import { getClassificationList, deleteClassification } from "@/api/product";
export default {
  name: "ClassificationList",
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
        searchKey: "",
      },
      columns: [
        { dataIndex: "name", title: this.$t("productAdm.class.nameZh"), scopedSlots: { customRender: "name" } },
        { dataIndex: "nameEn", title: "名称(英文)", ellipsis: true },
        { dataIndex: "imgFullPath", title: "图片", scopedSlots: { customRender: "imgFullPath" } },
        { title:"关联产品类型数量", dataIndex: "count" },
        { dataIndex: "id", title: "分类ID" },
        { title: this.$t("public.action"), key: "action", align: "center", width: "180px", scopedSlots: { customRender: "action" } },
      ],
      loading: false,
      dataSource: [],
    };
  },
  computed: {},
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
  mounted() {},
  methods: {
    onChangePagination(e) {
      this.queryParam.page = e.current;
      this.queryParam.limit = e.pageSize;
      this.pagination.current = e.current;
      this.pagination.pageSize = e.pageSize;
      this.queryList();
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
      };
      this.pagination.current = 1;
      this.queryList();
    },
    queryList() {
      this.loading = true;
      getClassificationList(this.queryParam)
        .then((res) => {
          if (res.code == 0) {
            this.dataSource = res.data.list;
            this.childrenNull(this.dataSource);
            this.pagination.total = res.data.total;
            console.log(this.dataSource)
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    childrenNull(arr) {
      arr.forEach((v) => {
        if (v.children && v.children.length > 0) {
          this.childrenNull(v.children);
        } else {
          v.children = null;
        }
      });
    },
    linkToPage(type, id) {
      this.$routerPush({
        path: `/product/classification/details?type=${type}&id=${id}`,
        name: "ClassificationDetails",
      });
    },
    handleDel(id) {
      this.$Delete(this, "").then((res) => {
        deleteClassification({ id }).then((res) => {
          this.toast(res);
          if (res.code === 0) {
            this.queryList();
          }
        });
      });
    },
  },
};
</script>
<style lang="less" scoped>
// 修改展开图标样式
/deep/ .ant-table-row-collapsed::after {
  content: "+";
  height: 15px;
  line-height: 15px;
}
</style>
