<template>
  <div class="aithings-cloud-menu">
    <a-card :bordered="false">
      <!-- 搜索 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="20">
            <a-col v-bind="aColFlex">
              <a-form-item>
                <a-input allowClear v-model="queryParam.menuName" :placeholder="$t('authorityAdm.munu.inputName')" @keyup.enter.native="queryList" />
              </a-form-item>
            </a-col>
            <a-col v-bind="aColFlex">
              <span class="table-page-search-submitButtons">
                <a-button icon="search" type="primary" @click="queryList">
                  {{ $t("public.search") }}
                </a-button>
                <a-divider type="vertical" />
                <a-button type="primary" icon="plus" @click="handleNew">
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
        :pagination="pagination"
        :data-source="dataSource"
        :columns="columns"
        :loading="loading"
      >
        <template slot="title" slot-scope="text, record">
          <span style="padding: 0 20px 0 10px">
            <icon-font class="aithings-microcheiria" v-if="record" :type="record.icon" />
          </span>
          <span v-if="record">
            {{ record.title }}
          </span>
        </template>
        <template slot="menuType" slot-scope="text, record">
          {{ $DictName("menu_type", record.menuType) }}
        </template>
        <template slot="status" slot-scope="text, record">
          <span>{{ $DictName("web_status", record.status) }}</span>
        </template>
        <template slot="action" slot-scope="text, record">
          <a-button type="link" size="small" icon="edit" @click="handleEdit(record.id)" >
            {{ $t("public.edit") }}
          </a-button>
          <a-divider type="vertical" />
          <a-button type="link" size="small" icon="delete" @click="handleDel(record.id)" >
            {{ $t("public.delete") }}
          </a-button>
          <a-divider type="vertical" />
          <a-button type="link" size="small" icon="plus" :disabled="record.isFrame === 1" @click="handleNew(record)" >
            {{ $t("authorityAdm.munu.addChildrenMenu") }}
          </a-button>
        </template>
      </a-table>
      <!-- 添加编辑弹框 -->
    </a-card>
    <form-modal ref="formModal" @update="queryList"></form-modal>
  </div>
</template>
<script>
import { getDisparkMenuList, deleteDisparkMenu } from "@/api/authority";
import FormModal from "./components/FormModal.vue";
export default {
  name: "DisparkMenu",
  components: {
    "form-modal": FormModal,
  },
  data() {
    return {
      isInit:false,
      queryParam: {
        menuName: "",
      },
      pagination: false,
      // 表头
      columns: [
        {
          title: this.$t("authorityAdm.munu.title"),
          dataIndex: "title",
          width: "260px",
          scopedSlots: { customRender: "title" },
        },
        {
          title: this.$t("authorityAdm.munu.permissionIde"),
          dataIndex: "name",
          ellipsis: true,
        },
        {
          title: this.$t("authorityAdm.munu.permissionType"),
          dataIndex: "menuType",
          scopedSlots: { customRender: "menuType" },
        },
        {
          title: this.$t("authorityAdm.munu.sort"),
          dataIndex: "weigh",
        },
        {
          title: this.$t("authorityAdm.munu.component"),
          dataIndex: "component",
          ellipsis: true,
        },
        {
          title: this.$t("authorityAdm.munu.status"),
          dataIndex: "status",
          scopedSlots: { customRender: "status" },
        },
        {
          title: this.$t("public.action"),
          dataIndex: "action",
          align: "center",
          width: "290px",
          scopedSlots: { customRender: "action" },
        },
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
    queryList() {
      this.loading = true;
      getDisparkMenuList(this.queryParam)
        .then((res) => {
          if (res.code == 0) {
            this.childrenToNull(res.data || []);
            this.dataSource = res.data;
          } else {
            this.dataSource = [];
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    childrenToNull(arr) {
      arr.forEach((v) => {
        if (v.children && v.children.length) {
          this.childrenToNull(v.children);
        } else {
          v.children = null;
        }
      });
    },
    handleNew(item) {
      if (item.id) {
        this.$refs.formModal.init(this.dataSource, item.id, "addChildren"); // 添加子菜单
      } else {
        this.$refs.formModal.init(this.dataSource, "", "add"); // 添加菜单
      }
    },
    handleEdit(id) {
      this.$refs.formModal.init(this.dataSource, id, "edit"); // 编辑菜单
    },
    handleDel(id) {
      this.$Delete(this, "").then((res) => {
        deleteDisparkMenu({ ids: [id] }).then((res) => {
          this.toast(res);
          this.queryList();
        });
      });
    },
  },
};
</script>
<style lang="less" scoped></style>
