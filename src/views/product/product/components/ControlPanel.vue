<template>
  <div class="aithings-control-panel">
    <div style="padding-bottom: 10px">
      {{ `已关联控制面板(${controlPanelRows.length}个)` }}
      <a-button
        v-if="!disabled"
        :disabled="!productTypeId"
        style="margin-left: 10px"
        type="primary"
        icon="plus"
        @click="showControlPanel"
      >
        添加控制面板
      </a-button>
      <a-divider type="vertical" v-if="!disabled" />
      <a-button v-if="!disabled" :disabled="!productTypeId" @click="init">
        刷新
      </a-button>
    </div>
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
      :loading="loading"
      :data-source="dataSource"
      :columns="dataColumns"
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
      <template slot="previewUrl" slot-scope="text, item">
        <img
          :src="item.previewUrl"
          style="width: 100px"
          @click="$PreviewModal({ url: item.previewUrl })"
        />
      </template>
    </a-table>
    <a-modal
      title="添加控制面板"
      :width="640"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @cancel="handleCancel"
    >
      <a-spin :spinning="confirmLoading">
        <a-form-model
          ref="ruleForm"
          :model="form"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <!-- 名称 -->
          <a-form-model-item label="面板名称(中文)" prop="name">
            <a-input v-model="form.name" />
          </a-form-model-item>
          <a-form-model-item label="面板名称(英文)" prop="nameEn">
            <a-input v-model="form.nameEn" />
          </a-form-model-item>
          <a-form-model-item label="面板编码" prop="code">
            <a-input v-model="form.code" placeholder="请输入面板编码" />
          </a-form-model-item>
          <!-- 选择产品 -->
          <a-form-model-item label="选择产品分类" prop="productTypeId">
            <!-- 详情或者产品类型已发布则不可编辑 -->
            <a-tree-select
              placeholder="请选择产品分类"
              disabled
              tree-default-expand-all
              v-model="form.productTypeId"
              :replaceFields="{
                children: 'children',
                title: 'name',
                key: 'id',
                value: 'id',
              }"
              :tree-data="productTypeList"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            >
            </a-tree-select>
          </a-form-model-item>
          <!-- 文件包 -->
          <a-form-model-item label="文件包" prop="urlName">
            <input type="text" v-show="false" v-model="form.urlName" />
            <upload-file
              fileIcon="icon-zip"
              fileHint="必须为zip格式,且不超过2M"
              :fileType="['application/x-zip-compressed','application/octet-stream','application/zip','application/x-zip']"
              :propsAccept="['.zip']"
              :propsFileName="form.urlName"
              :fileSize="2"
              @ok="onChangeZipFile"
            ></upload-file>
          </a-form-model-item>
          <!-- 预览图 -->
          <a-form-model-item label="预览图" prop="previewUrl">
            <input type="text" v-show="false" v-model="form.previewUrl" />
            <upload-img
              :imgRequest="false"
              :propsImgSrc="form.previewUrl"
              imgHint="建议3:4,png格式最佳,大小不超过1M"
              @ok="handleUploadImg"
            ></upload-img>
          </a-form-model-item>
          <!-- 语言包 -->
          <a-form-model-item label="语言包" prop="langFileName">
            <input type="text" v-show="false" v-model="form.langFileName" />
            <upload-file
              fileIcon="icon-excel"
              fileHint="必须为xls,csv格式,且不超过2M"
              :fileType="[
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-excel',
                'text/csv',
              ]"
              :propsAccept="['.xls', '.xlsx', '.csv']"
              :propsFileName="form.langFileName"
              :fileSize="2"
              @ok="onChangeExcelFile"
            ></upload-file>
          </a-form-model-item>
          <!-- 描述 -->
          <a-form-model-item label="描述">
            <input-textarea v-model="form.desc"> </input-textarea>
          </a-form-model-item>
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
  </div>
</template>
<script>
import { getControlPanelList, addControlPanel } from "@/api/product";
import { ZhNameRules, EnNameRules, CommonRules } from "@/utils/validate";
export default {
  props: {
    productTypeId: {
      type: String,
      default: "",
    },
    productTypeList: {
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
      loading: false,
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
      dataSource: [],
      dataColumns: [
        {
          dataIndex: "name",
          title: "面板名称",
        },
        {
          dataIndex: "previewUrl",
          title: "预览图",
          scopedSlots: { customRender: "previewUrl" },
        },
      ],
      controlPanelRows: [],
      selectedRowKeys: [],
      // 添加控制面板
      visible: false,
      confirmLoading: false,
      form: {
        previewUrl: "",
        urlName: "",
        langFileName: "",
      },
      rules: {
        name: ZhNameRules("请输入控制面板中文名称"),
        nameEn: EnNameRules("请输入控制面板英文名称"),
        code:[
          { required: true, message:'请输入面板编码'},
          { required: true, pattern: /^[A-Za-z0-9_-]+$/, message: "限制英文、数字、中划线、下划线"}
        ],
        productTypeId: CommonRules("请选择产品分类"),
        urlName: CommonRules("请选择文件"),
        previewUrl: CommonRules("请选择预览图"),
        langFileName: CommonRules("请选择语言包"),
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };
  },
  created() {},
  watch: {
    productTypeId: {
      handler: function (newData, oldData) {
        // 当新旧都有值则为切换了产品分类
        if (newData && oldData) {
          this.controlPanelRows = []; // 数据初始化
          this.selectedRowKeys = []; // 数据初始化
        }
        this.init();
        this.form.productTypeId = newData;
      },
      immediate: true,
    },
    formData: {
      handler: function (newData, oldData) {
        if (newData && newData.id && newData.controlPanelIds) {
          // 迎合数据
          this.controlPanelRows = newData.controlPanelIds.map((v) => {
            return { id: v };
          });
          // 选中回显
          this.selectedRowKeys = newData.controlPanelIds;
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
      if (!this.productTypeId) return;
      this.queryParam.query.productTypeId = this.productTypeId;
      this.queryParam.query.productId = this.formData.id || ""; // 编辑-需要传id
      this.queryParam.query.status = 1; // 查询已启用
      this.queryParam.query.associate = 1; // 查询未被关联
      this.loading = true;
      getControlPanelList(this.queryParam).then((res) => {
        if (res.code === 0) {
          this.dataSource = res.data.list;
          this.pagination.total = res.data.total;
        } else {
          this.toast(res);
        }
        this.loading = false;
      });
    },
    onSelectChange(value, rows, e) {
      // 已选中的
      this.controlPanelRows = [...this.controlPanelRows, ...rows];
      // 未选中的 剔除
      let arrIds = rows.map((v) => v.id);
      let noArr = this.dataSource.filter((v) => !arrIds.includes(v.id));
      let noArrIds = noArr.map((v) => v.id);
      this.controlPanelRows = this.controlPanelRows.filter(
        (v) => !noArrIds.includes(v.id)
      );
      // 有重复 去重
      this.controlPanelRows = this.removeDuplicate(this.controlPanelRows);
      // 选中回显
      this.selectedRowKeys = this.controlPanelRows.map((v) => {
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
    // 显示添加控制面板弹框
    showControlPanel() {
      this.visible = true;
      this.form = {
        ...this.form,
        productId: this.formData.id || "",
        name: "",
        nameEn: "",
        code:"",
        desc: "",
        previewUrl: "",
        urlName: "",
        langFileName: "",
        panelFile: {},
        panelPreview: {},
        langFile: {},
        status: 1,
      };
    },
    handleCancel() {
      this.visible = false;
    },
    handleOk() {
      this.$refs["ruleForm"].validate(async (valid) => {
        if (!valid) return;
        const formData = new FormData();
        // 如果有重新选择文件则添加file
        if (this.form.panelFile) {
          formData.append("panelFile", this.form.panelFile);
        }
        if (this.form.panelPreview) {
          formData.append("panelPreview", this.form.panelPreview);
        }
        if (this.form.productId) {
          formData.append("productId", this.form.productId);
        }
        if (this.form.langFile) {
          formData.append("langFile", this.form.langFile);
        }
        formData.append("name", this.form.name);
        formData.append("nameEn", this.form.nameEn);
        formData.append("code", this.form.code);
        formData.append("productTypeId", this.form.productTypeId);
        formData.append("status", this.form.status);
        formData.append("desc", this.form.desc || "");
        this.confirmLoading = true;
        let res = await addControlPanel(formData);
        this.toast(res);
        this.confirmLoading = false;
        if (res.code === 0) {
          this.init();
          this.handleCancel();
        }
      });
    },
    // 文档获取
    onChangeZipFile(res) {
      this.form.panelFile = res.file;
      // 获取文件名展示
      this.form = {
        ...this.form,
        urlName: res.name,
      };
      this.$refs["ruleForm"].clearValidate(["urlName"]);
    },
    // 语言包获取
    onChangeExcelFile(res) {
      this.form.langFile = res.file;
      // 获取文件名展示
      this.form = {
        ...this.form,
        langFileName: res.name,
      };
      this.$refs["ruleForm"].clearValidate(["langFileName"]);
    },
    handleUploadImg(res) {
      this.$set(this.form, "previewUrl", res.src);
      this.$set(this.form, "panelPreview", res.file);
      this.$refs["ruleForm"].clearValidate(["previewUrl"]);
    },
  },
};
</script>
<style lang="less" scoped></style>
