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
                placeholder="请输入消息名称"
                :allowClear="true" 
                @keyup.enter.native="query"
              />
            </a-form-item>
          </a-col>
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-select
                v-model="queryParam.query.pushType"
                placeholder="请选择消息平台类型"
                :allowClear="true" 
                @keyup.enter.native="query"
              >
                <a-select-option
                  v-for="v in $DictList('tpl_message_platform')"
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
                v-model="queryParam.query.messageType"
                placeholder="请选择消息类型"
                :allowClear="true" 
                @keyup.enter.native="query"
              >
                <a-select-option
                  v-for="v in $DictList('tpl_message_type')"
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
      <template slot="pushType" slot-scope="text, item">
        {{ $DictName("tpl_message_platform", item.pushType) }}
      </template>
      <template slot="messageType" slot-scope="text, item">
        {{ $DictName("tpl_message_type", item.messageType) }}
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
        <a-divider type="vertical" />
        <a-button
          type="link"
          size="small"
          icon="menu"
          @click="setLang(item.tplCode,'tplSubject', item.tplName)"
        >
          名称多语言
        </a-button>
     
        <a-button
          type="link"
          size="small"
          icon="delete"
          @click="handleDelete(item.id)"
        >
          删除
        </a-button>
        <a-divider type="vertical" />
        <a-button
          type="link"
          size="small"
          icon="menu"
          @click="setLang(item.tplCode, 'tplContent', item.tplContent)"
        >
          内容多语言
        </a-button>
      </template>
    </a-table>
    <form-modal ref="formModal" @ok="queryList"></form-modal>
    <lang-modal
      ref="langModal"
      sourceTable="message_template"
      :fieldName="fieldName"
      :defaultVal="defaultVal"
    ></lang-modal>
  </a-card>
</template>
<script>
import FormModal from "./components/FormModal.vue";
import LangModal from "@/components/LangModal";
import { getMessageList, deleteMessage } from "@/api/template";
const pageSize = 10;
export default {
  name: "Message",
  components: {
    "form-modal": FormModal,
    "lang-modal": LangModal,
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
          width: "64px",
          customRender: (text, record, index) => index + 1,
        },
        {
          dataIndex: "tplName",
          title: "消息名称",
          ellipsis: true,
        },
        {
          dataIndex: "pushType",
          title: "消息平台",
          scopedSlots: { customRender: "pushType" },
        },
        {
          dataIndex: "messageType",
          title: "消息类型",
          scopedSlots: { customRender: "messageType" },
        },
        {
          dataIndex: "tplContent",
          title: "中文内容",
          width: "30%",
          ellipsis: true,
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          width: "210px",
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
      defaultVal: "",
      fieldName:"",
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
      this.queryParam.page = e.current;
      this.queryParam.limit = e.pageSize;
      this.pagination.current = e.current;
      this.pagination.pageSize = e.pageSize;
      this.queryList();
    },
    queryList() {
      this.loading = true;
      getMessageList(this.queryParam)
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
    handleAdd() {
      this.$refs["formModal"].init("add");
    },
    handleEdit(id) {
      this.$refs["formModal"].init("edit", id);
    },
    handleDelete(id) {
      this.$confirm({
        title: "确定是否删除",
        content: "删除后，将不可恢复",
        onOk: async () => {
          let res = await deleteMessage({ id });
          if (res.code === 0) {
            this.queryList();
          }
          this.toast(res);
        },
      });
    },
    setLang(id, fieldName, defaultVal) {
      this.fieldName = fieldName
      this.defaultVal = defaultVal;
      this.$nextTick(() => {
        this.$refs["langModal"].init(id);
      });
    },
  },
};
</script>
<style lang="less" scoped></style>
