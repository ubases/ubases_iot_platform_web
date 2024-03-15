<template>
  <a-card :bordered="false">
    <a-page-header :title="title" @back="$multiTab.closeCurrentPage()">
      <a-spin :spinning="confirmLoading">
        <a-form-model ref="ruleForm" :model="form" :rules="formDisabled ? {} : rules" :label-col="labelCol" :wrapper-col="wrapperCol" >
          <a-form-model-item label="菜单名称" prop="name">
            <div v-if="formDisabled">{{ form.name }}</div>
            <a-input v-else placeholder="请输入菜单名称" v-model="form.name" />
          </a-form-model-item>
          <a-form-model-item label="是否必须" prop="required">
            <div v-if="formDisabled">
              {{ $DictName("yes_no", form.required) }}
            </div>
            <a-radio-group v-if="!formDisabled" v-model="form.required" :options="$DictList('yes_no')" @change="resetValid('required')" />
            <span v-if="!formDisabled" style="color: #ccc">
              通常只有主页和个人中心是必须的菜单
            </span>
          </a-form-model-item>
          <a-form-model-item label="菜单标识" prop="menuKey">
            <div v-if="formDisabled">
              {{ $DictName("oem_app_menu_key", form.menuKey) }}
            </div>
            <a-select v-else placeholder="请选择菜单标识" v-model="form.menuKey">
              <a-select-option v-for="v in $DictList('oem_app_menu_key')" :key="v.key" :value="v.key">
                {{ v.label }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="位置" prop="position">
            <div v-if="formDisabled">
              {{ $DictName("oem_app_menu_position", form.position) }}
            </div>
            <a-select v-else placeholder="请选择菜单标识" v-model="form.position">
              <a-select-option v-for="v in $DictList('oem_app_menu_position')" :key="v.key" :value="v.key">
                {{ v.label }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="默认状态" prop="defImage">
            <a-input v-show="false" v-model="form.defImage" />
            <upload-img imgDir="appMenu" :imgRequest="true" :propsImgSrc="form.defImage" :disabled="formDisabled" imgHint=" 建议72*72像素,png格式最佳,大小不超过1M" @ok="handleUploadImg"></upload-img>
          </a-form-model-item>
          <a-form-model-item label="选中状态" prop="selImage">
            <a-input v-show="false" v-model="form.selImage" />
            <upload-img imgDir="appMenu" :imgRequest="true" :propsImgSrc="form.selImage" :disabled="formDisabled" imgHint=" 建议72*72像素,png格式最佳,大小不超过1M" @ok="handleUploadSelImg"></upload-img>
          </a-form-model-item>
          <a-form-model-item :wrapper-col="{ span: 14, offset: 3 }">
            <a-button type="primary" v-if="type === 'add' || type === 'edit'" @click="submit" >
              确认
            </a-button>
            <a-divider type="vertical" v-if="type === 'add' || type === 'edit'"/>
            <a-button @click="$multiTab.closeCurrentPage()"> 取消 </a-button>
          </a-form-model-item>
        </a-form-model>
      </a-spin>
    </a-page-header>
  </a-card>
</template>
<script>
import { addFooterMenu, editFooterMenu } from "@/api/oemApp";
import { CommonNameRules, CommonRules } from "@/utils/validate";
export default {
  name: "FooterMenuDetails",
  data() {
    return {
      title: "添加底部菜单栏",
      type: "",
      form: {},
      formDisabled: false,
      rules: {
        name: CommonNameRules("请输入菜单名称"),
        required: CommonRules("请选择是否必须", "number"),
        menuKey: CommonRules("请选择菜单标识"),
        position: CommonRules("请输入排序", "number"),
        defImage: CommonRules("请上传图片"),
        selImage: CommonRules("请上传图片"),
      },
      confirmLoading: false,
      labelCol: { xs: { span: 24 }, sm: { span: 3 }},
      wrapperCol: { xs: { span: 24 }, sm: { span: 10 }},
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.form = JSON.parse(this.$route.query.data);
      this.type = this.$route.query.type;
      if (this.type === "add") {
        this.title = "添加底部菜单栏";
      } else if (this.type === "details") {
        this.title = "底部菜单栏详情";
        this.formDisabled = true;
      } else if (this.type === "edit") {
        this.title = "编辑底部菜单栏";
      }
      this.$route.meta.title = this.title;
    },
    // 图片上传
    handleUploadImg(res) {
      this.$set(this.form, "defImage", res.fullPath);
      this.$refs["ruleForm"].clearValidate(["defImage"]);
    },
    handleUploadSelImg(res) {
      this.$set(this.form, "selImage", res.fullPath);
      this.$refs["ruleForm"].clearValidate(["selImage"]);
    },
    submit() {
      this.$refs["ruleForm"].validate(async (valid) => {
        if (!valid) return;
        let res;
        if (this.form.id) {
          res = await editFooterMenu(this.form);
        } else {
          res = await addFooterMenu(this.form);
        }
        if (res.code === 0) {
          this.$multiTab.closeCurrentPage();
        }
        this.toast(res);
      });
    },
    // 重置校验
    resetValid(key){
      console.log(key)
      this.$refs["ruleForm"].validateField(key)
    },
  },
};
</script>
<style lang="less" scoped></style>
