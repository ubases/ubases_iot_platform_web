<template>
  <a-card :bordered="false">
    <a-page-header :title="title" @back="$multiTab.closeCurrentPage()">
      <a-spin :spinning="formLoading">
        <a-form-model
          ref="ruleForm"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :model="form"
          :rules="detailsDisabled ? {} : rules"
        >
          <!-- 用户账号  用户密码 -->
          <a-form-model-item :label="$t('authorityAdm.user.account')" prop="userName">
            <div v-if="detailsDisabled">{{ form.userName }}</div>
            <a-input v-else placeholder="请输入账号" :disabled="editDisabled" v-model="form.userName" />
          </a-form-model-item>

          <!-- 详情不显示密码 -->
          <a-form-model-item v-if="!detailsDisabled" :label="$t('authorityAdm.user.password')" prop="password">
            <a-input v-if="!editDisabled" placeholder="建议英文,数字,符号的组合" type="text" v-model="form.password" />
            <a-input v-if="editDisabled" disabled type="password" value="xxxxxxxx" />
            <a-button v-if="editDisabled" @click="resetPassword">
              重置密码
            </a-button>
          </a-form-model-item>
          <!-- 归属部门 -->
          <a-form-model-item :label="$t('authorityAdm.user.deptId')" prop="deptId">
            <div v-if="detailsDisabled">{{ form.deptName }}</div>
            <a-tree-select
              v-else
              placeholder="请选择部门"
              tree-default-expand-all
              v-model="form.deptId"
              :replaceFields="replaceFields"
              :tree-data="treeData"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              style="width: 100%"
            >
            </a-tree-select>
          </a-form-model-item>
          <!-- 岗位  角色 -->
          <a-form-model-item :label="$t('authorityAdm.user.post')" prop="postIds" >
            <div v-if="detailsDisabled">{{ form.postNames }}</div>
            <a-select v-else mode="multiple" placeholder="请选择岗位" v-model="form.postIds">
              <a-select-option v-for="v in postList" :key="v.postId" :value="v.postId">
                {{ v.postName }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item :label="$t('authorityAdm.user.role')" prop="roleIds">
            <div v-if="detailsDisabled">{{ form.roleNames }}</div>
            <a-select v-else mode="multiple" placeholder="请选择角色" v-model="form.roleIds" >
              <a-select-option v-for="v in roleList" :key="v.roleId" :value="v.roleId">
                {{ v.roleName }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <!--  状态 -->
          <a-form-model-item label="账号状态" prop="status">
            <div v-if="detailsDisabled">
              {{ $DictName("web_status", form.status) }}
            </div>
            <a-radio-group v-else v-model="form.status">
              <a-radio v-for="v in $DictList('web_status')" :key="v.key" :value="v.key">
                {{ v.label }}
              </a-radio>
            </a-radio-group>
          </a-form-model-item>
          <!-- 手机号码  邮箱 -->
          <a-form-model-item :label="$t('authorityAdm.user.phone')" prop="phonenumber">
            <div v-if="detailsDisabled">{{ form.phonenumber }}</div>
            <a-input v-else placeholder="请输入联系手机" v-model="form.phonenumber" />
          </a-form-model-item>
          <a-form-model-item :label="$t('authorityAdm.user.email')" prop="email" >
            <div v-if="detailsDisabled">{{ form.email }}</div>
            <a-input v-else placeholder="请输入联系邮箱" v-model="form.email" />
          </a-form-model-item>
          <!-- 联系地址 -->
          <a-form-model-item label="联系地址">
            <div v-if="detailsDisabled">{{ form.address }}</div>
            <input-textarea v-else placeholder="请输入联系地址" v-model="form.address" ></input-textarea>
          </a-form-model-item>
          <a-form-model-item :wrapper-col="{ span: 14, offset: 3 }">
            <a-button v-if="detailsDisabled" type="primary" @click="editForm">
              修改
            </a-button>
            <a-divider type="vertical" v-if="detailsDisabled" />
            <a-button v-if="!detailsDisabled" type="primary" @click="handleOk">
              确认
            </a-button>
            <a-divider type="vertical" v-if="!detailsDisabled" />
            <a-button type="primary" @click="setStatus(2)" v-if="detailsDisabled && form.status === 1" >
              禁用
            </a-button>
            <a-divider type="vertical" v-if="detailsDisabled && form.status === 1" />
            <a-button type="primary" @click="setStatus(1)" v-if="detailsDisabled && form.status === 2" >
              启用
            </a-button>
            <a-divider type="vertical" v-if="detailsDisabled && form.status === 2" />
            <a-button @click="$multiTab.closeCurrentPage()"> 取消 </a-button>
          </a-form-model-item>
        </a-form-model>
      </a-spin>
    </a-page-header>
  </a-card>
</template>
<script>
import { addUser, editUser, getUserInfo, getDepartmentList, getRoleList, getPostList, setUserStatus, editUserPassword} from "@/api/authority";
import { PassWordRules, CommonRules, AccountRules, EMAIL_REG, PHONE_REG} from "@/utils/validate";
import { arrToTree, getArrayDataName } from "@/utils/util";
export default {
  name: "UserDetails",
  data() {
    return {
      title: "",
      type: "",
      id: "",
      form: {},
      rules: {
        userName: AccountRules(),
        password: [{ required: true, message: "请输入密码"}],
        status: CommonRules("请选择账号状态", "number"),
        deptId: CommonRules("请选择部门"),
        postIds: CommonRules("请选择岗位", "array"),
        roleIds: CommonRules("请选择角色", "array"),
        email: [
          { required: false, pattern: EMAIL_REG, message: "请输入正确格式规则的邮箱" },
        ],
        phonenumber: [
          { required: false, pattern: PHONE_REG, message: "请输入正确的手机号码(11位)" },
        ],
      },
      labelCol: { xs: { span: 24 }, sm: { span: 3 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 10 }},
      formLoading: false,
      // 部门选择相关
      treeData: [],
      roleList: [],
      postList: [],
      replaceFields: {
        children: "children",
        title: "deptName",
        key: "deptId",
        value: "deptId",
      },
      // 表单禁用操作
      editDisabled: false,
      detailsDisabled: false,
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      this.type = this.$route.query.type;
      this.id = this.$route.query.id;
      this.detailsDisabled = false;
      this.editDisabled = false;
      if (this.type === "add") {
        this.title = "添加系统账号";
        this.form = {
          userName: "",
          password: "",
          phonenumber: "",
          email: "",
          status: 1,
          postIds: [],
          roleIds: [],
        };
        this.rules.password = PassWordRules()
      } else if (this.type === "edit") {
        this.title = "编辑系统账号";
        this.editDisabled = true;
        await this.getDetails();
      } else if (this.type === "details") {
        this.title = "系统账号详情";
        this.detailsDisabled = true;
        await this.getDetails();
      }
      this.$route.meta.title = this.title;
      let deptRes = await getDepartmentList({ status: 1 });
      if (deptRes.code === 0) {
        // 详情回显展示
        this.form.deptName = getArrayDataName(
          this.form.deptId,
          deptRes.data.list,
          "deptId",
          "deptName"
        );
        this.$forceUpdate();
        this.treeData = arrToTree(deptRes.data.list, "deptId", "parentId");
      }
      let resRole = await getRoleList({
        pageNum: 1,
        pageSize: 1000,
        status: 1,
      });
      if (resRole.code === 0) {
        this.roleList = resRole.data.list;
      }
      let resPost = await getPostList({
        pageNum: 1,
        pageSize: 1000,
        status: 1,
      });
      if (resPost.code === 0) {
        this.postList = resPost.data.list;
      }
    },
    editForm() {
      this.editDisabled = true;
      this.detailsDisabled = false;
      this.title = "编辑系统账号";
      this.$route.meta.title = this.title;
    },
    async getDetails() {
      this.formLoading = true;
      let res = await getUserInfo({ id: this.id });
      if (res.code === 0) {
        this.form = {
          ...res.data.userInfo,
          userId: res.data.userInfo.id,
          postIds: res.data.checkedPosts,
          postNames: res.data.posts.map((value) => value.postName).join(","), // 详情回显展示
          roleIds: res.data.checkedRoleIds,
          roleNames: res.data.roleList.map((value) => value.roleName).join(","), // 详情回显展示
        };
      }
      this.formLoading = false;
    },
    handleOk() {
      this.$refs["ruleForm"].validate(async (valid) => {
        if (!valid) return;
        this.formLoading = true;
        let res;
        
        if (!this.form.userId) {
          const md5 = require('md5')
          const password = md5(this.form.password)
          res = await addUser({...this.form, password});
        } else {
          res = await editUser({...this.form});
        }
        this.toast(res);
        this.formLoading = false;
        if ((this.type === "edit" || this.type === "add") && res.code === 0) {
          this.$multiTab.closeCurrentPage();
        } else if (this.type === "details" && res.code === 0) {
          this.detailsDisabled = true;
          this.editDisabled = false;
          this.title = "系统账号详情";
          this.$route.meta.title = this.title;
          this.getDetails()
        }
      });
    },
    setStatus(status) {
      let content;
      if (status === 1) {
        content = "是否启用此账号";
      } else if (status === 2) {
        content = "是否禁用此账号";
      }
      this.$confirm({
        content,
        onOk: () => {
          this.form.status = status
          editUser(this.form).then((res) => {
            this.toast(res);
            if (res.code === 0) {
              this.$multiTab.closeCurrentPage();
            }
          });
        },
      });
    },
    resetPassword() {
      this.$confirm({
        content: "是否重置该用户的密码",
        onOk: () => {
          editUserPassword({ id: this.id }).then((res) => {
            this.toast(res);
            if (res.code === 0) {
              this.init();
            }
          });
        },
      });
    },
  },
};
</script>
<style lang="less" scoped></style>
