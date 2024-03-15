<template>
  <div>
    <a-modal
      width="960px"
      :title="title"
      :visible="visible"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
    >
      <a-spin :spinning="confirmLoading">
        <a-form-model ref="ruleForm" :model="form" :rules="rules">
          <!-- 上级菜单 菜单图标 -->
          <a-row>
            <a-col :span="12">
              <a-form-model-item
                :label-col="two.labelCol"
                :wrapper-col="two.wrapperCol"
                :label="$t('authorityAdm.munu.PreviousMenu')"
              >
                <a-tree-select
                  v-model="form.parentId"
                  :replaceFields="replaceFields"
                  :tree-data="treeData"
                  :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                  style="width: 100%"
                  allow-clear
                  tree-default-expand-all
                  :disabled="formDisabled"
                  placeholder="请选择上级菜单"
                >
                </a-tree-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item
                :label-col="two.labelCol"
                :wrapper-col="two.wrapperCol"
                :label="$t('authorityAdm.munu.icon')"
                prop="icon"
              >
                <div
                  v-if="form.icon"
                  @click="selectIcon"
                  class="aithings-microcheiria"
                >
                  <icon-font style="font-size: 18px" :type="form.icon" />
                </div>
                <a-button v-else @click="selectIcon" type="link">
                  选择图标
                </a-button>
              </a-form-model-item>
            </a-col>
          </a-row>
          <!-- 菜单类型  菜单状态 -->
          <a-row>
            <a-col :span="12">
              <a-form-model-item
                :label-col="two.labelCol"
                :wrapper-col="two.wrapperCol"
                :label="$t('authorityAdm.munu.type')"
                prop="menuType"
              >
                <a-radio-group v-model="form.menuType" :disabled="formDisabled">
                  <a-radio
                    :value="v.key"
                    v-for="v in $DictList('menu_type')"
                    :key="v.key"
                  >
                    {{ v.label }}
                  </a-radio>
                </a-radio-group>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item
                :label-col="two.labelCol"
                :wrapper-col="two.wrapperCol"
                :label="$t('authorityAdm.munu.status')"
                prop="status"
              >
                <a-radio-group v-model="form.status">
                  <a-radio
                    v-for="v in $DictList('web_status')"
                    :key="v.key"
                    :value="v.key"
                  >
                    {{ v.label }}
                  </a-radio>
                </a-radio-group>
              </a-form-model-item>
            </a-col>
          </a-row>
          <!-- 菜单名称 显示排序 -->
          <a-row>
            <a-col :span="12">
              <a-form-model-item
                :label-col="two.labelCol"
                :wrapper-col="two.wrapperCol"
                :label="$t('authorityAdm.munu.menuName')"
                prop="title"
              >
                <a-input v-model="form.title" placeholder="请输入菜单名称" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item
                :label-col="two.labelCol"
                :wrapper-col="two.wrapperCol"
                :label="$t('authorityAdm.munu.showSort')"
                prop="weigh"
              >
                <a-input-number
                  v-model="form.weigh"
                  :min="1"
                  :max="999"
                  :precision="0"
                  style="width: 100%"
                  placeholder="请输入排序, 1~999"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
          <!-- 是否外链 显示状态 -->
          <a-row>
            <a-col :span="12">
              <a-form-model-item
                :label-col="two.labelCol"
                :wrapper-col="two.wrapperCol"
                :label="$t('authorityAdm.munu.isFrame')"
                prop="isFrame"
              >
                <a-radio-group v-model="form.isFrame">
                  <a-radio
                    :value="v.key"
                    v-for="v in $DictList('yes_no')"
                    :key="v.key"
                  >
                    {{ v.label }}
                  </a-radio>
                </a-radio-group>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item
                :label-col="two.labelCol"
                :wrapper-col="two.wrapperCol"
                :label="$t('authorityAdm.munu.visible')"
                prop="visible"
              >
                <a-radio-group v-model="form.visible">
                  <a-radio
                    :value="v.key"
                    v-for="v in $DictList('display_status')"
                    :key="v.key"
                  >
                    {{ v.label }}
                  </a-radio>
                </a-radio-group>
              </a-form-model-item>
            </a-col>
          </a-row>
          <!-- 权限标识 路由地址 -->
          <a-row>
            <a-col :span="12">
              <a-form-model-item
                :label-col="two.labelCol"
                :wrapper-col="two.wrapperCol"
                :label="$t('authorityAdm.munu.name')"
                prop="name"
              >
                <a-input v-model="form.name" placeholder="请输入权限标识" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item
                :label-col="two.labelCol"
                :wrapper-col="two.wrapperCol"
                :label="$t('authorityAdm.munu.path')"
                prop="path"
              >
                <a-input v-model="form.path" placeholder="请输入路由地址" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <!-- 组件路径 跳转路由 -->
          <a-row v-if="form.isFrame != 1">
            <a-col :span="12">
              <a-form-model-item
                :label-col="two.labelCol"
                :wrapper-col="two.wrapperCol"
                :label="$t('authorityAdm.munu.component')"
                prop="component"
              >
                <a-input
                  v-model="form.component"
                  placeholder="请输入组件路径"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item
                :label-col="two.labelCol"
                :wrapper-col="two.wrapperCol"
                :label="'重定向'"
                prop="jumpPath"
              >
                <a-input
                  v-model="form.jumpPath"
                  placeholder="请输入重定向地址"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
          <!-- 是否隐藏子菜单 是否缓存 -->
          <a-row>
            <a-col :span="12">
              <a-form-model-item
                :label-col="two.labelCol"
                :wrapper-col="two.wrapperCol"
                label="是否隐藏子菜单"
              >
                <a-radio-group v-model="form.isHideChildMenu">
                  <a-radio
                    :value="v.key"
                    v-for="v in $DictList('yes_no')"
                    :key="v.key"
                  >
                    {{ v.label }}
                  </a-radio>
                </a-radio-group>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item
                :label-col="two.labelCol"
                :wrapper-col="two.wrapperCol"
                label="是否缓存"
              >
                <a-radio-group v-model="form.isCache">
                  <a-radio
                    :value="v.key"
                    v-for="v in $DictList('yes_no')"
                    :key="v.key"
                  >
                    {{ v.label }}
                  </a-radio>
                </a-radio-group>
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
    <!-- 图标相关 -->
    <a-modal
      :title="this.$t('public.select_icon')"
      v-model="iconVisible"
      width="800px"
    >
      <icon-selector
        zIndex="2000"
        width="100%"
        v-model="form.icon"
        :loadType="['brand_logo', 'application', 'editor', 'data']"
        @change="handleIconChange"
      />
      <template #footer>
      </template>
    </a-modal>
  </div>
</template>
<script>
import { IconSelector } from "@/components";
import { addCloudMenu, editCloudMenu, getCloudMenuInfo } from "@/api/authority";
import { CommonRules, CommonNameRules, CommonLengthRules } from "@/utils/validate";
export default {
  components: {
    "icon-selector": IconSelector,
  },
  data() {
    return {
      labelCol: { xs: { span: 24 }, sm: { span: 3 }},
      wrapperCol: { xs: { span: 24 }, sm: { span: 21 }},
      two: {
        labelCol: { xs: { span: 24 }, sm: { span: 6 }},
        wrapperCol: { xs: { span: 24 }, sm: { span: 18 }},
      },
      confirmLoading: false,
      visible: false,
      form: {},
      rules: {
        menuType: CommonRules(this.$t("authorityAdm.munu.inputInfo1"), "number"),
        icon: CommonRules(this.$t("authorityAdm.munu.inputInfo2")),
        name: CommonNameRules(this.$t("authorityAdm.munu.inputInfo3")),
        title: CommonNameRules(this.$t("authorityAdm.munu.inputInfo4")),
        weigh: CommonRules(this.$t("authorityAdm.munu.inputInfo5"), "number"),
        isFrame: CommonRules(this.$t("authorityAdm.munu.inputInfo6"), "number"),
        visible: CommonRules(this.$t("authorityAdm.munu.inputInfo7"), "number"),
        status: CommonRules(this.$t("authorityAdm.munu.inputInfo8"), "number"),
        path: CommonNameRules(this.$t("authorityAdm.munu.inputInfo9")),
        component: CommonNameRules(this.$t("authorityAdm.munu.inputInfo11")),
        jumpPath: CommonLengthRules(),
      },
      title: "",
      // 上级菜单选择相关
      treeData: [],
      replaceFields: {
        children: "children",
        title: "title",
        key: "id",
        value: "id",
      },
      // 图标相关
      iconVisible: false,
      // 表单禁选
      formDisabled: false,
    };
  },
  mounted() {},
  methods: {
    async init(arr, id, type) {
      this.treeData = arr;
      this.visible = true;
      this.formDisabled = false;
      this.$refs["ruleForm"] && this.$refs["ruleForm"].clearValidate();
      this.form = {
        parentId: undefined, // 展示placeholder
        menuType: 0,
        icon: "",
        name: "", // 权限标识
        title: "",
        weigh: "",
        isFrame: 2,
        visible: 1,
        status: 1,
        path: "",
        jumpPath: "",
        component: "",
        isHideChildMenu: 2,
        isCache: 2,
        moduleType: "sys_admin",
      };
      this.title = this.$t("authorityAdm.munu.add");
      // 添加子菜单
      if (type == "addChildren") {
        this.form.menuType = 1; // 固定菜单类型
        this.form.parentId = id; // 固定上级菜单
        this.formDisabled = true;
      }
      // 编辑菜单
      if (type == "edit") {
        this.title = this.$t("authorityAdm.munu.edit");
        this.confirmLoading = true;
        this.formDisabled = true; // 编辑状态下 部分功能禁止编辑
        let res = await getCloudMenuInfo({ menuId: id });
        if (res.code === 0) {
          let result = res.data;
          result.parentId == "0" && (result.parentId = undefined); // 父级id为0 则为undefined 不能在页面展示为0
          this.form = {
            ...result,
            menuId: result.id,
          };
        }
        this.confirmLoading = false;
      }
    },
    // 选择图标
    selectIcon() {
      this.iconVisible = true;
    },
    handleIconChange(icon) {
      this.form.icon = icon;
      this.$refs["ruleForm"] && this.$refs["ruleForm"].clearValidate(["icon"]);
      this.iconVisible = false;
    },
    handleCancel() {
      this.visible = false;
    },
    handleOk() {
      this.$refs["ruleForm"].validate(async (valid) => {
        if (!valid) return;
        this.confirmLoading = true;
        this.form.parentId == undefined && (this.form.parentId = "0"); // 父级id默认为0
        let res;
        if (!this.form.menuId) {
          res = await addCloudMenu(this.form);
        } else {
          res = await editCloudMenu(this.form);
        }
        this.confirmLoading = false;
        this.toast(res);
        if (res.code === 0) {
          this.$emit("update");
          this.visible = false;
        }
      });
    },
  },
};
</script>
<style lang="less" scoped></style>
