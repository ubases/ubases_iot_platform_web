<template>
  <a-row :gutter="16" v-if="languages.length > 1">
    <a-col
      :span="24"
      style="
        border: 0px solid #e3e3e3;
        background: #fff;
        padding-top: 10px;
        padding-bottom: 10px;
      "
    >
      <a-table
        border
        rowKey="id"
        size="small"
        :columns="columns"
        :data-source="dataList"
        :scroll="tableScroll"
        :pagination="false"
      >
        <template
          :slot="item.id"
          slot-scope="text, record"
          v-for="(item, index) in languages"
        >
          <template v-if="item.id == hideItem">
            <span :key="index">{{ record[item.id] }}</span>
          </template>
          <template v-else>
            <a-textarea
              :key="index"
              :maxLength="maxLength"
              v-model="record[item.id]"
              v-if="record.isEnableEdit"
              auto-size
            />
            <span :key="index" v-else>{{ record[item.id] }}</span>
          </template>
        </template>
        <template slot="action" slot-scope="text, record">
          <a-button
            size="small"
            type="primary"
            @click="$set(record, 'isEnableEdit', true)"
            v-if="!record.isEnableEdit"
          >
            {{ $t("public.edit") }}
          </a-button>
          <a-button
            size="small"
            type="primary"
            v-if="record.isEnableEdit"
            @click="handleSave(record)"
          >
            {{ $t("public.save") }}
          </a-button>
          <a-button
            size="small"
            type="primary"
            style="background: gray; margin-left: 15px"
            v-if="record.isEnableEdit"
            @click="handleCancel(record)"
          >
            {{ $t("public.cancel") }}
          </a-button>
        </template>
      </a-table>
    </a-col>
  </a-row>
</template>

<script>
import { getInfo, add, update, getLanguageList } from "@/api/translate";
export default {
  name: "setTranslate",
  props: {
    keyCode: {
      type: String,
      default: "",
    },
    hideItem: {
      type: String,
      default: "zh",
    },
    maxLength: {
      type: Number,
      default: 200,
    },
  },
  data() {
    return {
      languages: ["zh", "en", "jp"],
      tableScroll: { x: `calc(${1 * 100}px + 50%)` },
      columns: [
        {
          title: this.$t("public.action"),
          dataIndex: "action",
          width: 180,
          scopedSlots: { customRender: "action" },
        },
      ],
      dataList: [],
    };
  },
  watch: {
    keyCode: {
      handler(oldvalue, newvalue) {
        this.$nextTick(() => {
          this.loadTranslateData();
        });
      },
      immediate: true,
    },
  },
  computed: {
    formItemLayout() {
      return {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
      };
    },
  },
  mounted() {
    // 获取语言种类
    getLanguageList({}).then((res) => {
      if (res.code == 0) {
        this.setLanguages(res.data);
        return;
      }
      let arr = [
        { id: "zh", title: "中文" },
        { id: "en", title: "英文" },
        { id: "jp", title: "日语" },
      ];
      this.setLanguages(arr);
    });
  },
  methods: {
    emptyDataList() {
      return [
        {
          code: this.keyCode,
          en: "",
          index: 1,
          jp: "",
          zh: this.keyCode,
          isEnableEdit: true,
          isNew: true,
        },
      ];
    },
    loadTranslateData(value) {
      if (!this.keyCode) {
        this.dataList = this.emptyDataList();
        return;
      }
      var queryParam = {
        code: this.keyCode,
      };
      getInfo(queryParam).then((res) => {
        if (res.code == 0) {
          res.data || (res.data = []);
          res.data.forEach((v, i) => {
            v.index = i;
          });
          if (res.data.length == 0) {
            res.data = this.emptyDataList();
          }
          this.dataList = res.data;
        }
      });
    },
    handleCancel(record) {
      this.$set(record, "isEnableEdit", false);
    },
    getEditStatus() {
      return this.dataList.filter((f) => f.isEnableEdit).length;
    },
    setLanguages(res) {
      if (res.length > 5) {
        this.tableScroll = { x: `calc(${res.length * 100}px + 50%)` };
      } else {
        this.tableScroll = {};
      }
      this.languages = res;
      this.columns = [
        ...res.map((m) => {
          return {
            title: m.title,
            dataIndex: m.id,
            scopedSlots: { customRender: m.id },
          };
        }),
        {
          title: this.$t("public.action"),
          dataIndex: "action",
          ...(res.length > 5 ? { fixed: "right", width: "160px" } : {}),
          scopedSlots: { customRender: "action" },
        },
      ];
      this.loadTranslateData();
    },
    handleSave(item) {
      let that = this;
      if (!this.keyCode) {
        this.$message.warning("请输入名称");
        return;
      }
      if (!item.jp || !item.en) {
        this.$message.warning("请输入翻译");
        return;
      }
      if (!item.isNew) {
        that.$Update(that, item.code).then(() => {
          update(item).then((res) => {
            that.toast(res);
            if (res.code == 0) {
              item.isEnableEdit = false;
            }
          });
        });
      } else {
        that.$Add(that, item.code).then(() => {
          add(item).then((res) => {
            that.toast(res);
            if (res.code == 0) {
              item.isEnableEdit = false;
              item.isNew = false;
              item.id = res.data;
            }
          });
        });
      }
    },
    toDate(timestamp) {
      return this.$moment(timestamp * 1000).format("YYYY-MM-DD HH:mm:ss");
    },
  },
};
</script>
