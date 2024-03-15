<template>
  <div class="aithings-module">
    <div>
      {{ `已选择模组(${moduleRows.length}个)` }}
    </div>
    <div style="padding: 10px 0"></div>
    <a-table
      size="small"
      rowKey="id"
      :loading="loading"
      :data-source="moduleData"
      :columns="moduleColumns"
      :row-selection="
        disabled
          ? {
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
              getCheckboxProps: () => {
                return { props: { disabled: true } };
              },
            }
          : {
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
            }
      "
      :pagination="pagination"
      @change="onChangePagination"
    >
      <template slot="firmwareType" slot-scope="text, item">
        <div>{{ $DictName("firmware_type", item.firmwareType) }}</div>
      </template>
      <template slot="defaultVersion" slot-scope="text, item">
        <div>{{ item.defaultVersion ? `v${item.defaultVersion}` : '' }}</div>
      </template>
    </a-table>
  </div>
</template>
<script>
import { getChipList } from "@/api/product";
export default {
  props: {
    formData: {
      type: Object,
      default: {},
    },
    disabled: {
      type: Boolean,
      default: false,
    },
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
      // 查询参数
      queryParam: {
        page: 1,
        limit: 10,
        query: {
          status: 1,
        },
      },
      loading: false,
      // 模组
      moduleData: [],
      moduleColumns: [
        {
          dataIndex: "moduleName",
          title: "模组名称",
          ellipsis: true,
        },
        {
          dataIndex: "firmwareName",
          title: "关联固件名称"
        },
        {
          dataIndex: "firmwareType",
          title: "固件类型",
          scopedSlots: { customRender: "firmwareType" },
          ellipsis: true,
        },
        {
          dataIndex: "firmwareKey",
          title: "固件key"
        },
        {
          dataIndex: "versions",
          title: "关联固件版本号",
        },
        {
          dataIndex: "defaultVersion",
          title: "默认版本号",
          scopedSlots: { customRender: "defaultVersion" },
          ellipsis: true,
        }
      ],
      selectedRowKeys: [],
      moduleRows: [],
    };
  },
  created() {},
  watch: {
    formData: {
      handler: function (newData, oldData) {
        if (newData && newData.id) {
          // 迎合数据
          this.moduleRows = newData.moduleIds.map((v) => {
            return { id: v };
          });
          // 选中回显
          this.selectedRowKeys = newData.moduleIds;
        }
        this.init();
      },
      immediate: true,
    },
  },
  methods: {
    // 分页
    onChangePagination(e) {
      this.queryParam.limit = e.pageSize;
      this.queryParam.page = e.current;
      this.pagination.current = e.current;
      this.pagination.pageSize = e.pageSize;
      this.init();
    },
    init() {
      this.loading = true;
      getChipList(this.queryParam).then((res) => {
        if (res.code === 0) {
          this.moduleData = res?.data?.list?.map(item=>{
            return {
              ...item,
              versions: item.versionList?.map(v=>`v${v.version}`)?.toString() || ''
            }
          });
          this.pagination.total = res.data.total;
        } else {
          this.toast(res);
        }
        this.loading = false;
      });
    },
    onSelectChange(selectedRowKeys, rows, e) {
      // 已选中的
      this.moduleRows = [...this.moduleRows, ...rows];
      // 未选中的 剔除
      let arrIds = rows.map((v) => v.id);
      let noArr = this.moduleData.filter((v) => !arrIds.includes(v.id));
      let noArrIds = noArr.map((v) => v.id);
      this.moduleRows = this.moduleRows.filter((v) => !noArrIds.includes(v.id));
      // 有重复 去重
      this.moduleRows = this.removeDuplicate(this.moduleRows);
      // 选中回显
      this.selectedRowKeys = this.moduleRows.map((v) => {
        return v.id;
      });
      // 传递到父组件
      let moduleIds = this.moduleRows.map((v) => v.id);
      this.$emit("onChangeModule", moduleIds);
    },
    // 数组去重
    removeDuplicate(arr) {
      var obj = {};
      arr = arr.reduce(function (item, next) {
        obj[next.id] ? "" : (obj[next.id] = true && item.push(next));
        return item;
      }, []);
      return arr;
    },
  },
};
</script>
<style lang="less" scoped></style>
