<template>
  <a-modal
    :title="modalTitle"
    :width="640"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <!-- 表格 -->
      <a-table
        size="small"
        rowKey="lang"
        :pagination="false"
        :data-source="dataSource"
        :columns="columns"
      >
        <template slot="fieldValue" slot-scope="text, item">
          <input-textarea v-model="item.fieldValue"></input-textarea>
        </template>
      </a-table>
    </a-spin>
    <template #footer>
      <a-button key="back" @click="handleCancel">取消</a-button>
      <a-divider type="vertical" />
      <a-button
        key="submit"
        type="primary"
        @click="handleOk"
        :loading="confirmLoading"
      >
        确定
      </a-button>
    </template>
  </a-modal>
</template>
<script>
import { mapGetters } from "vuex";
import { getLangForm, setLangForm } from "@/api/lang";
export default {
  props: {
    sourceTable: {
      type: String,
      default: "inform",
    },
    fieldName: {
      type: String,
      default: "tplContent",
    },
    defaultVal: {
      type: String,
      default: "",
    },
    defaultValEn: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      modalTitle: "多语言",
      visible: false,
      confirmLoading: false,
      id: "",
      form: {},
      dataSource: [
        {
          name: "",
          lang: "",
          fieldValue: "",
        },
      ],
      columns: [
        {
          dataIndex: "name",
          title: "语种",
        },
        {
          dataIndex: "fieldValue",
          title: "内容",
          scopedSlots: { customRender: "fieldValue" },
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["langTypeList"]),
  },
  methods: {
    async init(id) {
      this.id = id;
      this.confirmLoading = true;
      this.visible = true;
      let res = await getLangForm({
        sourceRowId: this.id,
        sourceTable: this.sourceTable,
        fieldName: this.fieldName,
        defaultVal: this.defaultVal,
        defaultValEn: this.defaultValEn,
      });
      this.confirmLoading = false;
      if (res.code === 0) {
        this.form = {
          sourceRowId: this.id,
          sourceTable: this.sourceTable,
          translateList: res.data || [],
        };
        this.dataSource = this.langTypeList.map((v) => {
          let obj = {
            lang: v.code,
            name: v.name,
            fieldName: this.fieldName,
            fieldValue: "",
            id: "",
          };
          this.form.translateList.some((item) => {
            if (item.lang === v.code) {
              obj.fieldValue = item.fieldValue;
              obj.id = item.id || "";
              return true;
            }
          });
          return obj;
        });
      }
    },
    handleOk() {
      this.form = {
        ...this.form,
        translateList: this.dataSource,
      };
      this.confirmLoading = true;
      setLangForm(this.form).then((res) => {
        this.toast(res);
        if (res.code === 0) {
          this.visible = false;
        }
        this.confirmLoading = false;
      });
    },
    handleCancel() {
      this.visible = false;
    },
  },
};
</script>
<style lang="less" scoped></style>
