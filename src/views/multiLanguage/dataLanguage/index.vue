<template>
  <a-card :bordered="false">
    <!-- 筛选栏 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-select v-model="queryParam.sourceTable" placeholder="请输入所属业务模块" :allowClear="true"  @keyup.enter.native="query">
                <a-select-option v-for="v in $DictList('lang_source_table')" :value="v.key" :key="v.key">
                  {{ v.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-input v-model="queryParam.sourceRowId" placeholder="请输入语言key值" :allowClear="true" @keyup.enter.native="query"/>
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
    <!-- 表格 -->
    <a-table size="small" rowKey="langKey" :data-source="dataSource" :columns="columns" :loading="loading" :pagination="pagination" @change="onChangePagination">
      <template slot="action" slot-scope="text, record">
        <a-button type="link" size="small" icon="setting" @click="$refs['formModal'].init( record.sourceRowId, record.sourceTable, record.fieldName)">
          修改文案
        </a-button>
      </template>
    </a-table>
    <form-modal ref="formModal" @ok="queryList"></form-modal>
  </a-card>
</template>
<script>
import { getDataLangList } from "@/api/lang";
import FormModal from "./components/FormModal.vue";
export default {
  name:'DataLanguage',
  components: {
    "form-modal": FormModal,
  },
  data() {
    return {
      isInit:false,
      queryParam: {
        page: 1,
        limit: 10,
        platformType: 1,
      },
      pagination: {
        showSizeChanger: true,
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: (total, range) =>
          `总数:${total} 当前:${range[0]}-${range[1]}`,
      },
      columns: [
        { dataIndex: "sourceRowId", title: "语言key值", scopedSlots: { customRender: "sourceRowId" }},
        { dataIndex: "name", title: "简体中文", scopedSlots: { customRender: "name" } },
        { dataIndex: "nameEn", title: "英文", scopedSlots: { customRender: "nameEn" } },
        { title: "操作", key: "action", align: "center", width: "80px", scopedSlots: { customRender: "action" }},
      ],
      dataSource: [],
      loading: false,
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
        platformType: 1,
      };
      this.pagination.current = 1;
      this.queryList();
    },
    queryList() {
      this.loading = true;
      getDataLangList(this.queryParam)
        .then((res) => {
          if (res.code === 0) {
            this.dataSource = res.data.list;
            this.pagination.total = res.data.total;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
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
<style lang="less" scoped></style>
