<template>
  <a-card :bordered="false">
    <!-- 筛选栏 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-input v-model="queryParam.query.moduleName" placeholder="请输入模组名称" :allowClear="true"  @keyup.enter.native="query" />
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
              <a-button type="primary" icon="plus" @click="handleAdd()">
                {{ $t("public.add") }}
              </a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 表格 -->
    <a-table size="small" rowKey="id" :data-source="dataSource" :columns="columns" :loading="loading" :pagination="pagination" @change="onChangePagination" >
      <template slot="moduleName" slot-scope="text, item">
        <div class="link-a" @click="handleEdit(item.id, 'details')">
          {{ item.moduleName }}
        </div>
      </template>
      <template slot="imgUrl" slot-scope="text, item">
        <a-image :src="item.imgUrl" />
      </template>
      <template slot="action" slot-scope="text, item">
        <a-button type="link" size="small" icon="edit" @click="handleEdit(item.id, 'edit')">
          {{ $t("public.edit") }}
        </a-button>
        <a-divider type="vertical" v-if="item.status === 2" />
        <a-button v-if="item.status === 2" type="link" size="small" icon="setting" @click="setChipStatus(item)">
          启用
        </a-button>
        <a-divider type="vertical" v-if="item.status === 1" />
        <a-button v-if="item.status === 1" type="link" size="small" icon="setting" @click="setChipStatus(item)">
          停用
        </a-button>
        <!-- <a-button
          type="link"
          size="small"
          icon="delete"
          @click="handleDelete(item.id)"
        >
          {{ $t("public.delete") }}
        </a-button> -->
      </template>
    </a-table>
    <form-modal ref="formModal" @ok="queryList"></form-modal>
  </a-card>
</template>
<script>
import { getChipList, deleteChip, setChipStatus } from "@/api/product";
import FormModal from "./components/index.vue";
export default {
  name: "Chip",
  components: {
    "form-modal": FormModal,
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
        query: {},
      },
      columns: [
        { title: "序号", width: "46px", customRender: (item, value, index) => index + 1 },
        { dataIndex: "moduleName", title: "模组名称", scopedSlots: { customRender: "moduleName" } },
        { dataIndex: "imgUrl", title: "图片", width: "80px", scopedSlots: { customRender: "imgUrl" } },
        { dataIndex: "firmwareTypeName", title: "固件类型" },
        { dataIndex: "firmwareFlag", title: "固件标识" },
        { dataIndex: "firmwareId", title: "固件key" },
        { title: "操作", key: "action", align: "center", width: "170px", scopedSlots: { customRender: "action" } },
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
    setChipStatus(e) {
      let msg = "";
      let status = null;
      if (e.status == 2) {
        status = 1;
        msg = "是否启用芯片模组";
      } else {
        status = 2;
        msg = "是否停用芯片模组";
      }
      this.$UpdateStatus(this, msg).then((res) => {
        setChipStatus({ id: e.id, status }).then((res) => {
          if (res.code === 0) {
            this.queryList();
          }
          this.toast(res);
        });
      });
    },
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
        query: {},
      };
      this.pagination.current = 1;
      this.queryList();
    },
    queryList() {
      this.loading = true;
      getChipList(this.queryParam)
        .then((res) => {
          if (res.code == 0) {
            this.dataSource = res.data.list;
            this.pagination.total = res.data.total;
          } else {
            this.dataSource = [];
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleEdit(id, type) {
      this.$refs["formModal"].init(type, id);
    },
    handleAdd() {
      this.$refs["formModal"].init("add", "");
    },
    handleDelete(id) {
      this.$Delete(this, "").then((res) => {
        deleteChip({ id }).then((res) => {
          this.toast(res);
          this.queryList();
        });
      });
    },
  },
};
</script>
<style lang="less" scoped></style>
