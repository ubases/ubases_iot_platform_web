<template>
  <a-card :bordered="false">
    <!-- 筛选栏 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-input
                v-model="queryParam.searchKey"
                :placeholder="$t('请输入固件名称,标识,key(ID)')"
                :allowClear="true" 
                @keyup.enter.native="query"
              />
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
              <a-button
                type="primary"
                icon="plus"
                @click="linkToPage('', 'add')"
              >
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
      <template slot="name" slot-scope="text, record">
        <div class="link-a" @click="linkToPage(record.id, 'details')">
          {{ record.name }}
        </div>
      </template>
      <template slot="status" slot-scope="text, record">
        <span>{{ $DictName("web_status", record.status) }}</span>
      </template>
      <template v-slot:action="item">
        <a-button
          type="link"
          size="small"
          icon="edit"
          @click="linkToPage(item.id, 'edit')"
        >
          {{ $t("public.edit") }}
        </a-button>
        <a-divider type="vertical" v-if="item.status == 1" />
        <a-button
          v-if="item.status == 1"
          type="link"
          size="small"
          icon="setting"
          @click="handleSet(item)"
        >
          停用
        </a-button>
        <a-divider type="vertical" v-if="item.status == 2" />
        <a-button
          v-if="item.status == 2"
          type="link"
          size="small"
          icon="setting"
          @click="handleSet(item)"
        >
          启用
        </a-button>
        <a-divider type="vertical" />
        <a-button
          type="link"
          size="small"
          icon="plus"
          @click="addVersion(item)"
        >
          {{ $t("firmware.addVersion") }}
        </a-button>
      </template>
    </a-table>
    <!-- 添加 编辑框版本信息 -->
    <edit-version ref="versionForm"></edit-version>
  </a-card>
</template>
<script>
import { getFirmwareList, setFirmwareStatus } from "@/api/product";
import EditVersion from "./components/EditVersion.vue";

export default {
  name: "FirmwareList",
  components: {
    EditVersion,
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
          title: this.$t("firmware.sort"),
          customRender: (item, value, index) => index + 1,
        },
        {
          dataIndex: "name",
          title: this.$t("firmware.name"),
          scopedSlots: { customRender: "name" },
          width: '14%'
        },
        {
          dataIndex: "id",
          title: this.$t("firmware.id"),
        },
        {
          dataIndex: "flag",
          title: this.$t("firmware.flag"),
          width: '14%'
        },
        {
          dataIndex: "typeName",
          title: this.$t("firmware.type"),
        },
        {
          dataIndex: "version",
          title: this.$t("firmware.latestVersion"),
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
  mounted() {},
  methods: {
    // 分页
    onChangePagination(e) {
      this.queryParam.limit = e.pageSize;
      this.queryParam.page = e.current;
      this.pagination.current = e.current;
      this.pagination.pageSize = e.pageSize;
      this.queryList();
    },
    query() {
      this.queryParam.page = 1;
      this.pagination.current = 1;
      this.queryList();
    },
    // 重置筛选参数
    reset() {
      this.queryParam = {
        page: 1,
        limit: this.queryParam.limit,
      };
      this.pagination.current = 1;
      this.queryList();
    },
    // 获取固件列表
    queryList() {
      this.loading = true;
      getFirmwareList(this.queryParam)
        .then((res) => {
          if (res.code == 0) {
            this.dataSource = res.data.list || [];
            this.pagination.total = res.data.total;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 跳转固件编辑页面
    linkToPage(id, type) {
      this.$routerPush({
        path: "/product/firmware/details/index",
        query: { id, type },
        name: "FirmwareDetails",
      });
    },
    addVersion(e) {
      let data = {
        newVersion: e.version,
        firmwareName: e.name,
        firmwareId: e.id,
        firmwareFileList: [],
        status: 2, // 默认禁用
      };
      this.$refs["versionForm"].init("add", data);
    },
    handleSet(e) {
      let msg = "";
      let status = null;
      if (e.status == 2) {
        status = 1;
        msg = "是否启用固件";
      } else {
        status = 2;
        msg = "是否停用固件";
      }
      this.$UpdateStatus(this, msg).then((res) => {
        let data = {
          id: e.id,
          status,
        };
        setFirmwareStatus(data).then((res) => {
          if (res.code == 0) {
            this.queryList();
          }
          this.toast(res);
        });
      });
    },
  },
};
</script>
<style lang="less" scoped>
.firmware-name {
  text-decoration: underline;
  cursor: pointer;
}
</style>
