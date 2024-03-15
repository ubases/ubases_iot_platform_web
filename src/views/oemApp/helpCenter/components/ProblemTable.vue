<template>
  <div>
    <!-- 筛选栏 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="16">
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-select v-model="queryParam.lang" placeholder="语种" :allowClear="true" @keyup.enter.native="query">
                <a-select-option v-for="v in langTypeList" :key="v.code" :value="v.code">
                  {{ v.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-input v-model="queryParam.title" placeholder="请输入问题标题" :allowClear="true" @keyup.enter.native="query"/>
            </a-form-item>
          </a-col>
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-select v-model="queryParam.isNormal" placeholder="是否常见" :allowClear="true"  @keyup.enter.native="query">
                <a-select-option v-for="v in $DictList('is_doc_familiar')" :key="v.key" :value="v.key">
                  {{ v.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-select v-model="queryParam.isEnable" placeholder="是否启用" :allowClear="true"  @keyup.enter.native="query">
                <a-select-option v-for="v in $DictList('is_doc_enable')" :key="v.key" :value="v.key">
                  {{ v.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" icon="search" @click="query">
                {{ $t("public.query") }}
              </a-button>
              <a-divider type="vertical" />
              <a-button icon="redo" @click="reset">
                {{ $t("public.reset") }}
              </a-button>
              <a-divider type="vertical" v-if="whetherAdd" />
              <a-button type="primary" icon="plus" @click="addProblem" v-if="whetherAdd">
                {{ $t("public.add") }}
              </a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 表格 -->
    <a-table size="small" rowKey="id" :data-source="dataSource" :columns="columns" :loading="loading" :pagination="pagination" @change="onChangePagination">
      <template slot="titleRow" slot-scope="text, record">
        <div class="link-a" @click="lookProblem(record.setingId, record.lang)">
          {{ record.title }}
        </div>
      </template>
      <template slot="updatedAt" slot-scope="text, record">
        {{ record.updatedAt | momentFilter }}
      </template>
      <template slot="isEnable" slot-scope="text, record">
        {{ $DictName("is_doc_enable", record.isEnable) }}
      </template>
      <template slot="isNormal" slot-scope="text, record">
        {{ $DictName("is_doc_familiar", record.isNormal) }}
      </template>
      <template v-slot:action="record">
        <a-button type="link" size="small" icon="setting" @click="setProblem(record.setingId)">
          设置
        </a-button>
        <a-divider type="vertical" />
        <a-button type="link" size="small" icon="edit" @click="editProblem(record.setingId, record.dirId, record.lang)">
          编辑
        </a-button>
        <a-divider type="vertical" />
        <a-button type="link" size="small" icon="delete" @click="deleteProblem(record.setingId)">
          删除
        </a-button>
      </template>
    </a-table>
    <set-modal ref="setModal" @ok="queryList"></set-modal>
    <edit-modal ref="editModal" @ok="queryList"></edit-modal>
    <details-modal ref="detailsModal"></details-modal>
  </div>
</template>
<script>
import EditModal from "./EditModal.vue";
import SetModal from "./SetModal.vue";
import DetailsModal from "./DetailsModal.vue";
import { mapGetters } from "vuex";
import { getDocEntryList, deleteDocEntry } from "@/api/oemApp";
export default {
  components: {
    "set-modal": SetModal,
    "edit-modal": EditModal,
    "details-modal": DetailsModal,
  },
  data() {
    return {
      pagination: {
        showSizeChanger: true,
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: (total, range) =>
          `总数:${total} 当前:${range[0]}-${range[1]}`,
      },
      queryParam: {},
      columns: [
        { title: "序号", width: "80px", customRender: (item, value, index) => index + 1 },
        { dataIndex: "title", title: "问题标题", width: "180px", scopedSlots: { customRender: "titleRow" } },
        { dataIndex: "dirName", title: "目录" },
        { dataIndex: "isEnable", title: "状态", scopedSlots: { customRender: "isEnable" } },
        { dataIndex: "updatedAt", title: "更新时间", scopedSlots: { customRender: "updatedAt" } },
        { dataIndex: "isNormal", title: "常见问题", scopedSlots: { customRender: "isNormal" }},
        { title: this.$t("public.action"), key: "action", align: "center", width: "250px", scopedSlots: { customRender: "action" } },
      ],
      loading: false,
      dataSource: [],
      whetherAdd: false,
    };
  },
  computed: {
    ...mapGetters(["langTypeList"]),
  },
  created() {},
  methods: {
    queryList() {
      this.loading = true;
      getDocEntryList(this.queryParam)
        .then((res) => {
          if (res.code !== 0) return;
          res.data.list.forEach((v) => {
            v.id = v.setingId + v.lang;
          });
          this.dataSource = res.data.list;
          this.pagination.total = res.data.total;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    query() {
      this.queryParam.pageNum = 1;
      this.pagination.current = 1;
      this.queryList();
    },
    reset() {
      this.queryParam = {
        pageNum: 1,
        pageSize: this.queryParam.pageSize,
        dirId: this.queryParam.dirId,
        lang: this.langTypeList[0].code,
      };
      this.pagination.current = 1;
      this.queryList();
    },
    init(ids) {
      let dirId = "";
      // 是子集目录则可以添加
      if (ids.length && ids[1]) {
        dirId = ids[1];
        this.whetherAdd = true;
      } else {
        dirId = ids[0] || "";
        this.whetherAdd = false;
      }
      this.queryParam = {
        dirId,
        lang: this.langTypeList[0].code,
        pageNum: 1,
        pageSize: 10,
      };
      this.dataSource = [];
      if (!ids.length) return;
      this.queryList();
    },
    setProblem(id) {
      this.$refs["setModal"].init(id);
    },
    addProblem() {
      this.$refs["editModal"].init(
        "0",
        this.queryParam.dirId,
        this.queryParam.lang,
        "add"
      );
    },
    editProblem(id, dirId, lang) {
      this.$refs["editModal"].init(id, dirId, lang, "eidt");
    },
    lookProblem(id, lang) {
      this.$refs["detailsModal"].init(id, lang);
    },
    deleteProblem(id) {
      this.$confirm({
        title: "确定是否删除",
        content: "删除后，将不可恢复",
        onOk: () => {
          deleteDocEntry({ setingId: id }).then((res) => {
            this.toast(res);
            if (res.code === 0) {
              this.queryList();
            }
          });
        },
      });
    },
    onChangePagination(e) {
      this.queryParam.pageNum = e.current;
      this.queryParam.pageSize = e.pageSize;
      this.pagination.current = e.current;
      this.pagination.pageSize = e.pageSize;
      this.queryList();
    },
  },
};
</script>
<style lang="less" scoped></style>
