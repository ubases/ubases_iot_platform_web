<template>
  <a-card :bordered="false">
    <a-page-header :title="title" @back="$multiTab.closeCurrentPage()">
      <a-spin :spinning="formLoading">
        <a-form-model ref="ruleForm" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol" :rules="formDisabled ? {} : rules">
          <a-form-model-item label="账号类型" prop="accountType">
            <div v-if="formDisabled">
              {{ $DictName("account_type", form.accountType) }}
            </div>
            <a-radio-group v-else v-model="form.accountType">
              <a-radio v-for="v in $DictList('account_type')" :key="v.key" :value="v.key">
                {{ v.label }}
              </a-radio>
            </a-radio-group>
          </a-form-model-item>
          <!-- 名称  标识 -->
          <a-form-model-item label="账号" prop="account">
            <div v-if="formDisabled">
              {{ form.account }}
            </div>
            <a-input v-else :disabled="editDisabled" placeholder="请输入账号" v-model="form.account"/>
          </a-form-model-item>
          <!-- 详情不显示密码 -->
          <a-form-model-item v-if="!formDisabled" label="密码" prop="password">
            <a-input v-if="!editDisabled" placeholder="建议英文,数字,符号的组合" type="text" v-model="form.password" />
            <a-input v-if="editDisabled" disabled type="password" value="xxxxxxxx" />
            <!-- 编辑状况下才可放开密码重置功能 -->
            <a-button v-if="editDisabled" @click="resetPassword">
              重置密码
            </a-button>
          </a-form-model-item>
          <a-form-model-item label="企业名称" prop="companyName">
            <div v-if="formDisabled">
              {{ form.companyName }}
            </div>
            <a-input v-else placeholder="请输入账号所属的企业名称" v-model="form.companyName"/>
          </a-form-model-item>
          <!-- 编辑或者详情 才显示角色名称 添加情况下没有 -->
          <a-form-model-item label="角色" v-if="formDisabled || editDisabled">
            {{ form.roleName }}
          </a-form-model-item>
          <a-form-model-item label="账号状态" prop="status">
            <div v-if="formDisabled">
              {{ $DictName("web_status", form.status) }}
            </div>
            <a-radio-group v-else v-model="form.status">
              <a-radio v-for="v in $DictList('web_status')" :key="v.key" :value="v.key">
                {{ v.label }}
              </a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item label="联系手机" prop="phone">
            <div v-if="formDisabled">{{ form.phone }}</div>
            <a-input v-else placeholder="请输入联系手机" v-model="form.phone" />
          </a-form-model-item>
          <a-form-model-item label="联系邮箱" prop="email">
            <div v-if="formDisabled">{{ form.email }}</div>
            <a-input v-else placeholder="请输入联系邮箱" v-model="form.email" />
          </a-form-model-item>
          <a-form-model-item label="联系地址">
            <div v-if="formDisabled">{{ form.address }}</div>
            <input-textarea v-else placeholder="请输入联系地址" v-model="form.address"></input-textarea>
          </a-form-model-item>
          <a-form-model-item :wrapper-col="{ span: 14, offset: 3 }">
            <a-button v-if="formDisabled" type="primary" @click="editForm">
              修改
            </a-button>
            <a-divider type="vertical" v-if="formDisabled" />
            <a-button v-if="!formDisabled" type="primary" @click="submit">
              确认
            </a-button>
            <a-divider type="vertical" v-if="!formDisabled" />
            <a-button type="primary" @click="setStatus(2)" v-if="formDisabled && form.status === 1">
              禁用
            </a-button>
            <a-divider type="vertical" v-if="formDisabled && form.status === 1"/>
            <a-button type="primary" @click="setStatus(1)" v-if="formDisabled && form.status === 2">
              启用
            </a-button>
            <a-divider type="vertical" v-if="formDisabled && form.status === 2"/>
            <a-button @click="$multiTab.closeCurrentPage()"> 取消 </a-button>
          </a-form-model-item>
        </a-form-model>
      </a-spin>
    </a-page-header>
  </a-card>
</template>
<script>
import { getDeveloperDetails, addDeveloper, editDeveloper, setDeveloperStatus, resetDeveloperPassword} from "@/api/authority";
import { PassWordRules, AccountRules, CommonRules, EMAIL_REG, PHONE_REG} from "@/utils/validate";
export default {
  name: "DeveloperDetails",
  data() {
    return {
      title: "",
      type: "",
      id: "",
      form: {},
      formLoading: false,
      rules: {
        accountType:[{ required: true, message: "请选择账号类型"}],
        account: AccountRules(),
        password: [{ required: true, message: "请输入密码"}],
        status: CommonRules("请选择账号状态", "number"),
        companyName: [],
        email: [{ required: false, pattern: EMAIL_REG, message: "请输入正确格式规则的邮箱"}],
        phone: [{ required: false, pattern: PHONE_REG, message: "请输入正确的手机号码(11位)" }],
      },
      formDisabled: false,
      editDisabled: false,
      labelCol: { xs: { span: 24 }, sm: { span: 3 }},
      wrapperCol: { xs: { span: 24 }, sm: { span: 10 } },
    };
  },
  created() {
    this.init();
  },
  watch:{
    'form.accountType': {
      handler: function (newData) {
        if(newData == 1){
          this.$set(this.rules,'companyName',[{ required:true, min:0, max:50, message:'请输入公司名称,长度0-50'}])
        }else {
          this.$set(this.rules,'companyName',[])
          this.$refs.ruleForm.clearValidate('companyName')
        }
      },
      deep: true,
    },
  },
  methods: {
    init() {
      this.type = this.$route.query.type;
      this.id = this.$route.query.id;
      this.editDisabled = false;
      this.formDisabled = false;
      if (this.type === "add") {
        this.title = "添加开发者账号";
        this.form = {
          status: 1,
          accountType:1,
          accountOrigin: 2,
        };
        this.rules.password = PassWordRules()
      } else if (this.type === "edit") {
        this.title = "编辑开发者账号";
        this.editDisabled = true;
        this.getDetails();
      } else if (this.type === "details") {
        this.title = "开发者账号详情";
        this.formDisabled = true;
        this.getDetails();
      }
      this.$route.meta.title = this.title;
    },
    async getDetails() {
      this.formLoading = true;
      let res = await getDeveloperDetails({ id: this.id });
      if (res.code === 0) this.form = res.data;
      this.form.contract = this.form.contract || [];
      this.form.password = 'xxxxxxxx'
      this.formLoading = false;
    },
    editForm() {
      this.type = 'edit'
      this.editDisabled = true;
      this.formDisabled = false;
      this.title = "编辑开发者账号";
      
      this.$route.meta.title = this.title;
    },
    submit() {
      this.$refs["ruleForm"].validate(async (valid) => {
        if (!valid) return;
        this.formLoading = true;
        let res;
        const md5 = require('md5')
        const password = md5(this.form.password)
        if (this.id) {
          res = await editDeveloper({...this.form});
        } else {
          res = await addDeveloper({...this.form, password});
        }
        if ((this.type === "edit" || this.type === "add") && res.code === 0) {
          this.$multiTab.closeCurrentPage();
        } else if (this.type === "details" && res.code === 0) {
          this.editDisabled = false;
          this.formDisabled = true;
          this.title = "开发者账号详情";
          this.$route.meta.title = this.title;
        }
        this.formLoading = false;
        this.toast(res);
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
          setDeveloperStatus({ id: this.id, status }).then((res) => {
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
        content: "是否重置该开发者的密码",
        onOk: () => {
          resetDeveloperPassword({ id: this.id }).then((res) => {
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
<style lang="less" scoped>
</style>
