<template>
  <a-card :bordered="false">
    <!-- 搜索 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="20">
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-input v-model="queryParam.query.packageName" placeholder="请输入语言包名称" :allowClear="true" @keyup.enter.native="query"/>
            </a-form-item>
          </a-col>
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-select v-model="queryParam.query.appTemplateType" placeholder="请选择模板类型" :options="$DictList('app_template_type')" :allowClear="true"  @keyup.enter.native="query"/>
            </a-form-item>
          </a-col>
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-select v-model="queryParam.query.appTemplateId" placeholder="请选择版本号" :options="versionOptions" :allowClear="true"  @keyup.enter.native="query"/>
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
                上传语言包
              </a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 表格 -->
    <a-table size="small" rowKey="id" :data-source="dataSource" :columns="columns" :loading="loading" :pagination="pagination" @change="onChangePagination">
      <template slot="appTemplateType" slot-scope="text, item">
        {{ $DictName("app_template_type", item.appTemplateType) }}
      </template>
      <template slot="updatedAt" slot-scope="text, item">
        {{ item.updatedAt | momentFilter }}
      </template>
      <template slot="action" slot-scope="text, item">
        <a-button type="link" size="small" @click="handleDownload(item)">
          下载
        </a-button>
        <a-divider type="vertical" />
        <a-button type="link" size="small" icon="edit" @click="handleEdit(item.id)">
          修改
        </a-button>
        <a-divider type="vertical" />
        <a-button type="link" size="small" icon="delete" @click="handleDelete(item.id)">
          删除
        </a-button>
      </template>
    </a-table>
    <form-modal ref="formModal" @handleOk="handleOk"></form-modal>
  </a-card>
</template>
<script>
import FormModal from "./components/FormModal.vue";
import { getAppLangList, deleteAppLang, getAppTemplateList } from "@/api/oemApp"
const pageSize = 10;
export default {
  name: "AppLang",
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
        { title: "序号", width: "50px", customRender: (text, record, index) => index + 1 },
        { dataIndex: "packageName", title: "语言包名称" },
        { dataIndex: "appTemplateType", title: "模板类型", scopedSlots: { customRender: "appTemplateType" } },
        { dataIndex: "appTemplateVersion", title: "模板版本号" },
        { dataIndex: "fileSize", title: "文件包大小" },
        { dataIndex: "updatedAt", title: "更新时间", scopedSlots: { customRender: "updatedAt" } },
        { title: "操作", key: "action", align: "center", width: "260px", scopedSlots: { customRender: "action" } },
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
      versionOptions: []
    };
  },
  created() {
    this.isInit = true
    this.queryList()
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
    // 翻页
    onChangePagination(e) {
      this.queryParam.page = e.current
      this.queryParam.limit = e.pageSize
      this.pagination.current = e.current
      this.pagination.pageSize = e.pageSize
      this.queryList()
    },

    // 获取模板列表
    async getAppTemplateList(){
      const res = await getAppTemplateList({query:{}})
      if(res.code !== 0) return
      this.versionOptions = res?.data?.list?.map(item=>{
        return {
          label: item.version,
          value: item.id
        }
      }) || []
    },

    // 获取列表
    async queryList() {
      this.loading = true
      const res = await getAppLangList(this.queryParam)
      this.loading = false
      if(res.code !== 0) return
      this.dataSource = res.data?.list ||[]
      this.pagination.total = res.data.total
    },
    query() {
      this.queryParam.page = 1
      this.pagination.current = 1
      this.queryList()
    },
    reset() {
      this.queryParam = {
        page: 1,
        limit: this.queryParam.limit,
        query: {},
      }
      this.pagination.current = 1
      this.queryList()
    },

    // 添加
    handleAdd() {
      this.$refs["formModal"].init("add")
    },

    // 编辑
    handleEdit(id) {
      this.$refs["formModal"].init("edit", id)
    },

    // 添加/编辑完成
    handleOk(){
      this.queryList()
    },

    // 删除
    handleDelete(id) {
      this.$confirm({
        title: "确定是否删除",
        content: "删除后，将不可恢复",
        onOk: async() => {
          const res = await deleteAppLang(id)
          if(res.code !== 0) return
          this.queryList()
        },
      })
    },
    handleDownload(item) {
        this.$DownloadTemplate(
        this,
        {
          url: `/v1/platform/web/lang/appResources/download`,
          method: "get",
          belongType: item.belongType,
          packageId: item.id,
        },
        item.fileName || "语言包.xlsx"
      )
    },
  },
};
</script>
<style lang="less" scoped></style>
