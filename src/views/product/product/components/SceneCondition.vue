<template>
  <div class="aithings-scene-condition">
    <a-alert
      v-if="!instructList.length"
      style="margin-bottom: 10px"
      message="请先选择控制指令"
      type="warning"
      banner
    />
    <a-alert
      v-else
      style="margin-bottom: 10px"
      message="温馨提示：为更合理的设置场景，数据传输类型为“可上报”的仅可以作为触发条件，“可下发”的仅可以作为执行任务"
      type="warning"
      banner
    />
    <a-table
      size="small"
      rowKey="id"
      :pagination="false"
      :data-source="instructData"
      :columns="instructColumns"
    >
      <template slot="triggerCond" slot-scope="text, item, index">
        <a-checkbox
          v-if="item.rwFlag === 'READ' || item.rwFlag === 'READ_WRITE'"
          v-model="item.triggerCond"
          :disabled="disabled"
          @change="onChangeCheckbox($event, index, 'triggerCond')"
        >
        </a-checkbox>
        <div v-else>不可配置</div>
      </template>
      <template slot="execCond" slot-scope="text, item, index">
        <a-checkbox
          v-if="item.rwFlag === 'WRITE' || item.rwFlag === 'READ_WRITE'"
          v-model="item.execCond"
          :disabled="disabled"
          @change="onChangeCheckbox($event, index, 'execCond')"
        >
        </a-checkbox>
        <div v-else>不可配置</div>
      </template>
    </a-table>
  </div>
</template>
<script>
export default {
  props: {
    instructList: {
      type: Array,
      default: [],
    },
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
      instructData: [],
      instructColumns: [
        {
          dataIndex: "funcName",
          title: "功能点",
        },
        {
          dataIndex: "desc",
          title: "功能描述",
          ellipsis: true,
        },
        {
          dataIndex: "triggerCond",
          title: "触发条件",
          scopedSlots: { customRender: "triggerCond" },
        },
        {
          dataIndex: "execCond",
          title: "执行任务",
          scopedSlots: { customRender: "execCond" },
        },
      ],
    };
  },
  watch: {
    instructList: {
      handler: function (newData, oldData) {
        if (newData && newData.length) {
          this.instructData = newData;
        } else {
          this.instructData = [];
        }
      },
      immediate: true,
    },
  },
  methods: {
    onChangeCheckbox(data, index, type) {
      this.instructData[index][type] = data.target.checked;
      this.$forceUpdate();
    },
  },
};
</script>
<style lang="less" scoped></style>
