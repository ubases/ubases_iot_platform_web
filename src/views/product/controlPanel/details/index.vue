<template>
  <a-card :bordered="false">
    <a-page-header :title="title" @back="$multiTab.closeCurrentPage()">
      <a-spin :spinning="confirmLoading">
        <a-form-model ref="ruleForm" :model="form" :rules="formDisabled ? {} : rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item label="面板名称(中文)" prop="name">
            <div v-if="formDisabled">{{ form.name }}</div>
            <a-input v-else v-model="form.name" placeholder="请输入面板名称(中文)" />
          </a-form-model-item>
          <a-form-model-item label="面板名称(英文)" prop="nameEn">
            <div v-if="formDisabled">{{ form.nameEn }}</div>
            <a-input v-else v-model="form.nameEn" placeholder="请输入面板名称(英文)" />
          </a-form-model-item>
          <a-form-model-item label="面板编码" prop="code">
            <div v-if="formDisabled">{{ form.code }}</div>
            <a-input v-else v-model="form.code" placeholder="请输入面板编码" />
          </a-form-model-item>
          <a-form-model-item label="选择产品分类" prop="productTypeId">
            <div v-if="formDisabled">{{ form.productTypeName ? form.productTypeName : "无" }}</div>
            <!-- 详情或者产品类型已发布则不可编辑 -->
            <a-tree-select
              v-else
              placeholder="请选择产品分类"
              tree-default-expand-all
              :disabled="productStatus === 1"
              v-model="form.productTypeId"
              :replaceFields="{
                children: 'children',
                title: 'name',
                key: 'id',
                value: 'id',
              }"
              :tree-data="productTypeList"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :allowClear="true"
              @change="onChangeProductType"
            >
            </a-tree-select>
          </a-form-model-item>
          <a-form-model-item label="选择产品类型">
            <div v-if="formDisabled">
              {{ form.productId ? form.productName : "无" }}
              <span v-if="form.productId">
                {{ $DictName("product_release", productStatus) }}
              </span>
            </div>
            <a-select v-else placeholder="请选择产品类型" :disabled="formDisabled || productStatus == 1" v-model="form.productId" @change="onChangeProduct" :allowClear="true">
              <a-select-option v-for="v in productList" :key="v.id" :value="v.id">
                {{ v.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <!-- 文件包 -->
          <a-form-model-item label="文件包" prop="urlName">
            <input type="text" v-show="false" v-model="form.urlName" />
            <upload-file
              fileIcon="icon-zip"
              fileHint="必须为zip格式,且不超过2M"
              :fileType="['application/x-zip-compressed','application/octet-stream','application/zip','application/x-zip']"
              :disabled="formDisabled"
              :propsAccept="['.zip']"
              :propsFileName="form.urlName"
              :fileSize="2"
              :propsFileSrc="form.url"
              :download="form.url?true:false"
              :propsImgSrc="form.url"
              @ok="onChangeZipFile"
            ></upload-file>
          </a-form-model-item>
          <!-- 预览图 -->
          <a-form-model-item label="预览图" prop="previewUrl">
            <input type="text" v-show="false" v-model="form.previewUrl" />
            <upload-img 
            :imgRequest="false" 
            :propsImgSrc="form.previewUrl" 
            :disabled="formDisabled" 
            :download="form.previewUrl?true:false"
            propsFileName="控制面板预览图"
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
              :disabled="formDisabled"
              :download="form.id&&form.langFileName?true:false"
              :propsFileName="form.langFileName"
              :fileSize="2"
              @ok="onChangeExcelFile"
              @download="downloadLang"
            ></upload-file>
          </a-form-model-item>
          <!-- 描述 -->
          <a-form-model-item label="描述">
            <div v-if="formDisabled">{{ form.desc }}</div>
            <input-textarea v-else v-model="form.desc" placeholder="请输入描述">
            </input-textarea>
          </a-form-model-item>
          <a-form-model-item :wrapper-col="{ span: 14, offset: 3 }">
            <!-- 添加 编辑提交按钮 -->
            <a-button type="primary" v-if="!formDisabled" @click="submit">
              确认
            </a-button>
            <a-divider type="vertical" v-if="!formDisabled" />
            <!-- 详情切换为编辑按钮 -->
            <a-button type="primary" v-if="formDisabled" @click="editForm">
              修改
            </a-button>
            <a-divider type="vertical" v-if="formDisabled" />
            <!-- 详情删除按钮 -->
            <a-button type="danger" v-if="formDisabled" :disabled="productStatus === 1" @click="handleDelete" >
              删除
            </a-button>
            <a-divider type="vertical" v-if="formDisabled" />
            <a-button @click="$multiTab.closeCurrentPage()"> 取消 </a-button>
          </a-form-model-item>
        </a-form-model>
      </a-spin>
    </a-page-header>
  </a-card>
</template>
<script>
import { addControlPanel, getClassificationList, getProductList, getControlPanelDetails, editControlPanel, deleteControlPanel} from "@/api/product";
import { ZhNameRules, EnNameRules, CommonRules } from "@/utils/validate";
export default {
  name: "ControlPanelDetails",
  data() {
    return {
      id: "",
      type: "",
      title: "",
      form: {
        previewUrl: "",
        urlName: "",
        langFileName: "",
      },
      rules: {
        name: ZhNameRules("请输入控制面板中文名称"),
        nameEn: EnNameRules("请输入控制面板英文名称"),
        productTypeId: CommonRules("请选择产品分类"),
        code:[
          { required: true, message:'请输入面板编码'},
          { required: true, pattern: /^[A-Za-z0-9_-]+$/, message: "限制英文、数字、中划线、下划线"}
        ],
        urlName: CommonRules("请选择文件"),
        previewUrl: CommonRules("请选择预览图"),
        langFileName: CommonRules("请选择语言包"),
      },
      confirmLoading: false,
      formDisabled: false,
      // 添加编辑弹框
      labelCol: { xs: { span: 24 }, sm: { span: 3 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 10 }},
      productTypeList: [],
      productList: [],
      productStatus: null,
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      this.id = this.$route.query.id || "";
      this.type = this.$route.query.type;
      let classRes = await getClassificationList({});
      if (classRes.code === 0) {
        this.productTypeList = classRes.data?.list?.map(item=>{
          return {
            ...item,
            disabled: true
          }
        });
      }
      if (this.type === "add") {
        this.title = "添加控制面板";
      } else if (this.type === "edit") {
        this.title = "编辑控制面板";
      } else if (this.type === "details") {
        this.title = "控制面板详情";
        this.formDisabled = true;
      }
      this.$route.meta.title = this.title;
      if (!this.id) return;
      // 详情 编辑
      this.confirmLoading = true;
      let res = await getControlPanelDetails(this.id);
      if (res.code === 0) {
        this.form = res.data;
        // 产品类型是否发布
        this.productStatus = res.data.productStatus;
      }
      // 获取产品类型列表
      let result = await getProductList({
        attributeType: -1,
        productTypeId: this.form.productTypeId,
        status: -1,
      });
      if (result.code === 0) {
        this.productList = result.data.list || [];
      }
      this.confirmLoading = false;
    },
    onChangeProductType(productTypeId) {
      this.form = {
        ...this.form,
        productId: "",
      };
      getProductList({
        attributeType: -1,
        productTypeId,
        status: -1,
      }).then((res) => {
        if (res.code == 0) {
          this.productList = res.data.list || [];
        }
      });
    },
    onChangeProduct() {
      this.$refs["ruleForm"].clearValidate(["productId"]);
    },
    submit() {
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
        if (this.form.langFile) {
          formData.append("langFile", this.form.langFile);
        }
        if (this.form.id) {
          formData.append("id", this.form.id);
        }
        if (this.form.productId) {
          formData.append("productId", this.form.productId);
        }
        if (this.form.productTypeId) {
          formData.append("productTypeId", this.form.productTypeId);
        }
        formData.append("name", this.form.name);
        formData.append("nameEn", this.form.nameEn);
        formData.append("code", this.form.code);
        formData.append("productTypeId", this.form.productTypeId);
        formData.append("desc", this.form.desc || "");
        this.confirmLoading = true;
        let res;
        if (this.form.id) {
          res = await editControlPanel(formData);
        } else {
          res = await addControlPanel(formData);
        }
        this.toast(res);
        this.confirmLoading = false;
        if ((this.type === "edit" || this.type === "add") && res.code === 0) {
          this.$multiTab.closeCurrentPage();
        } else if (this.type === "details" && res.code === 0) {
          this.formDisabled = true;
          this.title = "控制面板详情";
          this.$route.meta.title = this.title;
        }
      });
    },
    handleDelete() {
      this.$confirm({
        title: "确定是否删除",
        content: "删除后，将不可恢复",
        onOk: () => {
          deleteControlPanel(this.id).then((res) => {
            if (res.code === 0) {
              this.$multiTab.closeCurrentPage(); // 删除成功则关闭当前页面
            }
            this.toast(res);
          });
        },
      });
    },
    // 语言包文档下载
    downloadLang() {
      this.confirmLoading = true;
      this.$DownloadTemplate(
        this,
        {
          url: `/v1/platform/web/lang/appResources/download`,
          method: "get",
          belongType: 4,
          belongId: this.form.id,
        },
        this.form.langFileName + ".xlsx"
      ).finally(() => {
        this.confirmLoading = false;
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
    editForm() {
      this.title = "编辑控制面板";
      this.$route.meta.title = this.title;
      this.formDisabled = false;
    },
  },
};
</script>
<style lang="less" scoped>
// .file-upload {
//   display: flex;
//   align-items: center;
  /deep/.file-name {
    // margin-right: 10px;
    // text-decoration: underline;
    display: flex;
    .name{
      margin-right: 10px;
    }
  }
  .preview-img {
    width: 100px;
    margin-right: 10px;
    border: 1px solid #ccc;
    cursor: pointer;
  }
// }

</style>
