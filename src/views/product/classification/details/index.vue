<template>
  <a-card :bordered="false">
    <a-page-header :title="title" @back="$multiTab.closeCurrentPage()">
      <a-spin :spinning="confirmLoading">
        <a-card title="基础信息" :bordered="false">
          <a-form-model ref="ruleForm" :model="form" :rules="detailsDisabled ? {} : rules">
            <!-- 分类名称 -->
            <a-row>
              <a-col :span="24">
                <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" :label="$t('productAdm.class.nameZh')" prop="name">
                  <div v-if="detailsDisabled">{{ form.name }}</div>
                  <a-input v-else v-model="form.name" placeholder="请输入名称(中文)" />
                </a-form-model-item>
              </a-col>
              <!-- 分类名称 -->
              <a-col :span="24">
                <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" :label="$t('productAdm.class.nameEn')" prop="nameEn" >
                  <div v-if="detailsDisabled">{{ form.nameEn }}</div>
                  <a-input v-else v-model="form.nameEn" placeholder="请输入名称(英文)"/>
                </a-form-model-item>
              </a-col>
              <!-- 所属父级 -->
              <a-col :span="24">
                <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" :label="$t('productAdm.class.parent')">
                  <div v-if="detailsDisabled">{{ form.parentName }}</div>
                  <a-tree-select
                    v-else
                    v-model="form.parentId"
                    :disabled="isParent"
                    :replaceFields="replaceFields"
                    :tree-data="treeData"
                    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                    style="width: 100%"
                    tree-default-expand-all
                    placeholder="请选择所属父级"
                  >
                  </a-tree-select>
                </a-form-model-item>
              </a-col>
              <!-- 分类图 -->
              <a-col :span="24">
                <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" label="图片" prop="imgFullPath">
                  <a-input v-show="false" v-model="form.imgFullPath" />
                  <upload-img
                    imgDir="classification"
                    :imgSizeMode="2"
                    :imgRequest="true"
                    :propsImgSrc="form.imgFullPath"
                    :disabled="detailsDisabled"
                    imgHint="图片比例1:1,png格式最佳,大小不超过1M"
                    @ok="handleUploadImg"
                  ></upload-img>
                </a-form-model-item>
              </a-col>
              <!-- 描述 -->
              <a-col :span="24">
                <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" :label="$t('public.remark')">
                  <div v-if="detailsDisabled">{{ form.desc }}</div>
                  <input-textarea v-else v-model="form.desc" :maxLength="500" placeholder="请输入备注"></input-textarea>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
        </a-card>
        <a-card title="物模型" v-if="form.parentId" :bordered="false">
          <div class="table-operator" v-if="!detailsDisabled">
            <a-row type="flex" justify="space-between">
              <a-col>
                <a-alert message="请先下载物模型模板，按照模板编辑后，再导入" banner/>
              </a-col>
              <a-col>
                <a-button :disabled="detailsDisabled" @click="downloadTemplate">
                  下载模板
                </a-button>
                <a-divider type="vertical" />
                <vue-xlsx-table :disabled="detailsDisabled" @on-select-file="handleSelectedFile">
                  导 入
                </vue-xlsx-table>
              </a-col>
            </a-row>
          </div>
          <!-- 表格 -->
          <a-table size="small" rowKey="identifier" :data-source="modelItems" :columns="columns" :pagination="false">
            <template slot="required" slot-scope="text, item">
              <div v-if="item.required == 1">是</div>
              <div v-if="item.required == 0">否</div>
            </template>
            <template slot="action" slot-scope="text, item, index">
              <a-button type="link" size="small" icon="delete" v-if="!detailsDisabled" @click="deleteModel(index)" >
                {{ $t("public.delete") }}
              </a-button>
            </template>
          </a-table>
        </a-card>
        <a-card :bordered="false">
          <a-button type="primary" v-if="!detailsDisabled" @click="handleOk">
            确认
          </a-button>
          <a-divider type="vertical" v-if="!detailsDisabled" />
          <a-button type="primary" v-if="detailsDisabled" @click="editForm">
            修改
          </a-button>
          <a-divider type="vertical" v-if="detailsDisabled" />
          <a-button type="danger" v-if="detailsDisabled" @click="handleDel">
            删除
          </a-button>
          <a-divider type="vertical" v-if="detailsDisabled" />
          <a-button @click="$multiTab.closeCurrentPage()"> 取消 </a-button>
        </a-card>
      </a-spin>
    </a-page-header>
  </a-card>
</template>
<script>
import { getClassificationList, getClassificationInfo, addClassification, editClassification, deleteClassification,} from "@/api/product";
import { ZhNameRules, EnNameRules, CommonRules } from "@/utils/validate";
import { getArrayDataName } from "@/utils/util";
export default {
  name: "ClassificationDetails",
  data() {
    return {
      title: "",
      confirmLoading: false,
      columns: [
        { dataIndex: "dpid", title: "dpid" },
        { dataIndex: "identifier", title: "唯一编码" },
        { dataIndex: "name", title: "指令名称" },
        { dataIndex: "rwFlag", title: "数据传输类型" },
        { dataIndex: "dataType", title: "数据类型" },
        { dataIndex: "properties", title: "属性", width: "160px" },
        { dataIndex: "mark", title: "说明", width: "160px" },
        { dataIndex: "required", title: "是否必须", scopedSlots: { customRender: "required" } },
        { title: this.$t("public.action"), key: "action", align: "center", width: "120px", scopedSlots: { customRender: "action" } },
      ],
      // 添加编辑弹框
      labelCol: { xs: { span: 24 }, sm: { span: 3 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 10 } },
      form: {},
      rules: {
        name: ZhNameRules(this.$t("productAdm.class.inputNameZh")),
        nameEn: EnNameRules(this.$t("productAdm.class.inputNameEn")),
        imgFullPath: CommonRules("请上传图片"),
      },
      // 上级菜单选择相关
      treeData: [],
      replaceFields: {
        children: "children",
        title: "name",
        key: "id",
        value: "id",
      },
      id: "",
      modalType: "", // add 添加 details 详情 edit 编辑
      detailsDisabled: false,
      imgInfo: {}, // 图片详细信息
      modelItems: [], // 物模型信息
      isParent: false, // 是否是父级
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      this.id = this.$route.query.id;
      this.modalType = this.$route.query.type;
      if (this.modalType === "add") {
        this.title = "添加产品分类";
      } else if (this.modalType === "details") {
        this.title = "产品分类详情";
        this.detailsDisabled = true;
      } else if (this.modalType === "edit") {
        this.title = "编辑产品分类";
      }
      this.$route.meta.title = this.title;
      let res = await getClassificationList({});
      if (res.code === 0) {
        let data = res.data.list;
        this.childrenNull(data);
        this.treeData = data.map((v) => {
          if (v.id === this.id) {
            this.isParent = true;
          }
          return {
            ...v,
            children: [],
          };
        });
        this.treeData = this.treeData.filter((value) => value.id !== this.id);
        this.treeData.push({ id: "", name: "无" });
      }
      if (!this.id) return;
      this.confirmLoading = true;
      let result = await getClassificationInfo({ id: this.id });
      if (result.code === 0) {
        this.form = result.data;
        this.modelItems = result.data.modelItems;
        // 详情回显展示
        this.form.parentName = getArrayDataName(
          this.form.parentId,
          this.treeData
        );
      }
      this.confirmLoading = false;
    },
    editForm() {
      this.detailsDisabled = false;
      this.title = "编辑产品分类";
      this.$route.meta.title = this.title;
    },
    childrenNull(arr) {
      arr.forEach((v) => {
        if (v.children && v.children.length > 0) {
          this.childrenNull(v.children);
        } else {
          v.children = null;
        }
      });
    },
    handleOk() {
      this.$refs["ruleForm"].validate(async (valid) => {
        if (!valid) return;
        this.confirmLoading = true;
        let res;
        this.form = {
          ...this.form,
          ...this.imgInfo, // 图片详细信息
          modelItems: this.modelItems, // 物模型信息
        };
        if (!this.form.id) {
          res = await addClassification(this.form);
        } else {
          res = await editClassification(this.form);
        }
        this.toast(res);
        this.confirmLoading = false;
        if (
          (this.modalType == "edit" || this.modalType === "add") &&
          res.code === 0
        ) {
          this.$multiTab.closeCurrentPage();
        } else if (this.modalType == "details" && res.code === 0) {
          this.detailsDisabled = true;
          this.title = "产品分类详情";
          this.$route.meta.title = this.title;
        }
      });
    },
    handleDel() {
      this.$Delete(this, "").then((res) => {
        deleteClassification({ id: this.form.id }).then((res) => {
          this.toast(res);
          if (res.code === 0) {
            this.$multiTab.closeCurrentPage();
          }
        });
      });
    },
    // 图片上传
    async handleUploadImg(res) {
      this.$set(this.form, "imgFullPath", res.fullPath);
      this.imgInfo = {
        imgSize: res.size,
        imgPath: res.path,
        imgFullPath: res.fullPath,
        imgName: res.name,
        imgType: res.type,
        Imgkey: res.key,
      };
      this.$refs["ruleForm"].clearValidate(["imgFullPath"]);
    },
    handleSelectedFile(data) {
      let arr = [
        "dpid",
        "identifier",
        "name",
        "rwFlag",
        "dataType",
        "properties",
        "mark",
        "required",
      ];
      let bl = data.header.every((value) => {
        let index = arr.findIndex((item) => {
          return item === value;
        });
        return index !== -1;
      });
      if (bl) {
        this.modelItems = data.body;
      } else {
        this.$notification.error({
          message: "请导入符合模板规则的文件",
        });
      }
    },
    deleteModel(index) {
      this.$confirm({
        title: "确定是否删除",
        content: "删除后，将不可恢复",
        onOk: () => {
          this.modelItems.splice(index, 1);
        },
      });
    },
    downloadTemplate() {
      this.$DownloadTemplate(
        this,
        {
          url: `/v1/platform/web/pm/productType/getModelTemplate`,
        },
        "物模型模板.xlsx"
      ).finally(() => {});
    },
  },
};
</script>
<style lang="less" scoped></style>
