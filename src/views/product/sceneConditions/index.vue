<template>
  <div class="aithings-scene-conditions">
    <a-card :bordered="false">
      <!-- 筛选栏 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="4" :sm="24">
              <a-form-item>
                <a-input 
                v-model="queryParam.id" 
                placeholder="请输入条件名称" 
                :allowClear="true" 
                @keyup.enter.native="queryList"
                />
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="24">
              <a-form-item>
                <a-select
                  v-model="queryParam.status"
                  placeholder="请选择产品类型"
                  default-value="0"
                  :allowClear="true" 
                  @keyup.enter.native="queryList"
                >
                  <a-select-option value="1">关闭</a-select-option>
                  <a-select-option value="2">运行中</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="24">
              <a-form-item>
                <a-select
                  v-model="queryParam.status"
                  placeholder="请选择产品名称"
                  default-value="0"
                  :allowClear="true" 
                  @keyup.enter.native="queryList"
                >
                  <a-select-option value="1">关闭</a-select-option>
                  <a-select-option value="2">运行中</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="24">
              <a-form-item>
                <a-select
                  v-model="queryParam.status"
                  placeholder="请选择条件类型"
                  default-value="0"
                  :allowClear="true" 
                  @keyup.enter.native="queryList"
                >
                  <a-select-option value="1">关闭</a-select-option>
                  <a-select-option value="2">运行中</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button icon="search" type="primary" @click="queryList">
                  查询
                </a-button>
                <a-button
                  icon="redo"
                  style="margin-left: 8px"
                  @click="queryList"
                >
                  重置
                </a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <!-- 表格操作栏 -->
      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAdd()">
          添加
        </a-button>
      </div>

      <!-- 表格 -->
      <a-table
        size="small"
        :data-source="dataSource"
        :columns="columns"
        :loading="loading"
        :pagination="pagination"
        @change="onChangePagination"
      >
        <template v-slot:action>
          <a-button type="link" size="small" icon="edit" @click="handleEdit()">
            {{ $t("public.edit") }}
          </a-button>
          <a-button v-if="true" type="link" size="small" icon="delete">
            删除
          </a-button>
        </template>
      </a-table>

      <!-- 添加 编辑框 -->
      <a-modal
        title="编辑/添加"
        :width="640"
        :visible="visible"
        :confirm-loading="confirmLoading"
        @ok="handleOk"
        @cancel="handleCancel"
      >
        <a-spin :spinning="confirmLoading">
          <a-form-model ref="ruleForm" :model="form">
            <!-- 名称 -->
            <a-row>
              <a-col>
                <a-form-model-item
                  :label-col="labelCol"
                  :wrapper-col="wrapperCol"
                  label="条件名称"
                >
                  <a-input v-model="form.name" />
                </a-form-model-item>
              </a-col>
            </a-row>
            <!-- 选择产品 -->
            <a-row>
              <a-col>
                <a-form-model-item
                  :label-col="labelCol"
                  :wrapper-col="wrapperCol"
                  label="选择产品"
                >
                  <a-select
                    style="width: 120px; margin-right: 20px"
                    placeholder="产品类型"
                  >
                    <a-select-option value="jack"> Jack </a-select-option>
                    <a-select-option value="lucy"> Lucy </a-select-option>
                    <a-select-option value="Yiminghe">
                      yiminghe
                    </a-select-option>
                  </a-select>
                  <a-select
                    style="width: 120px; margin-right: 20px"
                    placeholder="产品名称"
                  >
                    <a-select-option value="lucy"> Lucy </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
            </a-row>
            <!-- 条件类型 -->
            <a-row>
              <a-col>
                <a-form-model-item
                  :label-col="labelCol"
                  :wrapper-col="wrapperCol"
                  label="条件类型"
                >
                  <a-radio-group v-model="form.resource">
                    <a-radio value="1">触发</a-radio>
                    <a-radio value="2">执行</a-radio>
                  </a-radio-group>
                </a-form-model-item>
              </a-col>
            </a-row>
            <!-- 产品指令 -->
            <a-row>
              <a-col>
                <a-form-model-item
                  :label-col="labelCol"
                  :wrapper-col="wrapperCol"
                  label="产品指令"
                >
                  <a-table
                    size="small"
                    :row-selection="rowSelection"
                    :data-source="modelDataSource"
                    :columns="modelColumns"
                    :pagination="false"
                  >
                  </a-table>
                </a-form-model-item>
              </a-col>
            </a-row>
            <!-- 描述 -->
            <a-row>
              <a-col>
                <a-form-model-item
                  :label-col="labelCol"
                  :wrapper-col="wrapperCol"
                  label="描述"
                >
                  <a-input v-model="form.desc" type="textarea" />
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
        </a-spin>
      </a-modal>
    </a-card>
  </div>
</template>
<script>
// 表格全选触发事件
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {},
  onSelect: (record, selected, selectedRows) => {},
  onSelectAll: (selected, selectedRows, changeRows) => {},
};
export default {
  name: "sceneConditions",
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
      queryParam: {},
      columns: [
        {
          title: "序号",
          width: "50px",
          customRender: (item, value, index) => index + 1,
        },
        {
          dataIndex: "name",
          title: "条件名称",
        },
        {
          dataIndex: "details",
          title: "条件类型",
        },
        {
          dataIndex: "info",
          title: "产品名称",
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          width: "160px",
          scopedSlots: { customRender: "action" },
        },
      ],
      dataSource: [{}],
      // 指令表格
      modelColumns: [
        {
          dataIndex: "index",
          title: "功能点",
        },
        {
          dataIndex: "name",
          title: "控制",
        },
      ],
      modelDataSource: [{}],
      rowSelection,
      // 添加编辑弹框
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 21 },
      },
      two: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 },
        },
      },
      form: {},
      visible: false,
      confirmLoading: false,
      loading: false,
    };
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    onChangePagination(e) {
    },
    queryList() {},
    handleOk() {
      this.confirmLoading = true;
      setTimeout(() => {
        this.visible = false;
        this.confirmLoading = false;
      }, 2000);
    },
    handleCancel() {
      this.visible = false;
    },
    handleEdit() {
      this.visible = true;
    },
    handleAdd() {
      this.visible = true;
    },
    handleDelete() {
      this.$confirm({
        content: "确定是否删除!",
        onOk() {},
        onCancel() {},
      });
    },
  },
};
</script>
<style lang="less" scoped></style>
