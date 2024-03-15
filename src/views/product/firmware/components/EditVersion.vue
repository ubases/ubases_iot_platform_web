<template>
  <a-modal :title="modalTitle" :width="800" :visible="visible" :confirm-loading="confirmLoading" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form-model ref="ruleForm" :model="form" :rules="rules">
        <a-row>
          <a-col>
            <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" :label="$t('firmware.SDKName')">
              <span>{{ form.firmwareName }}</span>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col>
            <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" :label="$t('firmware.latestVersion')">
              <span>{{ form.newVersion }}</span>
            </a-form-model-item>
          </a-col>
        </a-row>
        <!-- 版本号 -->
        <a-row>
          <a-col>
            <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" :label="$t('firmware.version')" prop="version">
              <a-input v-model="form.version" placeholder="例如：1.0.1" />
              <div style="color: #ccc">版本号格式：xx.xx.xx</div>
            </a-form-model-item>
          </a-col>
        </a-row>
        <!-- 备注 -->
        <a-row>
          <a-col>
            <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" label="版本描述" prop="desc">
              <input-textarea v-model="form.desc" @input="$refs['ruleForm'].clearValidate(['desc'])" placeholder="请输入版本描述"></input-textarea>
            </a-form-model-item>
          </a-col>
        </a-row>
        <!-- 文档 -->
        <a-row>
          <a-col>
            <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" label="资源包" prop="zipFileName">
              <a-input v-show="false" v-model="form.zipFileName" />
              <upload-file
                fileDir="firmwareDoc"
                fileIcon="folder"
                fileHint="资源包为zip格式,且不超过10M"
                :fileType="['application/x-zip-compressed','application/octet-stream','application/zip','application/x-zip']"
                :propsAccept="['.zip']"
                :propsFileName="form.zipFileName"
                :propsFileSrc="''"
                :fileSize="10"
                :isRequest="true"
                @ok="$e=>onChangeFile($e,'zip')"
              ></upload-file>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col>
            <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" label="OTA包" prop="fileName">
              <a-input v-show="false" v-model="form.fileName" />
              <upload-file
                fileDir="firmwareDoc"
                fileIcon="folder"
                fileHint="固件为bin格式,且不超过10M"
                :fileType="['application/x-zip-compressed','application/octet-stream','application/zip','application/x-zip']"
                :propsAccept="['.bin']"
                :propsFileName="form.fileName"
                :propsFileSrc="''"
                :fileSize="10"
                :isRequest="true"
                @ok="$e=>onChangeFile($e,'bin')"
              ></upload-file>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col>
              <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" label="关键版本" prop="isMust">
                <a-radio-group v-model="form.isMust" :options="$DictList('yes_no')" />
              </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-spin>
    <template #footer>
      <a-button key="back" @click="handleCancel">取消</a-button>
      <a-divider type="vertical" />
      <a-button key="submit" type="primary" @click="handleOk" :loading="confirmLoading">
        确定
      </a-button>
    </template>
  </a-modal>
</template>
<script>
import { addFirmwareVersions, editFirmwareVersions } from "@/api/product";
import { VersionRules, CommonRules } from "@/utils/validate";
export default {
  name: "EditVersion",
  data() {
    return {
      type: "",
      modalTitle: "",
      visible: false,
      confirmLoading: false,
      form: {
        version: "",
        desc: "",
      },
      labelCol: { xs: { span: 24 }, sm: { span: 6 }},
      wrapperCol: { xs: { span: 24 }, sm: { span: 18 }},
      rules: {
        version: VersionRules(this.$t("firmware.inputVersionName")),
        desc: CommonRules("请输入版本描述"),
        zipFileName: CommonRules("请上传资源包"),
        fileName: CommonRules(this.$t("firmware.uploadPakage")),
        isMust:CommonRules("请选择是否关键版本",'number'),
      },
    };
  },
  watch: {
    visible: function (newData, oldData) {
      if (newData) {
      }
    },
  },
  computed: {
    // 上传文档
    uploadFileOptions() {
      return {
        multiple: false,
        customRequest: this.handCustomerRequest,
        beforeUpload: this.beforeFileUpload,
      };
    },
  },
  methods: {
    init(type, data) {
      this.type = type;
      if (type === "add") {
        this.modalTitle = "添加固件版本";
      } else if (type === "edit") {
        this.modalTitle = "编辑固件版本";
      }
      this.form = data;
      this.$refs["ruleForm"] && this.$refs["ruleForm"].clearValidate();
      this.visible = true;
    },
    handleOk() {
      this.$refs["ruleForm"].validate(async (valid) => {
        if (!valid) return;
        this.confirmLoading = true;
        let res;
        if (this.form.id) {
          // 固件版本编辑
          res = await editFirmwareVersions(this.form);
        } else {
          // 固件版本添加
          res = await addFirmwareVersions(this.form);
        }
        this.confirmLoading = false;
        this.toast(res);
        if (res.code === 0) {
          this.visible = false;
          this.$emit("ok");
        }
      });
    },
    handleCancel() {
      this.visible = false;
    },
    onChangeFile(res,type) {
      if(type === 'bin'){
      this.$set(this.form, "filePath", res.fullPath);
      this.$set(this.form, "fileKey", res.key);
      this.$set(this.form, "fileSize", res.size);
      this.$set(this.form, "fileName", res.name);
      this.$refs["ruleForm"].clearValidate(["fileName"]);
      } else if(type==='zip'){
        this.$set(this.form, "zipFilePath", res.fullPath);
        this.$set(this.form, "zipFileKey", res.key);
        this.$set(this.form, "zipFileSize", res.size);
        this.$set(this.form, "zipFileName", res.name);
        this.$refs["ruleForm"].clearValidate(["zipFileName"]);
      }
    },
  },
};
</script>
