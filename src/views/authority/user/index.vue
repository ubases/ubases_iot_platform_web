<template>
  <div class="aithings-user">
    <a-card :bordered="false">
      <!-- 筛选栏 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col v-bind="aColFlex">
              <a-form-item>
                <a-input v-model="queryParam.searchKey" :placeholder="$t('authorityAdm.user.inputAccount')" :allowClear="true"  @keyup.enter.native="query" />
              </a-form-item>
            </a-col>
            <a-col v-bind="aColFlex">
              <a-form-item>
                <a-tree-select
                  v-model="queryParam.deptId"
                  placeholder="请选择部门"
                  :replaceFields="{
                    children: 'children',
                    title: 'deptName',
                    key: 'deptId',
                    value: 'deptId',
                  }"
                  :tree-data="treeData"
                  :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                  style="width: 100%"
                  tree-default-expand-all
                  :allowClear="true"
                ></a-tree-select>
              </a-form-item>
            </a-col>
            <a-col v-bind="aColFlex">
              <a-form-item>
                <a-select v-model="queryParam.postId" placeholder="请选择岗位" :allowClear="true" @keyup.enter.native="query">
                  <a-select-option v-for="v in postList" :key="v.postId" :value="v.postId" >
                    {{ v.postName }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col v-bind="aColFlex">
              <a-form-item>
                <a-select v-model="queryParam.status" :placeholder="$t('authorityAdm.user.selectStatus')" :allowClear="true"  @keyup.enter.native="query" >
                  <a-select-option v-for="v in $DictList('web_status')" :key="v.key" :value="v.key">
                    {{ v.label }}
                  </a-select-option>
                </a-select>
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
                <a-button type="primary" icon="plus" @click="linkToPage('add')">
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
        <template slot="userName" slot-scope="text, record">
          <div class="link-a" @click="linkToPage('details', record.id)">
            {{ record.userName }}
          </div>
        </template>
        <template slot="roleInfo" slot-scope="text, record">
          <span v-for="(v, i) in record.roleInfo" :key="v.roleId">
            {{ v.name }}{{ i == record.roleInfo.length - 1 ? "" : "，" }}
          </span>
        </template>
        <template slot="post" slot-scope="text, record">
          <span v-for="(v, i) in record.post" :key="v.postId">
            {{ v.postName }}{{ i == record.post.length - 1 ? "" : "，" }}
          </span>
        </template>
        <template slot="status" slot-scope="text, record">
          <span>{{ $DictName("web_status", record.status) }}</span>
        </template>
        <template slot="action" slot-scope="text, record">
          <a-button type="link" size="small" icon="edit" @click="linkToPage('edit', record.id)">
            {{ $t("public.edit") }}
          </a-button>
          <a-divider type="vertical" />
          <a-button type="link" size="small" icon="delete" @click="handleDel([record.id])">
            {{ $t("public.delete") }}
          </a-button>
        </template>
      </a-table>
    </a-card>
  </div>
</template>
<script>
import moment from "moment";
import { getUserList, deleteUser, getDepartmentList, getPostList} from "@/api/authority";
import { arrToTree } from "@/utils/util";
export default {
  name: "UserList",
  data() {
    return {
      isInit:false,
      moment,
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
        pageNum: 1,
        pageSize: 10,
      },
      columns: [
        {
          title: "序号",
          width: "80px",
          customRender: (item, value, index) => index + 1,
        },
        {
          dataIndex: "userName",
          title: this.$t("authorityAdm.user.account"),
          scopedSlots: { customRender: "userName" },
          ellipsis: true,
        },
        {
          dataIndex: "dept.deptName",
          title: this.$t("authorityAdm.user.deptId"),
          ellipsis: true,
        },
        {
          dataIndex: "roleInfo",
          title: this.$t("authorityAdm.user.role"),
          scopedSlots: { customRender: "roleInfo" },
          ellipsis: true,
        },
        {
          dataIndex: "post",
          title: "岗位",
          scopedSlots: { customRender: "post" },
          ellipsis: true,
        },
        {
          dataIndex: "status",
          title: this.$t("public.status"),
          scopedSlots: { customRender: "status" },
        },
        {
          title: this.$t("public.action"),
          key: "action",
          align: "center",
          width: "220px",
          scopedSlots: { customRender: "action" },
        },
      ],
      loading: false,
      dataSource: [],
      form: {},
      treeData: [],
      postList: [],
    };
  },
  computed: {},
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
    // 分页
    onChangePagination(e) {
      this.queryParam.pageNum = e.current;
      this.queryParam.pageSize = e.pageSize;
      this.pagination.current = e.current;
      this.pagination.pageSize = e.pageSize;
      this.queryList();
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
      };
      this.pagination.current = 1;
      this.queryList();
    },
    queryList() {
      this.loading = true;
      getUserList(this.queryParam)
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
    init() {
      getDepartmentList({ status: 1 }).then((res) => {
        if (res.code === 0) {
          this.treeData = arrToTree(res.data.list, "deptId", "parentId");
        }
      });
      getPostList({ pageNum: 1, pageSize: 1000, status: 1 }).then((res) => {
        if (res.code === 0) {
          this.postList = res.data.list;
        }
      });
    },
    linkToPage(type, id = "") {
      this.$routerPush({
        path: `/authority/user/details?type=${type}&id=${id}`,
        name: "DeveloperAuditDetails",
      });
    },
    handleDel(ids) {
      this.$Delete(this, "").then((res) => {
        deleteUser({ ids }).then((res) => {
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
<style lang="less" scoped></style>
