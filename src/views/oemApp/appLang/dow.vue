<template>
  <a-card :bordered="false">
    <a-spin :spinning="infoLoading">
      <a-space style="width: 100%" align="center" direction="vertical" v-if="!langInfo.id">
        <a-button type="primary" icon="plus" @click="visible = true">
          上传语言包
        </a-button>
        <a-alert message="上传前，请确保测试环境下，语音包显示正常" banner />
      </a-space>
      <div class="app-lang" v-else>
        <div>
          <div class="app-lang-title">{{ langInfo.packageName }}</div>
          <div>支持语种：{{ langInfo.langsDesc }}</div>
          <div>上传时间：{{ langInfo.updatedAt | momentFilter }}</div>
          <div>上传人：{{ langInfo.uploadUser }}</div>
        </div>
        <div>
          <a-button @click="downloadLang">下载查看</a-button>
          <br />
          <a-button type="primary" @click="visible = true"> 重新上传 </a-button>
        </div>
      </div>
    </a-spin>
    <a-modal title="上传语言包" :width="640" :visible="visible" :confirm-loading="confirmLoading" @ok="handleOk" @cancel="handleCancel">
      <a-spin :spinning="confirmLoading">
        <a-form-model ref="ruleForm" :model="form" :rules="rules">
          <!-- 语言包名称 -->
          <a-row>
            <a-col>
              <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" label="语言包名称" prop="packageName">
                <a-input placeholder="请输入语言包名称" v-model="form.packageName"/>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col>
              <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" label="上传文件" prop="fileName">
                <input type="text" v-show="false" v-model="form.fileName" />
                <upload-file
                  fileIcon="icon-excel"
                  fileHint="请注意文件总的表头已区分语种，方便系统自动识别语种,且不超过10M"
                  :fileType="[
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'application/vnd.ms-excel',
                  ]"
                  :propsAccept="['.xls', '.xlsx']"
                  :propsFileName="form.fileName"
                  :fileSize="10"
                  @ok="onChangeExcelFile"
                ></upload-file>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </a-spin>
    </a-modal>
  </a-card>
</template>
<script>
import { CommonNameRules, CommonRules } from "@/utils/validate";
import { getAppLangDetails, addAppLang } from "@/api/oemApp";
export default {
  name: "AppLang",
  data() {
    return {
      visible: false,
      confirmLoading: false,
      form: {},
      rules: {
        packageName: CommonNameRules("请输入语言包名称"),
        fileName: CommonRules("请选择语言包文件"),
      },
      labelCol: { xs: { span: 24 }, sm: { span: 4 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 20 }},
      fileList: [],
      infoLoading: false,
      langInfo: {},
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.infoLoading = true;
      getAppLangDetails({ belongType: "3" })
        .then((res) => {
          if (res.code === 0) {
            this.langInfo = res.data || {};
          }
        })
        .finally(() => {
          this.infoLoading = false;
        });
    },
    handleOk() {
      this.$refs["ruleForm"].validate(async (valid) => {
        if (!valid) return;
        this.confirmLoading = true;
        const formData = new FormData();
        formData.append("file", this.form.file);
        formData.append("belongType", 3);
        formData.append("packageName", this.form.packageName);
        let res = await addAppLang(formData);
        this.confirmLoading = false;
        if (res.code === 0) {
          this.visible = false;
          this.form = {};
          this.init();
        }
      });
    },
    handleCancel() {
      this.visible = false;
      this.form = {};
      this.$refs["ruleForm"].clearValidate(["packageName"]);
      this.$refs["ruleForm"].clearValidate(["fileName"]);
    },
    // 文档获取
    onChangeExcelFile(res) {
      // 获取文件名展示
      this.form = {
        ...this.form,
        file: res.file,
        fileName: res.name,
      };
      this.$refs["ruleForm"].clearValidate(["fileName"]);
    },
    // 文档下载
    downloadLang() {
      this.infoLoading = true;
      this.$DownloadTemplate(
        this,
        {
          url: `/v1/platform/web/lang/appResources/download`,
          method: "get",
          belongType: 3,
        },
        this.langInfo.packageName + ".xlsx"
      ).finally(() => {
        this.infoLoading = false;
      });
    },
  },
};
</script>
<style lang="less" scoped>
.app-lang {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .app-lang-title {
    font-size: 18px;
    font-weight: 900;
    color: @app-theme-color;
  }
  & > div {
    display: flex;
    flex-direction: column;
    div {
      line-height: 30px;
    }
  }
}
</style>
