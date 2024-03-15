<template>
  <div class="aithings-firmware">
    <div>
      {{ `已关联固件(${firmwareRows.length}个)` }}
    </div>
    <a-alert
      v-if="!moduleIds.length"
      style="margin-bottom: 10px"
      message="请先选择模组"
      type="warning"
      banner
    />
    <a-alert
      v-else
      style="margin-bottom: 10px"
      message="温馨提示：一个类型的包，只能选择一个"
      type="warning"
      banner
    />
    <a-table
      size="small"
      rowKey="id"
      :loading="loading"
      :data-source="firmwareData"
      :columns="firmwareColumns"
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
      <template slot="type" slot-scope="text, item">
        <div>{{ $DictName("firmware_type", item.type) }}</div>
      </template>
      <template slot="flashSize" slot-scope="text, item">
        <div>{{ $DictName("flash_size", item.flashSize) }}</div>
      </template>
    </a-table>
  </div>
</template>
<script>
import { getFirmwareList } from "@/api/product";
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
    moduleIds: {
      type: Array,
      default: [],
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
        query: { status: 1 },
      },
      loading: false,
      // 关联固件
      firmwareData: [],
      firmwareColumns: [
        {
          dataIndex: "name",
          title: "固件名称",
          ellipsis: true,
        },
        {
          dataIndex: "version",
          title: "版本号",
          ellipsis: true,
        },
        {
          dataIndex: "type",
          title: "固件类型",
          scopedSlots: { customRender: "type" },
          ellipsis: true,
        },
        {
          dataIndex: "flag",
          title: "标识",
          ellipsis: true,
        },
        {
          dataIndex: "id",
          title: "固件key",
          ellipsis: true,
        },
        {
          dataIndex: "flashSize",
          title: "大小",
          scopedSlots: { customRender: "flashSize" },
        },
        {
          dataIndex: "remark",
          title: "固件描述",
        },
      ],
      selectedRowKeys: [],
      firmwareRows: [],
    };
  },
  watch: {
    // 根据模组id查询固件列表
    moduleIds: {
      handler: function (newData, oldData) {
        this.firmwareData = [];
        this.firmwareRows = [];
        this.selectedRowKeys = [];
        if (newData && newData.length) {
          this.queryParam.query.moduleIds = newData;
          this.init();
        }
      },
      immediate: true,
    },
    formData: {
      handler: function (newData, oldData) {
        if (newData && newData.id && newData.firmwareIds) {
          // 迎合数据
          this.firmwareRows = newData.firmwareIds.map((v) => {
            return { id: v };
          });
          // 选中回显
          this.selectedRowKeys = newData.firmwareIds;
        }
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
      getFirmwareList(this.queryParam).then((res) => {
        if (res.code === 0) {
          this.firmwareData = res.data.list;
          this.pagination.total = res.data.total;
        } else {
          this.toast(res);
        }
        this.loading = false;
      });
    },
    onSelectChange(value, rows, e) {
      // 已选中的
      this.firmwareRows = [...this.firmwareRows, ...rows];
      // 未选中的 剔除
      let arrIds = rows.map((v) => v.id);
      let noArr = this.firmwareData.filter((v) => !arrIds.includes(v.id));
      let noArrIds = noArr.map((v) => v.id);
      this.firmwareRows = this.firmwareRows.filter(
        (v) => !noArrIds.includes(v.id)
      );
      // 有重复 去重
      this.firmwareRows = this.removeDuplicate(this.firmwareRows);
      // 选中回显
      this.selectedRowKeys = this.firmwareRows.map((v) => {
        return v.id;
      });
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
