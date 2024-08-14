<template>
  <a-card :bordered="false">
    <!-- 搜索 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="20">
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-select v-model="queryParam.query.type" placeholder="请选择模板类型" :options="$DictList('app_template_type')" :allowClear="true"  @keyup.enter.native="query"/>
            </a-form-item>
          </a-col>
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-select v-model="queryParam.query.version" placeholder="请选择模板版本号" :options="versionOptions" :allowClear="true"  @keyup.enter.native="query"/>
            </a-form-item>
          </a-col>
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-select v-model="queryParam.query.openRangeType" placeholder="请选择开放范围" :options="$DictList('app_template_open_range')" :allowClear="true"  @keyup.enter.native="query"/>
            </a-form-item>
          </a-col>
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-select v-model="queryParam.query.status" placeholder="请选择状态" :options="$DictList('app_template_status')" :allowClear="true"  @keyup.enter.native="query" />
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
                添加
              </a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 表格 -->
    <a-table size="small" rowKey="id" :data-source="dataSource" :columns="columns" :loading="loading" :pagination="pagination" @change="onChangePagination">
      <template slot="type" slot-scope="text, item">
        {{ $DictName("app_template_type", item.type) }}
      </template>
      <template slot="openRangeType" slot-scope="text, item">
        {{ $DictName("app_template_open_range", item.openRangeType) }}
      </template>
      <template slot="status" slot-scope="text, item">
        {{ $DictName("app_template_status", item.status) || '草稿' }}
      </template>
      <template slot="action" slot-scope="text, item">
        <a-button type="link" size="small" icon="copy" @click="handleCopy(item.id)">
          复制
        </a-button>
        <a-divider type="vertical" />
        <a-button type="link" size="small" icon="setting" @click="handleEnable(item.id,item.status)">
          {{item.status === 1 ? '停用': '启用'}}
        </a-button>
        <a-divider type="vertical" />
        <a-button type="link" size="small" icon="edit" @click="handleEdit(item.id)">
          编辑
        </a-button>
        <a-divider type="vertical" />
        <a-button type="link" size="small" icon="delete" :disabled="(item.status === 1)" @click="handleDelete(item.id)">
          删除
        </a-button>
      </template>
    </a-table>
    <form-modal ref="formModal" @handleOk="queryList"/>
  </a-card>
</template>
<script>
const pageSize = 10;
import { getAppTemplateList, copyAppTemplate, setAppTemplateStatus, deleteAppTemplate } from "@/api/oemApp"
import FormModal from "./components/FormModal.vue";

export default {
  name: "TemplateManage",
  components:{
    FormModal
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
      dataSource: [{}],
      columns: [
        { title: "序号", width: "50px", customRender: (text, record, index) => index + 1 },
        { dataIndex: "type", title: "模板类型", scopedSlots: { customRender: "type" } },
        { dataIndex: "version", title: "版本号" },
        { dataIndex: "openRangeType", title: "开放范围", scopedSlots: { customRender: "openRangeType" } },
        { dataIndex: "remark", title: "版本介绍", width: "15%" },
        { dataIndex: "useCount", title: "已应用次数" },
        { dataIndex: "status", title: "状态", scopedSlots: { customRender: "status" } },
        { title: "操作", key: "action", align: "center", width: "340px", scopedSlots: { customRender: "action" } },
      ],
      pagination: {
        showSizeChanger: true,
        current: 1,
        pageSize,
        total: 0,
        showTotal: (total, range) =>
          `总数:${total} 当前:${range[0]}-${range[1]}`,
      },
      fieldName: "",
      defaultVal: "",
      versionOptions:[],
      visible:false,
      copyId: ''
    };
  },
  created() {
    this.isInit = true
    this.queryList();
    this.getAppTemplateList()
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
      this.queryParam.page = e.current;
      this.queryParam.limit = e.pageSize;
      this.pagination.current = e.current;
      this.pagination.pageSize = e.pageSize;
      this.queryList();
    },
    queryList() {
      this.loading = true;
      getAppTemplateList(this.queryParam).then((res) => {
        if (res.code === 0) {
          this.dataSource = res.data.list;
          this.pagination.total = res.data.total;
        }
        this.loading = false;
      });
    },

    // 获取模板列表
    async getAppTemplateList(){
      const res = await getAppTemplateList({query:{}})
      if(res.code !== 0) return
       const list = res?.data?.list?.map(item=>item.version) || []
       this.versionOptions = Array.from(new Set(list))?.map(item=>{
        return{
          label: item,
          value: item
        }
       }) || []
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

    // 复制
    async handleCopy(id){
      this.$refs["formModal"].init(id)
    },

    // 启用/禁用
    async handleEnable(id,status){
      const res = await setAppTemplateStatus({id,status:status == 1 ? 3: 1})
      if(res.code!==0) return
      this.queryList()
    },

    handleAdd() {
      this.$routerPush({
        path: "/oem-app/template-manage/details",
        query: { type: "add" },
      });
    },
    handleEdit(id) {
      this.$routerPush({
        path: "/oem-app/template-manage/details",
        query: { type: "edit",id },
      });
    },

    // 删除
    handleDelete(id) {
      this.$confirm({
        title: "确定是否删除",
        content: "删除后，将不可恢复",
        onOk: async() => {
          const res = await deleteAppTemplate(id)
          if(res.code !== 0) return
          this.queryList()
          this.getAppTemplateList()
        },
      });
    },
  },
};
</script>
<style lang="less" scoped></style>
