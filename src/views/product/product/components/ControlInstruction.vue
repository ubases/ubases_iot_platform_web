<template>
  <div class="aithings-control-instruction">
    <a-alert
      v-if="!productTypeId"
      style="margin-bottom: 10px"
      message="请先选择产品分类"
      type="warning"
      banner
    />
    <a-table
      size="small"
      rowKey="id"
      :pagination="false"
      :loading="loading"
      :data-source="instructData"
      :columns="instructColumns"
      :row-selection="
        disabled
          ? null
          : {
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
              getCheckboxProps: getCheckboxProps,
            }
      "
    >
      <template slot="required" slot-scope="text, item">
        <div>{{ $DictName("yes_no", item.required) }}</div>
      </template>
    </a-table>
  </div>
</template>
<script>
import { getProductInstruction } from "@/api/product";
export default {
  props: {
    productTypeId: {
      type: String,
      default: "",
    },
    formData: {
      type: Object,
      default: {},
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    whetherProductKey: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // 控制指令
      instructData: [],
      instructColumns: [
        {
          dataIndex: "dpid",
          title: "dpid",
        },
        {
          dataIndex: "funcName",
          title: "功能点",
        },
        {
          dataIndex: "required",
          title: "必选",
          width: "50px",
          scopedSlots: { customRender: "required" },
        },
        {
          dataIndex: "identifier",
          title: "标识符",
        },
        {
          dataIndex: "rwFlag",
          title: "数据传输类型",
        },
        {
          dataIndex: "dataType",
          title: "数据类型",
          width: "80px",
        },
        {
          dataIndex: "attribute",
          title: "功能点属性",
          width: "340px",
        },
      ],
      instructRows: [],
      selectedRowKeys: [],
      loading: false,
      // 必选项
      mustList: [],
    };
  },
  created() {},
  computed: {
    // 有必选和非必选 需要做出判断
    disabledForm: function () {
      console.log(this.instructRows,this.mustList)
      if (this.instructRows.length === 0) return true;
      return this.mustList.some(
        (value) => !this.instructRows.some((item) => item.id === value.id)
      );
    },
  },

  watch: {
    productTypeId: {
      handler: function (newData, oldData) {
        this.init();
      },
      immediate: true,
    },
    formData: {
      handler: function (newData, oldData) {
        if (newData && newData.id) {
          this.instructRows = newData.thingModels || [];
          // 选中回显
          this.selectedRowKeys = this.instructRows.map((v) => {
            return v.id;
          });
        }
      },
      immediate: true,
    },
  },
  methods: {
    getCheckboxProps(record) {
      return {
        props: {
          disabled: this.disabled,
        },
      };
    },
    init() {
      if (!this.productTypeId) return;
      this.loading = true;
      // 当主动切换产品分类
      if (this.whetherProductKey) {
        this.instructRows = [];
        this.selectedRowKeys = [];
      }
      getProductInstruction({
        productTypeId: this.productTypeId,
        productKey: this.whetherProductKey ? "" : this.formData.productKey,
      }).then((res) => {
        if (res.code === 0) {
          this.instructData = res.data || [];
          // 筛选必选项
          this.mustList = this.instructData.filter((v) => {
            return v.required === 1;
          });
          // 详情只展示已选项;
          if (this.disabled) {
            this.instructData = this.instructData.filter((value) =>
              this.selectedRowKeys.some((item) => item === value.id)
            );
          }
        } else {
          this.toast(res);
          this.instructData = [];
          this.mustList = [];
        }
        this.loading = false;
      });
    },
    onSelectChange(selectedRowKeys, rows) {
      this.instructRows = rows;
      this.selectedRowKeys = this.instructRows.map((v) => {
        return v.id;
      });
      this.$emit("onChangeInstruction", this.instructRows);
    },
  },
};
</script>
<style lang="less" scoped></style>
