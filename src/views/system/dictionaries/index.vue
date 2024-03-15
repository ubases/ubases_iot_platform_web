<template>
  <a-card>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="16">
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-input
                v-model="queryParam.dictName"
                :placeholder="$t('dic.name')"
                :allowClear="true" 
                @keyup.enter.native="handleSearch"
              />
            </a-form-item>
          </a-col>
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-input
                v-model="queryParam.dictType"
                :placeholder="$t('dic.code')"
                :allowClear="true" 
                @keyup.enter.native="handleSearch"
              />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" icon="search" @click="handleSearch">
                {{ $t("public.search") }}
              </a-button>
              <a-divider type="vertical" />
              <a-button icon="redo" @click="reset"> 重置 </a-button>
              <a-divider type="vertical" />
              <a-button type="primary" icon="plus" @click="handleNew">
                {{ $t("public.add") }}
              </a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <a-table
      size="small"
      rowKey="dictId"
      :data-source="loadData"
      :columns="columns"
      :loading="loading"
      :pagination="pagination"
      @change="onChangePagination"
    >
      <template slot="dictName" slot-scope="text, record">
        <div class="link-a" @click="lookOver(record)">
          {{ record.dictName }}
        </div>
      </template>
      <template slot="valueType" slot-scope="text, record">
        <div v-if="record.valueType === 1">整数</div>
        <div v-if="record.valueType === 2">浮点数</div>
        <div v-if="record.valueType === 3">字符串</div>
      </template>
      <template slot="action" slot-scope="text, record">
        <a-button
          type="link"
          size="small"
          icon="edit"
          @click="handleEdit(record)"
        >
          {{ $t("public.edit") }}
        </a-button>
        <a-divider type="vertical" />
        <a-button
          type="link"
          size="small"
          icon="delete"
          @click="deleteDict(record)"
          >{{ $t("public.delete") }}</a-button
        >
      </template>
    </a-table>

    <!-- 表单添加编辑框 -->
    <a-modal
      :width="640"
      :title="title"
      :visible="visible"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
    >
      <a-spin :spinning="confirmLoading">
        <a-form :form="form">
          <a-form-item
            :label="$t('dic.name')"
            type="text"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input
              :maxLength="100"
              v-decorator="['dictName']"
              placeholder="请输入字典集名称"
            />
          </a-form-item>
          <a-form-item
            :label="$t('dic.code')"
            type="text"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input
              :maxLength="50"
              :disabled="!!editDictId"
              v-decorator="[
                'dictType',
                { rules: [{ required: true, message: $t('dic.input_code') }] },
              ]"
              placeholder="请输入字典集编码"
            />
          </a-form-item>
          <a-form-item
            label="字典集类型"
            type="text"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-radio-group
              v-decorator="[
                'valueType',
                { rules: [{ required: true, message: '请选择字典集类型' }] },
              ]"
            >
              <a-radio :value="1"> 整数 </a-radio>
              <a-radio :value="2"> 浮点数 </a-radio>
              <a-radio :value="3"> 字符串 </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            :label="$t('dic.pinyin')"
            type="text"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input
              :maxLength="50"
              v-decorator="['pinyin']"
              placeholder="请输入字典集拼音"
            />
          </a-form-item>
          <a-form-item
            :label="$t('dic.des')"
            type="text"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-textarea
              :maxLength="500"
              style="width: 100%"
              v-decorator="['remark']"
              placeholder="请输入描述"
            />
          </a-form-item>
        </a-form>
      </a-spin>
      <template #footer>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-divider type="vertical" />
        <a-button
          key="submit"
          type="primary"
          @click="handleSubmit"
          :loading="confirmLoading"
        >
          确定
        </a-button>
      </template>
    </a-modal>
  </a-card>
</template>
<script>
import {
  addDictType,
  getDictTypeList,
  deleteDictType,
  updateDictType,
} from "@/api/dictionaries";
import pick from "lodash.pick";

export default {
  name: "DictionariesList",
  data() {
    return {
      isInit:false,
      // 表格
      pagination: {
        showSizeChanger: true,
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: (total, range) =>
          `总数:${total} 当前:${range[0]}-${range[1]}`,
      },
      loading: false,
      queryParam: {
        pageNum: 1,
        pageSize: 10,
        dictName: "",
        dictType: "",
      },
      columns: [
        {
          title: this.$t("dic.name"),
          dataIndex: "dictName",
          scopedSlots: { customRender: "dictName" },
        },
        {
          title: this.$t("dic.code"),
          dataIndex: "dictType",
          ellipsis: true,
        },
        {
          title: "字典集类型",
          dataIndex: "valueType",
          scopedSlots: { customRender: "valueType" },
        },
        {
          title: this.$t("public.action"),
          dataIndex: "action",
          align: "center",
          width: "220px",
          scopedSlots: { customRender: "action" },
        },
      ],
      loadData: [],
      // 表单添加编辑
      form: this.$form.createForm(this),
      editDictId: "",
      title: "",
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
      confirmLoading: false,
      visible: false,
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
    reset() {
      this.queryParam.pageNum = 1;
      this.queryParam.dictName = "";
      this.queryParam.dictType = "";
      this.pagination.current = 1;
      this.queryList();
    },
    handleSearch() {
      this.queryParam.pageNum = 1;
      this.pagination.current = 1;
      this.queryList();
    },

    // 字典列表
    async queryList() {
      this.loading = true;
      const res = await getDictTypeList(this.queryParam);
      if (res.code !== 0) return;
      this.pagination.total = res.data.total ?? 1;
      this.loadData = res.data.list;
      this.loading = false;
    },
    onChangePagination(e) {
      this.queryParam.pageSize = e.pageSize;
      this.queryParam.pageNum = e.current;
      this.pagination.current = e.current;
      this.pagination.pageSize = e.pageSize;
      this.queryList();
    },

    // 查看字典
    lookOver(data) {
      this.$routerPush({
        path: `/system/dictionaries/details?code=${data.dictType}`,
        name: "DictionariesDetails",
      });
    },

    // 点击编辑
    handleEdit(record) {
      this.visible = true;
      this.editDictId = record.dictId;
      this.title = this.$t("dic.edit");
      const {
        form: { setFieldsValue },
      } = this;
      this.$nextTick(() => {
        setFieldsValue(
          pick(record, [
            "dictName",
            "dictType",
            "dictValue",
            "valueType",
            "remark",
          ])
        );
      });
    },

    // 点击新建
    handleNew() {
      this.visible = true;
      this.editDictId = "";
      this.title = this.$t("dic.add");
      const {
        form: { setFieldsValue },
      } = this;
      this.$nextTick(() => {
        setFieldsValue(
          pick({}, ["dictName", "dictType", "dictValue", "valueType", "remark"])
        );
      });
    },

    // 确认修改提交
    handleSubmit() {
      const {
        form: { validateFields },
        editDictId,
      } = this;
      validateFields(async (err, values) => {
        if (err) return;
        let res = null;
        res = editDictId
          ? await updateDictType({ dictId: editDictId, ...values })
          : await addDictType(values);
        res.code === 0 ? this.refresh(res) : this.toast(res);
      });
    },
    handleCancel() {
      this.visible = false;
      this.confirmLoading = false;
      this.form.resetFields();
    },

    deleteDict(record) {
      this.$Delete(this, record.dictName).then(async () => {
        const res = await deleteDictType(record.dictId);
        this.toast(res);
        this.queryList();
      });
    },
    refresh(res) {
      this.toast(res);
      this.handleCancel();
      this.queryList();
    },
  },
};
</script>
<style lang="less" scoped></style>
