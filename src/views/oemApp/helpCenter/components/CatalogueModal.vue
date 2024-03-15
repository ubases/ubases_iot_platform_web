<template>
  <a-modal :title="modalTitle" :width="640" :visible="visible" :confirm-loading="confirmLoading" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form-model ref="ruleForm" :model="form" :rules="rules">
        <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" label="图标" prop="dirImg">
          <a-input v-show="false" v-model="form.dirImg" />
          <upload-img
            imgDir="appHelpCenter"
            :imgSizeMode="1"
            :imgWidth="120"
            :imgHeight="120"
            :imgRequest="true"
            :propsImgSrc="form.dirImg"
            imgHint="图片120*120px,png格式最佳,大小不超过1M"
            @ok="handleUploadImg"
          ></upload-img>
        </a-form-model-item>
        <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" label="序号" prop="sort">
          <a-input-number placeholder="请输入序号" v-model="form.sort" :min="0" :precision="0"/>
        </a-form-model-item>
        <a-form-model-item v-for="(v, i) in form.docDirLangs" :key="v.lang" :label-col="labelCol" :wrapper-col="wrapperCol" :label="v.langName" :prop="'docDirLangs.' + i + '.dirName'" :rules="langRules(v.lang)">
          <a-input v-model="v.dirName" />
        </a-form-model-item>
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
import { mapGetters } from "vuex";
import { CommonRules, CommonLengthRules, ZH_EN_NUMBER_BLANK_REG, EN_NUMBER_BLANK_REG} from "@/utils/validate";
import { addDocDirectory, eidtDocDirectory, getDocDirectoryDetails} from "@/api/oemApp";
export default {
  data() {
    let langRules = (e) => {
      let rules = CommonLengthRules(1, 50, "字符长度1-50");
      if (e === "zh") {
        rules.push({
          required: true,
          pattern: ZH_EN_NUMBER_BLANK_REG,
          message: "请输入文本内容(中文,英文,数字和空格)",
        });
      } else if (e === "en") {
        rules.push({
          required: true,
          pattern: EN_NUMBER_BLANK_REG,
          message: "请输入文本内容(英文,数字和空格)",
        });
      }
      return rules;
    };
    return {
      modalTitle: "",
      visible: false,
      confirmLoading: false,
      id: "",
      form: {
        id: "",
        parentId: "0",
        dirImg: "",
        docDirLangs: [],
        sort:0
      },
      rules: {
        dirImg: CommonRules("请上传图片"),
      },
      labelCol: { xs: { span: 24 }, sm: { span: 3 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 21 } },
      langRules,
      helpId:'',
    };
  },
  computed: {
    ...mapGetters(["langTypeList"]),
  },
  methods: {
    init({ id = "", parentId = "0", type = "add", helpId=""}) {
      this.visible = true;
      this.confirmLoading = true;
      this.$refs["ruleForm"] && this.$refs["ruleForm"].resetFields();
      this.form.id = id;
      this.form.parentId = parentId;
      this.form.docDirLangs = this.langTypeList.map((value) => {
        return {
          dirName: "",
          lang: value.code,
          langName: value.name,
        };
      });
      if (type === "add") {
        this.modalTitle = "添加目录";
        this.confirmLoading = false;
        this.helpId = helpId
      } else if (type === "edit") {
        this.modalTitle = "编辑目录";
        getDocDirectoryDetails({ id })
          .then((res) => {
            if (res.code !== 0) return;
            this.form.id = res.data.id || id;
            this.form.sort = res.data.sort;
            this.form.parentId = res.data.parentId;
            this.form.dirImg = res.data.dirImg;
            this.form.docDirLangs = this.langTypeList.map((v) => {
              let obj = {
                lang: v.code,
                langName: v.name,
                dirName: "",
              };
              res.data.docDirLangs.some((item) => {
                if (item.lang === v.code) {
                  obj.dirName = item.dirName;
                  return true;
                }
              });
              return obj;
            });
          })
          .finally(() => {
            this.confirmLoading = false;
          });
      }
    },
    handleOk() {
      this.$refs["ruleForm"].validate((res) => {
        if (!res) return;
        this.confirmLoading = true;
        this.form.sort = Number(this.form.sort) || 1
        const param = {...this.form,helpId:this.helpId}
        if (this.form.id) {
          eidtDocDirectory(param)
            .then((res) => {
              this.toast(res);
              if (res.code === 0) {
                this.visible = false;
                this.$emit("ok");
              }
            })
            .finally(() => {
              this.confirmLoading = false;
            });
        } else {
          addDocDirectory(param)
            .then((res) => {
              this.toast(res);
              if (res.code === 0) {
                this.visible = false;
                this.$emit("ok");
              }
            })
            .finally(() => {
              this.confirmLoading = false;
            });
        }
      });
    },
    handleCancel() {
      this.visible = false;
    },
    // 图片上传
    handleUploadImg(res) {
      this.$set(this.form, "dirImg", res.fullPath);
      this.$refs["ruleForm"].clearValidate(["dirImg"]);
    },
  },
};
</script>
<style lang="less" scoped>
.ant-input-number{
  width: 100%;
}
</style>
