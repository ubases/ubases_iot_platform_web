<template>
  <div>
    <a-card :bordered="false">
      <!-- 表格操作栏 -->
      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleSave('add')">
          {{ $t("public.add") }}
        </a-button>
      </div>
      <!-- 表格 -->
      <a-table
        size="small"
        rowKey="id"
        :data-source="configList"
        :columns="columns"
        :loading="loading"
        :pagination="false"
      >
        <template slot="action" slot-scope="text, record">
          <a-button
            type="link"
            size="small"
            icon="edit"
            @click="handleSave('edit', record)"
          >
            {{ $t("public.edit") }}
          </a-button>
          <a-divider type="vertical" />
          <a-button
            type="link"
            size="small"
            icon="delete"
            @click="handleDelete(record)"
          >
            删除
          </a-button>
        </template>
      </a-table>
      <!-- 添加 编辑框 -->
      <a-modal
        :title="title"
        :width="640"
        :visible="visible"
        :confirm-loading="confirmLoading"
        @ok="handleOk"
        @cancel="handleCancel"
      >
        <a-spin :spinning="confirmLoading">
          <a-form-model ref="ruleForm" :model="form" :rules="rules">
            <!-- 参数描述 -->
            <a-row>
              <a-col :span="24">
                <a-form-model-item
                  :label-col="labelCol"
                  :wrapper-col="wrapperCol"
                  label="参数描述"
                  prop="desc"
                >
                  <a-input v-model="form.desc" placeholder="请输入参数描述" />
                </a-form-model-item>
              </a-col>
            </a-row>
            <!-- 参数编码 -->
            <a-row>
              <a-col :span="24">
                <a-form-model-item
                  :label-col="labelCol"
                  :wrapper-col="wrapperCol"
                  label="参数编码"
                  prop="code"
                >
                  <a-input v-model="form.code" placeholder="请输入参数编码" />
                </a-form-model-item>
              </a-col>
            </a-row>
            <!-- 参数值 -->
            <a-row>
              <a-col :span="24">
                <a-form-model-item
                  :label-col="labelCol"
                  :wrapper-col="wrapperCol"
                  label="参数值"
                  prop="value"
                >
                  <a-input v-model="form.value" placeholder="请输入参数值" />
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
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
    </a-card>
  </div>
</template>
<script>
import {
  getSystemConfigList,
  addSystemConfig,
  editSystemConfig,
  deleteSystemConfig,
} from "@/api/configuration";
import { CommonNameRules } from "@/utils/validate";
export default {
  name: "Configuration",
  components: {},
  data() {
    return {
      configList: [],
      columns: [
        {
          title: "序号",
          width: "80px",
          customRender: (text, record, index) => index + 1,
        },
        {
          dataIndex: "desc",
          title: "参数描述",
          ellipsis: true,
        },
        {
          dataIndex: "code",
          title: "参数编码",
          ellipsis: true,
        },
        {
          dataIndex: "value",
          title: "参数值",
          ellipsis: true,
        },
        {
          title: this.$t("public.action"),
          key: "action",
          align: "center",
          width: "180px",
          scopedSlots: { customRender: "action" },
        },
      ],
      loading: false,
      visible: false,
      title: "",
      confirmLoading: false,
      form: {},
      rules: {
        desc: CommonNameRules("请输入参数描述", 100, 1),
        code: CommonNameRules("请输入参数编码", 50, 1),
        value: CommonNameRules("请输入参数值", 500, 1),
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
  },
  computed: {},
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.loading = true;
      getSystemConfigList()
        .then((res) => {
          if (res.code === 0) {
            this.configList = res.data.list;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleDelete(item) {
      this.$confirm({
        title: "确定是否删除",
        content: "删除后，将不可恢复",
        onOk: () => {
          deleteSystemConfig({ id: item.id }).then((res) => {
            if (res.code === 0) {
              this.init();
            }
            this.toast(res);
          });
        },
      });
    },
    handleSave(type, item) {
      if (type === "add") {
        this.title = "添加平台配置项";
        this.form = {};
      } else if (type === "edit") {
        this.title = "编辑平台配置项";
        this.form = item;
      }
      this.visible = true;
    },
    handleOk() {
      this.$refs["ruleForm"].validate(async (valid) => {
        if (!valid) return;
        this.confirmLoading = true;
        let res;
        if (!this.form.id) {
          res = await addSystemConfig(this.form);
        } else {
          res = await editSystemConfig(this.form);
        }
        this.toast(res);
        this.confirmLoading = false;
        if (res.code === 0) {
          this.visible = false;
          this.init();
        }
      });
    },
    handleCancel() {
      this.visible = false;
    },
  },
};
</script>
<style lang="less" scoped></style>
